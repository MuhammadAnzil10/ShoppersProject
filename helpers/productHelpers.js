const mongoose = require('mongoose')
const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')




const add_product = async(productData)=>{    


            try{

          
                var arrayImage = []

                for(let i=0;i< productData.files.length;i++)
                {
                    arrayImage[i]=productData.files[i].filename
                }
                
                const {name,description,regularPrice,promotionalPrice,category} = productData

                const newProduct = new Product({

                    name:name,
                    description:description,
                    regularPrice:regularPrice,
                    promotionalPrice:promotionalPrice,
                    category:category,
                    images:arrayImage
                    
                })

                const addedProductData = await newProduct.save()

                return addedProductData


            }
            catch(error)
            {
                console.log(error.message);
            }
}

   const getAllProduct = async ()=>{

            return new Promise(async (resolve,reject)=>{
                const allProduct = await Product.find()

               
            })


   }
  
  const  getOneProduct = async (productId)=>{

        return new Promise(async(resolve,reject)=>{

            const productData = await Product.findOne({_id:productId})

            if(productData){
                resolve(productData)
            }else{
                reject("No Data")
            }
        })
  }
   

const productOffer =()=>{
   
    return new Promise(async(resolve,reject)=>{
        const categories = await Category.find()
       
       let totalPercentageDiscount;
       let promoPrice;
       for(let i=0;i<categories.length;i++){
          const products=await Product.find({category:categories[i]._id})
          
          for(let product of products){
           
            totalPercentageDiscount=categories[i].percentageDiscount + product.percentageDiscount
            promoPrice= Math.round((totalPercentageDiscount/100)*product.regularPrice)
            
            product.promotionalPrice = product.regularPrice - promoPrice
            
            await product.save()
        
          }
          
        

       }
      
    })  
  

}






module.exports ={

    add_product,
    getAllProduct,
    getOneProduct,
    productOffer

}