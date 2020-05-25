var express = require("express");
var router = express.Router();
var mainController = require("../controllers/mainController");

/* GET productCart page. */
router.get("/", mainController.root);
router.get("/register", mainController.register);

module.exports = router;
