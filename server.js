require("dotenv").config()
const app=require("./src/app")
const connectDb=require("./src/config/db")
require("./src/workers/emailWorker");



connectDb();


const PORT = process.env.PORT || 3000;




app.listen(PORT,()=>{
    console.log(`server started at 8000`)
})



