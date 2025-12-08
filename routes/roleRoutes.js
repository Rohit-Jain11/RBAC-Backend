const express = require('express');
const router = express.Router();
const { createRole, deleteRole, editRole, updateRole, getAllRoles } = require('../controller/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');


router.post('/create-role', authMiddleware, checkPermission("create_role"), createRole);
router.delete('/delete-role/:roleId', authMiddleware, checkPermission("delete_role"), deleteRole);
router.get('/edit-role/:roleId', authMiddleware, checkPermission("edit_role"), editRole);
router.put('/update-role/:roleId', authMiddleware, checkPermission("update_role"), updateRole);
router.get('/get-all-roles', authMiddleware, checkPermission("get_all_roles"), getAllRoles);





module.exports = router;
