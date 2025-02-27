const  Task  = require('../models/task.model');

exports.createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();

        res.status(201).send(task);
    } catch (error) {
        res.status(400)
            .send({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500)
            .send({ message: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.status(200).send(task);
    }
    catch (error) {
        res.status(500)
            .send({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const originalTask = await Task.findById(req.params.id);

        const task = await Task.findByIdAndUpdate(req.params.id, req.body,
            { new: true}
        );
        
        if(JSON.stringify(originalTask) === JSON.stringify(task)) {
            return res.status(400)
                .send({ message: 'There are no changes' });
        }
        res.status(200).send(task);
    }
    catch (error) {
        res.status(500)
            .send({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.status(200).send(task);
    }
    catch(error) {
        res.status(500)
        .send({ message: error.message });
    }
};