const couponButton = document
  .querySelector(".couponButton")
  .addEventListener("click", applyCoupon);
const couponCode = document.querySelector(".couponCode");

async function applyCoupon(event) {
  event.preventDefault();
  const subtotalElement = document.querySelector(".cartSubtotal");
  const subTotal = subtotalElement.getAttribute("id");
  const inputeCoupon = couponCode.value;
  const offerValue = document.querySelector(".offerValue");
  const total = document.querySelector('.cartTotals')



  const response = await fetch("/apply-coupon", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subTotal,
      inputeCoupon,
    }),
  });
 
  const data = await response.json();

  if(data.isValidCoupon === false){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please Enter Coupon',
    })
    return
  }
  
  if(data.usage){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Coupon already using',
    })
    

  }
  if (data.discount) {
    offerValue.textContent = data.discount;
  }
  if(data.total){
 total.textContent = data.total
  }
  if(data.count === false){
    
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Coupon Not Available!',
    })

  }
  if(data.minimumOrderValue){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Require Minimum Order Value!',
    })
  }
  if(data.isCouponExpired){

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Coupon Expired!',
    })
  }
}
