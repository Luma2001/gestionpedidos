const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },
})

module.exports = mongoose.model('User', userSchema);