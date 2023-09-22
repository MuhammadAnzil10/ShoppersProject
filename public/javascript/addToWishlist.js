
const addToWishlistBtn = document.querySelectorAll('[id="addToWishlistBtn"]')

function changeColor(){
   
    addToWishlistBtn.forEach((button)=>{
        const productId = button.getAttribute('data-product-id')
        const isClicked = localStorage.getItem(`wishlistButtonClicked_${productId}`)

        if(isClicked === 'true'){
            button.style.backgroundColor = 'red';

        }else{
            button.style.backgroundColor='white'
        }
    })
}
changeColor()
addToWishlistBtn.forEach((button)=>{

    

    button.addEventListener('click',addToWish)

    function addToWish(e){
      
            e.preventDefault()
              
            const productId = button.getAttribute('data-product-id')
          
             fetch('/add-to-wishlist',{
                method:'post',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    productId
                })
                
             }).then((response)=>response.json()).then((data)=>{
                if(data){
                    Swal.fire({
                        icon: 'success', // Success icon
                        title: data.message,
                        showConfirmButton: false, // Remove the "OK" button
                        timer: 1500, // Auto close after 1.5 seconds (adjust as needed)
                      });
    
                      if(data.added){
                        button.style.backgroundColor='red'
                        localStorage.setItem(`wishlistButtonClicked_${productId}`,'true')
                    }
                      if(data.removed){
                        button.style.backgroundColor='white'
                        localStorage.removeItem(`wishlistButtonClicked_${productId}`)
                    }
                      
                }
            })
    
        
    }
})


