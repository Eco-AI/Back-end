const mongoose = require("mongoose"); //import mongoose
const coordinata = require("./coordinata"); // import coordinata

// piano_pulizia schema
const piano_puliziaSchema = new mongoose.Schema({
    zona: {
        regione: [coordinata.schema],
        contenitori_rifiuti: [coordinata.schema],
        rifiuti_da_smistare: [String],
        rifiuti_non_riconosciuti: [String],
    },
    data_inizio: Date,
    data_fine: Date,
});

const piano_pulizia = mongoose.model('piano_pulizia', piano_puliziaSchema); //convert to model named piano_pulizia
module.exports = piano_pulizia; //export for controller use