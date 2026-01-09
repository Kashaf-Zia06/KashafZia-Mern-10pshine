
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema(
{
    name:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:[true,"Name is required"]
        
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        unique:true,
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String,
    }




},{timestamps:true})

//pre is a hook
//before just  saving the data hash the password using bcrypt
//Never use callback function with 'pre' as callbacks cant use 'this' 

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){return next()}
    this.password=bcrypt.hash(this.password,10)
    next()
})

//using bcrypt to compare password as well , the plain text password given by user and hashed password in db
userSchema.methods.isPasswordCorrect=async function(password) {
   return  await bcrypt.compare(password,this.password)
    
}

//generate Access Token
userSchema.methods.generateAccessToken=async function() {
    return jwt.sign({
        //payload
        _id:this._id,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

//generate RefreshToken
userSchema.methods.generateRefreshToken=async function() {
    return jwt.sign({
        //payload
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User=mongoose.model("User",userSchema)