const {constants} = require("../constants");


const ErrorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    switch (statusCode) {
        case constants.VALIDATION:
            res.json({ title: "Validation failed!", message: err.message, stack: err.stack });
            break;
        case constants.NOT_FOUND:
            res.status(400).json({ title: "Not found!", message: err.message, stack: err.stack });
            break;
        case constants.SERVER_ERROR:
            res.status(500).json({ title: "Server error!", message: err.message, stack: err.stack });
            break;
        case constants.UNAUTHORIZED:
            res.status(401).json({ title: "Unauthorized!", message: err.message, stack: err.stack });
            break;
        case constants.FORBIDDEN:
            res.status(403).json({ title: "Forbidden!", message: err.message, stack: err.stack });
            break;
        default:
            console.log("All good")
            break;
    }
    // res.status(statusCode).json({ message: err.message, stack: process.env.NODE_ENV === "production" ? null : err.stack });
}

module.exports = ErrorHandler;