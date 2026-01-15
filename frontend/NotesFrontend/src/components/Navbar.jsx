import React, { useState } from 'react'
import ShinyText from './ShinyText';
import ProfileInfo from './ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Target } from 'lucide-react';

const Navbar = () => {

    const [searchQuery,setSearchQuery]=useState("")

    const navigate=useNavigate;

    const onLogout=()=>{
        navigate("/login")
    }

    const handleSearch =()=>{

    }

    const onClearSearch=()=>{
        setSearchQuery("")
    }

    return (
        <div className='flex items-center justify-between px-6 py-2 drop-shadow'>
                <h2 className='text-white text-xl py-2 font-medium'>Notes</h2>
                <SearchBar
                value={searchQuery}
                onChange={({target})=>{
                    setSearchQuery(target.value)
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
                />
                <ProfileInfo onLogout={onLogout}/>
        </div>
    )
}



export default Navbar
