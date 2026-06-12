import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        minlength: 2,
        maxlength: 60
    },
    color: {
        type: String,
        trim: true,
        maxlength: 20
    },
    description: {
        required: false,
        type: String,
        trim: true,
        maxlength: 500
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);