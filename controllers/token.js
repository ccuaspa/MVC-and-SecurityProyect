var Usuario = require("../models/usuarios");
var Token = require("../models/token");

module.exports = {
    confirmationGet: async function (req, res, next) {
        try {
            // Buscar el token
            const token = await Token.findOne({ token: req.params.token });
            if (!token) {
                return res.status(400).send({
                    type: "not-verified",
                    msg: "No encontramos un usuario con este token. Quizá haya expirado y debas solicitar uno.",
                });
            }
    
            // Buscar el usuario asociado al token
            const usuario = await Usuario.findById(token._userId);
            if (!usuario) {
                return res.status(400).send({ msg: "No encontramos un usuario con este token." });
            }
    
            // Verificar si el usuario ya está verificado
            if (usuario.verificado) {
                return res.redirect("/usuarios");
            }
    
            // Marcar el usuario como verificado y guardar
            usuario.verificado = true;
            await usuario.save();
    
            // Redirigir al usuario al inicio
            res.redirect("/");
        } catch (err) {
            console.error("Error durante la confirmación:", err);
            res.status(500).send({ msg: "Ocurrió un error interno. Por favor, inténtalo de nuevo." });
        }
    },
    
    
    /*
    confirmationGet : function(req, res, next){
        Token.findOne({ token:req.params.token}, function(err, token){
            if (!token) return res.status(400).send({type: "not-verified", msg:"No encontramos un usuario con este token. Quiza haya expirado y debas solicitar uno "});
            Usuario.findById(token._userId, function(err, usuario){
                if(!usuario) return res.status(400).send({msg: "No encontramos un usuario con este token"});
                if (usuario.verificado) return res.redirect("/usuarios");
                usuario.verificado=true;
                usuario.save(function (err){
                    if (err) { return res.status(500).send({msg: err.message}); }
                    res.redirect("/");
                });
            });
            ;
        });
    },
    */
}