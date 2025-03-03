var Bicicleta = require("../../models/bicicleta");

exports.bicicleta_list = function(req, res){
    Bicicleta.find({})
    .then((bicicletas) => {
        res.status(200).json({
            bicicletas:bicicletas
        });
    });
}
//API Create
exports.bicicleta_create = function(req, res){
    var bici = new Bicicleta({
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    });

    bici.save()
    .then(bicicleta =>{
        res.status(200).json(bicicleta);
    }) 
}

//API Update
exports.bicicleta_update=function(req, res){
    var abici= Bicicleta.findByCode(req.body.code)
    .then(abici =>{
        abici.color = req.body.color;
        abici.modelo = req.body.modelo;
        abici.ubicacion = [req.body.lat, req.body.lng]

        return abici.save()
        .then(bicicleta =>{
            res.status(200).json(bicicleta);
        }) 
    })  
  
    
}
    
//API Delete
exports.bicicleta_delete= function(req, res){
    Bicicleta.removeByCode(req.body.code)
    .then(bicicleta =>{
        res.status(204).send();
    }) 
}