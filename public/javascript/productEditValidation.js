

const productEditForm = document
  .querySelector('[id="productEditForm"]')
  .addEventListener("submit", (e) => {
    e.preventDefault();

    
const ProductNameErr = document.getElementById('ProductNameErr')
const ProductDescriptionErr = document.getElementById('ProductDescriptionErr')
const ProductRegularPriceErr = document.getElementById('ProductRegularPriceErr')

const ProductStockQuantityErr = document.getElementById('ProductStockQuantityErr')


    const productName = document.getElementById("product_name");
    const description = document.getElementById("description");
    const regularPrice = document.getElementById("regularPrice");
   
    const stockQuantity = document.getElementById("stockQuantity");
    const images = document.getElementById("imagesProduct");
    let imageAllowedTypes = ["image/jpeg", "image/png", "image/gif"];
    let maxSizeInBytes = 5 * 1024 * 1024;
   
   
    if(productName.value.trim() ===''){
     
        ProductNameErr.innerHTML = 'Please Enter Product Name'
        return
    }else{
    
        ProductNameErr.innerHTML=''
    }
    if(description.value.trim()===''){

        ProductDescriptionErr.innerHTML='Please Fill '
        return
    }
    else{
        ProductDescriptionErr.innerHTML=''

    }
    if(regularPrice.value.trim()===''){

        ProductRegularPriceErr.innerHTML='Enter Price'
        return

    }else{
        ProductRegularPriceErr.innerHTML=''
    }
    if(images && images.files){

      let imagesArray = images.files;
    for (let i = 0; i < imagesArray.length; i++) {
      if (!imageAllowedTypes.includes(imagesArray[i].type)) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid image format. Please upload a JPG,PNG or GIF!",
        });

        return;
      }
      if (imagesArray[i].size > maxSizeInBytes) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "maximum size exeeded",
        });

        return;
      }
    }
    }

    document
    .querySelector('[id="productEditForm"]').submit()
     
     



  });
