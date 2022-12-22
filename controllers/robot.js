const Robot = require('../models/robot');
const { ObjectId } = require('mongodb');

//GET all robots
// Body: nome_organizzazione, filtro
// TODO: return only robots' id
const getAllRobots = (req, res) => {
    // check if parameters are missing, if so return bad request
    const nome_organizzazione = req.params.org_id;
    const filtro = req.body.filtro;
    // filtro esempio -> { "capienza_attuale": { ">": 0 } }
    //                   { "capienza_attuale": { ">": 0 }, "temperatura": { "<": 30 } }
    //                   { "batteria": { ">": 50 }, "temperatura": { ">": 30 } }
    //                   { "batteria": { ">": 50 }, "temperatura": { ">": 30 }, "capienza_attuale": { "=": 0 } }
    //                   { "batteria": { ">": 50 }, "temperatura": { "=!": 30 }, "capienza_attuale": { "<": 20 } }

    Robot.find({ nome_organizzazione: nome_organizzazione }, (err, data) => {
        if (err) {
            res.status(500).json({ message: "Internal server error: " + err });
            return;
        }
        if (data.length == 0) {
            res.status(404).json({ message: "No robots found" });
            return;
        }
        // check if filter is empty
        if (!filtro) {
            // return only robots' id
            data = data.map(robot => robot["_id"]);
            res.status(200).json(data);
            return;
        }
        // filter is not empty, filter robots
        let filteredRobots = [];
        data.forEach(robot => {
            let toAdd = true;
            Object.keys(filtro).forEach(key => {
                if (toAdd) {
                    if (filtro[key]["="] != undefined && (robot[key] != filtro[key]["="])) {
                        toAdd = false;
                    }
                    if (filtro[key]["!="] != undefined && (robot[key] == filtro[key]["!="])) {
                        toAdd = false;
                    }
                    if (filtro[key][">"] != undefined && (robot[key] <= filtro[key][">"])) {
                        toAdd = false;
                    }
                    if (filtro[key]["<"] != undefined && (robot[key] >= filtro[key]["<"])) {
                        toAdd = false;
                    }
                }
            });
            if (toAdd) {
                filteredRobots.push(robot["_id"]);
            }
        });
        res.status(200).json(filteredRobots);
    });
};

// GET robot by id
const getRobotById = (req, res) => {
    const id = req.params.id;

    // Check if the format of the id is valid before querying the database
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ Error: "Invalid id" });
    }

    Robot.findById(id).then((data) => {
        if (data)
            return res.status(200).json(data);
        else
            return res.status(404).json({ Error: "Robot not found" });
    }).catch((err) => {
        return res.status(500).json({ Error: "Internal server error: " + err });
    });
};

// POST create new robot
// Body: nome_organizzazione
const createRobot = (req, res) => {
    const nome_organizzazione = req.body.nome_organizzazione;
    if (!nome_organizzazione) {
        res.status(400).json({ message: "Bad request, missing parameters" });
        return;
    }

    console.log("Creating new robot for organization: " + nome_organizzazione);

    const newRobot = new Robot({
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        nome_organizzazione: nome_organizzazione,
        capienza_attuale: 0,
        temperatura: 0,
        batteria: 100,
        posizione: {
            latitudine: 0,
            longitudine: 0,
            altitudine: 0
        }
    });
    newRobot.save().then((data) => {
        return res.status(201).json(data);
    }).catch((err) => {
        return res.status(500).json({ Error: "Internal server error: " + err });
    });
};


// PUT update robot parameters by id
const updateRobot = (req, res) => {
    const id = req.params.id;

    // Check if the format of the id is valid before querying the database
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ Error: "Invalid id" });
    }

    // check that all parameters are present
    if (!req.body.capienza_attuale || !req.body.temperatura || !req.body.batteria || !req.body.posizione) {
        return res.status(400).json({ Error: "Bad request, missing parameters" });
    }

    Robot.findByIdAndUpdate(id, {
        "capienza_attuale": req.body.capienza_attuale,
        "temperatura": req.body.temperatura,
        "batteria": req.body.batteria,
        "posizione": req.body.posizione,
    }, { new: true }
    ).then((data) => {
        if (data.length == 0) {
            return res.status(404).json({ Error: "Robot not found" });
        }
        return res.status(200).json(data);
    }
    ).catch((err) => {
        return res.status(500).json({ Error: "Internal server error: " + err });
    })
};


//export controller functions
module.exports = {
    getAllRobots,
    getRobotById,
    updateRobot,
    createRobot
};