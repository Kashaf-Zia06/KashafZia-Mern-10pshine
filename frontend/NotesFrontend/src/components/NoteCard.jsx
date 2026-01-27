import React from 'react'
import {MdCreate,MdDelete} from "react-icons/md"
import {MdOutlinePushPin} from "react-icons/md"

const NoteCard = ({title,content,isPinned,date,onDelete,onEdit}) => {
  return (
    <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-white shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300'>
        <div className='flex  items-center justify-between' >
            <div>
                <h6 className='text-1xl text-white'>{title}</h6>
                <span className='text-white text-xs'>{date}</span>
            </div>

            <MdOutlinePushPin 
            className={`hover:cursor-pointer ${isPinned ? 'text-blue-400 ': 'text-slate-300'}`}
            />

        </div>    

            <p className='text-xs custom-text mt-2 text-[#fefefe9e]  '>{content?.slice(0,200)}</p>

            <div className='flex items-center justify-end mt-2'>
                <div className='flex items-center gap-2'>
                    <MdCreate className='icon-btn' onClick={onEdit}/>
                    <MdDelete className='text-xl text-slate-300 hover:text-red-400 hover:cursor-pointer' onClick={onDelete}/>
                </div>
            </div>



        </div>
      
    
  )
}

export default NoteCard
