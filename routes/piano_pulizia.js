const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const piano_puliziaController = require('../controllers/piano_pulizia');
// 3.

router.post('/piano_pulizia', piano_puliziaController.newPiano_pulizia);

router.get('/piano_pulizia', piano_puliziaController.getPiano_pulizia);

router.get('/piano_pulizia/:id', piano_puliziaController.getPiano_puliziaById);


module.exports = router; // export to use in server.js