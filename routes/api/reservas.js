//llamar modulo express
var express = require('express');
//modulo routeador de express
var router = express.Router();
//importar controller para reserva
var reservaController = require('../../controllers/api/reservaControllerAPI');

router.get("/", reservaController.reserva_list);
//router.post("/create", reservaController.reserva_create);
router.post("/update", reservaController.reserva_update);
router.post("/delete", reservaController.reserva_delete);

module.exports = router;