const Admins = require('../models/adminModel');
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to create a JWT token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// Function to retrieve all users
const getAdmins = async (req, res) => {
    try {
        const admins = await Admins.find({}).sort({ createdAt: -1 });
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: "خطأ في استرجاع المستخدمين" });
    }
};

// Function to retrieve a specific user by ID
const getOneAdmin = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد مستخدم" });
    }

    try {
        const admin = await Admins.findById(id);
        if (!admin) {
            return res.status(404).json({ error: "المستخدم غير موجود" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: "خطأ في استرجاع المستخدم" });
    }
};

// Function to create a new user
const createAdmin = async (req, res) => {
    try {
        const { admin_name, admin_email, admin_password, admin_birth, admin_img } = req.body;

        // Validate required fields
        if (!admin_name || !admin_email || !admin_password || !admin_birth || !admin_img) {
            return res.status(400).json({ error: "يجب ملأ جميع الخانات من فضلك" });
        }

        // Validate email format
        if (!validator.isEmail(admin_email)) {
            return res.status(400).json({ error: "البريد الالكتروني خاطئ" });
        }

        // Check for existing user by email
        const exists = await Admins.findOne({ admin_email });
        if (exists) {
            return res.status(400).json({ error: "البريد الالكتروني مستخدم" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin_password, salt);

        // Create a new user
        const admin = await Admins.create({
            admin_name,
            admin_email,
            admin_password: hashedPassword,
            admin_birth,
            admin_img
        });

        // Generate a JWT token for the new user
        const token = createToken(admin._id);

        // Respond with the created user and their JWT token
        res.status(201).json({ admin, token });
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
        const admin = await Admins.findById(id);
        if (!admin) {
            return res.status(404).json({ error: 'لا يوجد مستخدم' });
        }

        // Verify the current password
        const match = await bcrypt.compare(currentPassword, admin.admin_password);
        if (!match) {
            return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        admin.admin_password = hashedPassword;
        await admin.save();

        return res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تغيير كلمة المرور" });
    }
};

// Function to log in a user
const logAdmin = async (req, res) => {
    const { admin_email, admin_password } = req.body;

    try {
        const admin = await Admins.findOne({ admin_email });
        if (!admin) {
            return res.status(400).json({ error: "البريد الالكتروني خاطئ" });
        }

        // Check if the provided password matches the stored hashed password
        const match = await bcrypt.compare(admin_password, admin.admin_password);
        if (!match) {
            return res.status(404).json({ error: "كلمة المرور الخاطئة" });
        }

        // Generate a token and respond with the user info and token
        const token = createToken(admin._id);
        res.status(200).json({ admin, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تسجيل الدخول" });
    }
};

// Export all controller functions for use in your routes
module.exports = { createAdmin, logAdmin, getAdmins, getOneAdmin, changePassword };
