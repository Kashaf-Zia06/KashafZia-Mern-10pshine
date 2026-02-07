import dotenv from "dotenv"
import connectDB from "./config/db.js"
import {app} from "./app.js"
import logger from "./logger.js"


dotenv.config({
  path:'./.env'
})


connectDB()
.then(()=>{
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    
  // console.log(`Server is running on port ${PORT}`);
  logger.info("Server running on port 5000");


});



}).catch((err)=>{
  logger.error("MongoDB connection failed")

})


// import dotenv from "dotenv"
// import app from "./app.js"

// dotenv.config({ path: './.env' });

// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   console.log(`App is listening on ${PORT}`);
// });
