import mongoose from "mongoose";

const showHistory = new mongoose.Schema(
    {
        showId:
        {
            type:String,
        },
        userid:
        {
            type:String,
            required:true
        }
    }
)
const Show=mongoose.model("userShowHistory",showHistory)

export default Show;