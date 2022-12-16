const mongoose = require("mongoose"); //import mongoose
const coordinata = require("./coordinata"); // import coordinata

// rifiuto schema
const rifiutoSchema = new mongoose.Schema({
    URL_foto: {
        type: String,
        required: true
    },
    posizione: coordinata.schema,
});

const rifiuto = mongoose.model('rifiuto', rifiutoSchema); //convert to model named rifiuto
module.exports = rifiuto; //export for controller use