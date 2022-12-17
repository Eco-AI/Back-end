const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const rifiutoController = require('../controllers/rifiuto');
// 3.

router.get('/rifiuto', rifiutoController.getElencoRifiuti);

router.post('/rifiuto', rifiutoController.riconoscimentoRifiuto);

router.get('/rifiuto/:id', rifiutoController.getDettagliRifiuto);