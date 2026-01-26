
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema(
{
    userName:{
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
        required:[true,"Password is required"]
    },
    refreshToken:{
        type:String,
    }




},{timestamps:true})

//pre is a hook
//before just  saving the data hash the password using bcrypt
//Never use callback function with 'pre' as callbacks cant use 'this' 

// Hash password before saving.
// Use the correct middleware signature for Mongoose pre('save') hooks.
// For async middleware: do not include (err, req, res, next) parameters —
// use a regular async function and either return/throw or call next() in
// non-async style. Arrow functions should be avoided because they
// don't bind `this`.
userSchema.pre("save", async function () {
    console.log("pre save hook")
    // `this` refers to the document being saved
    if (!this.isModified("password")) return;
   this.password= await bcrypt.hash(this.password,10)
    console.log("hashed password")
});


//using bcrypt to compare password as well , the plain text password given by user and hashed password in db
userSchema.methods.isPasswordCorrect=async function(password) {
   return  await bcrypt.compare(password,this.password)
    
}

//generate Access Token
userSchema.methods.generateAccessToken= function() {
    console.log('inside genertae access token function in user model.js')
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
userSchema.methods.generateRefreshToken= function() {
      console.log('inside genertae refresh token function in user model.js')
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