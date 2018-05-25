const passport = require('passport');
const mongoose = require('mongoose');

const Account = new mongoose.Schema({
    username: String,
    password: String,
    passed: Array
}, { timestamps: true });

module.exports = mongoose.model("accounts", Account);