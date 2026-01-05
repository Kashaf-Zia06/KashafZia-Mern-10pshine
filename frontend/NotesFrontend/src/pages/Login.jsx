import Navbar from '@/components/Navbar'
import PasswordInput from '@/components/PasswordInput'
import { validateEmail } from '@/utils/helper'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {

    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[error,setError]=useState(null)


    const handleLogin= async(e)=>{
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


    }



  return (
    <>
      <Navbar/>
    <div className='flex items-center justify-center mt-26'>
        <div className='w-96 border rounded bg-white px-7 py-10' >
            <form onSubmit={handleLogin}>
                <h4 className='text-2xl mb-7'>Login</h4>

                <input value={email} onChange={(e)=>{setEmail(e.target.value)}} type="text" placeholder='Email' className='input-box'/>

                <PasswordInput value={password} onChange={(e)=>setPassword(e.target.value)}/>
                
                {error && <p className='text-red-500 text-xs pb-1 '>{error}</p>}

                <button type='submit' className='btn-primary'>Login</button>

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
