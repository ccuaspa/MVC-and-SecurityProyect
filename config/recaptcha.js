const Recaptcha = require("express-recaptcha").RecaptchaV2;
require("dotenv").config();

const siteKey = process.env.RECAPTCHA_SITE_KEY;
const secretKey = process.env.RECAPTCHA_SECRET_KEY;



const recaptcha = new Recaptcha(siteKey, secretKey);

module.exports = recaptcha;
