

passwordChangeBtn.addEventListener('click',(e)=>{
    e.preventDefault()

    

const passwordChangeBtn = document.getElementById('passwordChangeBtn')
const oldPassword = document.getElementById('oldPassword').value
const newPassword2 = document.getElementById('newPassword2').value
const newPassword = document.getElementById('newPassword1').value
    
const oldPasswordErr = document.getElementById('oldPasswordErr')
const newPassword1Err = document.getElementById('newPassword1Err')
const newPassword2Err = document.getElementById('newPassword2Err')

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    
    if(oldPassword.trim() === ''){
      
      oldPasswordErr.innerHTML='Enter Valid Password'
        return
    }else{
        oldPasswordErr.innerHTML=''
    }

    if(newPassword === '')
    {
        newPassword1Err.innerHTML="Password must be at least 8 characters long and include uppercase letters, lowercase letters, digits, and special characters."
        return
    }
    else if(!passwordRegex.test(newPassword)){

        newPassword1Err.innerHTML="Password must be at least 8 characters long and include uppercase letters, lowercase letters, digits, and special characters."
        return
    }
    else{
        newPassword1Err.innerHTML=''
    }

    if(newPassword.trim() !== newPassword2.trim()){
        newPassword2Err.innerHTML='Password not match'
        return
    }
    else{
        newPassword2Err.innerHTML=''
    }

  
    

   const userId = document.getElementById('userId').value
   
   
       fetch('/change-password',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            userId,
            oldPassword,
            newPassword

        })
    }).then((response)=>response.json()).then((data)=>{
        if(data.success){
           
            Swal.fire({
                icon: 'success',
                title: 'Password Saved',
                text: 'Your password has been saved successfully.',
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  location.reload()
                }
              });

            
        }else if(!data.success){
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'The passwords you entered do not match with your old password.',
                
              })
        }
    })

    

})