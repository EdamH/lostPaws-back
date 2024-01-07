const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenHandler');
const { uploadPetImage, addPet, getUserPets, getPet, getPets, getPetsByType, toggleFavourite, transferPet, updatePet } = require('../controllers/petController');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/pets')
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id  + '-' + file.originalname.replace( /\s/g, '-'))
  }
})
const upload = multer({ storage: storage, limits: { fieldSize: 5 * 1024 * 1024 * 1024 } })


router.post('/upload', validateToken, upload.single('avatar'), uploadPetImage);
router.post('/add', validateToken, addPet);
router.get('/user', validateToken, getUserPets);
router.get("/get", getPets);
router.get("/get/type", getPetsByType);
router.get("/get/:id", getPet);
router.get("/favourite/:id", validateToken, toggleFavourite);
router.put("/transfer", validateToken, transferPet);
router.put("/update", validateToken, updatePet);

module.exports = router;