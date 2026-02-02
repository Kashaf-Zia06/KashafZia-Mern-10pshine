// import React, { useState } from 'react'
// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"



// const PasswordInput = ({ value,onChange, placeholder }) => {
//     const [isShowPassword, setIsShowPassword] = useState(false);

//     const togglePassword = () => {
//         setIsShowPassword(!isShowPassword)

//     }
//     return (
//         <div className='flex  items-center bg-transparent border-gray-400 border-[1.5px]  rounded mb-4 '>

//             <input
//                 value={value}
//                 onChange={onChange}
//                 type={isShowPassword ? "text" : "password"}
//                 placeholder={placeholder || "   Password"}
//                 // className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none text-white'
//                 // className='input-box'
//                 className='py-3 mr-3 text-white outline-none text-sm'

//             />


//             {isShowPassword ? (
//                 <FaRegEye
//                     size={22}
//                     className="text text-blue-500"
//                     onClick={() => { togglePassword() }} />) :
//                 (
//                     <FaRegEye
//                         size={22}
//                         className="text text-slate-400 cursor-pointer"
//                         onClick={() => { togglePassword() }} />)




//             }
//         </div>
//     )
// }

// export default PasswordInput


import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false)

  return (
    <div className="relative  mb-4">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="input-box pr-12"
      />

      <span
        onClick={() => setIsShowPassword(!isShowPassword)}
        className="absolute right-4 top-1/2 -translate-y-[90%] cursor-pointer text-slate-400 hover:text-blue-400 transition"
      >
        {isShowPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
      </span>
    </div>
  )
}

export default PasswordInput
