const nodemailer = require("nodemailer");

const mailConfig={
    host: "smtp.ethereal.email",
    port: 587,
    auth:{
        user:"pablo.batz46@ethereal.email",
        pass:"8SQDJTX7gkWPNV8mu5"
    }
};

module.exports = nodemailer.createTransport(mailConfig);