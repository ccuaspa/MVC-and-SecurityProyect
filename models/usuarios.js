var mongoose = require("mongoose");
const { isEmail, isLength } = require('mongoose-validators');
var Reserva = require("./reserva");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const saltRounds = 10;

const Token=require("../models/token");
const mailer = require("../mailer/mailer");

var Schema = mongoose.Schema;

const validateEmail = function(email){
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}
var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, "El nombre es obligatorio"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "El email es obligatorio"],
        lowercase: true,
        unique: true,
        validate: isEmail({ message: "Por favor ingrese un email válido" })
    },
    password: {
        type: String,
        required: [true, "El password es obligatorio"]
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.pre("save", function(next){
    if (this.isModified("password")){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
})

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

/*Metodo para resetear mejorado
usuarioSchema.methods.resetPassword = function (cb) {
    const usuario = this;
    
    // Crear un token único para resetear la contraseña
    const token = new Token({
        _userId: usuario._id,
        token: crypto.randomBytes(16).toString("hex"),
    });

    // Guardar el token en la base de datos
    token.save()
        .then(() => {
            const email_destination = usuario.email;
            const mailOptions = {
                from: "no-reply@redbicicletas.com",
                to: email_destination,
                subject: "Recuperación de contraseña",
                html: `
                    <p>Hola,</p>
                    <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                    <a href="http://localhost:5000/resetPassword/${token.token}">Restablecer contraseña</a>
                    <p>Si no solicitaste este cambio, ignora este correo.</p>
                `,
            };

            // Enviar el correo
            return mailer.sendMail(mailOptions);
        })
        .then(() => {
            console.log("Correo de recuperación enviado a " + usuario.email);
            cb(null); // No hay error, llamar callback con `null`
        })
        .catch((error) => {
            console.error("Error enviando correo de recuperación:", error);
            cb(error); // Pasar el error al callback
        });
};

*/
usuarioSchema.methods.resetPassword = async function (cb) {
    try {
        const token = new Token({
            _userId: this._id,
            token: crypto.randomBytes(16).toString("hex")
        });

        await token.save();  // Ahora usa await en lugar de callback

        const email_destination = this.email;
        const mailOptions = {
            from: "no-reply@redbicicletas.com",
            to: email_destination,
            subject: "Reseteo de password",
            text: "Hola,\n\n" +
                "Por favor, para resetear el password de su cuenta haga click en este link:\n" +
                "http://localhost:5000" + "/resetPassword/" + token.token
        };

        await mailer.sendMail(mailOptions);  // También usa await si mailer soporta promesas

        console.log("Se envió un email para resetear el password a: " + email_destination + ".");
        cb(null);  // Llama al callback sin error

    } catch (err) {
        console.error("Error en resetPassword:", err);
        cb(err);  // Pasa el error al callback
    }
};


usuarioSchema.statics.createInstance = function(code, nombre){
    return new this({
        code: code,
        nombre: nombre
    });
  };
  
  
usuarioSchema.methods.toString = function(){
    return "code: "+this.code+ " | color"+this.color;
};

usuarioSchema.statics.allUsuarios = function(){
    return this.find({});
};


usuarioSchema.statics.add = function(aUsuario){
    this.create(aUsuario);
};

// Función para encontrar una usuario por su CODE
usuarioSchema.statics.findByCode = function(aCode) { 
    return this.findOne({code: aCode});
};

// Función para eliminar una bicicleta por su ID
usuarioSchema.statics.removeByCode = function(aCode) {
    return this.deleteOne({code: aCode});
};

usuarioSchema.methods.reservar = function(biciId, desde, hasta){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
    console.log(reserva);
    reserva.save();
}
/*
usuarioSchema.methods.enviar_email_bienvenida= function(cb){
    const token = new Token({_userId: this._id, token: crypto.randomBytes(16).toString("hex")})
    const email_destination= this.email;
    token.save(function (err){
        if (err) { return console.log(err.message);}

        const mailOptions = {
            from: "no-reply@redbicicletas.com",
            to: email_destination,
            subject: "Verificacion de cuenta",
            text: "Hola, \n\n"+"Por favor, para verificar su cuenta haga click en este link: \n"+ "http://localhost:5000"+ "\/token/confirmation\/"+ token.token + ".\n"
        };

        mailer.sendMail(mailOptions, function(err){
            if (err) {return console.log(err.message); }

            console.log("Averification email has been sent to "+ email_destination+".")
        });
    });
}
    */
usuarioSchema.methods.enviar_email_bienvenida = async function () {
    try {
        // Crear el token
        const token = new Token({
            _userId: this._id,
            token: crypto.randomBytes(16).toString("hex"),
        });

        // Guardar el token
        await token.save();

        // Preparar las opciones de correo
        const email_destination = this.email;
        const mailOptions = {
            from: "no-reply@redbicicletas.com",
            to: email_destination,
            subject: "Verificación de cuenta",
            html: `
                <p>Hola,</p>
                <p>Por favor, para verificar su cuenta haga click en este enlace:</p>
                <a href="http://localhost:5000/token/confirmation/${token.token}">Verificar cuenta</a>
                <p>Si no solicitaste esta verificación, por favor ignora este correo.</p>
            `
        };

        // Enviar el correo
        await mailer.sendMail(mailOptions);
        console.log(
            "Se ha enviado un correo de verificación a " + email_destination + "."
        );
    } catch (err) {
        console.error("Error al enviar el email de bienvenida:", err.message);
    }
};

module.exports = mongoose.model("Usuario", usuarioSchema);