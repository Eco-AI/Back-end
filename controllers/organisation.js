const Organisation = require('../models/organisation');
// newOrganisation function for post organisation route
//POST organisation
const newOrganisation = (req, res) => {
    // check if parameters are empty, if so return 400 error
    if (!req.body.name || !req.body.employee_num) {
        res.status(400).json({ message: "Bad request, missing parameters" });
        return;
    }
    //check if the organisation name already exists in db
    Organisation.findOne({ name: req.body.name }, (err, data) => {
        //if organisation not in db, add it
        if (!data) {
            //create a new organisation object using the Organisation model and req.body
            const newOrganisation = new Organisation({
                name: req.body.name,
                employee_num: req.body.employee_num,
            })

            console.log("Creating new organisation: ", newOrganisation);

            // save this object to database
            newOrganisation.save((err, data) => {
                if (err) {
                    res.status(500).json({ Error: err });
                    return;
                }
                res.status(201).json({ message: "Organisation created", data: data });
            })
            //if there's an error or the organisation is in db, return a message         
        } else {
            if (err) {
                res.status(500).json({ Error: err });
                return;
            }
            
            res.status(409).json({ message: "Organisation already exists" });
        }
    })
};


//GET all organisation
const getAllOrganisations = (req, res) => {
    console.log("Getting all organisations");
    Organisation.find({}, (err, data) => {
        if (err) {
            res.status(500).json({ Error: err });
            return;
        }
        res.status(200).json(data);
    })
};

//DELETE organisation by name
const deleteOrganisation = (req, res) => {
    console.log("Deleting organisation: ", req.params.name);

    Organisation.findOne({ name: req.params.name }, (err, data) => {
        if (err) {
            res.status(500).json({ Error: err });
            return;
        }
        if (data) {
            Organisation.deleteOne({ name: req.params.name }, (err, data) => {
                if (err) {
                    res.status(500).json({ Error: err });
                    return;
                }
                res.status(204);
            }
            )
        } else {
            // if organisation not found return 404 error
            res.status(404).json({ message: "Organisation not found" });
        }
    })
};


//export controller functions
module.exports = {
    getAllOrganisations,
    newOrganisation,
    deleteOrganisation
};