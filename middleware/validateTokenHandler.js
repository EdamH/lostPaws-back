const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');



const validateToken= asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        try {
            token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            // console.log("here", req.user);
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if(!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});


module.exports = validateToken;