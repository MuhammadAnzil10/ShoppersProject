
const addBannerForm = document.getElementById('addBannerForm')

console.log(addBannerForm);

addBannerForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const addBannerName = document.getElementById('addBannerName')
    const addBannerDescription = document.getElementById('addBannerDescription')
    const addBannerImage =document.getElementById('addBannerImage')

    const errAddBannerName = document.getElementById('errAddBannerName')
    const erraddBannerDescription = document.getElementById('erraddBannerDescription')


    if(addBannerName.value.trim()===''){

        errAddBannerName.innerHTML='Enter valid banner name'
        return
    }
    else{
        errAddBannerName.innerHTML=''

    }

    if(addBannerDescription.value.trim()===''){

        erraddBannerDescription.innerHTML='Enter Decription'
        return
    }
    else{
        erraddBannerDescription.innerHTML=''
    }

    const image = addBannerImage.files[0]

    if(image){
        const allowedTypes =['image/jpeg','image/png','image/gif']
        
    if(!allowedTypes.includes(image.type))
    {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid image format. Please upload a JPG,PNG or GIF!',
            
          })
        
        return
    }

    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'add Image',
        })
        return
    }

    addBannerForm.submit()
})




const bannerForm = document.getElementById('editBannerForm')

bannerForm.addEventListener('submit',(e)=>{

    e.preventDefault()

    const bannerName = document.getElementById('bannerName')
    const bannerDescription = document.getElementById('bannerDescription')

    if(bannerName.value.trim() ==='')
    {
        bannerName.setCustomValidity('Please enter valid name')
        return
    }else{
        bannerName.setCustomValidity('')
    }

    if(bannerDescription.value.trim() ==='')
    {
        bannerDescription.setCustomValidity('Please enter valid Description')
        return
    }else{
        bannerName.setCustomValidity('')
    }


    bannerForm.submit()

})



