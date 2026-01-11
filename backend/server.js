import dotenv from "dotenv"
import connectDB from "./config/db.js"
import {app} from "./app.js"


dotenv.config({
  path:'./.env'
})


connectDB()
.then(()=>{
  const PORT = process.env.PORT || 8000;
  console.log("Inside server.js after connecting DB")
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});



}).catch((err)=>{
  console.log("MongoDB connection failed!!",err)

})


// import dotenv from "dotenv"
// import app from "./app.js"

// dotenv.config({ path: './.env' });

// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   console.log(`App is listening on ${PORT}`);
// });
