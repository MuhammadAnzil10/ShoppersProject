

function loginFormValidation(event){

  event.preventDefault()


  const password1 = document.getElementById('password1').value;
  const password2 = document.getElementById('password2').value;

  const passwordErr1= document.getElementById('passwordErr1');
  const passwordErr2 = document.getElementById('passwordErr2')
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


  if(password1.trim()==='' || !passwordRegex.test(password1)){

      passwordErr1.innerHTML='Enter Valid Password'
      return

  }
  else{
    passwordErr1.innerHTML=''
  }

  if(password2 === ''){

    passwordErr2.innerHTML= "Please Enter Valid Password"
      return
  }
  else{
    passwordErr2.innerHTML =""
  }
  if(password1 !== password2){

    passwordErr2.innerHTML="Password not match"
    return 
      
  }
  else{
    passwordErr2.innerHTML=""
  }


  forgetForms.submit()

  
}

const forgetForms = document.getElementById('forgetForms');

forgetForms.addEventListener('submit',loginFormValidation)
