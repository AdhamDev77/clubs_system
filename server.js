const express = require('express')
var cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config()

const usersRoutes = require('./routes/users')
const adminsRoutes = require('./routes/admin')
const eventsRoutes = require('./routes/events')
const clubsRoutes = require('./routes/clubs')

// express app
const app = express()

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.json({msg: "Welcome Bro!"})
})

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/user', usersRoutes)
app.use('/api/admin', adminsRoutes)
app.use('/api/event', eventsRoutes)
app.use('/api/club', clubsRoutes)


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log('listening ya3am !!')
    })
})
.catch((error) => {
    console.log(error)
})
