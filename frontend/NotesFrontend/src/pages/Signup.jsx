import React from 'react'
import Navbar from '@/components/Navbar'
import { useState } from 'react'
import PasswordInput from '@/components/PasswordInput'
import { Link } from 'react-router-dom'
import { validateEmail } from '@/utils/helper'
import { validatePassword } from '@/utils/helper'
import axios from "axios"
import { useNavigate } from "react-router-dom";


const Signup = () => {

    const [userName,setUserName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState(null)

    const navigate=useNavigate()


    const handleSignUp= async (e)=>{
        e.preventDefault()

        if(!userName){
            setError("Please enter name")
            return;
        }

        setError("")

        if(!validateEmail(email)){
            setError("Please enter valid email")
            return;
        }

        setError("")

        if (!validatePassword(password)) {
                    setError(
                        "Password must be at least 6 characters and include uppercase, lowercase, and a number"
                    );
                    return;
                }
        

        if(!password){
            setError("Please enter password")
            return;
        }

        setError("")

        //Sign up api call

        try {
            const res=await axios.post(
                "http://localhost:5005/users/signup",
                {userName,email,password},
                {withCredentials:true},

            )
            console.log("User signed up:",res.data)
            navigate("/login"); 
            
        }
        // catch (err) {
        //     console.log("Signup failed: ",err.message)
        // }
         catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // now it will show "User doesnot exist"
            } else {
                setError("Something went wrong. Please try again.");
            }
        }





    }

  return (
    <>
    <Navbar/>
    <div className='flex items-center justify-center mt-26'>
        <div className='w-96 mx-auto bg-transparent border-[3px] hover:shadow-2xl border-white rounded-[30px] px-7 py-10' >
            <form onSubmit={handleSignUp}>
                <h4 className='text-2xl mb-7 text-white text-center'>SignUp</h4>

                <input 
                 value={userName}
                 onChange={(e)=>{setUserName(e.target.value)}}
                 type="text" 
                 placeholder='UserName' className='input-box'/>

                 <input 
                 value={email}
                 onChange={(e)=>{setEmail(e.target.value)}}
                 type="text" 
                 placeholder='Email' className='input-box'/>

                <PasswordInput
                 value={password} onChange={(e)=>{setPassword(e.target.value)}}
                />


                {error && <p className='text-red-500 text-xs pb-1 '>{error}</p>}

                <button type='submit' className='btn-primary'>Create account</button>

                <p className='text-sm text-white text-center mt-4'>
                    Already have an account?{" "}
                    <Link to='/login' className='text-[#fffdfdd1] font-medium underline text-primary'>
                    Login
                    </Link>
                </p>






            </form>
        </div>
    </div>
    </>
  )
}

export default Signup
