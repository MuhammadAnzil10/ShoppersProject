const mongoose = require("mongoose");
const Coupon = require("../models/couponModel");

const loadCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find({ activeCoupon: true });

    res.render("couponsManage", { coupons });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadAddCoupon = async (req, res) => {
  try {
    res.render("addCoupon");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const addCoupon = async (req, res) => {
  try {
    const {
      couponCode,
      couponDescription,
      discountPercentage,
      maximumDiscount,
      minimumOrderValue,
      validity,
      usageCount,
    } = req.body;

    const couponNameRegx = new RegExp(`^${couponCode}$`, "i");
    
    const existingCoupon = await Coupon.findOne({ couponCode: couponNameRegx });

    if (existingCoupon) {
      res.render("addCoupon", { error: "Coupon already existed" });
    } else {
      let coupon = new Coupon({
        couponCode: couponCode,
        couponDescription: couponDescription,
        discountPercentage: discountPercentage,
        maxDiscountAmount: maximumDiscount,
        minOrderValue: minimumOrderValue,
        validFor: validity,
        usageCount: usageCount,
        createdOn: new Date(),
      });

      coupon.save();

      res.render("addCoupon", { message: "Coupon added successfully" });
    }
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const activateCoupon = async (req, res) => {
  try {
    const couponId = req.query.id;

    const activatedCoupon = await Coupon.findOneAndUpdate(
      { _id: couponId },
      { activeCoupon: true }
    );

    res.redirect("/admin/inactive-coupons");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const deactiveCoupon = async (req, res) => {
  try {
    const couponId = req.query.id;

    const activatedCoupon = await Coupon.findOneAndUpdate(
      { _id: couponId },
      { activeCoupon: false }
    );

    res.redirect("/admin/coupon-manage");
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadInactiveCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find({ activeCoupon: false });
    res.render("couponInactiveList", { coupons });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const loadCouponEdit = async (req, res) => {
  try {
    const couponId = req.query.id;
    const coupon = await Coupon.findOne({ _id: couponId });
    res.render("editCoupon", { coupon });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const couponEdit = async (req, res) => {
  try {
    const coupon_id = req.query.id;
    const {
      couponCode,
      couponDescription,
      discountPercentage,
      maximumDiscount,
      minimumOrderValue,
      validity,
      usageCount,
    } = req.body;

    // const couponRegex = new RegExp(`^${couponCode}$`, "i");
    // const existedCoupon = await Coupon.findOne({ couponCode:couponCode });
    // console.log(existedCoupon);
    // if (existedCoupon) {
    //   res.render("editCoupon", {
    //     coupon: existedCoupon,
    //     error: "Coupon Already Existing",
    //   });
    // } else {
      const editedCoupon = await Coupon.findOneAndUpdate(
        { _id: coupon_id },
        {
          $set: {
            couponCode: couponCode,
            couponDescription: couponDescription,
            discountPercentage: discountPercentage,
            maxDiscountAmount: maximumDiscount,
            minOrderValue: minimumOrderValue,
            validFor: validity,
            usageCount: usageCount,
          },
        }
      );

      res.redirect("/admin/coupon-manage");
    
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

module.exports = {
  loadCoupon,
  loadAddCoupon,
  addCoupon,
  activateCoupon,
  deactiveCoupon,
  loadInactiveCoupon,
  loadCouponEdit,
  couponEdit,
};
