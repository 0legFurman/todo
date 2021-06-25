const {Schema, model, Types} = require('mongoose')
const schema = new Schema({
    login: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    tasks: [{
        type: Object,
        unique: true,
    }]
})

module.exports = model('user', schema)