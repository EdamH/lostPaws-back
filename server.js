const express = require("express");
const dotenv = require('dotenv').config();
const app = express();
const connectDB = require('./config/connectDB');
const ErrorHandler = require("./middleware/errorHandler");


// PORT
const port = process.env.PORT || 5000;

// DB CONNECTION
connectDB();

// MIDDLEWARE
app.use(express.json());
app.use(ErrorHandler);
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/messages", require("./routes/messageRouter"));
app.use("/api/pets", require("./routes/petRouter"));
app.use("/api/uploads", express.static("uploads"));



app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
})