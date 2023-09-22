

function loginFormValidation(event){

    event.preventDefault()

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const emailErr= document.getElementById('emailErr');
    const passwordErr = document.getElementById('passwordErr')


    if(email.trim()===''){

        emailErr.innerHTML='Enter Valid Email id'
        return

    }
    else{
        emailErr.innerHTML=''
    }

    if(password === ''){

        passwordErr.innerHTML= "Please Enter Valid Password"
        return
    }
    else{
        passwordErr.innerHTML =""
    }


    loginForm.submit()

    
}

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit',loginFormValidation)
