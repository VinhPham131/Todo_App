const express = require('express');
const router = express.Router();

const {
    createTask,
    getTasks,
    getTaskById,
    deleteTask,
    updateTask,
} = require('../controllers/task.controller');

router
    .route('/')
    .get(getTasks)
    .post(createTask);

router
    .route('/:id')
    .get(getTaskById)
    .patch(updateTask)
    .delete(deleteTask);

module.exports = router;

