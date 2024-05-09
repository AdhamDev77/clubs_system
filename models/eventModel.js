const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
    event_img: {
        type: String,
        required: true
    },
    event_title: {
        type: String,
        required: true
    },
    event_description: {
        type: String,
        required: true,
    },
    event_location: {
        type: String,
        required: true
    },
    event_club: {
        type: String,
        required: true,
    },
    event_date: {
        type: String,
        required: true
    },
    event_time: {
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Event', eventSchema)