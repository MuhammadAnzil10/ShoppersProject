
const removeButtons = document.querySelectorAll('.remove-btn')


removeButtons.forEach((removeButton) => {
     
    // cartItemId = removeButton.getAttribute('id')
    
   
   

    removeButton.addEventListener('click',handleCartItemRemoval)

});

function handleCartItemRemoval(event){
   
    
    event.preventDefault();
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            
    const removeButton = event.target;
    const cartItemId = removeButton.getAttribute('id');
    const cartItemRow = removeButton.closest('.product-container');
    const quantity = cartItemRow.querySelector('.quantity-amount').value
    const offerValue = document.getElementById('offerCoupon')
  
    
    
    
    fetch('/removeCartItem',{

        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            cartItemId,
            quantity,
          })
    }).then((response)=> response.json())
    .then((data)=>{
        if(data.success){
           cartItemRow.remove()
            const cartSubtotal = document.querySelector('.cartSubtotal')
            const cartTotal = document.querySelector('.cartTotals')
            cartTotal.textContent = data.totalAmount
            cartSubtotal.textContent = data.subTotal
            offerValue.textContent=data.discountValue;
        }
        if(data.productLength < 1){
            setTimeout(()=>{
                location.reload()
            },1000)
            
        }
        else{
            console.error("Error removing cart item");
        }
    }).catch((error)=>{
        console.log("error removing item",error);
    })
    
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success',
           
          )
        }
      })
   
   
    

}