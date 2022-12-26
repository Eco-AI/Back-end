const Rifiuto = require('../models/rifiuto');
const Robot = require('../models/robot');
const PianoPulizia = require('../models/piano_pulizia');
const { spawn } = require('child_process');


// POST riconoscimento rifiuto
const riconoscimentoRifiuto = (req, res) => {
    let robot = req.loggedUser;
    // TODO: implement python AI to recognize the waste
    const pythonProcess = spawn('python', ['classifier.py']);
    pythonProcess.stdout.on('data', (data) => {
        classification = data.toString();

        if (classification == "Non riconosciuto") {
            // Get the zone where the trash is located (use the robot id to get the piano_pulizia, then the zone)
            Robot.findById(robot.id, (err, data) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error:" + err });
                }
                if (data.length == 0) {
                    return res.status(404).json({ message: "Robot not found" });
                }
                PianoPulizia.findOne({ID_robot: data._id}, (err, data) => {
                    if (err) {
                        return res.status(500).json({ message: "Internal server error:" + err });
                    }
                    if (data.length == 0) {
                        return res.status(404).json({ message: "Piano pulizia not found" });
                    }

                    // Create a new Rifiuto object
                    const newRifiuto = new Rifiuto({
                        URL_foto: req.body.URL_foto,
                        posizione: req.body.posizione,
                        id_zona: data.id_zona,
                        classificazione: classification
                    });
                    // Save the new Rifiuto object in the database
                    newRifiuto.save((err, data) => {
                        if (err) {
                            return res.status(500).json({ message: "Internal server error:" + err });
                        }
                        return res.status(201).json(data);
                    });
                });
            });
        }
        else {
            // return the classification
            return res.json(classification);
        }
    });
};

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

// GET trash to collect
// Query parameters: id_zona
const getTrashToCollect = (req, res) => {
    const id_zona = req.query.id_zona;

    // Find all the trash in the zone with id = id_zona and classificazione != "Non riconosciuto"
    Rifiuto.find({ id_zona: id_zona, classificazione: { $ne: "Non riconosciuto" } }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (data.length == 0) {
            return res.status(404).json({ message: "Rifiuto not found" });
        }
        return res.status(200).json(data);
    });
};

// GET trash to classify
// Query parameters: id_zona
const getTrashToClassify = (req, res) => {
    const id_zona = req.query.id_zona;

    // Find all the trash in the zone with id = id_zona and classificazione = "Non riconosciuto"
    Rifiuto.find({ id_zona: id_zona, classificazione: "Non riconosciuto" }, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error:" + err });
        }
        if (data.length == 0) {
            return res.status(404).json({ message: "Rifiuto not found" });
        }
        return res.status(200).json(data);
    });
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



//export controller functions
module.exports = {
    getDettagliRifiuto,
    deleteRifiuto,
    classificaRifiuto,
    riconoscimentoRifiuto,
    getTrashToCollect,
    getTrashToClassify
};