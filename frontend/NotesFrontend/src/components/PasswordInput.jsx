import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"



const PasswordInput = ({ value,onChange, placeholder }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const togglePassword = () => {
        setIsShowPassword(!isShowPassword)

    }
    return (
        <div className='flex items-center bg-transparent border-gray-400 border-[1.5px] px-2 rounded mb-4 outline-none'>

            <input
                value={value}
                onChange={onChange}
                type={isShowPassword ? "text" : "password"}
                placeholder={placeholder || "   Password"}
                className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none text-white'

            />


            {isShowPassword ? (
                <FaRegEye
                    size={22}
                    className="text text-blue-500"
                    onClick={() => { togglePassword() }} />) :
                (
                    <FaRegEye
                        size={22}
                        className="text text-slate-400 cursor-pointer"
                        onClick={() => { togglePassword() }} />)




            }
        </div>
    )
}

export default PasswordInput
