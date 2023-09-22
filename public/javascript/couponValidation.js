// coupon add validation

const addCouponForm= document.getElementById('addCouponForm')

addCouponForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const addCouponCode = document.getElementById('addCouponCode')
    const addCouponDescription = document.getElementById('addCouponDescription')
    const addDiscountPercentage = document.getElementById('addDiscountPercentage')
    const addMaximumDiscount = document.getElementById('addMaximumDiscount')
    const addMinimumOrderValue = document.getElementById('addMinimumOrderValue')
    const addValidity = document.getElementById('addValidity')
    const addUsageCount = document.getElementById('addUsageCount')

    const addCouponCodeErr = document.getElementById('addCouponCodeErr')
    const addCouponDescriptionErr = document.getElementById('addCouponDescriptionErr')
    const addDiscountPercentageErr = document.getElementById('addDiscountPercentageErr')
    const addMaximumDiscountErr = document.getElementById('addMaximumDiscountErr')
    const addMinimumOrderValueErr = document.getElementById('addMinimumOrderValueErr')
    const addValidityErr = document.getElementById('addValidityErr')
    const addUsageCountErr = document.getElementById('addUsageCountErr')

    if(addCouponCode.value.trim() === ''){
        addCouponCodeErr.innerHTML="enter valid name"
        return
    }else{
        addCouponCodeErr.innerHTML=''
    }

    if(addCouponDescription.value.trim()===''){
        addCouponDescriptionErr.innerHTML='enter valid description'
        return
    }else{
        addCouponDescriptionErr.innerHTML=''
    }

    if(addDiscountPercentage.value.trim()===''){
        addDiscountPercentageErr.innerHTML='enter value'
        return
    }else{
        addDiscountPercentageErr.innerHTML=''

    }
   
    if(addMaximumDiscount.value.trim()===''){
        addMaximumDiscountErr.innerHTML='Enter Value'
        return
    }else{
        addMaximumDiscountErr.innerHTML=''
    }

    if(addMinimumOrderValue.value.trim()===''){
        addMinimumOrderValueErr.innerHTML='Enter Value'
        return
    }else{
        addMinimumOrderValueErr.innerHTML=''
    }

    if(addValidity.value.trim()===''){
        addValidityErr.innerHTML='Enter Value'
        return
    }else{
        addValidityErr.innerHTML=''
    }

    if(addUsageCount.value.trim()===''){
        addUsageCountErr.innerHTML='Enter Value'
        return
    }else{
        addUsageCountErr.innerHTML=''
    }


    addCouponForm.submit()




    

})













