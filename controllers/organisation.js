const Organisation = require('../models/organisation');
// newOrganisation function for post organisation route
//POST organisation
const newOrganisation = (req, res) => {
    //check if the organisation name already exists in db
    Organisation.findOne({ name: req.body.name }, (err, data) => {

        //if organisation not in db, add it
        if (!data) {
            //create a new organisation object using the Organisation model and req.body
            const newOrganisation = new Organisation({
                name: req.body.name,
                employe_num: req.body.employe_num,
            })

            // save this object to database
            newOrganisation.save((err, data) => {
                if (err) return res.json({ Error: err });
                return res.json(data);
            })
            //if there's an error or the organisation is in db, return a message         
        } else {
            if (err) return res.json(`Something went wrong, please try again. ${err}`);
            return res.json({ message: "Organisation already exists" });
        }
    })
};


//GET all organisation
const getAllOrganisations = (req, res) => {
    Organisation.find({}, (err, data) => {
        if (err) {
            return res.json({ Error: err });
        }
        return res.json(data);
    })
};


//export controller functions
module.exports = {
    getAllOrganisations,
    newOrganisation,
};