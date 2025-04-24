const express = require("express");
const router = express.Router();
const blogController = require("../controller/blog.controller");
const passport = require("passport");

const isAdminAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
};

router.get("/view-blogs", blogController.getViewBlogPage);
router.get("/single-blog/:id", blogController.getSingleBlogPage);  
router.get("/add-blog", isAdminAuthenticated, blogController.getAddBlogPage);
router.get("/all-blogs", isAdminAuthenticated, blogController.getAllBlogsPage);
router.get("/edit-blog/:id", isAdminAuthenticated, blogController.getEditBlogPage);
router.get("/delete-blog/:id", isAdminAuthenticated, blogController.deleteBlog);
router.post("/add-blog", isAdminAuthenticated, blogController.postAddBlog);
router.post("/edit-blog/:id", isAdminAuthenticated, blogController.postEditBlog);

module.exports = router;