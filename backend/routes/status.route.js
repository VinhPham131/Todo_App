const express = require('express');
const router = express.Router();

const {
    createStatus,
    getStatus,
} = require('../controllers/status.controller');

router
    .route('/')
    .post(createStatus)
    .get(getStatus);
        
module.exports = router;