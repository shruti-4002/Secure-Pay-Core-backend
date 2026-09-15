const transactionModel=require("../models/transaction.model")
const ledgerModel=require("../models/ledger.model")
const emailservice=require("../utils/mailer")
const accountModel=require("../models/account.model")
const mongoose=require("mongoose");
const emailQueue = require("../queues/email.queue");
/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
     * 1. Validate request
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction (PENDING)
     * 6. Create DEBIT ledger entry
     * 7. Create CREDIT ledger entry
     * 8. Mark transaction COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification
 */


async function createtransaction(req,res){
   
     /**
     * 1. Validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        

        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

        const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
        status:"ACTIVE"
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
        status:"ACTIVE"
    })

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount and Acount Must be ACTIVE"
        })
    }

    /**
     * Validate Idempotency Key
     */

    const isTransactionAlreadyExists= await transactionModel.findOne({idempotencyKey});

      if (isTransactionAlreadyExists) {
        //transcation and session completed in past
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
            })
        }

            //when user doubleclicks
         if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction in proccess",
            })
        }


        //keyexits but expire
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const createdInSeconds = Math.floor(isTransactionAlreadyExists.createdAt / 1000);
        const diffInSeconds = nowInSeconds - createdInSeconds;
        const twentyFourHoursInSeconds = 24 * 60 * 60; // 86400

     if (diffInSeconds > twentyFourHoursInSeconds) {
     return res.status(400).json({ message: "key Expired Try again" });
    }
        
        

    // FAILED/REVERSED Case:
    console.log(`Retrying transaction for key: ${idempotencyKey}`);
}//end of cond wheree it checks whether transaction exits or not 

    //before starting session make sure there is enough money in user acc to be sent

    const balance=await fromUserAccount.getBalance();

    if(balance<amount){
        return res.status(400).json({
            message:`Insufficient Balance in Account Current balance is ${balance} and req is ${amount}`
        })
    }


/**
 * Create Transaction(PENDING){
 *
 */

const transaction=await transactionModel.create({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING",
   
})

    





   
const lockAccount=await accountModel.findOneAndUpdate(
    {_id:fromAccount,isLocked:false},
    {isLocked:true},
    { returnDocument:'after' }
)  

if (!lockAccount) {   //only in double window

     await transactionModel.findOneAndUpdate(
            {idempotencyKey},
            {status:"FAILED"},      
           
        )


       
        return res.status(429).json({ 
            message: "your account is busy wait for ongoing transaction to get over.This transaction attempt failed. Please initiate a new payment with a fresh request" 
        });
    }




const session=await mongoose.startSession()
session.startTransaction();
console.log("transaction started");
try{



console.log("Transaction started and Account Locked");




 await ledgerModel.create([{
    account:fromAccount,
    amount,
    type:"DEBIT"

}],{session});


//simulating wait 
// await (async () => {
//     return new Promise((resolve) => {
//         setTimeout(function() {
//             console.log("Wait over");
//             resolve(); 
//         }, 10 * 1000);
//     });
// })();




await ledgerModel.create([{
    account:toAccount,
    amount,
    type:"CREDIT"

}],{session})







await transactionModel.findOneAndUpdate(
    
    {idempotencyKey},
    {status:"COMPLETED"},
     { session }
)



await session.commitTransaction();

console.log("Transaction Success!");

/**
 * SEND EMAIL NOTIFICATION
 */

await emailQueue.add("sendEmailJob", {
  type: "TRANSACTION_SUCCESS",
  data: {
    email: req.user.email,
    name: req.user.name,
    amount,
    toAccount
  }
});


return res.status(201).json({ message: "Transaction Successful"});


}catch(error){

   


//ye dekh last mein session abort kiya hai after findand update trasactionModel
if (session.inTransaction()) {
     await session.abortTransaction();
}

try{

await transactionModel.findOneAndUpdate(
    
    {idempotencyKey},
    {status:"FAILED"},   
)

await  emailservice.sendTransactionFailureEmail(req.user.email,req.user.name,amount,toAccount)

}catch(err){
    console.error("Cleanup failed:", err);
}


    console.error("Transaction Failed, everything rolled back:", error);

       

    return res.status(400).json({
        message:"This transaction attempt failed. Please initiate a new payment with a fresh request"
    })


}finally {
    //  Cleanup 
    await session.endSession();
 await accountModel.findByIdAndUpdate(fromAccount, { isLocked: false });




    console.log("Session Ended");
}







    
    }//main function end 





async function createInitialFundsTransaction(req,res){

    const {toAccount,amount,idempotencyKey}=req.body;
    
    if (!toAccount || !amount || !idempotencyKey) {
        
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const fromUserAccount=await accountModel.findOne({
       
        user:req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"sytem user account not found"
        })
    }

    const session= await mongoose.startSession();
     session.startTransaction();

    try{

    await transactionModel.create([{
        fromAccount:fromUserAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING",
        
    }],{session})

    await ledgerModel.create([{
        account:fromUserAccount,
        amount,
        type:"DEBIT"

    }],{session})

     await ledgerModel.create([{
        account:toAccount,
        amount,
        type:"CREDIT"

    }],{session})

    await transactionModel.findOneAndUpdate(
        {idempotencyKey},
       {status:"COMPLETED"},
       {session}
    )

    await session.commitTransaction();
  


    res.status(201).json({
        message:"Transaction Successful"
    })





    }catch(err){

        await session.abortTransaction();
        console.log(err);
        await transactionModel.findOneAndUpdate(
            {idempotencyKey},
            {status:"FAILED"},
            {session}
        )
        res.status(401).json({
            message:"TRANSACTION FAILED"
        })

    }finally{
          session.endSession();
    }




    
}

    module.exports={
        createtransaction, createInitialFundsTransaction
    }