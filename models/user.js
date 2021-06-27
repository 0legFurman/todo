const {Schema, model} = require('mongoose')
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
    }]
})

module.exports = model('user', schema)