
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



