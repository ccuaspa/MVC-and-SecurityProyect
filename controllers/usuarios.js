var Usuario = require('../models/usuarios');

module.exports ={
    // Controlador para mostrar la lista de usuarios
    list : function(req, res, next) {
        // Renderiza la vista 'usuarios/index' y pasa todas las usuarios
        Usuario.find()
        .then((users)=>{
            res.render('usuarios/index', {users:users});
        })  
    },

    //Seccion para update
    update_get : function(req, res, next) {
    Usuario.findById(req.params.id)
    .then(user=>{
        res.render("usuarios/update", {user:user})
        })
    },

    update: function(req, res, next) {
        const update_values = {nombre: req.body.nombre};
        Usuario.findByIdAndUpdate(req.params.id, update_values, {new: true}) // Asegura que la versión actualizada sea devuelta
            .then(usuario => {
                res.redirect("/usuarios");
            })
            .catch(err => {
                console.log(err);
                res.render("usuarios/update", {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            });
    },
    

    /*
//REVISAR
    update: function(req, res, next) {
         var update_values = {nombre: req.body.nombre};
        Usuario.findByIdAndUpdate(req.params.id, update_values, function(err, usuario){
            if (err){
                console.log(err);
                res.render("usuario/update", {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            }else{
                res.redirect("/usuarios");
                return;
            }
        })
        
        /*
        .then(user=>{
            user.nombre = req.body.nombre;
            return user.save()
            .then(()=>{
                res.redirect("/usuarios");
            })
        })
               
    },
*/
    //Seccion para create

    // Controlador para mostrar el formulario de creación de una nueva usuario
    create_get : function(req, res, next) {
        // Renderiza la vista 'usuarios/create' para desplegar el formulario de creación de una nueva usuario
        res.render("usuarios/create", {errors:{}, usuario: new Usuario()});
    },

    // Controlador que maneja la creación de una nueva usuario a través de un POST
    create : function(req, res, next) {
        if (req.body.password != req.body.confirm_password){
            res.render("usuarios/create", {errors: {confirm_password: {message: "No coincide con el password ingresado"}}, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            return;
        }
        Usuario.create({nombre: req.body.nombre, email:req.body.email, password: req.body.password})
            //, function(err, nuevoUsuario)
            .then(nuevoUsuario => {
                nuevoUsuario.enviar_email_bienvenida();  // Usando nuevoUsuario
                res.redirect("/usuarios");
            })
            .catch(err => {
                console.log(err);
                res.render("usuarios/create", {errors: err.errors, usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})});
            });
        },
/*
    delete: function(req,res,next){
        Usuario.findByIdAndDelete(req.body.id, function(err){
            if(err)
                next(err);
            else
                res.redirect("/usuarios");
        });
    },
*/
    delete: function(req, res, next){
        Usuario.findByIdAndDelete(req.body.id)
            .then(() => {
                res.redirect("/usuarios");
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error al eliminar el usuario");
            });
    },    
}


