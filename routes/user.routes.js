const express = require('express');
const { userPage, signleProduct,addToCart,viewCart,viewProfile,changeUserPasswordPage,changeUserPassword,registerPage,handleRegister,loginPage,handleLogin,logoutUser } = require('../controller/user.controller');
const passport = require('passport');

const routes = express.Router();

routes.get("/", userPage);
routes.get("/single-product/:id", signleProduct);

routes.get("/add-cart/:id", addToCart);
routes.get("/cart", viewCart);


routes.get('/view-Profile',passport.checkAuthenticated, viewProfile);

routes.get('/Change-Password',passport.checkAuthenticated, changeUserPasswordPage);

routes.post('/Change-Password',passport.checkAuthenticated, changeUserPassword);   
// Auth Pages
routes.get("/register", registerPage);
routes.post("/register", handleRegister);
// Login Routes
routes.get("/loginUser", loginPage);
routes.post("/loginUser", handleLogin);
// routes/user.js
routes.get("/logoutUser", logoutUser);

module.exports = routes;

