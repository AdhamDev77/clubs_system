const Event = require('../models/eventModel');
const mongoose = require('mongoose');

// Retrieve all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء استرجاع الفعاليات" });
    }
};

// Retrieve a specific event by ID
const getOneEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا توجد فعالية" });
    }

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "الفعالية غير موجودة" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء استرجاع الفعالية" });
    }
};

// Create a new event
const createEvent = async (req, res) => {
    try {
        const { event_img, event_title, event_description, event_location, event_club, event_date, event_time } = req.body;

        // Validate required fields
        if (!event_img || !event_title || !event_description || !event_location || !event_club || !event_date || !event_time) {
            return res.status(400).json({ error: "يجب ملأ جميع الخانات من فضلك" });
        }

        // Create a new event
        const event = await Event.create({
            event_img,
            event_title,
            event_description,
            event_location,
            event_club,
            event_date,
            event_time
        });

        res.status(201).json(event); // Use 201 for successful creation
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "حدث خطأ أثناء إنشاء الفعالية" }); // Generic error message
    }
};

// Update an event by ID
const updateEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا توجد فعالية" });
    }

    try {
        const event = await Event.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });
        if (!event) {
            return res.status(404).json({ error: "الفعالية غير موجودة" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تحديث الفعالية" });
    }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "لا توجد فعالية" });
    }

    try {
        const event = await Event.findOneAndDelete({ _id: id });
        if (!event) {
            return res.status(404).json({ error: "الفعالية غير موجودة" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء حذف الفعالية" });
    }
};

// Export all the controller functions for use in routes
module.exports = { getEvents, getOneEvent, createEvent, updateEvent, deleteEvent };
