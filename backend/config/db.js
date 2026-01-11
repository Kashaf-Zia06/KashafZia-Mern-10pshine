import mongoose, { connect } from "mongoose";
import dotenv from "dotenv"
import { DB_NAME } from "../constant.js";

dotenv.config()

const connectDB= async()=>{

    try {
        console.log("Inside DB.js connectdb")
        const connectionInstance= await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        console.log("Mongo Db connected!!")
        console.log(`MongoDB Host: ${connectionInstance.connection.host}`)
        return
    } catch (error) {
        console.log("Mongo db failed to connect")
        console.log(error)
    }

}

export default connectDB
