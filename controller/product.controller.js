const Category = require("../models/category.model");
const ExtraCategory = require("../models/extraCategory.model");
const SubCategory = require("../models/subCategory.model");
const Product = require("../models/product.model");

exports.addProductPage = async (req, res) => {
  try {
    let categories = await Category.find();
    let subCategories = await SubCategory.find();
    let extraCategories = await ExtraCategory.find();
    return res.render("product/add_product", {
      categories,
      subCategories,
      extraCategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.addNewProduct = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    req.body.productImage = imagePath;

    await Product.create(req.body);
    req.flash("success", "New Product Added.");
    return res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.getAllProducts = async (req, res) => {
  const { category, search } = req.query;

    let filter = {};

    if (category) {
        filter['category._id'] = category;
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
    
      return res.render("product/view_product", {allProducts, categories});
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.getProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)
    .populate("category")
    .populate("subcategory")
    .populate("extracategory");

      return res.render("product/single_product", {product});
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.addToCart = (req, res) => {
  const productId = req.params.id;
  console.log('Adding product with ID:', productId);

  const product = { _id: productId, name: 'Product Name', price: 100 }; 

  if (product) {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push(product);

    console.log('Product added to cart:', product);
  } else {
    console.log('Product not found');
  }
  res.redirect('/');
};
