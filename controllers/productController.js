const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const productHelpers = require("../helpers/productHelpers");
const Product = require("../models/productModel");
const userHelper = require("../helpers/userHelpers");

const loadProduct = async (req, res) => {
  try {
    const productData = await Product.find();
    if (productData) {
     
      res.render("productManagement", { product: productData });
    } else {
      res.render("productManagement");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddProduct = async (req, res) => {
  try {
    const categoryData = await Category.find({ unlist: false });

  

    res.render("addProduct", { category: categoryData });
  } catch (error) {
    console.log(error.message);
  }
};

const addProduct = async (req, res) => {
  try {
    if (req.body) {
      var arrayImage = [];

      for (let i = 0; i < req.files.length; i++) {
        arrayImage[i] = req.files[i].filename;
      }

      let {
        name,
        description,
        regularPrice,
        category,
        stock,
        discountPercentage
      } = req.body;
     const categoryData = await Category.findOne({_id:category})

      const productNameRegex = new RegExp(`^${name}$`,'i')
      const existingProduct = await Product.findOne({name:productNameRegex})
      if(existingProduct){
        const categoryData = await Category.find({ unlist: false });
        return res.render("addProduct",{message:"Item already existed",category:categoryData});
      }
     
      const discountPercentageValue = (discountPercentage / 100) * regularPrice
     let promotionalPrice =Math.round(regularPrice - discountPercentageValue) 

      const newProduct = new Product({
        name: name,
        description: description,
        regularPrice: regularPrice,
        productPrice:promotionalPrice,
        promotionalPrice: promotionalPrice,
        category: category,
        images: arrayImage,
        stock: stock,
        percentageDiscount:discountPercentage

      });

      const addedProductData = await newProduct.save();
     

      res.redirect("/admin/product");
    } else {
      res.render("addProduct");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadEditProduct = async (req, res) => {
  try {
    const productId = req.query.id;

    const productData = await Product.findById({ _id: productId });
    const categoryId = productData.category;


    const defaultCategory = await Category.find({ _id: categoryId });


    const categoryData = await Category.find({ unlist: false });
  
    if (productData) {
      res.render("editProduct", {
        product: productData,
        category: categoryData,
        oldCategory: defaultCategory,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editProduct = async (req, res) => {
  try {
    
    const percentageDiscountValue = (req.body.discountPercentage/100)*req.body.regularPrice
    let promotionalPrice = Math.round(req.body.regularPrice - percentageDiscountValue)

    const product = await Product.findById({_id:req.body.product_id})
    let arrayImage = product.images
   
    if (req.files && req.files.length > 0) {
      if(arrayImage.length < 1){

         arrayImage = [];
      for (let i = 0; i < req.files.length; i++) {
        arrayImage[i] = req.files[i].filename;
      }

      }else{

        for (let i = 0; i < req.files.length; i++) {
          arrayImage[arrayImage.length+i] = req.files[i].filename;
        }
  
        
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: req.body.product_id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            regularPrice: req.body.regularPrice,
            promotionalPrice:promotionalPrice,
            productPrice:promotionalPrice,
            images: arrayImage,
            percentageDiscount:req.body.discountPercentage,
            category: req.body.category,
            stock:req.body.stockQuantity
          },
        }
      );
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: req.body.product_id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            regularPrice: req.body.regularPrice,
            promotionalPrice:promotionalPrice,
            productPrice:promotionalPrice,
            category: req.body.category,
            stock:req.body.stockQuantity,
            percentageDiscount:req.body.discountPercentage,
          },
        }
      );
    }
    res.redirect("/admin/product");
  } catch (error) {
    console.log(error.message);
  }
};
const blockProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    const unlistProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      { $set: { unlist: true } }
    );

    res.json({ success: true });
    // res.redirect('/admin/product')
  } catch (error) {
    res.render('404',{user:req.session.user_id})
  }
};

const unblockProduct = async (req, res) => {
  try {
    let productId = req.query.id;
    const listProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      { $set: { unlist: false } }
    );
    res.json({ success: true });
    // res.redirect('/admin/product')
  } catch (error) {
    res.render('404',{user:req.session.user_id})
  }
};

const loadProductPage = async (req, res) => {
  try {
    const productId = req.query.id;
    const userData = await userHelper.getUser(req.session.user_id);

    productHelpers
      .getOneProduct(productId)
      .then((productData) => {
        res.render("productView", { product: productData, user: userData });
      })
      .catch((error) => {
        console.error(error);
        
      });
  } catch (error) {
    console.log(error.message);
    res.render('404',{user:req.session.user_id})
  }
};

const removeProductImage = async(req,res)=>{
    try{

        const imageName = req.query.img
        const productId = req.query.pId
      
        const product = await Product.findOne({_id:productId})
         
        const imageIndex = product.images.findIndex((image)=>{
             
         return imageName === image
        })
        product.images.splice(imageIndex,1)

        await product.save()

        res.redirect(`/admin/product/edit-product?id=${product._id}`)

        

       
    }
    catch(error){
        console.log(error.message);
        res.render('404',{user:req.session.user_id})
    }
}

module.exports = {
  loadProduct,
  addProduct,
  loadAddProduct,
  loadEditProduct,
  editProduct,
  blockProduct,
  unblockProduct,
  loadProductPage,
  removeProductImage
};
