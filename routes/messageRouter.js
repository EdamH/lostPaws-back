const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');
const { sendMessage, getMessages, getCommunicatedUsers } = require("../controllers/messageController");


router.post("/send", validateToken, sendMessage);
router.get("/get", validateToken, getMessages);
router.get("/getUsers", validateToken, getCommunicatedUsers);

module.exports = router;