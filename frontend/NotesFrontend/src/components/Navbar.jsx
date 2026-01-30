import React, { useState } from 'react'
import ShinyText from './ShinyText';
import ProfileInfo from './ProfileInfo';
import { useNavigate,useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Target } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {

    const location=useLocation();

    const hideSearchBar=location.pathname ==='/login' || location.pathname==='/signup' || location.pathname==='/Login' || location.pathname==='/Signup'
    
    const [searchQuery, setSearchQuery] = useState("")

    const navigate = useNavigate();

    const onLogout = async() => {
        try {
            console.log("Inside logout of navbar.jsx")
            const res = await axios.post(
                "http://localhost:5005/users/logout",
                {
                    withCredentials:true
                })
            console.log(res)
            navigate("/login")
        } catch (err) {
            console.log(err.message)

        }

    }

    const handleSearch = () => {

    }

    const onClearSearch = () => {
        setSearchQuery("")
    }

    return (
        <div className='flex items-center justify-between px-6 py-2 drop-shadow'>
            <h2 className='text-white text-4xl py-2 font-medium'>NOTES</h2>


            {!hideSearchBar &&(
            <SearchBar
                value={searchQuery}
                onChange={({ target }) => {
                    setSearchQuery(target.value)
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />)
            }

            <ProfileInfo onLogout={onLogout} />
        </div>
    )
}



export default Navbar
