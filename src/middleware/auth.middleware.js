const userModel=require("../models/user.model")
const jwt=require("jsonwebtoken")
const tokenBlacklistModel=require("../models/blacklist.model")




async function authMiddleware(req, res, next) {
    // Extract token from either Cookies or the Authorization Header
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1].trim();

    // If no token is found, deny access immediately

  


    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access. Please Login or Signup."
        });
    }

     const isBlacklisted=await tokenBlacklistModel.findOne({token})

     if(isBlacklisted){
        return res.status(401).json({
            message:"Unothorized access,token is invalid"
        })
     }

        //if execution enters here means user has token now check is it expired is it corrcet
    try {

        // Verify if the token is valid using the Secret Key if it fails it throws error
        //two kids of error :1-token correct  but Expired 
        //2-token invalid 

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database to ensure the account still exists/is active
        //this might fail too if mongo server is down so throws error
        const user = await userModel.findById(decoded.userId);


        //case:user may have got token of 48 hours but in 24th hour he suspended so
        //might not be present in db
        if (!user) {
            return res.status(401).json({ 
                message: "Unauthorized access. User account not found." 
            });
        }

        // Attach the user object to the request for use in subsequent controllers
        req.user = user;
        
        // Proceed to the next middleware or controller
        next();

    }  catch (err) {
    // Case 1: The token has expired (usually after 1h or 24h)
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
            message: "Session expired, please login again." 
        });
    }

    // Case 2: The token is fake or tampered with
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
            message: "Unauthorized access." 
        });
    }

    // Case 3: Something else went wrong (e.g., Database connection issue)
    return res.status(500).json({ 
        message: "Internal Server Error." 
    });
}

}

    async function authSystemUserMiddleware(req,res,next){
try{
        const token=req.cookies?.token||req.headers?.authorization?.split(" ")[1]

        if(!token){
             return res.status(401).json({
                message:"Unorthorized Access token is missing"
            })
        }

    const isBlacklisted=await tokenBlacklistModel.findOne({token})

     if(isBlacklisted){
        return res.status(401).json({
            message:"Unothorized access,token is invalid"
        })
     }



        const decode=jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
             return res.status(401).json({
                message:" token is invalid"
            })
        }

        const user=await userModel.findById(decode.userId).select("+SystemUser").lean();
        
        if(!user.SystemUser){
            return res.status(403).json({
                message:"Forbidden Access not a System User"
            })
        }

        req.user=user
        return next();

    }catch(err){
         return res.status(401).json({
                message:"Unorthorized Access"
            })
    }
    }











module.exports={
    authMiddleware,
    authSystemUserMiddleware
}