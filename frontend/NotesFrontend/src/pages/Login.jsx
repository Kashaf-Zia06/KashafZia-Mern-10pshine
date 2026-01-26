import Navbar from '@/components/Navbar'
import PasswordInput from '@/components/PasswordInput'
import { validateEmail } from '@/utils/helper'
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Login = () => {

    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[error,setError]=useState(null)
    const navigate=useNavigate()

    const handleLogin= async(e)=>{
        console.log("inside handle login og login.jsx")
        e.preventDefault()

        if(!validateEmail(email))
        {
            setError('Please enter valid email')
            return;
        }

        setError("")

        if(!password){
            setError("Please enter a password")
            return;
        }

        setError("")


        //Login Api call
        console.log("calling login api")

       try {
        console.log("inside try block of login api posting axios")
        const res=await axios.post(
            "http://localhost:5005/users/login",
            {email,password},
            {withCredentials:true},
            
            
        )
        navigate("/dashboard")
        console.log(res.data)
       } 
       catch (err) {
        console.log("User login failed", err.message)
       }

    }



  return (
    <>
      <Navbar/>
    <div className='flex items-center justify-center mt-26'>
        <div className='w-96 border rounded bg-white px-7 py-10' >
            <form onSubmit={handleLogin}>
                <h4 className='text-2xl mb-7'>Login</h4>

                <input value={email} onChange={(e)=>{setEmail(e.target.value)}} 
                type="text" placeholder='Email' className='input-box'/>

                <PasswordInput value={password} onChange={(e)=>setPassword(e.target.value)}/>
                
                {error && <p className='text-red-500 text-xs pb-1 '>{error}</p>}

                <button onClick={handleLogin} type='submit' className='btn-primary'>Login</button>

                <p className='text-sm text-center mt-4'>
                    Not registered yet?{" "}
                    <Link to='/Signup' className='font-medium underline text-primary'>
                    Create an account
                    </Link>
                </p>

            </form>
        </div>
      
    </div>
    </>
  )
}

export default Login
