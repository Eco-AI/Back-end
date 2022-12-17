const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const utenteController = require('../controllers/utente');
// 3.

router.post('/utente/signup', utenteController.signup);

router.post('/utente/login', utenteController.login);

router.get('/utente/logout', utenteController.logout);

router.get('/utente/:id', utenteController.getUtenteById);


module.exports = router; // export to use in server.js