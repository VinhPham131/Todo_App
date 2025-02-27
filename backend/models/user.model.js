const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
    },
    sex: {
        type: String,
        required: [true, 'Sex is required'],
    },
    yearOfBirth: {
        type: Number,
        required: [true, 'Year of birth is required'],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;