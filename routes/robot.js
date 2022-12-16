const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const robotController = require('../controllers/robot');
// 3.

router.get('/robot', robotController.getAllRobot);

router.get('/robot/:name', robotController.getOneRobot);

router.put('/robot/:name', robotController.updateRobot);

// 4.
module.exports = router; // export to use in server.js