import React from 'react'
import notes from "../assets/notes.png"
import { Link } from 'react-router-dom'
const LandingPage = () => {
    return (
        <>
            <h2 className='text-white text-4xl ml-6 py-2 font-medium'>NOTES</h2>

            <div className='grid grid-cols-2 place-content-center'>


                <div className='mt-[30px]'>
                    <img src={notes} alt="Notes" />
                </div>

                <div className='m-auto'>
                    <h2 className='text-5xl text-white text-center align-middle m-auto'>Hi there <span className='wave'> 👋</span></h2>
                    <p className='text-white text-2xl hover:text-shadow-2xs text-shadow-lg/30 mt-3'>Ready to organize your thoughts?</p>

                    <div className='mt-[29px] gap-2.5 justify-center flex'>
                        <Link to={'/Signup'}>    <button

                            className='text-white border- bg-[#552586] hover:cursor-pointer animated-border-btn'>SignUp</button>
                        </Link>


                        <Link to='/Login'>
                            <button className='animated-border-btn text-white bg-[#552586] hover:cursor-pointer'>
                                Login
                            </button>
                        </Link>
                    </div>


                </div>




            </div>
        </>
    )
}

export default LandingPage
