import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const insertBvn = async (req, res) => {

    
    try {
        
        const { firstName, lastName, dob, email, bvn, phone } = req.body;

        // Validate fields
        if (!firstName || !lastName || !email || !bvn || !phone || !dob) {
            return res.status(400).json({
                message: "First name, last name, date of birth, email, BVN and phone number required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            dob,
            bvn
        });

        console.log("Saved user:", user);
        res.status(201).json({
            message: "BVN inserted successfully",
            user
        });

    } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ message: error.message });
}
};
export const validateBvn = async (req, res) => {
    try {
        const { bvn } = req.body;

        if (!bvn) {
            return res.status(400).json({
                message: "BVN is required"
            });
        }

        // 🔍 Check in your database
        const user = await User.findOne({ bvn });

        if (!user) {
            return res.status(404).json({
                message: "BVN not found"
            });
        }

        // ✅ BVN exists
        res.status(200).json({
            message: "BVN is valid",
            data: user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};