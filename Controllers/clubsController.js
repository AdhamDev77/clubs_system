const Club = require('../models/clubModel');
const mongoose = require('mongoose');

// Retrieve all clubs
const getClubs = async (req, res) => {
    try {
        const clubs = await Club.find({}).sort({ createdAt: -1 });
        res.status(200).json(clubs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء استرجاع الأندية" });
    }
};

// Retrieve a specific club by ID
const getOneClub = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد نادي" });
    }

    try {
        const club = await Club.findById(id);
        if (!club) {
            return res.status(404).json({ error: "النادي غير موجود" });
        }
        res.status(200).json(club);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء استرجاع النادي" });
    }
};

// Create a new club
const createClub = async (req, res) => {
    try {
        const { club_img, club_name, club_description, club_owner } = req.body;

        // Validate required fields
        if (!club_img || !club_name || !club_description || !club_owner) {
            return res.status(400).json({ error: "يجب ملأ جميع الخانات من فضلك" });
        }

        // Create a new club
        const club = await Club.create({
            club_img,
            club_name,
            club_description,
            club_owner
        });

        res.status(201).json(club); // Use 201 for successful creation
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "حدث خطأ أثناء إنشاء النادي" }); // Generic error message
    }
};

// Update a club by ID
const updateClub = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد نادي" });
    }

    try {
        const club = await Club.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
        if (!club) {
            return res.status(404).json({ error: "النادي غير موجود" });
        }

        res.status(200).json(club);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تحديث النادي" });
    }
};

// Delete a club by ID
const deleteClub = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا يوجد نادي" });
    }

    try {
        const club = await Club.findOneAndDelete({ _id: id });
        if (!club) {
            return res.status(404).json({ error: "النادي غير موجود" });
        }

        res.status(200).json(club);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء حذف النادي" });
    }
};

// Export all the controller functions for use in routes
module.exports = { getClubs, getOneClub, createClub, updateClub, deleteClub };
