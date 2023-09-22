


const firstName = document.getElementById('fname')
const lastName = document.getElementById('lastName')
const email = document.getElementById('email')
const message = document.getElementById('message')

const contactMsgForm = document.getElementById('contactMsgForm')
contactMsgForm.addEventListener('submit',(e)=>{

    e.preventDefault()
    const firstName = document.getElementById('fname').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('email').value
    const message = document.getElementById('message').value

    const fNameErr = document.getElementById('fNameErr')
    const lNameErr = document.getElementById('lNameErr')
    const emailErr = document.getElementById('emailErr')
    const messageErr = document.getElementById('messageErr')
    const regEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if(firstName.trim() === '' ||firstName.trim().length < 3){
      
        fNameErr.innerHTML='Enter Valid name'
        return
    }else{
        fNameErr.innerHTML=''
    }
    if(lastName.trim() === '')
    {
        lNameErr.innerHTML='Enter Valid name'
        return
    }else{
        lNameErr.innerHTML=''
    }
    if(!regEmail.test(email.trim())){
        emailErr.innerHTML='Enter Valid email'
        return
    }else{
        emailErr.innerHTML=''
      
    }
    if(message.trim() === ''|| message.trim().length < 10){
        messageErr.innerHTML='Enter Valid message'
        return
    }else{
        messageErr.innerHTML=''
    }

    fetch('/contact',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            firstName,
            lastName,
            email,
            message
        })
    }).then((response)=>response.json()).then((data)=>{
        
      
        
        if(data.success){

           

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                showConfirmButton: false
            });
          setTimeout(()=>{

            location.href='/contact'
          },2000)
        }
    })
})