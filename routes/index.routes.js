const express = require('express');
const routes = express.Router();
const {dashBoard, loginPage, loginAdmin, logout, forgotPasswordPage, sendEmail, verifyOTP, changePasswordPage, resetPassword, changePassword} = require("../controller/index.controller");
const passport = require('passport');

// User Side
routes.use("/user", require("../routes/user.routes"));

// Admin Side
routes.get("/", loginPage);
routes.get("/dashboard", passport.checkAuthenticated, dashBoard);

routes.post("/login", passport.authenticate('local',{failureRedirect: "/"} ),  loginAdmin);
routes.get("/logout", logout);
routes.get("/profile", logout);

routes.get("/forgotPassword", forgotPasswordPage);
routes.post("/sendEmail", sendEmail);
routes.post("/verify-otp", verifyOTP);
routes.post("/reset-password", resetPassword);

routes.get("/change-password", passport.checkAuthenticated, changePasswordPage);
routes.post("/change-password", passport.checkAuthenticated, changePassword);

routes.use("/admin", passport.checkAuthenticated, require('./admin.routes'))
routes.use("/blog", passport.checkAuthenticated, require('./blog.routes'))
routes.use("/category", passport.checkAuthenticated, require('./category.routes'))
routes.use("/subCategory", passport.checkAuthenticated, require('./subCategory.routes'))
routes.use("/extracategory", passport.checkAuthenticated, require('./extraCategory.routes'))
routes.use("/product", passport.checkAuthenticated, require('./product.routes'))

module.exports = routes;