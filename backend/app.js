import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { globalErrorHandler } from "./middlewares/errorHandler.js"


console.log("inside app.js before starting express app")

dotenv.config({ path: './.env' });

const app=express();


app.use(cors({
    // origin:true,
    origin:"http://localhost:5173",
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    
    
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
import notesRouter from "./routes/note.route.js"

//routes declaration
app.use('/users',userRouter);
app.use('/notes',notesRouter)

app.use(globalErrorHandler);

export {app}