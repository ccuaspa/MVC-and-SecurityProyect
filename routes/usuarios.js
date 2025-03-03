//llamar modulo express
var express = require('express');
//modulo routeador de express
var router = express.Router();
//importar controller para usuarios
var usuariosController = require('../controllers/usuarios');


router.get('/', usuariosController.list);

//routers para create
router.get("/create", usuariosController.create_get);
router.post("/create", usuariosController.create);

//rutas para update
router.get("/:id/update", usuariosController.update_get);
router.post("/:id/update", usuariosController.update);

//ruta para delete
router.post("/:id/delete", usuariosController.delete);


module.exports = router;
