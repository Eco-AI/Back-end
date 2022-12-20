const mongoose = require("mongoose"); //import mongoose

// piano_pulizia schema
const piano_puliziaSchema = new mongoose.Schema({
    zona: {
        regione: [{
            LAT: Number,
            LON: Number,
            ALT: Number,
        }],
        contenitori_rifiuti: [{
            LAT: Number,
            LON: Number,
            ALT: Number,
        }],
        rifiuti_da_smistare: [String],
        rifiuti_non_riconosciuti: [String],
    },
    data_inizio: Date,
    data_fine: Date,
});

const piano_pulizia = mongoose.model('piano_pulizia', piano_puliziaSchema); //convert to model named piano_pulizia
module.exports = piano_pulizia; //export for controller use