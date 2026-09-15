const mongoose=require("mongoose")

const ledgerSchema=new mongoose.Schema({

 account:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with an account"],
         index:true,
        immutable:true
},
    amount:{
        type:Number,
        required:[true,"Amount is required for creating ledger entry"],
        index:true,
        immutable:true
    },

    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either Credit or Debit"
        },
        required:true,
        immutable:true
    }

})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

// 1. Block Updates 
const updateMethods = [
    'updateOne', 
    'updateMany', 
    'findOneAndUpdate', 
    'findByIdAndUpdate', 
    'replaceOne'
];

updateMethods.forEach(method => {
    ledgerSchema.pre(method, preventLedgerModification);
});

// 2. Block Deletions 
const deleteMethods = [
    'remove', 
    'deleteOne', 
    'deleteMany', 
    'findOneAndDelete', 
    'findByIdAndDelete',
    'findOneAndRemove'
];

deleteMethods.forEach(method => {
    ledgerSchema.pre(method, preventLedgerModification);
});


const ledgerModel=mongoose.model('ledger',ledgerSchema);

module.exports=ledgerModel;