var Reserva = require("../../models/reserva");

exports.reserva_list = function(req, res){
    Reserva.find({})
    .then((reservas) => {
        res.status(200).json({
            reservas:reservas
        });
    });
}
//API Create
/*
exports.reserva_create = function(req, res){
    var reserva = new Reserva({
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    });

    reserva.save()
    .then(reserva =>{
        res.status(200).json(reserva);
    }) 
}*/

//API Update
exports.reserva_update=function(req, res){
    var reserva= Reserva.findById(req.body.id)
    .then(reserva =>{
        reserva.desde= req.body.desde,
        reserva.hasta= req.body.hasta
        //areserva.bicicleta= req.body.bicicleta
        //areserva.usuario= areserva.usuario

        console.log("Datos de la reserva antes de guardar:", reserva);

        return reserva.save()
       

        .then(reserva =>{
            res.status(200).json(reserva);
            console.log("Datos de la reserva Despues de guardar:", reserva);
        }) 
    })  
  
    
}
    
//API Delete
exports.reserva_delete= function(req, res){
    Reserva.removeById(req.body.id)
    .then(() =>{
        res.status(204).send();
    }) 
}