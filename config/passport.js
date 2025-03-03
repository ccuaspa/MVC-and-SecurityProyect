const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuarios');

passport.use(new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  function (email, password, done) {
    Usuario.findOne({ email: email })
      .then(usuario => {
        if (!usuario) return done(null, false, { message: "Email no existe o incorrecto" });

        if (!usuario.validPassword(password)) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        return done(null, usuario);
      })
      .catch(err => done(err));
  }
));

passport.serializeUser(function(user,cb){
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb){
    Usuario.findById(id)
      .then(usuario => cb(null, usuario))
      .catch(err => cb(err));
});

module.exports=passport;