const {constants} = require("../constants");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Messsage = require("../models/messageModel");


//@desc send message
//@route POST /api/message/send
//@access Private

const sendMessage = asyncHandler(async (req, res) => { 
    const { receiver, message } = req.body;
    const sender = req.user._id;
    if (!sender || !receiver || !message) {
        res.status(constants.VALIDATION);
        throw new Error("Please provide all fields");
    }
    const newMessage = await Messsage.create({
        sender,
        receiver,
        message,
    });
    if (newMessage) {
        getMessages({ query: { otherUser: receiver.valueOf(), _id: sender } })
        .then((response) => {res.status(201).json(response)});
    } else {
        res.status(constants.VALIDATION);
        throw new Error("Invalid message data");
    }
});

//@desc get all messages
//@route GET /api/message/get
//@access Private

const getMessages = asyncHandler(async (req, res) => {
    const { otherUser } = req.query;
    const thisUser = await User.findById(otherUser);
    const messages = await Messsage.find({
        $or: [
            { sender: req.user ? req.user._id : req.query._id , receiver: otherUser },
            { sender: otherUser, receiver: req.user ? req.user._id : req.query._id  }
        ]
    })
        .populate("sender", "username userImage")
        .populate("receiver", "username userImage")
        .sort({ createdAt: -1 });
    
    
    if (req.user) {
        res.json(messages);
    } else {
        return messages;
    }
});


const getCommunicatedUsers = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const senders = await Messsage.distinct("sender", { receiver: userId });
    const receivers = await Messsage.distinct("receiver", { sender: userId });
    const communicatedUsers = [...senders, ...receivers];
    const uniqueUsers = Array.from(new Set(communicatedUsers));
    const users = await User.find({ _id: { $in: uniqueUsers } }, "username userImage"); // Include 'userImage' field
    const lastMessages = await Promise.all(
        users.map(async (user) => {
            const messages = await getMessages({ query: { otherUser: user._id.valueOf(), _id: userId } });
            // console.log(messages[0].message)
            const lastMessage = messages[0].message; // Fetch the first item returned in getMessages
            return { ...user.toObject(), lastMessage };
        })
    );
    console.log(lastMessages)
    res.json(lastMessages);    
});

module.exports = { sendMessage, getMessages, getCommunicatedUsers };

