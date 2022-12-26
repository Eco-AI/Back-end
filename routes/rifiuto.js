const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const rifiutoController = require('../controllers/rifiuto');
// 3.

router.post('/rifiuto', rifiutoController.riconoscimentoRifiuto);

router.get('/rifiuto/:id', rifiutoController.getDettagliRifiuto);

router.delete('/rifiuto/:id', rifiutoController.deleteRifiuto);

router.patch('/rifiuto/:id', rifiutoController.classificaRifiuto);


module.exports = router;