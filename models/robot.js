const mongoose = require("mongoose"); //import mongoose
const coordinata = require("./coordinata"); // import coordinata

// robot schema
const robotSchema = new mongoose.Schema({
    token: { type: String, required: true },
    capienza_attuale: String,
    temperatura: Number,
    batteria: Number,
    posizone: coordinata.schema,
    online: Boolean,
    id_piano_pulizia: String,
    nome_organizazione: String,
});

const robot = mongoose.model('robot', robotSchema); //convert to model named robot
module.exports = robot; //export for controller use