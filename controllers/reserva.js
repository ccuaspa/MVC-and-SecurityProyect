var Reserva = require('../models/reserva');
var Usuario = require('../models/usuarios');

// Controlador para mostrar la lista de reservas
exports.reserva_list = function(req, res) {
    // Renderiza la vista 'reservas/index' y pasa todas las reservas
    const reservas = Reserva.find()
    .then((reservas)=>{
        res.render('reservas/index', {reservas});
    })
    
}

// Controlador para mostrar el formulario de creación de una nueva reserva
exports.reserva_create_get = function(req, res) {
    // Renderiza la vista 'reservas/create' para desplegar el formulario de creación de una nueva reserva
    res.render("reservas/create");
}

// Controlador que maneja la creación de una nueva reserva a través de un POST
exports.reserva_create_post = function(req, res) {
    // Crea una nueva instancia de reserva con los datos del formulario
    Usuario.findByCode(req.body.code)
    .then(usuario => {
        console.log(req.body);
        usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta)
        .then(()=>{
            res.redirect("/reservas");
        })       
    });
    
    
}

//Seccion para read
exports.reserva_read_get = function(req, res) {
    // Renderiza la vista 'reservas/index' y pasa todas las reservas
    const reservas = Reserva.find()
    .then(reservas=>{
        res.render('reservas/index', {reservas});
    })
}

//Seccion para update

exports.reserva_update_get = function(req, res) {
    var reserva =Reserva.findById(req.params.id)
    .then(reserva=>{
        res.render("reservas/update", {reserva});
    })   
}

exports.reserva_update_post = function(req, res) {
    
    var reserva =Reserva.findById(req.params.id)
    .then(reserva=>{
        reserva.desde= req.body.desde,
        reserva.hasta= req.body.hasta,
        reserva.bicicleta= req.body.bicicleta,
        reserva.usuario= req.body.usuario

    return reserva.save()
    .then(()=>{
        res.redirect("/reservas");
    })
    
})

    
}

//Controllers para delete
exports.reserva_delete_post = function(req, res) {
    Reserva.removeById(req.body.id)
    .then(()=>{
        res.redirect("/reservas");
    })
}
