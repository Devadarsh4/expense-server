const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    adminEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    membersEmail: [String],
    thumbnail: String,

    paymentStatus: {
        amount: Number,
        currency: String,
        date: Date,
        isPaid: Boolean
    }
});

module.exports = mongoose.model('Group', groupSchema);