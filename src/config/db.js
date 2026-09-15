const mongoose=require("mongoose")

const connectDb=async()=>{
    try{

        const conn=await mongoose.connect(process.env.MONGO_URI)
       
        console.log("DATABASE CONNECTED");


    }catch(err){
        console.log("error connecting to Db");
        process.exit(1)
    }
}

module.exports=connectDb;