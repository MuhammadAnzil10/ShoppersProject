

const couponRemove = document.querySelector('.removeCouponBtn')

couponRemove.addEventListener('click',removeCouponOffer)

async function removeCouponOffer(event){

    event.preventDefault()

    const cartTotal = document.querySelector('.cartTotals')
    const offerValue = document.querySelector('.offerValue')
    const cartTotalValue = cartTotal.getAttribute('id')
 
   const response= await fetch('/remove-coupon',{

        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            cartTotalValue
        })
    })

    const data = await response.json()

    console.log(data);
    if(data){
        cartTotal.textContent=data.cartCoupon.totalAmount
        offerValue.textContent=data.cartCoupon.discountValue
       }
    if(data.noCouponApplied){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please Apply coupon ',
          })
         
          
    }
  

}