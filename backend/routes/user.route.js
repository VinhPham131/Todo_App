const express = require('express');
const router = express.Router();

const {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    updateUser,
} = require('../controllers/user.controller');

router
    .route('/')
    .get(getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;
