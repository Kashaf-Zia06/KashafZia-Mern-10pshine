import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

console.log("inside app.js before starting express app")

dotenv.config({ path: './.env' });

const app=express();


app.use(cors({
    origin:true,
    
    
}))

app.use(express.json()) //form data acceptance
app.use(express.urlencoded({extended:true})) //data coming through URLS or params
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
    console.log("Root route hit");
    res.send("Server is running 🚀");
});


//import router
import userRouter from "./routes/user.route.js";

//routes declaration
app.use('/users',userRouter);

export {app}