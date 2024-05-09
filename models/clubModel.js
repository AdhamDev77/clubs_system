const mongoose = require('mongoose')

const Schema = mongoose.Schema

const clubSchema = new Schema({
    club_img: {
        type: String,
        required: true
    },
    club_name: {
        type: String,
        required: true
    },
    club_description: {
        type: String,
        required: true
    },
    club_owner: {
        type: String,
        required: true
    },
    
}, {timestamps: true})

module.exports = mongoose.model('Club', clubSchema)