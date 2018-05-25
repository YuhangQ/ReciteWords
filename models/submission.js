const mongoose = require('mongoose');

const Submission = new mongoose.Schema({
    username: String,
    unit: String
}, { timestamps: true });

module.exports = mongoose.model("submissions", Submission);