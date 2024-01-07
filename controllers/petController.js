const {constants} = require("../constants");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Pet = require("../models/petModel");



//@desc get all pets image
//@route POST /api/pet/get
//@access Public
const getPets = asyncHandler(async (req, res) => {
    const pets = await Pet.find({});

    if (pets) {
        res.json(pets);
    } else {
        res.status(404);
        throw new Error("Pets not found");
    }
});

//@desc get pet by id
//@route POST /api/pet/get/:id
//@access Public
const getPet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.id).populate("user", "name email");

    if (pet) {
        res.json(pet);
    } else {
        res.status(404);
        throw new Error("Pet not found");
    }
});

//@desc get pets by type
//@route POST /api/pet/get/type
//@access Public
const getPetsByType = asyncHandler(async (req, res) => {
    const type = req.query.type; //lost or found or adoption
    console.log("type", req.query);

    // Check if type is one of the expected values
    if (!['Lost', 'Found', 'Adoption'].includes(type)) {
        res.status(400);
        throw new Error("Invalid type");
    }

    const pets = await Pet.find({ postType: type });

    if (pets) {
        res.json(pets);
    } else {
        res.status(404);
        throw new Error("Pets not found");
    }
});



//@desc upload pet image
//@route POST /api/pet/upload
//@access Private
const uploadPetImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(constants.NOT_FOUND);
        throw new Error("User not found");
    }

    res.status(201).json({ path: req.file.filename });
});

//@desc add pet
//@route POST /api/pet/add
//@access Private
const addPet = asyncHandler(async (req, res) => {
    const { petImage, postType, petSpecies, petName, city, petBreed, petAge, petGender, petSize } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(constants.NOT_FOUND);
        throw new Error("User not found");
    }

    const pet = await Pet.create({
        petImage,
        postType,
        petSpecies,
        petName,
        city,
        petBreed,
        petAge,
        petGender,
        petSize,
        user: req.user._id
    });

    if (pet) {
        res.status(201).json({
            _id: pet._id,
            postType: pet.postType,
            petSpecies: pet.petSpecies,
            petName: pet.petName,
            city: pet.city,
            petBreed: pet.petBreed,
            petAge: pet.petAge,
            petGender: pet.petGender,
            petSize: pet.petSize,
            user: pet.user,
        });
    } else {
        res.status(400);
        throw new Error("Invalid pet data");
    }
});

//@desc get user pets
//@route GET /api/pet/user
//@access Private
const getUserPets = asyncHandler(async (req, res) => {
    const pets = await Pet.find({ user: req.user._id });

    if (pets) {
        res.json(pets);
    } else {
        res.status(404);
        throw new Error("Pets not found");
    }
});

//@desc toggle favourite status
//@route GET /api/pet/favourite
//@access Private
const toggleFavourite = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
        res.status(404);
        throw new Error("Pet not found");
    }

    pet.favourite = !pet.favourite;
    await pet.save();
    console.log(pet);

    res.json(pet);
});

//@desc transfer adoption pets
//@route PUT /api/pet/transfer
//@access Private

const transferPet = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.body.id);
    if (!pet) {
        res.status(404);
        throw new Error("Pet not found");
    }

    pet.user = req.user._id;
    await pet.save();

    res.json(pet);
});

//@desc update pet
//@route PUT /api/pet/update
//@access Private
const updatePet = asyncHandler(async (req, res) => {
    const pet = await Pet.findByIdAndUpdate(req.body.id, {
        ...req.body
    }, { new: true });

    if (!pet) {
        res.status(404);
        throw new Error("Pet not found");
    }

    res.json(pet);
});


module.exports = {
    uploadPetImage,
    addPet,
    getUserPets,
    getPets,
    getPet,
    getPetsByType,
    toggleFavourite,
    transferPet,
    updatePet
}
