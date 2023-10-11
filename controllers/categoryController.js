const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const categoryHelper = require("../helpers/categoryHelper");

const getCategory = async (req, res) => {
  try {
    const adminId = req.session.admin_id;

    const categoryData = await Category.find();

    res.render("categoryManagement", { category: categoryData });
  } catch (error) {
    console.log(error.message);
    res.render("404", { user: req.session.user_id });
  }
};

const addCategoryLoad = async (req, res) => {
  try {
    res.render("addCategory");
  } catch (error) {
    console.log(error.message);
    res.render("404", { user: req.session.user_id });
  }
};

const addCategory = async (req, res) => {
  try {
    if (req.body) {
      await categoryHelper
        .addCategory(req.body)
        .then((data) => {
          res.redirect("/admin/category");
        })
        .catch((err) => {
          res.render("addCategory", { message: "Item Already Existed" });
        });
    } else {
      res.render("addCategory");
    }
  } catch (error) {
    console.log(error.message);
    res.render("404", { user: req.session.user_id });
  }
};

const categoryEditLoad = async (req, res) => {
  try {
    const categoryId = req.query.id;

    const categoryItem = await categoryHelper.getCategory(categoryId);

    res.render("categoryEdit", { category: categoryItem });
  } catch (error) {
    console.log(error.message);
    res.render("404", { user: req.session.user_id });
  }
};

const categoryEdit = async (req, res) => {
  try {
    if (req.body) {
      const category = await Category.findOne({ _id: req.body.category_id });
      categoryHelper
        .updateCategory(req.body)
        .then((data) => {
          res.redirect("/admin/category");
        })
        .catch((error) => {
          res.render("categoryEdit", {
            category,
            message: "Category already existing",
          });
        });
    } else {
      res.render("categoryEdit");
    }
  } catch (error) {
    console.log(error.message);
    res.render("404", { user: req.session.user_id });
  }
};

const blockCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;

    const blockedCategory = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { $set: { unlist: true } }
    );

    res.json({ success: true });
    // res.redirect('/admin/category')
  } catch (error) {
    console.log(error.message);
    res.render("404", { user: req.session.user_id });
  }
};

const unblockCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;

    const unblockedCategory = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { $set: { unlist: false } }
    );
    // res.redirect('/admin/category')

    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.render("404", { user: req.session.user_id });
  }
};

module.exports = {
  getCategory,
  addCategoryLoad,
  addCategory,
  categoryEditLoad,
  categoryEdit,
  blockCategory,
  unblockCategory,
};
