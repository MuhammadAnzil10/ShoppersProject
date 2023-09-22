
// coupon edit validation
const editCouponForm= document.getElementById('editCouponForm')

editCouponForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const editCouponCode = document.getElementById('editCouponCode')
    const editCouponDescription = document.getElementById('editCouponDescription')
    const editDiscountPercentage = document.getElementById('editDiscountPercentage')
    const editMaximumDiscount = document.getElementById('editMaximumDiscount')
    const editMinimumOrderValue = document.getElementById('editMinimumOrderValue')
    const editValidity = document.getElementById('editValidity')
    const editUsageCount = document.getElementById('editUsageCount')

    const editCouponCodeErr = document.getElementById('editCouponCodeErr')
    const editCouponDescriptionErr = document.getElementById('editCouponDescriptionErr')
    const editDiscountPercentageErr = document.getElementById('editDiscountPercentageErr')
    const editMaximumDiscountErr = document.getElementById('editMaximumDiscountErr')
    const editMinimumOrderValueErr = document.getElementById('editMinimumOrderValueErr')
    const editValidityErr = document.getElementById('editValidityErr')
    const editUsageCountErr = document.getElementById('editUsageCountErr')

    if(editCouponCode.value.trim() === ''){
        editCouponCodeErr.innerHTML="enter valid name"
        return
    }else{
        editCouponCodeErr.innerHTML=''
    }

    if(editCouponDescription.value.trim()===''){
        editCouponDescriptionErr.innerHTML='enter valid description'
        return
    }else{
        editCouponDescriptionErr.innerHTML=''
    }

    if(editDiscountPercentage.value.trim()===''){
        editDiscountPercentageErr.innerHTML='enter value'
        return
    }else{
        editDiscountPercentageErr.innerHTML=''

    }
   
    if(editMaximumDiscount.value.trim()===''){
        editMaximumDiscountErr.innerHTML='Enter Value'
        return
    }else{
        editMaximumDiscountErr.innerHTML=''
    }

    if(editMinimumOrderValue.value.trim()===''){
        editMinimumOrderValueErr.innerHTML='Enter Value'
        return
    }else{
        editMinimumOrderValueErr.innerHTML=''
    }

    if(editValidity.value.trim()===''){
        editValidityErr.innerHTML='Enter Value'
        return
    }else{
        editValidityErr.innerHTML=''
    }

    if(editUsageCount.value.trim()===''){
        editUsageCountErr.innerHTML='Enter Value'
        return
    }else{
        editUsageCountErr.innerHTML=''
    }


editCouponForm.submit()




    

})