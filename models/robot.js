const mongoose = require("mongoose"); //import mongoose

// robot schema
const robotSchema = new mongoose.Schema({
    token: { type: String, required: true },
    capienza_attuale: String,
    temperatura: Number,
    batteria: Number,
    posizione: {
        LAT: Number,
        LON: Number,
        ALT: Number,
    },
    online: Boolean,
    id_piano_pulizia: String,
    nome_organizzazione: String,
});

const robot = mongoose.model('robot', robotSchema); //convert to model named robot
module.exports = robot; //export for controller use