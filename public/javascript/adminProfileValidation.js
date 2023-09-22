

const adminProfileEditForm = document.getElementById('adminProfileEditForm')

adminProfileEditForm.addEventListener('submit',(e)=>{

    e.preventDefault()

    const editAdminName = document.getElementById('editAdminName')
    const editAdminEmail = document.getElementById('editAdminEmail')
    const editAdminMobile = document.getElementById('editAdminMobile')

    const editAdminNameErr = document.getElementById('editAdminNameErr')
    const editAdminEmailErr = document.getElementById('editAdminEmailErr')
    const editAdminMobileErr = document.getElementById('editAdminMobileErr')
   
   if(editAdminName.value.trim()===''){
    editAdminNameErr.innerHTML='Enter Valid name'
    return
   }else{
    editAdminNameErr.innerHTML=''
   }
   
   if(editAdminEmail.value.trim()==='')
   {
    editAdminEmailErr.innerHTML='Enter valid email'
    return
   }else{
    editAdminEmailErr.innerHTML=''
   }

   if(editAdminMobile.value.trim()===''){
    editAdminMobileErr.innerHTML='enter valid mobile'
    return
   }else{
    editAdminMobileErr.innerHTML=''
   }

   adminProfileEditForm.submit()

})