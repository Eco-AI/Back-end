const Piano_pulizia = require('../models/piano_pulizia');
// newPiano_pulizia function for post Piano_pulizia route
//POST Piano_pulizia
const createPianoPulizia = (req, res) => {
    const { zona, data_inizio, data_fine } = req.body;
    if (!zona || !data_inizio || !data_fine) {
        return res.status(400).json({ Error: "Bad request: missing parameters" });
    }

    // convert data_inizio and data_fine to Date objects from timestamp
    const data_inizio_date = new Date(data_inizio);
    const data_fine_date = new Date(data_fine);

    // check if data_inizio and data_fine are valid dates
    if (isNaN(data_inizio_date.getTime()) || isNaN(data_fine_date.getTime())) {
        return res.status(400).json({ Error: "Bad request: invalid date" });
    }

    // check if data_inizio is before data_fine
    if (data_inizio_date.getTime() > data_fine_date.getTime()) {
        return res.status(400).json({ Error: "Bad request: data_inizio is after data_fine" });
    }

    //create a new Piano_pulizia object using the Piano_pulizia model and req.body
    const newPiano_pulizia = new Piano_pulizia({
        zona,
        data_inizio_date,
        data_fine_date
    });

    // save this object to database
    newPiano_pulizia.save((err, data) => {
        if (err) return res.status(500).json({ Error: "Internal server error: " + err });
        return res.status(200).json(data);
    })
};

// GET list of piano_pulizia list
// Query parameters: ?nome_org=nome_org
const getPianoPuliziaList = (req, res) => {
    const nome_organizzazione = req.query.nome_org;

    if (!nome_organizzazione) {
        return res.status(400).json({ Error: "Bad request: missing parameters" });
    }

    Piano_pulizia.find({ nome_organizzazione: nome_organizzazione }, (err, data) => {
        if (err) {
            return res.status(500).json({ Error: "Internal server error: " + err });
        }

        if (data.length === 0) {
            return res.status(404).json({ Error: "Not found" });
        }

        return res.status(200).json(data);
    });
};

// GET piano_pulizia by id
// Params: id
const getPianoPuliziaInfoForOrg = (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ Error: "Bad request: missing parameters" });
    }

    Piano_pulizia.findById(id, (err , data) => {
        if (err) {
            return res.status(500).json({ Error: "Internal server error: " + err });
        }

        if (data.length === 0) {
            return res.status(404).json({ Error: "Not found" });
        }

        return res.status(200).json(data);
    });
};

// GET piano_pulizia (request from robot)
const getPianoPuliziaInfoForRobot = (req, res) => {
    let robot = req.loggedUser;
    let robot_id = robot.id;

    if (!robot) {
        return res.status(400).json({ Error: "Bad request: missing parameters" });
    }

    Piano_pulizia.findOne({ ID_robot: robot_id }, (err, data) => {
        if (err) {
            return res.status(500).json({ Error: "Internal server error: " + err });
        }

        if (data.length === 0) {
            return res.status(404).json({ Error: "Not found" });
        }

        return res.status(200).json(data);
    });
};

// PATCH piano_pulizia
// Body: { id_robot, nome_organizzazione }
const assegnaPianoPulizia = (req, res) => {
    const { id_robot, nome_organizzazione } = req.body;

    if (!id_robot || !nome_organizzazione) {
        return res.status(400).json({ Error: "Bad request: missing parameters" });
    }

    // find the piano_pulizia with the closest data_inizio
    Piano_pulizia.aggregate([
        { $match: { nome_organizzazione: nome_organizzazione } },
        { $sort: { data_inizio: 1 } },
        { $limit: 1 }
    ], (err, data) => {
        if (err) {
            return res.status(500).json({ Error: "Internal server error: " + err });
        }

        if (data.length === 0) {
            return res.status(404).json({ Error: "Not found" });
        }

        // update the piano_pulizia with the id_robot
        Piano_pulizia.findByIdAndUpdate(data[0]._id, { ID_robot: id_robot }, (err, data) => {
            if (err) {
                return res.status(500).json({ Error: "Internal server error: " + err });
            }
            
            return res.status(200).json(data);
        });
    });
};




//export controller functions
module.exports = {
    createPianoPulizia,
    getPianoPuliziaList,
    getPianoPuliziaInfoForOrg,
    getPianoPuliziaInfoForRobot,
    assegnaPianoPulizia   
};