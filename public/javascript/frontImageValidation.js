
document.getElementById('imageForm').addEventListener('submit',(event)=>{

    event.preventDefault()

    const imageInput = document.getElementById('imageInput')
    
    const file = imageInput.files[0]

   

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

