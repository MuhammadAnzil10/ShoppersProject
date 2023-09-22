
var wishlistStstus = 'false';
document.addEventListener('DOMContentLoaded', () => {
    const addToCartLinks = document.querySelectorAll('[id="addToCart"]');

    // const rowWishlist = document.querySelectorAll('[id="rowWishlist"]')
    // rowWishlist.forEach((row)=>{
    //   console.log(row.getAttribute('data-productId'));
    // })
    
   

    
   
      

    addToCartLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default behavior of the anchor tag (e.g., navigating to a URL) 
            const productId = link.getAttribute('data-product-id');
            const productPrice = link.getAttribute('data-product-price')
           
             wishlistStstus = link.getAttribute('data-wishlist-status')
        if(!wishlistStstus){
          wishlistStstus='false'
        }
       
           
            
      
     
        // Show SweetAlert popup
        Swal.fire({
          title: 'Add to Cart',
          text: 'Are you sure you want to add this item to your cart?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
        }).then((result) => {
          // If user clicks "Yes," perform the cart addition logic
          if (result.isConfirmed) {
            
            addToCart(productId,productPrice);
            
          }
        });
      });
    });

  
    // Function to add the item to the cart
    function addToCart(productId,productPrice) {
     
       fetch('/add-to-cart',{
        method:'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify({
          productId:productId,
          quantity:1,
          price:productPrice,
          wishlistStstus
        })
       }).then(response=>response.json())
       .then(data=>{
        if(data.success){
          Swal.fire({
            title: 'Added to Cart!',
            text: 'The item has been added to your cart.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Out of stock',
           
          })
        }
        if(data.productId){
          if(wishlistStstus ==='true'){
            const rowWishlist = document.querySelectorAll('[id="rowWishlist"]')
            rowWishlist.forEach((row)=>{
             let wishlistProductId = row.getAttribute('data-productId')
             if(wishlistProductId === data.productId)
             {
              fetch('/add-to-wishlist',{
                method:'post',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    productId:data.productId
                })
                
             }).then((response)=>response.json()).then((data)=>{
              if(data.removed){
                localStorage.removeItem(`wishlistButtonClicked_${data.productId}`)
            }
             })
               row.remove()
  
             }
            })
            
          }
        }
       

       })
       .catch(error=>console.error(error))
      // Add your cart addition logic here
      // For example, make an AJAX request to your server to add the item to the cart
      // After the item is successfully added, you can show another SweetAlert to confirm the addition
     
    }
  });
  