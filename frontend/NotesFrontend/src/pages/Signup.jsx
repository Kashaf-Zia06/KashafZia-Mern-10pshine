import React from 'react'
import Navbar from '@/components/Navbar'
import { useState } from 'react'
import PasswordInput from '@/components/PasswordInput'
import { Link } from 'react-router-dom'
import { validateEmail } from '@/utils/helper'


const Signup = () => {

    const [userName,setUserName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState(null)


    const handleSignUp= async (e)=>{
        e.preventDefault()

        if(!userName){
            setError("Please enter name")
            return;
        }

        setError("")

        if(!validateEmail){
            setError("Please enter valid email")
            return;
        }

        setError("")

        if(!password){
            setError("Please enter password")
            return;
        }

        setError("")

        //Sign up api call


    }

  return (
    <>
    <Navbar/>
    <div className='flex items-center justify-center mt-26'>
        <div className='w-96 border rounded bg-white px-7 py-10' >
            <form onSubmit={handleSignUp}>
                <h4 className='text-2xl mb-7'>SignUp</h4>

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

                <p className='text-sm text-center mt-4'>
                    Already have an account?{" "}
                    <Link to='/login' className='font-medium underline text-primary'>
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
