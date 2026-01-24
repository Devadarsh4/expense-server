require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./src/rules/authRoutes');

const app = express();

app.use(express.json());

mongoose
    .connect(process.env.MONGO_DB_CONNECTION_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((error) =>
        console.log('Error Connecting to Database:', error)
    );

app.use('/auth', authRoutes);

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});