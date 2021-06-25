const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
app.use(express.json({extended: true}))
app.use('/api',require('./auth.routes'))

const PORT = config.get('port') || 6000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoURL'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        app.listen(PORT, () => console.log('App has been started on ', PORT))
    } catch (e) {
        console.log('Server error - ', e.message)
        process.exit(1)
    }
}
start()