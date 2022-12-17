const Robot = require('../models/robot');


//GET all robots
// TODO: return only robots' id
const getAllrobots = (req, res) => {
    Robot.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
};

// GET robot by id
const getRobotById = (req, res) => {
    const id = req.params.id;
    Robot.findOne({ _id : id}, (err, data) => {
        if (err || !data) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
};

// PUT update robot parameters by id
const updateRobot = (req, res) => {
    const id = req.params.id;

    Robot.findOneAndUpdate({
        _id: id
    }, {
        "capienza_attuale": req.body.capienza_attuale,
        "temperatura": req.body.temperatura,
        "batteria": req.body.batteria,
        "posizione": req.body.posizione,
    }, { new: true }
    ).then((data) => {
        if (!data) {
            return res.json({ Error: "Robot not found" });
        }
        return res.json(data);
    }
    ).catch((err) => {
        return res.json({ Error: err });
    }
    )

};


//export controller functions
module.exports = {
    getAllrobots,
    getRobotById,
    updateRobot,
};