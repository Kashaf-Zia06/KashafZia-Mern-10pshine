import { useState } from 'react'
import DarkVeil from './components/DarkVeil';
import Navbar from './components/Navbar';
import './App.css'
import './index.css'
import Home from './pages/Home';
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/Signup';
import bg from './assets/bg.avif'






const routes=(
  <Router>
    <Routes>
      <Route path='/dashboard' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
    </Routes>
  </Router>
)

const myStyle = {
  backgroundImage: `url(${bg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '100vh',
  
};


function App() {
  return (
    <>
      {/* <div className='fixed inset-0 -z-10'>
        <DarkVeil />
      </div> */}

      {/* <div 
      className="fixed inset-0 -z-10"
      style={myStyle}>

      </div> */}
      
     <div>

    {routes}
     </div>
      </>
  )
}
export default App