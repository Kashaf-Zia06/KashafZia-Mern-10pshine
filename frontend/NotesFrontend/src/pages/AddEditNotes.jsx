import { Target } from 'lucide-react';
import React, { useState } from 'react'

const AddEditNotes = () => {

  const [title,setTitle]=useState("");
  const [content,setContent]=useState("")


  return (
    <div>
        <div className='flex flex-col gap-2 text-white'>
            <label className='input-label'>TITLE</label>

            <input type="text"
            className='text-2xl text-black outline-none ' 
            placeholder='Go to gym'
            value={title}
            onChange={({target})=>setTitle(target.value)}/>
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
            onChange={({target})=>setContent(target.value)}
            ></textarea>

            <button className='bg-[linear-gradient(90deg,_#efd5ff_0%,_#515ada_100%)] font-medium mt-5 p-3 text-white cursor-pointer' onClick={()=>{}}>
                
                ADD
            </button>
        </div>
     
    </div>
  )
}

export default AddEditNotes
