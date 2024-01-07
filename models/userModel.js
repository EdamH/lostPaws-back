const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userImage: {
        type: String,
        default: "default.png"
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true,
        maxlength: [20, "Username cannot be more than 20 characters"]
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [20, "First name cannot be more than 20 characters"],
        default: "John"
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [20, "Last name cannot be more than 20 characters"],
        default: "Doe"
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: [true, "Email already exists"],
        trim: true,
        maxlength: [50, "Email cannot be more than 50 characters"]
    },
    city: {
        type: String,
        trim: true,
        maxlength: [30, "city name cannot be more than 20 characters"],
        default: "Somewhere in the world"
    },
    phone: {
        type: String,
        trim: true,
        minlength: [10, "Please enter a valid phone number"],
        default: "XX XXX XXX"
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password cannot be less than 6 characters"]
    },
}, { timestamps: true }); 

module.exports = mongoose.model("User", userSchema);