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



// this Route is made for viewers 


app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f8f9fa; color: #333; border-radius: 10px; max-width: 600px; margin: 50px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50;">🚀 Secure Pay Core Backend</h1>
            <p style="font-size: 16px; color: #555;">
                Successfully deployed on <strong>AWS EC2</strong> via <strong>Nginx Reverse Proxy</strong> & Automated <strong>CI/CD Pipeline</strong>.
            </p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="margin-bottom: 25px;">Click below to explore the interactive API documentation and test endpoints:</p>
            <a href="/api-docs" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(0,123,255,0.3);">
                📄 Open Swagger API Docs
            </a>
            <p style="margin-top: 30px; font-size: 12px; color: #888;">Status: Operational & Secure 🔒</p>
        </div>
    `);
});


module.exports=app;