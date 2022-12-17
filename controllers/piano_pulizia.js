const Piano_pulizia = require('../models/piano_pulizia');
// newPiano_pulizia function for post Piano_pulizia route
//POST Piano_pulizia
const newPiano_pulizia = (req, res) => {
    //create a new Piano_pulizia object using the Piano_pulizia model and req.body
    const newPiano_pulizia = new Piano_pulizia({
        zona: req.body.zona,
        data_inzio: req.body.data_inizio,
        data_fine: req.body.data_fine,
    })

    // save this object to database
    newPiano_pulizia.save((err, data) => {
        if (err) return res.json({ Error: err });
        return res.json(data);
    })
};

// GET piano_pulizia from priority queue
const getPiano_pulizia = (req, res) => {
    // TODO: implement priority queue
    Piano_pulizia.findOne({}, (err, data) => {
        if (err || !data) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
};

//GET piano_pulizia by id
const getPiano_puliziaById = (req, res) => {
    const id = req.params.id;
    Piano_pulizia.findOne({ _id: id}, (err, data) => {
        if (err || !data) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
};


//export controller functions
module.exports = {
    getPiano_puliziaById,
    getPiano_pulizia,
    newPiano_pulizia,
};