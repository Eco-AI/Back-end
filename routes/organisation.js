const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const organisationController = require('../controllers/organisation');
// 3.

router.post('/organisation', organisationController.newOrganisation);

router.get('/organisation', organisationController.getAllOrganisations);

router.delete('/organisation/:name', organisationController.deleteOrganisation);


module.exports = router; // export to use in server.js