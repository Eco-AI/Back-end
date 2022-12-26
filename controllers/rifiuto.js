const Rifiuto = require('../models/rifiuto');


// GET rifiuto by id
const getDettagliRifiuto = (req, res) => {
    const id = req.params.id;
    Rifiuto.findById(id, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (data.length == 0) {
            return res.status(404).json({ message: "Rifiuto not found" });
        }
        return res.json(data);
    })
};

// DELETE rifiuto by id
const deleteRifiuto = (req, res) => {
    const id = req.params.id;
    Rifiuto.findByIdAndDelete(id, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (data.length == 0) {
            return res.status(404).json({ message: "Rifiuto not found" });
        }
        return res.status(204);
    })
};

// PATCH classifica rifiuto by id
const classificaRifiuto = (req, res) => {
    const id = req.params.id;
    const classificazione = req.body.classificazione;

    Rifiuto.findByIdAndUpdate(id, { classificazione: classificazione }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (data.length == 0) {
            return res.status(404).json({ message: "Rifiuto not found" });
        }
        return res.status(204);
    })
};

// POST riconoscimento rifiuto
const riconoscimentoRifiuto = (req, res) => {
    //create a new Rifiuto object using the Rifiuto model and req.body
    const newRifiuto = new Rifiuto({
        URL_foto: req.body.URL_foto,
        posizione: req.body.posizione,
    })

    // TODO: implement python AI to recognize the waste
    classification = "test";
    // return the classification
    return res.json(classification);
};

//export controller functions
module.exports = {
    getDettagliRifiuto,
    deleteRifiuto,
    classificaRifiuto,
    riconoscimentoRifiuto,
};