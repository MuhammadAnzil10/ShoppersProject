


const productToCart = document.getElementById('productToCart')
const productId = document.getElementById('productid').value

const productPrice = document.getElementById('productPrice').value


productToCart.addEventListener("click",updateCart)


function updateCart(event){

    event.preventDefault()


    
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


    function addToCart(productId,productPrice)
    {
     
        fetch('/add-to-cart',{

            method:'post',
            headers:{
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({

                productId,
                quantity:1,
                price:productPrice,
             

            })
        }).then((response)=>response.json()).then((data)=>{
            if(data){
              Swal.fire({
                title: 'Added to Cart!',
                text: 'The item has been added to your cart.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
              });

            }
            else{
              setTimeout(()=>{
                location.reload()
              },2000)

                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Out of stock',
              });
            
             

            }
        }).catch((err)=>{
            console.error(err);
        })

        

    
    }

}