const recaptcha = require("../config/recaptcha");
const loginController = require("../controllers/loginController");
var express = require("express");
var router = express.Router();



/* GET login page. */
router.get("/", recaptcha.middleware.render, function (req, res) {
  res.render("login", { captcha: res.recaptcha, usuario:{ email:req.query.usuario ? req.query.usuario:{}}, errors: {recaptcha:"reCAPTCHA failed"} });
});

/* POST login form. */
router.post("/", recaptcha.middleware.verify, loginController.login);

module.exports = router;