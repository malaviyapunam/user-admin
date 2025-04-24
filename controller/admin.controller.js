const Admin = require("../models/admin.model");
const path = require("path");
const fs = require("fs");

exports.addAdminPage = async (req, res) => {
    return res.render("add_admin")
};

exports.viewAllAdminPage = async (req, res) => {

    let admins = await Admin.find({});
    return res.render("view_all_admin", { admins});
};

exports.addNewAdmin = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      req.body.image = imagePath;
    }

    let admin = await Admin.create(req.body);
    req.flash("success", 'New Admin Added Success');
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

exports.editAdminPage = async (req, res) => {
  try {
    let admin = await Admin.findById(req.params.id);
    if (admin) {
      return res.render("edit_admin", { admin });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    let admin = await Admin.findById(req.params.id);
    if (admin) {
      if (req.file) {
        let imagePath = "";
        if (admin.image !== "") {
          imagePath = path.join(__dirname, "..", admin.image);
          try {
            await fs.unlinkSync(imagePath);
          } catch (error) {
            console.log("Image Not Found...");
          }
        }
        imagePath = `/uploads/${req.file.filename}`;
        req.body.image = imagePath;
      }

      let updateAdmin = await Admin.findByIdAndUpdate(admin._id, req.body, {
        new: true,
      });
      if (updateAdmin) {
        req.flash("success", "Update Admin Success");
        return res.redirect("/admin/view-admins");
      } else {
        req.flash("error", "Somthing Wrong");
        return res.redirect("back");
      }
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.log(error);
  }
};
