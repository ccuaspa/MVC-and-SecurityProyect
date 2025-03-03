//llamar modulo express
var express = require('express');
//modulo routeador de express
var router = express.Router();
//importar controller para bicicleta
var bicicletaController = require('../../controllers/api/bicicletaControllerAPI');

router.get("/", bicicletaController.bicicleta_list);
router.post("/create", bicicletaController.bicicleta_create);
router.post("/update", bicicletaController.bicicleta_update);
router.post("/delete", bicicletaController.bicicleta_delete);

module.exports = router;