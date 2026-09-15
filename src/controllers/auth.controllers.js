const userModel=require("../models/user.model")
const jwt=require("jsonwebtoken")
const emailQueue = require("../queues/email.queue.js");
const tokenBlacklistModel=require("../models/blacklist.model")
/**
 * -user registered controller
 * -POST/api/auth/register
 */

async function userRegisterController(req,res){
try{
    
    const {email,password,name}=req.body

    const isExits= await userModel.findOne({email:email});

    if(isExits){
        return res.status(422).json({message:"user already registered with this email",status:"failed"});
    }

  
    const user=await  userModel.create({
        email,
        name,
        password
    });

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});

    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"strict"
    })


    await emailQueue.add("sendEmailJob", {
      type: "WELCOME_EMAIL",
      data: {
        email: user.email,
        name: user.name
      }
    });
   

    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
    })

     

   }catch(err){
    
    if(err.code===11000){
        return res.status(400).json({message:"email already exits"}); //race condition
    }

    if(err.name === "ValidationError"){
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({message: messages.join(", ")});
}

    return res.status(500).json({
        message:"internal Server Error"
    })



   }

}

/**
 * -user login controller
 * -POST/api/auth/login
 */

async function userLoginController(req,res){

    const{email,password}=req.body;

    const user=await  userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({message:"email or password invalid"})
    }

    const isAuthorized = await user.comparePassword(password);

    if(!isAuthorized){
        return res.status(401).json({message:"unarthorized acess"});
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"3d"});


    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"strict"
    })
    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        message:"user logged in"
    })




}


async function userLogoutController(req,res){
   const token=req.cookies.token || req.headers.authorization?.split(" ")[1]
   
   if(!token){
    return res.status(200).json({
        message:"User Logged out successfully"

    })
   }

   res.cookie("token","");//clear cookies

   await tokenBlacklistModel.create({
    token:token
   })

    return res.status(200).json({
        message:"User Logged out successfully"

    })



}

module.exports={
    userRegisterController,
    userLoginController,
    userLogoutController
}

