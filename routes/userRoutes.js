const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgetPassword, resetPassword, editUser, updateUser, deleteUser, getAllUser} = require('../controller/UserController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const checkPermission = require('../middleware/checkPermission.js');
const upload = require('../middleware/upload.js');

router.post('/register', authMiddleware, checkPermission("create_user"), registerUser);
router.post('/login',loginUser);
router.post('/forget-password',authMiddleware, checkPermission("forget_password") ,forgetPassword);
router.post('/reset-password/:token',authMiddleware, checkPermission("reset_password"), resetPassword);
router.get('/edit-user/:id',authMiddleware, checkPermission("edit_user"), editUser);
router.put('/update-user/:id', authMiddleware, checkPermission("update_user"), upload.single("avatar"), updateUser);
router.delete('/delete-user/:id', authMiddleware, checkPermission("delete_user"), deleteUser);
router.get('/get-all-user', authMiddleware, checkPermission("get-all-user"), getAllUser);


module.exports = router;
