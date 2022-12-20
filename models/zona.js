const mongoose = require("mongoose"); //import mongoose

// zona schema
const zonaSchema = new mongoose.Schema({
    regione: [coordinata.schema],
    contenitori_rifiuti: [{
        LAT: Number,
        LON: Number,
        ALT: Number,
    }],
    rifiuti_da_smistare: [String],
    rifiuti_non_riconosciuti: [String],
});

// zona model
const zona = mongoose.model("zona", zonaSchema);
module.exports = zona;