require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const Usuario = require("./models/usuarios");
const Token = require("./models/token")
//const Usuario = require("./models/usuarios");
//const Token = require("./models/token")

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var forgotPasswordRouter = require('./routes/forgotPassword');
var usuariosRouter = require('./routes/usuarios');
var tokenRouter = require('./routes/token');
var bicicletasRouter = require('./routes/bicicletas');
var reservasRouter = require('./routes/reservas');
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');
var reservasAPIRouter = require('./routes/api/reservas');
var authAPIRouter = require('./routes/api/reservas')

const store = new session.MemoryStore;

var app = express();

app.set("secretkey", "jwt_pwd_!!11223344//234");

app.use(session({
  cookie: {maxAge:240*60*60*1000},
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicis_!!!***!"-!"-!"-!"-!"-!"-123123'
}));

var mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error de conexión a MongoDB Atlas:', err);
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/login", function(req, res){
  res.render("session/login")
});

app.post("/login", function(req, res, next){
  //passport
  passport.authenticate("local", function(err, usuario, info){
    if (err) return next(err);
    if(!usuario) return res.render("session/login", {info});
    req.logIn(usuario, function(err){
      if (err) return next(err);
      return res.redirect("/");
    })
  })(req, res, next);  
})

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});


app.get("/forgotPassword", function(req, res){
  res.render("session/forgotPassword")
});


app.post("/forgotPassword", function(req, res, next){
  Usuario.findOne({ email: req.body.email})
  .then(usuario => {
      if(!usuario) return res.render("session/forgotPassword", {info:  {message: "Email no existe o incorrecto"}});
    
      usuario.resetPassword(function(err){
      if (err) return next(err);
      console.log("session/forgotPasswordMessage");
      });
      res.render("session/forgotPasswordMessage")
  });
});


app.get("/resetPassword/:token", async (req, res, next) => {
  try {
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
      return res.status(400).send({ msg: "Token inválido o expirado." });
    }

    const usuario = await Usuario.findById(token._userId);
    if (!usuario) {
      return res.status(400).send({ msg: "No existe un usuario asociado al token." });
    }

    res.render("session/resetPassword", { errors: {}, usuario: usuario });
  } catch (err) {
    next(err); // Manejo de errores
  }
});

/*version mejorada
app.get("/resetPassword/:token", function(req, res) {
  Token.findOne({ token: req.params.token })
      .then(token => {
          if (!token) {
              return res.render("session/resetPassword", { info: { message: "Token inválido o expirado" } });
          }

          res.render("session/resetPassword", { token: req.params.token });
      })
      .catch(err => res.status(500).send(err));
});

app.post("/resetPassword/:token", async (req, res) => {
  try {

      const token = await Token.findOne({ token: req.params.token });
      if (!token) {
          
          return res.status(400).render("session/resetPassword", { info: { message: "Token inválido o expirado" } });
      }

      const usuario = await Usuario.findById(token._userId);
      if (!usuario) {

          return res.status(400).render("session/resetPassword", { info: { message: "Usuario no encontrado" } });
      }


      if (!req.body.password || req.body.password.length < 6) {

          return res.render("session/resetPassword", {
              errors: { message: "La contraseña debe tener al menos 6 caracteres" },
              token: req.params.token
          });
      }

      // Asignar la nueva contraseña correctamente
      usuario.password = req.body.password;
      await usuario.save();

      //  ELIMINAR TOKEN USADO
      await Token.deleteOne({ token: req.params.token });

      res.redirect("/login"); // Redirigir a login después de cambiar la contraseña
  } catch (error) {
      console.error(" Error en resetPassword:", error);
      res.status(500).render("session/resetPassword", { info: { message: "Error interno del servidor" } });
  }
});
*/
app.post("/resetPassword", async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.render("session/resetPassword", {
        errors: { confirm_password: { message: "No coincide con el password ingresado" } },
        usuario: new Usuario({ email: req.body.email })
      });
    }

    const usuario = await Usuario.findOne({ email: req.body.email });

    if (!usuario) {
      return res.render("session/resetPassword", {
        errors: { email: { message: "No se encontró un usuario con ese email." } },
        usuario: new Usuario({ email: req.body.email })
      });
    }

    usuario.password = req.body.password;

    try {
      await usuario.save();
      res.redirect("/login");
    } catch (err) {
      res.render("session/resetPassword", { errors: err.errors, usuario });
    }

  } catch (err) {
    res.render("session/resetPassword", {
      errors: { general: { message: "Error al procesar la solicitud." } },
      usuario: new Usuario({ email: req.body.email })
    });
  }
});


app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/forgotPassword', forgotPasswordRouter);
app.use('/usuarios', usuariosRouter);
app.use('/token', tokenRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/reservas', loggedIn, reservasRouter);
app.use('/api/bicicletas',validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/api/reservas',validarUsuario, reservasAPIRouter);
app.use("/api/auth", authAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next){
	if(req.user){
	next();
}else {
	console.log("Usuario sin loguearse");
res.redirect("/login");
}
};
function validarUsuario(req, res, next){
	jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"),function(err, decoded){
		if(err){
			res.json({status:"error", message: err.message, data: null});
}else{
	req.body.userId=decoded.id;

	console.log("jwt verify: "+ decoded);

	next();
}
});
}


module.exports = app;
