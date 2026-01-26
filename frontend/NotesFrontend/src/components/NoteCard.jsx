import React from 'react'
import {MdCreate,MdDelete} from "react-icons/md"
import {MdOutlinePushPin} from "react-icons/md"

const NoteCard = ({title,content,isPinned,date,onDelete,onEdit}) => {
  return (
    <div className='border rounded p-4 bg-[#ffa232] border-3 border-[#da7a2c] text-white hover:shadow-xl transition-all ease-in-out'>
        <div className='flex  items-center justify-between' >
            <div>
                <h6 className='text-sm font-medium text-white'>{title}</h6>
                <span className='text-white text-xs'>{date}</span>
            </div>

            <MdOutlinePushPin 
            className={`icon-btn ${isPinned ? 'text-blue-300 ': 'text-slate-300'}`}
            />

        </div>    

            <p className='text-xs mt-2 text-shadow-indigo-50'>{content?.slice(0,60)}</p>

            <div className='flex items-center justify-between mt-2'>
                <div className='flex items-center gap-2'>
                    <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit}/>
                    <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete}/>
                </div>
            </div>



        </div>
      
    
  )
}

export default NoteCard
