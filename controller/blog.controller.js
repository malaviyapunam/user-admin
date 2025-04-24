const Blog = require("../models/blog.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

exports.getAddBlogPage = async (req, res) => {
    res.render("add-Blog");
};

exports.postAddBlog = async (req, res) => {
    upload.single("image")(req, res, async function (err) {
        if (err) return res.send("Error uploading file: " + err.message);

        const { title, description, author, category } = req.body;
        const image = req.file ? "/uploads/" + req.file.filename : null;

        if (!title || !description || !author || !category || !image) {
            return res.send("All fields are required.");
        }

        try {
            const newBlog = new Blog({ title, description, author, category, image });
            await newBlog.save();
            res.redirect("/blogs/view-blogs");
        } catch (error) {
            res.send("Error adding blog.");
        }
    });
};

exports.getAllBlogsPage = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render("allBlogs", { blogs });
    } catch (error) {
        res.send("Error fetching blogs.");
    }
};

exports.getViewBlogPage = async (req, res) => {
  try {
      const { category } = req.query;

      let filter = {};
      if (category && category !== "All") {
          filter.category = category;
      }

      const blogs = await Blog.find(filter);

      // Pass 'selectedCategory' to the template
      res.render("view-Blog", { blogs, selectedCategory: category });
  } catch (error) {
      res.status(500).send("Error fetching blogs.");
  }
};



exports.getSingleBlogPage = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).send("Blog not found.");
        }
        res.render("singleBlog", { blog }); 
    } catch (error) {
        res.status(500).send("Error fetching blog details.");
    }
};

exports.getEditBlogPage = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        res.render("/blogs/edit-blog", { blog });
    } catch (error) {
        res.send("Error fetching blog for editing.");
    }
};
exports.postEditBlog = async (req, res) => {
    upload.single("image")(req, res, async function (err) {
        if (err) return res.send("Error uploading file: " + err.message);

        const { title, description, author, category } = req.body;

        try {
            const blog = await Blog.findById(req.params.id);
            if (!blog) return res.send("Blog not found.");

            let updateData = { title, description, author, category };

            if (req.file) {
                if (blog.image && blog.image !== "/uploads") {
                    const oldImagePath = path.join(__dirname, "..", blog.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                updateData.image = "/uploads/" + req.file.filename;
            }

            await Blog.findByIdAndUpdate(req.params.id, updateData);
            res.redirect("/blogs/all-blogs");
        } catch (error) {
            res.send("Error updating blog.");
        }
    });
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog.image && blog.image !== "/uploads") {
        const imagePath = path.join(__dirname, "..", blog.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    await Blog.findByIdAndDelete(req.params.id);
} catch (error) {
    res.redirect("/");
}
};