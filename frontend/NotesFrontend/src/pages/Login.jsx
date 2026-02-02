import Navbar from '@/components/Navbar'
import PasswordInput from '@/components/PasswordInput'
import { getInitials, validateEmail, validatePassword } from '@/utils/helper'
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        console.log("inside handle login og login.jsx")
        e.preventDefault()

        if (!validateEmail(email)) {
            setError('Please enter valid email')
            return;
        }



        setError("")

      
        if (!password) {
            setError("Please enter a password")
            return;
        }

        setError("")


        //Login Api call
        console.log("calling login api")

        try {
            console.log("inside try block of login api posting axios")

            const res = await axios.post(
                "http://localhost:5005/users/login",
                { email, password },
                { withCredentials: true },


            )
            console.log(res)
            const user = res.data.data.user
            console.log(res.data.data.user.userName)
            const userName = res.data.data.user.userName
            // console.log(userName)
            // console.log("calling get initial")
            const initials = getInitials(user.userName)
            localStorage.setItem("user", JSON.stringify({ ...user, initials }));


            navigate("/dashboard")

            console.log(res.data)
        }


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
            <Navbar />
            <div className='flex items-center justify-center mt-26'>
                <div className='w-96 mx-auto bg-transparent border-[3px]
                 border-white hover:shadow-2xl rounded-[30px] px-7 py-10' >
                    <form onSubmit={handleLogin}>
                        <h4 className='text-2xl text-white text-center mb-7'>Login</h4>

                        <input value={email} onChange={(e) => { setEmail(e.target.value) }}
                            type="text" placeholder='Email' className='input-box' />

                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />

                        {error && <p className='text-red-500 text-center mt-[-12px] text-xs pb-1 '>{error}</p>}

                        <button onClick={handleLogin} type='submit' className='btn-primary'>Login</button>

                        <p className='text-sm text-white text-center mt-4'>
                            Not registered yet?{" "}
                            <Link to='/Signup' className='font-medium underline text-[#fffdfdd1]'>
                                Create an account
                            </Link>
                        </p>

                        <div className="flex justify-end mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm underline text-white hover:text-purple-300 transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                    </form>
                </div>

            </div>
        </>
    )
}

export default Login
