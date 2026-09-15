const express=require("express");
const cookieParser=require("cookie-parser")
const authRouter=require("./routes/auth.routes")
const accountRouter=require("./routes/account.routes")
const transactionRouter=require("./routes/transaction.routes")
const setupSwagger = require("./config/swagger");
/**
 * - MIddlewares
 */
const app=express();
app.use(express.json());
app.use(cookieParser());

setupSwagger(app);

/** 
 * ALL Routes
 */

app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter)




module.exports=app;