require("dotenv").config()
const app=require("./src/app")
const connectDb=require("./src/config/db")
require("./src/workers/emailWorker");



connectDb();







app.listen(8000,()=>{
    console.log(`server started at 8000`)
})



