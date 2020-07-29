const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../database/models");
const { validationResult } = require("express-validator");
const validationHelper = require("../validators/validatorHelpler");

module.exports = {
  // REGISTRO DE USUARIO
  register: (req, res) => {
    res.render("users/register");
  },
  store: (req, res) => {
    let errors = validationResult(req);
    let betterErrors = validationHelper(errors.mapped());
    // betterErrors.create('image', 'No me gusta el archivo que subiste', req.body.imagen);
    betterErrors.create("email", "Mail no valido", req.body.email);

    if (!errors.isEmpty()) {
      return res.render("users/register", {
        old: req.body,
        errors: betterErrors,
      });
    }
    usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      // imagen: req.file ? req.file.filename : '',
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      categoriaUsuarioId: 2,
    };

    db.usuarios
      .create(usuario)
      .then((storedUsuario) => {
        return res.redirect("/users/login");
      })
      .catch((error) => console.log(error));
  },
  // LOGIN DE USUARIO
  login: (req, res) => {
    res.render("users/login");
  },
  processLogin: (req, res, next) => {
    // Si existe el usuario
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("users/login", {
        old: req.body,
        errors: errors.mapped(),
      });
    }
    if (req.body.checkboxlogin) {
      db.usuarios
        .findOne({
          where: { email: req.body.email },
        })
        .then((usuario) => {
          req.session.usuario = usuario;
          let data = req.session.usuario;
          res.cookie("cookieuser", data, {
            maxAge: 1000 * 60 * 60 * 24 * 90,
          });
          if (usuario.categoria == '2') {
          return (
          res.render("users/profile", {
            title: "Perfil usuario",
            usuario: usuario,
          }))
        } else {
          res.render('users/administ', {
            title: "Perfil administrador",
            usuario: datos,
          })
        }
        });
    } else {
      db.usuarios
        .findOne({
          where: { email: req.body.email },
        })
        .then((usuario) => {
          req.session.usuario = usuario;
          let datos = req.session.usuario;

          if (usuario.categoria == 2){
          return res.render("users/profile", {
            title: "Perfil usuario",
            usuario: datos,
          })
        } else {
          res.render('users/administ', {
            title: "Perfil administrador",
            usuario: datos,
          })
        };
        });
    }
  },
  update: (req, res) => {
    usuario = req.body;

    usuario.imagen = req.params.imagen ? req.body.imagen : req.body.oldimagen;
    delete usuario.oldimagen;

    db.usuarios
      .update(usuario, {
        where: {
          id: req.params.usuarioId,
        },
      })
      .then((updatedusuario) => {
        res.redirect(`/users/login/${req.params.usuarioId}`);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  logout: (req, res, next) => {
    // Destruimos la sesión
    req.session.destroy();
    // // Destruimos la cookie de recordar
    res.cookie("cookieuser", null, { maxAge: -1 });
    // // Redirigimos a la home
    res.redirect("/");
    // console.log("no anda");
  },
};
