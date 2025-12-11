const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, checkAdminExists, createUser, saveResetToken, getUserByResetToken, updatePasswordAndClearToken, getUserById, updateUserById, deleteUserById, getAllUsers } = require('../models/userModel');
const { emailRegex, passwordRegex } = require('../utils/Validator');
const { hashPassword, comparePassword } = require('../utils/hash');
const { sendResetPasswordEmail } = require('../services/EmailService');
require('dotenv').config();
const crypto = require("crypto");


const registerUser = async(req, res) => {
    const {name, email,password, role} = req.body;

    if(!name || !email || !password || role === undefined) {
        return res.status(400).json({success: false,message:'All fields are required.'});
    }

    if(!emailRegex.test(email)) {
        return res.status(400).json({success: false, message: 'Please enter valid email address.'});
    }

    if(!passwordRegex.test(password)) {
        return res.status(400).json({success: false, message: 'Password must be at least 8 chars, include uppercase, lowercase, number, and special character.'});
    }

    try  {
        const existingEmail = await getUserByEmail(email);
        if(existingEmail) {
            return res.status(400).json({success:false, message: 'Email already registered.'});
        }
        
        if(role == 1) {
           const adminExists = await checkAdminExists();
           if(adminExists) {
            return res.status(400).json({success: false, message: 'Admin already exists. Only one admin allowed.'});
           }
        }

        const hashed = await hashPassword(password);

        const newUser = await createUser(name, email, hashed, role);

        return res.status(201).json({success: true, message: 'User created successfully.', data: newUser});

    } catch(err) {
        console.error('Register Error:', err);
        return res.status(500).json({success: false, message: 'Internal Server Error!'});
    }
};

const loginUser = async (req, res) => {

    const {email, password} = req.body;

    try {
        if(!email  || !password) {
            return res.status(400).json({success: false, message: "Please enter email and password."});
        }

        if(!emailRegex.test(email)) {
            return res.status(400).json({success: false, message: "Please enter valid email address."});
        }

        const user = await getUserByEmail(email) 
        if(!user) {
            return res.status(404).json({success: false, message: "User not found."});
        }

        const isMatch = await comparePassword(password, user.password);
        if(!isMatch) {
            return res.status(400).json({success: false, message: "Invalid credentials."});
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
        success: true,
        message: "User login successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        }
        });
    }
    catch(err) {
        console.log("Login error: ", err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }
};

const forgetPassword = async(req,res) => {
    const {email} = req.body;

    try {
        const user = await getUserByEmail(email);
        if(!user) {
            return res.status(400).json({success: false, message: "Email not exists in our records."});
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await saveResetToken(email, resetToken, expiryTime);

        // Create frontend reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email
        await sendResetPasswordEmail(email, resetLink);

        return res.status(200).json({success: false, message: "Password reset link sent to email" });
    } catch(err) {
        console.log("Forget apssword error: ", err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Check token in DB
    const user = await getUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Check expiry
    if (user.reset_token_expiry < new Date()) {
      return res.status(400).json({ message: "Reset token expired" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear token
    await updatePasswordAndClearToken(user.id, hashedPassword);

    return res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const editUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({success: false,message: "User not found" });
    }

    return res.status(200).json({success:true,data: user });
  } catch (error) {
    console.error("Edit User Error:", error);
    return res.status(500).json({success:false, message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(role == 1) {
        const adminExists = await checkAdminExists();
        if(adminExists) {
        return res.status(400).json({success: false, message: 'Admin already exists. Only one admin allowed.'});
        }
    }

    if(!emailRegex.test(email)) {
     return res.status(400).json({success: false, message: "Please enter valid email address."});
    }

    const existingEmail = await getUserByEmail(email);
    if(existingEmail && existingEmail.id != id) {
        return res.status(400).json({success:false, message: 'Email already registered.'});
    }

     const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (email !== undefined) fieldsToUpdate.email = email;
        if (role !== undefined) fieldsToUpdate.role = role;

         if (req.file) {
              fieldsToUpdate.avatar = `/uploads/users/${req.file.filename}`;
         }

        const updatedUser = await updateUserById(id, fieldsToUpdate);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: { ...updatedUser, avatar: fieldsToUpdate.avatar || user.avatar }
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({success: false, message: "Internal server error" });
  }
};

const deleteUser = async (req,res) => {
    const {id} = req.params;
    try {
        const user = await getUserById(id);
        if(!user) {
            return res.status(404).json({success: false, message: "User not found."});
        }

        await deleteUserById(id);

        return res.status(200).json({success: true, message: "User deleted successfully."});
    }
    catch(err) {
        console.log("Delete user error: ", err);
        return res.status(500).json({success: false, message: "Internal server error."});
    }
}

const getAllUser = async (req,res) => {
  try {
    const user = await getAllUsers();
    if(!user) return res.status(404).json({success: false, message: "User not found."});

    return res.status(200).json({success: true, data: user});
  } 
  catch(err) {
    console.log("Get all user error: ", err);
    return res.status(500).json({success: false, message: "Internal server error."});
  }
}



module.exports = {
    registerUser,
    loginUser,
    forgetPassword,
    resetPassword,
    editUser,
    updateUser,
    deleteUser,
    getAllUser
};