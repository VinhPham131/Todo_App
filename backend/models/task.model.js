const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: [true, 'Status is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;