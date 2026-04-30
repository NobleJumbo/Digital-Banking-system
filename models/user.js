import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    bvn: {
        type: String, // BVN or NIN
    }
}, { timestamps: true });



const User = mongoose.model("User",userSchema);
export default User;