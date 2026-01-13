import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import NoteCard from '@/components/NoteCard'
import { MdAdd, MdOutlineAlarmAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes.jsx'
import Modal from 'react-modal'

Modal.setAppElement("#root");

const Home = () => {

  const [openAddEditModal,setOpenAddEditModal]=useState({
    isShown: false,
    type:"add",
    data:null,
  })
  return (

    <>
    <Navbar/>
    <div className='container mx-auto'>
      <div className='grid grid-cols-3 gap-4 mt-8'>
      <NoteCard 
      title="Hello world" 
      date="13 Jan 2026"
      content="My first note"
      isPinned={true}
      onDelete={()=>{}}
      onEdit={()=>{}}/>
      </div>


      <div className='grid grid-cols-3 gap-4 mt-8'>
      <NoteCard 
      title="Hello world" 
      date="13 Jan 2026"
      content="My first note"
      isPinned={true}
      onDelete={()=>{}}
      onEdit={()=>{}}/>
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-[linear-gradient(90deg,_#efd5ff_0%,_#515ada_100%)] absolute right-10 bottom-10 cursor-pointer transition-all ease-in-out' 
      onClick={()=>{
        setOpenAddEditModal({isShown:true,type:"add" ,data:null})
      }} >


        <MdAdd className='text-[32px] text-white'/>
      </button>

      <Modal 
      isOpen={openAddEditModal.isShown}
      onRequestClose={()=>{}}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.2)",
        },
      }}
      contentLabel=""
      className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
      <AddEditNotes/>
      </Modal>




    
      
      
    </div>
    </>
  )
}

export default Home
