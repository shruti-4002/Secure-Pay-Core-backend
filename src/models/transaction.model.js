const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transcation must be associated with a from account"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be to associated with a to a account"]  ,
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"]
           , message:"Status can be either PENDING,COMPLETED,FAILED OR REVERSED",
        },default:"PENDING"

    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating Transaction"],
        min:[0,"Transaction cant be negative"]
    },

    idempotencyKey:{
        type:String,
        required:["true","Idemptency Key is required for creating a transaction"],
        index:true,
        unique:true
        
    }



},{
    timestamps:true
})

const transactionModel=mongoose.model("transaction",transactionSchema)
module.exports=transactionModel

