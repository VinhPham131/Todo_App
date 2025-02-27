const Status = require('../models/status.model');

exports.createStatus = async (req, res) => {
    try {
        const status = new Status(req.body);
        await status.save();
        res.status(201).send(status);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

exports.getStatus = async (req, res) => {
    try {
        const status = await Status.find().populate('tasks');
        res.status(200).send(status);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
