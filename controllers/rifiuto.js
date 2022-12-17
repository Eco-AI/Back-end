const Rifiuto = require('../models/rifiuto');

//GET elenco rifiuti
const getElencoRifiuti = (req, res) => {
    Rifiuto.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
};

// GET rifiuto by id
const getDettagliRifiuto = (req, res) => {
    const id = req.params.id;
    Rifiuto.findOne
        ({
            _id: id
        }, (err, data) => {
            if (err || !data) {
                return res.json({ Error: err });
            }
            return res.json(data);
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
    getElencoRifiuti,
    getDettagliRifiuto,
    riconoscimentoRifiuto,
};