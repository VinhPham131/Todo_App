const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const router = require('./routes/index');
const cors = require('cors');

connectDB();

app.use(bodyParser.json());
app.use(cors());
router(app);




app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});