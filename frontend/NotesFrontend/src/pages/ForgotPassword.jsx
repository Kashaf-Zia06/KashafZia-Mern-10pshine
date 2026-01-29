import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const submit = async () => {
    try {
        console.log("INSIDE SUBMIT AT FROGOT PASSWORD.JSX ")
        await axios.post(
          "http://localhost:5005/users/forgot-password",
          { email }
        );
        alert("Check your email");
    } catch (err) {
        console.log(err.message)
    }
  };

  return (
    <>
    <h2 className='text-white text-4xl ml-2.5 py-2 font-medium'>NOTES</h2>

    <div className="mt-[70px]">
        <h4 className="text-center text-3xl text-white">Forgot your password?</h4>
    <div className="flex flex-col gap-2 items-center justify-center mt-[20px] w-96 mx-auto bg-transparent border-[3px] border-white rounded-[30px] px-7 py-10"> 
      
      <input  
      value={email}
      placeholder="email"
      onChange={e => setEmail(e.target.value)}
      className="input-box bg-transparent border-[3px] text-white" />
     
      <button  
      
      className="text-white rounded-2xl border-black reset-btn "
      onClick={submit}>Send Reset Link</button>
    </div>
      </div>
    </>
  );
};

export default ForgotPassword