// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const groupRoutes = require("./src/routes/groupRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/groups", groupRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.listen(5001, () => {
    console.log("Server running on port 5001");
});