import mongoose,{Schema} from "mongoose";

const NotesSchema=new Schema({
    title:{
        type:String,
        required:true,

    },
    content:{
        type:String,
        required:true,

    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    isPinned:
    {
        type:Boolean,
        default:false
    }

},{timestamps:true}


)

export const Notes=mongoose.model("Notes",NotesSchema)