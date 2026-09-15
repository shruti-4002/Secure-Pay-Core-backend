const accountModel=require("../models/account.model")

async function createAccountController(req,res){
 try{   const {user}=req.body;
    
    const account=await accountModel.create({
        user:user
    })

    res.status(201).json({
        account
    })
}catch(err){
    console.log(err.name);
}

}
async function getUserAccountController(req,res){

    const accountlist= await accountModel.find({user:req.user._id});
    res.status(200).json({
        accountlist
    })

}

async function getAccountBalance(req,res){
    const {accountId}=req.params;

    const account=await accountModel.findOne({
        _id:accountId,
        user:req.user._id   //to make sure others account are not feteched
    })

        if(!account){
            return res.status(404).json({
                message:"Account not found"
            })
        }

        const balance=await account.getBalance();
        res.status(200).json({
            accountId:account._id,
            balance:balance
        })
}



module.exports={
    createAccountController,
    getUserAccountController,
    getAccountBalance
}
