const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes.js');
const roleRoutes = require('./routes/roleRoutes.js');
const assignPermissionRoutes = require('./routes/assignPermissionRoutes.js');

// IMPORT initDB FUNCTION
const initDB = require('./config/initDB.js');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database (CREATE TABLE IF NOT EXISTS ...)
initDB();

// Routes
app.use('/users', userRoutes);
app.use('/role', roleRoutes);
app.use('/assign',assignPermissionRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
