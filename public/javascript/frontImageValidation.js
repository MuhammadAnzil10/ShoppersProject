
document.getElementById('imageForm').addEventListener('submit',(event)=>{

    event.preventDefault()

    const imageInput = document.getElementById('imageInput')
    const profileName = document.getElementById('profileName')
    const profileEmail = document.getElementById('profileEmail')
    const profileMobile = document.getElementById('profileMobile')
    
    const regexName = /^[a-zA-Z]+$/;
    const mobilePattern = /^[6-9]\d{9}$/;
    const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const file = imageInput.files[0]


    if(profileName.value.trim()==='' || !regexName.test(profileName.value.trim())){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Enter valid name',
        
      })
    
    return
    }else if(profileEmail.value.trim()==='' || !emailRegex.test(profileEmail.value.trim())){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Enter valid email',
        
      })
    
    return
    }else if(profileMobile.value.trim()==='' || !mobilePattern.test(profileMobile.value.trim())){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please Enter valid mobile',
        
      })
    
    return
    }
    
   



    if(!file){

      document.getElementById('imageForm').submit()
   
        return
    }
    const allowedTypes =['image/jpeg','image/png','image/gif']

    if(!allowedTypes.includes(file.type))
    {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid image format. Please upload a JPG,PNG or GIF!',
            
          })
        
        return
    }
    let maxSize = 5 * 1024 * 1024

    if(file.size > maxSize){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'maximum size exeeded',
            
          })
        
        
        return
    }

    document.getElementById('imageForm').submit()

    


})

