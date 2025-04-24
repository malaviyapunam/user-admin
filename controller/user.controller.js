const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require('../models/user.model');
const passport = require('passport');

exports.viewCart = (req, res) => {
  try {
    const cart = req.session.cart || []; 

    res.render('cart', { cart }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading cart');
  }
};
let cart = []; 
exports.addToCart = async (req, res) => {
  const productId = req.params.id; 

  try {
      const product = await Product.findById(productId);
      if (product) {
          if (!req.session.cart) {
              req.session.cart = [];
          }
          req.session.cart.push(product);
          res.redirect('/user/cart');
      } else {
          res.send("Product not found");
      }
  } catch (err) {
      res.status(500).send("Error adding to cart");
  }
};


exports.userPage = async (req, res) => {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
        filter['category'] = category;
    }

    if (search) {
       
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { desc: { $regex: search, $options: 'i' } }
        ];
    }
  try {
    let categories = await Category.find();
    let allProducts = await Product.find(filter)
    .populate("category")
    .populate("subcategory")
    .populate("extracategory");
    return res.render("index", {categories, allProducts})
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};


exports.signleProduct = async (req, res) => {
  
  try {
      let product = await Product.findById(req.params.id)
          .populate("category")
          .populate("subcategory")
          .populate("extracategory");

      console.log("Populated Product:", product); 

      return res.render("get_product", { product });
  } catch (error) {
      console.log(error);
      req.flash("error", "Something went wrong!!!");
      return res.redirect("back");
  }
};



exports.registerPage = (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
    res.redirect("/"); 
  }
};

exports.handleRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", { error: "User already exists with this email." });
    }

    const newUser = new User({ username, email, password });

    await newUser.save();

    res.redirect("/user/loginUser");
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.loginPage = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/user");
    }
    res.render("loginUser");
  } catch (error) {
    console.log("Login page error:", error);
    res.redirect("/");
  }
};

exports.handleLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/loginUser");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Session login error:", err);
        return res.status(500).send("Login Session Error");
      }

      req.session.user = user;
      res.redirect("/user");
    });
  })(req, res, next);
};

exports.viewProfile = async (req, res) => {
  try {
    if (!req.user) {
      req.flash('error', 'Please login to view your profile');
      return res.redirect('/loginUser');
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/loginUser');
    }

    const success = req.flash('success');
    const error = req.flash('error');

    return res.render('view-Profile', { 
      user,
      success: success.length > 0 ? success[0] : null,
      error: error.length > 0 ? error[0] : null
    });

  } catch (error) {
    console.error('Error in viewProfile:', error);
    req.flash('error', 'An error occurred while loading your profile');
    res.redirect('/loginUser');
  }
};

exports.changeUserPasswordPage = (req, res) => {
  const success = req.flash('success');
  const error = req.flash('error');
  
  res.render('Change-Password', {
    success: success.length > 0 ? success[0] : null,
    error: error.length > 0 ? error[0] : null,
  });
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { currentPass, newpass, confpass } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/user/Change-Password');
    }

    if (currentPass !== user.password) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/user/Change-Password');
    }

    if (newpass !== confpass) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/user/Change-Password');
    }

    if (currentPass === newpass) {
      req.flash('error', 'New password must be different from current password.');
      return res.redirect('/user/Change-Password');
    }

    user.password = newpass;
    await user.save();

    req.flash('success', 'Password changed successfully.');
    res.redirect('/user/view-profile');
  } catch (error) {
    console.error('Change password error:', error);
    req.flash('error', 'Something went wrong while changing your password.');
    res.redirect('/user/Change-Password');
  }
};

exports.logoutUser = (req, res) => {
  try {
    req.logout(function (err) {
      if (err) {
        console.error("Logout Error:", err);
        return res.status(500).send("Failed to log out");
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).send("Failed to destroy session");
        }

        res.clearCookie("connect.sid"); 
        res.redirect("/user/loginUser");
      });
    });
  } catch (error) {
    console.log("Logout Exception:", error);
    res.redirect("/user/loginUser");
  }
};
