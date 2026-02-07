import mongoose, { connect } from "mongoose";
import dotenv from "dotenv"
import { DB_NAME } from "../constant.js";
import logger from "../logger.js";

dotenv.config()

const connectDB= async()=>{

    try {
        // console.log("Inside DB.js connectdb")
        const connectionInstance= await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        // console.log("Mongo Db connected!!")
        logger.info("MongoDB connected")
        logger.info(`MongoDB Host: ${connectionInstance.connection.host}`)
        return
    } catch (error) {
        // console.log("Mongo db failed to connect")
        logger.error({err:error})
        // console.log(error)
    }

}

export default connectDB
