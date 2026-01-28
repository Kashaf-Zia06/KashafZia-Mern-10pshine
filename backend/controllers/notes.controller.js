import { User } from "../models/User.model.js";
import { Notes } from "../models/Notes.model.js"
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const addNotes = asyncHandler(async (req, res) => {
    const { title, content } = req.body

    console.log("Req.user:", req.user);
    if (!req.user) {
        throw new ApiError(401, "User not authenticated");
    }

    console.log("Cookies:", req.cookies);
    console.log("Authorization Header:", req.headers.authorization);


    if (!title)
        throw new ApiError(401, "Title is required")

    if (!content) {
        throw new ApiError(401, "Content is required")
    }



    try {
        const user = await User.findById(
            req.user._id
        )


        const newNote = new Notes(
            {
                title: title,
                content: content,
                userId: req.user._id,

            }
        )

        const options = {
            httpOnly: true,
            secure: false
        }


        console.log("trying to add notes")
        await newNote.save()
        console.log("Note added")

        res.status(200).json(
            new apiResponse(200, "Notes added successfully", options)
        )

    } catch (error) {
        console.log(error.message)

    }





})


// const getUserNotes=asyncHandler(async(req,res)=>{
//     console.log("Inside get user notes function controller")
//     console.log(req.user._id)
//     const notes= await Notes.findById(req.user._id);

//     res.status(200).json(
//         new apiResponse(200,"Notes fetched successfully",notes)

//     )

// })



const getUserNotes = async (req, res) => {
    try {
        console.log("Inside getUserNotes controller");
        console.log("req.user:", req.user);

        const notes = await Notes.find({ userId: req.user._id });
        console.log("Fetched notes:", notes);

        res.status(200).json({
            statusCode: 200,
            message: "Notes fetched successfully",
            success: true,
            data: notes || []   // never null
        });
    } catch (err) {
        console.log("Error fetching notes:", err);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            success: false,
            data: []
        });
    }
};



const editNotes = asyncHandler(async (req, res) => {
    try {
        console.log("Inside edit notes controller")
        const { title, content } = req.body;

        const note = await Notes.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, content },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note
        });


    } catch (err) {
        console.log(err.message)

    }

})

const deleteNotes = asyncHandler(async (req, res) => {

    try {
        console.log("Inside delet notes controller")
        console.log(req)
        const {noteId}  = req.params
        console.log("Notes id is:",noteId)
        const user_id = req.user._id
        console.log("User id is ",user_id)


        if (!noteId) {
            return res.status(400).json({
                success: false,
                message: "Note ID is required",
            });
        }

        console.log(noteId)
        console.log(user_id)

        await Notes.findOneAndDelete(
            {
                _id: noteId,
                userId: user_id

            }
        )

        res.status(200).json({
            success:true,
            message:"Note deleted successfully",
        })

    } catch (err) {
        console.log(err.message)
    }

})

export { addNotes, editNotes, deleteNotes, getUserNotes }