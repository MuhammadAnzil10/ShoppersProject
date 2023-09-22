

const couponBtn = document.querySelector('.couponBtn').addEventListener('click',displayCoupon)


async function displayCoupon(event){

    event.preventDefault()

   const response = await fetch('/coupons',{
        method:'get',
        headers:{
            'Content-Type':'application/json'
        },
       
    })

    const data = await response.json()

     const couponsHtml = data.map((coupon)=>
        
`
<div class="container mt-5">
  <div class="d-flex justify-content-center row">
    <div class="col-md-4" style="width:484px">
      <div class="coupon p-3 " style="background-color: rgb(81 182 102);">
        <div class="row no-gutters">
          <div class="col-md-4 border-right">
            <div class="d-flex flex-column align-items-center">
            <i class="fa fa-gift" aria-hidden="true"></i><span class="d-block"
                >${coupon.couponDescription}</span
              ><span class="text-black-50">Max Discount :${coupon.maxDiscountAmount} </span>
            </div>
          </div>
          <div class="col-md-8">
            <div>
              <div class="d-flex flex-row justify-content-end off">
                <h1>${coupon.discountPercentage}%</h1>
                <span>OFF</span>
              </div>
              <div class="d-flex flex-row justify-content-between off px-3 p-2">
                <span>Promo code:</span
                ><span class="border border-success px-3 rounded code couponCode"
                  >${coupon.couponCode}</span
                >
              </div>
              <div class=""> off on orders above :
                <h1>${coupon.minOrderValue}</h1>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`

     ).join('')


     swal.fire({
        title:'Coupons',
        html:couponsHtml,
        icon:'info',
        confirmButtonText:'Close',
        width:'auto',
        height:'auto',
        
     })


}