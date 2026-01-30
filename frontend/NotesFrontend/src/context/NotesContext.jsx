import { createContext, useContext, useState } from "react"
import axios from "axios"

const NotesContext = createContext()

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  const fetchNotes = async () => {
    const res = await axios.get(
      "http://localhost:5005/notes/dashboard",
      { withCredentials: true }
    )
    setNotes(res.data.data)
  }

  // derived state (important)
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        fetchNotes,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => useContext(NotesContext)
