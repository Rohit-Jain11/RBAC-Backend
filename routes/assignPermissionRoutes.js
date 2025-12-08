const express = require('express');
const { assignPermissionsToRole } = require('../controller/assignPermissionController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');
const router = express.Router();

router.put('/assign-permission/:roleId', assignPermissionsToRole);




module.exports = router;
