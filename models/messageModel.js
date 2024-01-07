const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: [true, "Please provide a message"],
        trim: true,
        maxlength: [500, "Message cannot be more than 500 characters"]
    },
    image: {
        type: String,
    },
}, { timestamps: true }); 

module.exports = mongoose.model("Message", messageSchema);