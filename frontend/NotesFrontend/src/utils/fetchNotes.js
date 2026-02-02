import React from "react"
import axios from "axios"


const fetchNotes = async () => {
    try {
      console.log("Inside fetch notes function")
      const res = await axios.get(
        "http://localhost:5005/notes/dashboard",
        {
          withCredentials: true,
        })
      console.log(res)

      setNotes(res.data.data)
    } catch (err) {
      console.log(err.message)
    }
  }

  export {fetchNotes}