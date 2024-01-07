const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    petImage: {
        type: String,
        default: "default.png"
    },
    postType: {
        type: String,
        required: [true, "Please provide a post type"],
        trim: true,
        maxlength: [20, "Post type cannot be more than 20 characters"]
    },
    petSpecies: {
        type: String,
        trim: true,
        maxlength: [20, "Pet species cannot be more than 20 characters"],
    },
    petName: {
        type: String,
        trim: true,
        maxlength: [20, "Pet name cannot be more than 20 characters"],
        default: "Doe"
    },
    city: {
        type: String,
        required: [true, "Please provide a city"],
        trim: true,
        maxlength: [50, "City cannot be more than 50 characters"]
    },
    petBreed: {
        type: String,
        trim: true,
        maxlength: [30, "Pet breed cannot be more than 30 characters"],
        default: "Cute"
    },
    petAge: {
        type: String,
        trim: true,
    },
    petGender: {
        type: String,
        required: [true, "Please provide a pet gender"],
    },
    petSize: {
        type: String,
        required: [true, "Please provide a pet size"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    favourite: {
        type: Boolean,
        default: false
    },
}, { timestamps: true }); 

module.exports = mongoose.model("Pet", petSchema);