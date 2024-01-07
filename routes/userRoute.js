const express = require('express');
const router = express.Router();
const { registerUser, loginUser, currentUser, uploadUserImage, getUser, updateProfile } = require("../controllers/userController");
const validateToken = require('../middleware/validateTokenHandler');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id  + '-' + file.originalname.replace( /\s/g, '-'))
  }
})
const upload = multer({ storage: storage })

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.post('/upload', validateToken, upload.single('avatar'), uploadUserImage);

router.put('/update', validateToken, updateProfile);

router.get("/get", getUser);

module.exports = router;