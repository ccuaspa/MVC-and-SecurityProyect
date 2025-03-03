//llamar modulo express
var express = require('express');
//modulo routeador de express
var router = express.Router();
//importar controller para bicicleta
var bicicletaController = require('../controllers/bicicleta');


router.get('/', bicicletaController.bicicleta_list);

//routers para create
router.get("/create", bicicletaController.bicicleta_create_get);
router.post("/create", bicicletaController.bicicleta_create_post);

//routers para read
router.get("/read", bicicletaController.bicicleta_read_get);

//rutas para update
router.get("/:code/update", bicicletaController.bicicleta_update_get);
router.post("/:code/update", bicicletaController.bicicleta_update_post);

//ruta para delete
router.post("/:code/delete", bicicletaController.bicicleta_delete_post);

module.exports = router;
