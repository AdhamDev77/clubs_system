const Users = require('../models/userModel');
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to create a JWT token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// Function to retrieve all users
const getUsers = async (req, res) => {
    try {
        const users = await Users.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "خطأ في استرجاع المستخدمين" });
    }
};

// Function to retrieve a specific user by ID
const getOneUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد مستخدم" });
    }

    try {
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ error: "المستخدم غير موجود" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "خطأ في استرجاع المستخدم" });
    }
};

// Function to create a new user
const createUser = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_birth, user_img } = req.body;

        // Validate required fields
        if (!user_name || !user_email || !user_password || !user_birth || !user_img) {
            return res.status(400).json({ error: "يجب ملأ جميع الخانات من فضلك" });
        }

        // Validate email format
        if (!validator.isEmail(user_email)) {
            return res.status(400).json({ error: "البريد الالكتروني خاطئ" });
        }

        // Check for existing user by email
        const exists = await Users.findOne({ user_email });
        if (exists) {
            return res.status(400).json({ error: "البريد الالكتروني مستخدم" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);

        // Create a new user
        const user = await Users.create({
            user_name,
            user_email,
            user_password: hashedPassword,
            user_birth,
            user_img
        });

        // Generate a JWT token for the new user
        const token = createToken(user._id);

        // Respond with the created user and their JWT token
        res.status(201).json({ user, token });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "حدث خطأ أثناء إنشاء المستخدم" }); // Generic error message
    }
};

// Function to change a user's password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.params;

    if (currentPassword === "" || newPassword === "") {
        return res.status(400).json({ error: 'يجب ملأ جميع الخانات' });
    }

    try {
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'لا يوجد مستخدم' });
        }

        // Verify the current password
        const match = await bcrypt.compare(currentPassword, user.user_password);
        if (!match) {
            return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        user.user_password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تغيير كلمة المرور" });
    }
};

// Function to log in a user
const logUser = async (req, res) => {
    const { user_email, user_password } = req.body;

    try {
        const user = await Users.findOne({ user_email });
        if (!user) {
            return res.status(400).json({ error: "البريد الالكتروني خاطئ" });
        }

        // Check if the provided password matches the stored hashed password
        const match = await bcrypt.compare(user_password, user.user_password);
        if (!match) {
            return res.status(404).json({ error: "كلمة المرور الخاطئة" });
        }

        // Generate a token and respond with the user info and token
        const token = createToken(user._id);
        res.status(200).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تسجيل الدخول" });
    }
};

// Function to delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد مستخدم" });
    }

    try {
        const user = await Users.findOneAndDelete({ _id: id });
        if (!user) {
            return res.status(404).json({ error: "المستخدم غير موجود" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء حذف المستخدم" });
    }
};

// Function to update a user's details
const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد مستخدم" });
    }

    try {
        const user = await Users.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "المستخدم غير موجود" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تحديث المستخدم" });
    }
};

// Export all controller functions for use in your routes
module.exports = { createUser, logUser, getUsers, getOneUser, deleteUser, updateUser, changePassword };
