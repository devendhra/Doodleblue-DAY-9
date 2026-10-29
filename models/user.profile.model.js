const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        age: { type: Number, required: true },
        dob: { type: Date, required: true },
        bio: { type: String, required: true },
        gender: { type: String, required: true }
    },
    { timestamps: true }    
);

module.exports = mongoose.model("UserProfile", userProfileSchema);