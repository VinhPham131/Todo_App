const User = require('../models/user.model');
const Task = require('../models/task.model');

function validateYearOfBirth(yearOfBirth) {
    if (isNaN(yearOfBirth)) {
        return 'Year of birth must be a valid number';
    }

    if(yearOfBirth < 1901 || yearOfBirth > 2024) {
        return 'Year of birth must be between 1901 and 2024';
    }
}

function validateEmail(email) {
    if(email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        return 'Email is not valid';
    }
}

exports.createUser = async (req, res) => {
    try {
        const { username, email, yearOfBirth } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400)
                .send({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400)
                .send({ message: 'Email already exists' });
        }

        const yearOfBirthError = validateYearOfBirth(yearOfBirth);
        if (yearOfBirthError) {
            return res.status(400).send({ message: yearOfBirthError });
        }

        const emailError = validateEmail(email);
        if (emailError) {
            return res.status(400).send({ message: emailError });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400)
            .send({ message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500)
            .send({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500)
            .send({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email, yearOfBirth} = req.body;

        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).send({ message: 'Username already exists' });
            }
        }

        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail._id.toString() !== req.params.id) {
                return res.status(400).send({ message: 'Email already exists' });
            }
        }

        if (yearOfBirth) {
            const yearOfBirthError = validateYearOfBirth(yearOfBirth);
            if (yearOfBirthError) {
                return res.status(400).send({ message: yearOfBirthError });
            }
        }

        if (email) {
            const emailError = validateEmail(req.body.email);
            if (emailError) {
                return res.status(400).send({ message: emailError });
            }
        }

        const originalUser = await User.findById(req.params.id);

        const user = await User.findByIdAndUpdate(req.params.id, req.body,
            { new: true}
        );

        if (JSON.stringify(originalUser) === JSON.stringify(user)) {
            return res.status(400)
                .send({ message: 'There are no changes' });
        }
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500)
            .send({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const assignedTasks = await Task.find({ assignee: req.params.id });
        if (assignedTasks.length > 0) {
            return res.status(400).send({ message: 'User is assigned to tasks and cannot be deleted' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};