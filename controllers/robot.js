const Robot = require('../models/robot');
const User = require('../models/utente');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const { ObjectId } = require('mongodb');



// POST create new robot
// Body: nome_organizzazione
const createRobot = (req, res) => {
    let user = req.loggedUser;

    // check that the user has the role of "Admin"
    User.findOne({username: user.username}).then((data) => {
        if (data.ruolo != "admin") {
            return res.status(403).json({ Error: "Forbidden" });
        }
    }).catch((err) => {
        return res.status(500).json({ Error: "Internal server error: " + err });
    });


    console.log("Creating new robot for organization: " + nome_organizzazione);

    const newRobot = new Robot({
        nome_organizzazione: "",
        capienza_attuale: 0,
        temperatura: 0,
        batteria: 100,
        posizione: {
            LAT: 0,
            LON: 0,
            ALT: 0
        }
    });

    var payload = {
        id: newRobot._id,
        nome_organizzazione: newRobot.nome_organizzazione
    };

    var token = jwt.sign(payload, process.env.SUPER_SECRET);

    newRobot.save().then((data) => {
        return res.status(201).json({ id: data._id, token: token });
    }).catch((err) => {
        return res.status(500).json({ Error: "Internal server error: " + err });
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

// PUT update robot parameters by id
const updateRobot = (req, res) => {
    let robot = req.loggedUser;

    const id = robot.id;

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
    getRobotById,
    updateRobot,
    createRobot
};