import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import NoteCard from '@/components/NoteCard'
import { MdAdd, MdOutlineAlarmAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes.jsx'
import Modal from 'react-modal'
import axios from 'axios'
import { useNotes } from "@/context/NotesContext.jsx"
import { Heading3 } from 'lucide-react'
import { toast } from 'react-toastify'


Modal.setAppElement("#root");

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  const { filteredNotes,fetchNotes} = useNotes()
  console.log(filteredNotes)

  

  // const fetchNotes = async () => {
  //   try {
  //     console.log("Inside fetch notes function")
  //     const res = await axios.get(
  //       "http://localhost:5005/notes/dashboard",
  //       {
  //         withCredentials: true,
  //       })
  //     console.log(res)

  //     setNotes(res.data.data)
  //   } catch (err) {
  //     console.log(err.message)
  //   }
  // }

  const deleteNote = async (noteId) => {
    try {
      console.log("Inside on delete on home.jsx")
      console.log(noteId)
      const res = await axios.delete(
        `http://localhost:5005/notes/delete/${noteId}`,{
        withCredentials: true,
      }
     

      )

      toast.success("Note deleted successfully")
      fetchNotes()
      console.log(res)
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (

    <>
      <Navbar />
      <div className='container mx-auto'>
         {filteredNotes.length==0 && <h3 className=' text-3xl  no-notes'>No Notes to display!</h3>}
        <div className='grid grid-cols-3 gap-4 mt-8'>

         

          {filteredNotes.map((note) => (
            <NoteCard

              key={note._id}
              title={note.title}
              content={note.content}
              isPinned={note.isPinned}
              onEdit={() => {
                setOpenAddEditModal({
                  isShown: true, type: "edit",
                  data: note
                })
              }}
              onDelete={() => {
                console.log(note._id)
                if (window.confirm("Delete this note?")) {
                  
                  deleteNote(note._id);
                }
              }}
            />
          ))
          }
        </div>




        <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-[linear-gradient(90deg,_#efd5ff_0%,_#515ada_100%)] absolute right-10 bottom-10 cursor-pointer transition-all ease-in-out'
          onClick={() => {
            setOpenAddEditModal({ isShown: true, type: "add", data: null })
          }} >


          <MdAdd className='text-[32px] text-white' />
        </button>

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => { }}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
            },
          }}
          contentLabel=""
          className="w-[40%] mt-[116px] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
        >

          <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}

            onClose={() => {
              setOpenAddEditModal({ isShown: false, type: "add", data: null })
            }}
            fetchNotes={fetchNotes}
          />
        </Modal>







      </div>
    </>
  )
}

export default Home
