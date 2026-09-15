// src/utils/mailer.js

const nodemailer = require("nodemailer");
const getWelcomeEmailTemplate = require('./WelcomeEmail.js');


/**
 * Configure SMTP Transporter
 * Using STARTTLS (Port 587) for secure communication
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,

  },
});

if (process.env.NODE_ENV !== 'test') {
  transporter.verify((error, success) => {
    if (error) {
      console.log("SMTP Connection Error", error);
    } else {
      console.log("SMTP Server is ready to send emails");
    }
  });
}


/**
 * Pre-flight check to ensure SMTP credentials and network connectivity 
 * are valid before the server starts accepting requests.
 */

transporter.verify((error,success)=>{     
if(error){
  console.log("SMTP Connection Error",error);
}else{
  console.log("Email Server is Ready to take message");
}
})


/**
 * Sends a welcome email to newly registered users
 * @param {string} email - Recipient's email address
 * @param {string} name - User's name
 */



const sendWelcomeEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"Shruti Banking" <${process.env.GOOGLE_USER}>`,
      to: email,
      subject: "Welcome to Shruti Banking App! 🎉",
      html: getWelcomeEmailTemplate(name, email)
    });

    console.log("Welcome email sent to:", email);

  } catch (err) {
    console.error("Error sending welcome email:", err);
  }
};



const sendTransactionEmail = async (email, name, amount, toAccount) => {
  try {
    await transporter.sendMail({
      from: '"Shruti App" <i.m.shruti@outlook.com>',
      to: email,
      subject: "Transaction Successful!",
      
      html: `
        <h3>Hello ${name}</h3>
        <p>Your transaction of ₹${amount} to account <b>${toAccount}</b> was successful.</p>
        <p>Best regards,<br>The Backend Ledger Team</p>
      `
    });

    console.log("Transaction success email sent to:", email);

  } catch (err) {
    console.error("Error sending transaction success email:", err);
  }
};


const sendTransactionFailureEmail = async (email, name, amount, toAccount) => {
  try {
    await transporter.sendMail({
      from: '"Shruti App" <i.m.shruti@outlook.com>',
      to: email,
      subject: "Transaction Failed",
      
      html: `
        <h3>Hello ${name}</h3>
        <p>We regret to inform you that your transaction of ₹${amount} to account <b>${toAccount}</b> has failed.</p>
        <p>Please try again later.</p>
        <p>Best regards,<br>The Backend Ledger Team</p>
      `
    });

    console.log("Transaction failure email sent to:", email);

  } catch (err) {
    console.error("Error sending transaction failure email:", err);
  }
};





module.exports = {
    sendWelcomeEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
}