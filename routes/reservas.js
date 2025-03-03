//llamar modulo express
var express = require('express');
//modulo routeador de express
var router = express.Router();
//importar controller para reserva
var reservaController = require('../controllers/reserva');


router.get('/', reservaController.reserva_list);

//routers para create
router.get("/create", reservaController.reserva_create_get);
router.post("/create", reservaController.reserva_create_post);

//routers para read
router.get("/read", reservaController.reserva_read_get);

//rutas para update
router.get("/:id/update", reservaController.reserva_update_get);
router.post("/:id/update", reservaController.reserva_update_post);

//ruta para delete
router.post("/:id/delete", reservaController.reserva_delete_post);

module.exports = router;
