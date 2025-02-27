const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' 
    }]
});

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;
