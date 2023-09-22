
const mongoose = require('mongoose')
const Category = require('../models/categoryModel')

const addCategory = async(categoryData)=>{

    return new Promise(async (resolve,reject)=>{

        if(categoryData)
        {
            const categoryNameRegx = new RegExp(`^${categoryData.name}$`,'i')
            const existingCategory = await Category.findOne({name:categoryNameRegx})
         
            if(existingCategory){

                reject('Data already existed')

            }else{
                const category = new Category({

                    name:categoryData.name,
                    description:categoryData.description,
                    percentageDiscount:categoryData.percentageDiscount
                })

                const newCategoryData = await category.save()
                

                return resolve(newCategoryData)

            }
           
        }else{
            console.log("error no categoryData");
        }


    })
 
           
    
 

}

const getCategory = async(categoryId)=>
{
    try{

        const categoryItem =await Category.findById({_id:categoryId})

        return categoryItem

    }
    catch(error)
    {
        console.log(error.message);
    }

}

const updateCategory=async(categoryItem)=>{

    return new Promise( async(resolve, reject)=>{

        const {name,description,category_id,percentageDiscount} = categoryItem
        const category = await Category.findOne({_id:category_id})


            const newRegExName = new RegExp(`^${name}$`,'i')
        const existingCategory = await Category.findOne({name:newRegExName})

        if(existingCategory && existingCategory._id.toString()!==category_id){

           reject()
        }
        else{

            const updatedCategory = await Category.findByIdAndUpdate({_id:category_id},{$set:{

                name:name,
                description:description,
                percentageDiscount:percentageDiscount
    
            }})
             resolve(updatedCategory)

           
        }
       
        


    })
        
      

   
}


module.exports = {
    addCategory,
    getCategory,
    updateCategory
}