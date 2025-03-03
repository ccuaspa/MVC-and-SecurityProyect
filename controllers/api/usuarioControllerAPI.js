var Usuario = require("../../models/usuarios");

exports.usuarios_list = function(req, res){
    Usuario.find({})
    .then((usuarios) => {
        res.status(200).json({
            usuarios:usuarios
        });
    });
};

exports.usuarios_create = function(req, res){
    var usuario = new Usuario({nombre: req.body.nombre, email: req.body.email, password: req.body.password});

    usuario.save()
    .then(usuario =>{
        res.status(200).json(usuario);
    })  
};

exports.usuario_update=function(req, res){
    var aUser= Usuario.findByCode(req.body.code)
    .then(aUser =>{
        aUser.nombre = req.body.nombre;

        return aUser.save()
        .then(usuario =>{
            res.status(200).json(usuario);
        }) 
    })  
  
    
}

exports.usuario_reservar = function(req, res){
    Usuario.findByCode(req.body.code)
    .then(usuario => {
        console.log(req.body);
        usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta)
        console.log("reserva!");
        res.status(200).send();          
    });
};