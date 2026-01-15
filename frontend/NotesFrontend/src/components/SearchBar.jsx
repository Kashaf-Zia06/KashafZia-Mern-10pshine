import React from 'react'
import {FaMagnifyingGlass} from "react-icons/fa6"
import {IoMdClose} from "react-icons/io"

const SearchBar = ({value,onChange,handleSearch,onClearSearch}) => {
  return (
    <div className='flex items-center px-4 bg-slate-100 rounded-md w-80'>
      <input type="text"
      placeholder='Search Notes'
      value={value}
      onChange={onChange}
      className='w-full text-xs bg-transparent py-[11px] outline-none' />

    {value && (
    <IoMdClose className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3' onClick={onClearSearch}/>
  )}
  
    <FaMagnifyingGlass className='cursor-pointer hover:text-black' onClick={handleSearch}/>
    </div>
  )
}

export default SearchBar
