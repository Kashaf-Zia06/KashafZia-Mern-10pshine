import axios from 'axios';
import { Axis3D, Target } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { MdClose } from 'react-icons/md';


const AddEditNotes = ({ noteData, type, onClose, fetchNotes }) => {


  //states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("")

  const [error, setError] = useState(null)

  //useeffects
  useEffect(() => {
    if (type == 'add') {
      setTitle("")
      setContent("")
    }

    if (type == "edit") {
      setTitle(noteData.title)
      setContent(noteData.content)
    }

  }, [type, noteData])

  //add note api
  const addNote = async () => {
    console.log(title, content)
    console.log("Inside add notes function")
    try {
      const res = await axios.post(
        "http://localhost:5005/notes/add",
        { title, content },
        { withCredentials: true }

      );
      fetchNotes()
      onClose()
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }



  }


  //edit note api
  const editNote = async () => {
    try {
      await axios.put(
        `http://localhost:5005/notes/edit/${noteData._id}`,
        { title, content },
        { withCredentials: true }
      );

      fetchNotes();
      onClose();
    } catch (error) {
      console.log(error);
    }

  }


  const handleAddNotes = () => {
    if (!title) {
      setError("Please enter the title")
      return
    }

    if (!content) {
      setError("Please enter the content")
      return;
    }

    setError("")

    console.log(title)
    console.log(content)

    if (type === 'edit') {
      console.log("calling edit note api via handle function")
      editNote()
    }
    if (type === 'add') {
      console.log("calling add note via handle add notes ")
      addNote()
    }
  }



  return (
    <div className='relative'>
      <button className='w-10 h-10  rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-400' onClick={onClose}>
        <MdClose className='text-xl text-slate-300'
        />
      </button>

      <div className='flex flex-col gap-2 text-white'>
        <label className='input-label'>TITLE</label>

        <input type="text"
          className='text-2xl text-black outline-none '
          placeholder='Go to gym'
          value={title}
          onChange={({ target }) => setTitle(target.value)} />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>

        <textarea
          type="text"
          className='text-sm text-slate-950 ocutline-none bg-slate-50 p-2 rounded
            '
          placeholder='Content'
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}

        ></textarea>




        {error && <p className='text-red-600 text-xs pt-5'>{error}</p>}

        <button className='bg-[linear-gradient(90deg,_#efd5ff_0%,_#515ada_100%)] font-medium mt-5 p-3 text-white cursor-pointer'
          onClick={handleAddNotes}>

          {type=='edit'? "UPDATE" : "ADD" }
        </button>
      </div>

    </div>
  )
}

export default AddEditNotes
