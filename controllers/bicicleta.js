var Bicicleta = require('../models/bicicleta');

// Controlador para mostrar la lista de bicicletas
exports.bicicleta_list = function(req, res) {
    // Renderiza la vista 'bicicletas/index' y pasa todas las bicicletas
    const bicis = Bicicleta.find()
    .then((bicis)=>{
        res.render('bicicletas/index', {bicis});
    })
    
}


//Seccion para create

// Controlador para mostrar el formulario de creación de una nueva bicicleta
exports.bicicleta_create_get = function(req, res) {
    // Renderiza la vista 'bicicletas/create' para desplegar el formulario de creación de una nueva bicicleta
    res.render("bicicletas/create");
}

// Controlador que maneja la creación de una nueva bicicleta a través de un POST
exports.bicicleta_create_post = function(req, res) {
    // Crea una nueva instancia de bicicleta con los datos del formulario
    var bici = new Bicicleta({
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    });

    // Añade la bicicleta creada al listado de bicicletas
    bici.save()
    .then(()=>{
        res.redirect("/bicicletas");
    })
    
}

//Seccion para read
exports.bicicleta_read_get = function(req, res) {
    // Renderiza la vista 'bicicletas/index' y pasa todas las bicicletas
    const bicis = Bicicleta.find()
    .then(bicis=>{
        res.render('bicicletas/index', {bicis});
    })
}

//Seccion para update

exports.bicicleta_update_get = function(req, res) {
    var bici =Bicicleta.findByCode(req.params.code)
    .then(bici=>{
        res.render("bicicletas/update", {bici});
    })   
}

exports.bicicleta_update_post = function(req, res) {
    
    var bici =Bicicleta.findByCode(req.params.code)
    .then(bici=>{
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];

    return bici.save()
    .then(()=>{
        res.redirect("/bicicletas");
    })
    
})

    
}

//Controllers para delete
exports.bicicleta_delete_post = function(req, res) {
    Bicicleta.removeByCode(req.body.code)
    .then(()=>{
        res.redirect("/bicicletas");
    })
}
