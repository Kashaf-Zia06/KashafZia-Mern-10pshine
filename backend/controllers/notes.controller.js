import { User } from "../models/User.model.js";
import { Notes } from "../models/Notes.model.js"
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import logger from "../logger.js";

const addNotes = asyncHandler(async (req, res) => {
    const { title, content } = req.body


    if (!req.user) {
        logger.warn("Add note failed: user not authenticated");
        throw new ApiError(401, "User not authenticated");
    }

    if (!title) {
        logger.warn({ userId: req.user._id }, "Add note failed, title is required")
        throw new ApiError(401, "Title is required")
    }
    if (!content) {
        logger.warn({ userId: req.user._id }, "Add note failed,content is required")
        throw new ApiError(401, "Content is required")
    }

    try {
        const user = await User.findById(
            req.user._id
        )

        if (!user) {

            logger.warn({ userId: req.user._id }, "Add note failed: user not found");
        }

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

        await newNote.save()
        logger.info({ userId: req.user._id, noteId: newNote._id }, "Note added successfully");

        res.status(200).json(
            new apiResponse(200, "Notes added successfully", options)
        )

    } catch (error) {
        logger.error({ err: error, userId: req.user._id }, "Error adding note");
        throw new ApiError(500, error.message);

    }





})


const getUserNotes = async (req, res) => {

    logger.info({ userId: req.user._id }, "Get user notes request received");
    try {

        const notes = await Notes.find({ userId: req.user._id });

        logger.info({ userId: req.user._id, notesCount: notes.length }, "User notes fetched successfully");


        res.status(200).json({
            statusCode: 200,
            message: "Notes fetched successfully",
            success: true,
            data: notes || []   // never null
        });
    } catch (err) {
        logger.error({ err: err }, "Error fetching user notes");
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            success: false,
            data: []
        });
    }
};



const editNotes = asyncHandler(async (req, res) => {
    // logger.info({ userId: req.user._id, noteId }, "Edit note request received");
    try {

        const { title, content } = req.body;

        const note = await Notes.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { title, content },
            { new: true }
        );


        if (!note) {
            logger.warn({ userId: req.user._id, noteId: req.params._id }, "Edit note failed: note not found");
            throw new ApiError(404, "Note not found");
        }

        logger.info("Note updated successfully");

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note
        });


    } catch (err) {
        logger.error({ err, userId:req.user._id, noteId:req.params._id }, "Error updating note");
    }

})

const deleteNotes = asyncHandler(async (req, res) => {

    try {

        const { noteId } = req.params

        const user_id = req.user._id

        logger.info({ userId:user_id, noteId }, "Delete note request received");


        if (!noteId) {
            logger.warn( "Delete note failed: noteId is missing");
            return res.status(400).json({
                success: false,
                message: "Note ID is required",
            });
        }

        await Notes.findOneAndDelete(
            {
                _id: noteId,
                userId: user_id

            }
        )

        logger.info("Note deleted successfully");

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        })

    } catch (err) {
        logger.error({ err, userId:user_id, noteId }, "Error deleting note");
        throw new ApiError(500, err.message);
    }

})

export { addNotes, editNotes, deleteNotes, getUserNotes }