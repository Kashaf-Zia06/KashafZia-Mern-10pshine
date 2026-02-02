// import axios from 'axios';
// import { Axis3D, Target } from 'lucide-react';
// import React, { useState, useEffect } from 'react'
// import { MdClose } from 'react-icons/md';
// import { RichTextEditor } from '@mantine/rte';
// import { Editor } from '@tinymce/tinymce-react';
// import { useRef } from 'react';


// const AddEditNotes = ({ noteData, type, onClose, fetchNotes }) => {


//   //states
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("")

//   const [error, setError] = useState(null)

//   //useeffects
//   useEffect(() => {
//     if (type == 'add') {
//       setTitle("")
//       setContent("")
//     }

//     if (type == "edit") {
//       setTitle(noteData.title)
//       setContent(noteData.content)
//     }

//   }, [type, noteData])

//   //add note api
//   const addNote = async () => {
//     console.log(title, content)
//     console.log("Inside add notes function")
//     try {
//       const res = await axios.post(
//         "http://localhost:5005/notes/add",
//         { title, content },
//         { withCredentials: true }

//       );
//       fetchNotes()
//       onClose()
//       console.log(res.data)
//     } catch (error) {
//       console.log(error)
//     }



//   }


//   //edit note api
//   const editNote = async () => {
//     try {
//       await axios.put(
//         `http://localhost:5005/notes/edit/${noteData._id}`,
//         { title, content },
//         { withCredentials: true }
//       );

//       fetchNotes();
//       onClose();
//     } catch (error) {
//       console.log(error);
//     }

//   }


//   const handleAddNotes = () => {
//     if (!title) {
//       setError("Please enter the title")
//       return
//     }

//     if (!content) {
//       setError("Please enter the content")
//       return;
//     }

//     setError("")

//     console.log(title)
//     console.log(content)

//     if (type === 'edit') {
//       console.log("calling edit note api via handle function")
//       editNote()
//     }
//     if (type === 'add') {
//       console.log("calling add note via handle add notes ")
//       addNote()
//     }
//   }



//   return (
//     <div className='relative'>
//       <button className='w-10 h-10  rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-400' onClick={onClose}>
//         <MdClose className='text-xl text-slate-300'
//         />
//       </button>

//       <div className='flex flex-col gap-2 text-white'>
//         <label className='input-label'>TITLE</label>

//         <input type="text"
//           className='text-1xl text-slate-400 outline-none '
//           placeholder='Title here...'
//           value={title}
//           onChange={({ target }) => setTitle(target.value)} />
//       </div>

//       <div className="flex flex-col gap-2 mt-4">
//         <label className="input-label text-white">CONTENT</label>
//         <Editor
//           apiKey="your-tinymce-api-key"
//           value={content}
//           onEditorChange={(newContent) => setContent(newContent)}
//           init={{
//             height: 300,
//             menubar: false,
//             plugins: ['lists', 'link', 'paste', 'autolink'],
//             toolbar:
//               'bold italic underline | bullist numlist | link | undo redo',
//             content_style:
//               'body { font-family:Arial,sans-serif; font-size:14px; color:#fff; background-color:#1e293b }',
//           }}
//         />

//         {error && <p className="text-red-600 text-xs pt-5">{error}</p>}

//         <button
//           className="bg-[linear-gradient(90deg,_#efd5ff_0%,_#515ada_100%)] font-medium mt-5 p-3 text-white cursor-pointer"
//           onClick={handleAddNotes}
//         >
//           {type === 'edit' ? 'UPDATE' : 'ADD'}
//         </button>
//       </div>












//       {error && <p className='text-red-600 text-xs pt-5'>{error}</p>}

//       <button className='bg-[linear-gradient(90deg,_#efd5ff_0%,_#515ada_100%)] font-medium mt-5 p-3 text-white cursor-pointer'
//         onClick={handleAddNotes}>

//         {type == 'edit' ? "UPDATE" : "ADD"}
//       </button>
//     </div>

    
//   )
// }

// export default AddEditNotes



import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { Editor } from '@tinymce/tinymce-react';
import { ToastContainer, toast } from 'react-toastify';


const AddEditNotes = ({ noteData, type, onClose, fetchNotes }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  // Initialize form fields
  useEffect(() => {
    if (type === 'add') {
      setTitle('');
      setContent('');
    }
    if (type === 'edit' && noteData) {
      setTitle(noteData.title || '');
      setContent(noteData.content || '');
    }
  }, [type, noteData]);

  // Add note API
  const addNote = async () => {
    try {
      await axios.post(
        'http://localhost:5005/notes/add',
        { title, content },
        { withCredentials: true }
      );
      fetchNotes();
      toast.success("Note added successfuly")
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit note API
  const editNote = async () => {
    try {
      await axios.put(
        `http://localhost:5005/notes/edit/${noteData._id}`,
        { title, content },
        { withCredentials: true }
      );
      toast.success("Note edited successfully")
      fetchNotes();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNotes = () => {
    if (!title.trim()) {
      setError('Please enter the title');
      return;
    }
    if (!content.trim()) {
      setError('Please enter the content');
      return;
    }

    setError('');
    type === 'edit' ? editNote() : addNote();
  };

  return (
    <div className="relative p-4 bg-slate-800 rounded-md text-white">
      {/* Close button */}
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-400"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-300" />
      </button>

      {/* Title input */}
      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-1xl text-slate-400 outline-none p-2 rounded bg-slate-700"
          placeholder="Title here..."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Content editor */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <Editor
          value={content}
          onEditorChange={(newContent) => setContent(newContent)}
          apiKey='ej1gix6crweuordxq7n077r4qq0x929mgn8hi2ewt8iwf1aa'
          init={{
            height: 300,
            menubar: false,
            plugins: ['lists', 'link', 'paste', 'autolink'],
            toolbar:
              'undo redo | bold italic underline | bullist numlist | link',
            skin: 'oxide-dark',
            content_css: 'dark',
          }}
        />

        {error && <p className="text-red-600 text-xs pt-2">{error}</p>}

        <button
          className="bg-[linear-gradient(90deg,_#efd5ff_0%,_#515ada_100%)] font-medium mt-5 p-3 text-white cursor-pointer rounded"
          onClick={handleAddNotes}
        >
          {type === 'edit' ? 'UPDATE' : 'ADD'}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
