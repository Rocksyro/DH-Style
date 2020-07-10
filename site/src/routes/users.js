let express = require("express");
let router = express.Router();

const userController = require("../controllers/usersController.js");

const multer = require("multer");
const path = require("path");

const userLog = require("../middlewares/userLog");
const guestUser = require("../middlewares/guestUser");

const validate = require("../validators/usersValidators");

// MULTER
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/img/users"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage });

// Registro de usuario
router.get("/register", guestUser, userController.register);
router.post("/register", guestUser, validate.userCreate, userController.store);

// Login de usuario
router.get("/login", guestUser, userController.login);
router.post(
  "/login",
  guestUser,
  validate.userLogin,
  userController.processLogin
);

// Logout
router.post("/logout", userLog, userController.logout);

// Perfil del usuario
router.get("/profile/:usuarioId", userLog, userController.profile);

module.exports = router;
