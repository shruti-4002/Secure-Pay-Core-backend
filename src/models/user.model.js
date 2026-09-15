const mongoose =require("mongoose");
const bcrypt=require("bcrypt");

const userSchema= new mongoose.Schema({

        email:{
            type:String,
            required:[true,"Email is required for creating a user"],
            trim:true,
            lowercase:true,
          match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Invalid Email Format. Should be like example@domain.com"],
           unique:true

        },

        name:{
            type:String,
            required:[true,"name is required for creating account"],
        },

        password:{
            type:String,
            required:[true,"password is required for creating account"],
            minlength:[6,"password should contain more than 6 characters"],
            select:false           //to avoid password in query
        },

        SystemUser:{
            type:Boolean,
            default:false,
            
            select:false
        }

},
{
    timestamps:true
});

userSchema.pre("save",async function(){
       if(!this.isModified("password"))return 

       //if pass modified generate salt and hash
       const salt=await bcrypt.genSalt(10);
       this.password=await bcrypt.hash(this.password,salt);
     

})

userSchema.methods.comparePassword= async function(password){

  return await bcrypt.compare(password,this.password);

}

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;