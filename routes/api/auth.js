const express = require("express");
const router =requires.Router();

const authController = require("../../controllers/api/authControllerAPI");

router.post("/authenticate", authController.authenticate);
router.post("/forgotPassword", authController.forgotPassword);

module.exports = router;
