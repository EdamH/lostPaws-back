const {constants} = require("../constants");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



//@desc register User
//@route GET /users/register
//@access Public
const registerUser = asyncHandler(async (req, res, next) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        res.status(constants.VALIDATION);
        throw new Error("Please provide all fields");
    }
    // CHECK IF USER EXISTS
    const userAvailable = await User.findOne({ email });
    if(userAvailable) {
        res.status(constants.VALIDATION);
        throw new Error("User already exists");
    }
    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    if (user) {
        res.status(201).json({_id: user.id, email: user.email})
    } else {
        res.status(constants.VALIDATION);
        throw new Error("Invalid user data");
    }
    res.json({ message: `User Registered` });
}); 

//@desc get one contacts
//@route GET /api/user/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(constants.VALIDATION);
        throw new Error("Please provide all fields");
    }
    const user = await User.findOne({ email });
    // compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        // create token
        const token = jwt.sign(
        {
            user: {
                ...user._doc
            },
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
        )
        res.status(200).json({
            _id: user.id,
            accessToken: token,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
})

//@desc get current user info
//@route POST /api/user/current
//@access Private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
})

//@desc get current user info
//@route POST /api/user/current
//@access Public
const getUser = asyncHandler(async (req, res) => {
    const userId = req.query.id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(constants.NOT_FOUND);
        throw new Error("User not found");
    }
    res.json({username: user.username, userImage: user.userImage, firstName: user.firstName, lastName: user.lastName, city: user.city});
})

//@desc upload user image
//@route PUT /api/user/upload
//@access Private
const uploadUserImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(constants.NOT_FOUND);
        throw new Error("User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { userImage: req.file.filename },
        { new: true }
    );

    res.status(201).json({ message: "User image updated" });
});
//@desc upload user image
//@route PUT /api/user/upload
//@access Private
const updateProfile = asyncHandler(async (req, res) => {
    const privateInformation = req.body.privateInformation ? req.body.privateInformation: {};
    const publicInformation = req.body.publicInformation ? req.body.publicInformation : {};
    const passwordInformation = req.body.passwordInformation ? req.body.passwordInformation : {};
    // console.log(passwordInformation)
    if (privateInformation != {} || publicInformation != {}) {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { ...privateInformation, ...publicInformation },
            { new: true }
        );
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(constants.NOT_FOUND);
            throw new Error("User not found");
        }
        const updatedToken = jwt.sign(
            {
                user: {
                    ...user._doc
                },
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        )
        res.status(200).json({
            _id: user.id,
            accessToken: updatedToken,
        });
    }
    if (passwordInformation != {}) {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(constants.NOT_FOUND);
            throw new Error("User not found");
        }
        // console.log(passwordInformation.currentPassword);
        if (passwordInformation.currentPassword && (await bcrypt.compare(passwordInformation.currentPassword, user.password))) {
            // console.log("passwords match");
            const hashedPassword = await bcrypt.hash(passwordInformation.newPassword, 10);
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                { password: hashedPassword },
                { new: true }
            );
            const updatedToken = jwt.sign(
                {
                    user: {
                        ...user._doc
                    },
                },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            )
            res.status(200).json({
                _id: user.id,
                accessToken: updatedToken,
            });
        }
    }

});


module.exports = { registerUser, loginUser, currentUser, uploadUserImage, getUser, updateProfile};