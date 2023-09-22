

function signupValidation (event)
{
 
    event.preventDefault()
     
    const nameValid = document.getElementById('nameValid');
    const emailValid = document.getElementById('emailValid');
    const passwordValid = document.getElementById('passwordValid');
    const mobileValid = document.getElementById('mobileValid');



    const nameInput = document.getElementById('name')
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const number = document.getElementById('mobile').value;

     const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    //  const numberRegex = /^\d{10}$/
     const namePattern = /^[A-Za-z\s]+$/
     const mobilePattern = /^[6-9]\d{9}$/;

    if(name.trim()=== '' || name.trim().length < 3 || !namePattern.test(name)){
 
       nameValid.innerHTML='Please enter valid username(only letters allowed)'
        return

    }
    else{
     
        nameValid.innerHTML=''

    }
    
     if(!emailRegex.test(email.trim())){

        emailValid.innerHTML='Please enter valid email'
        return
    }
    else{
        emailValid.innerHTML=''
    }
    if(number === '')
    {
        mobileValid.innerHTML='Please enter valid phone number'
        return
    }
    else if(!mobilePattern.test(number)){
        mobileValid.innerHTML='Please enter valid phone number'
        return 
    }
    else{
        mobileValid.innerHTML=''
    }
    if(password === '')
    {
        passwordValid.innerHTML="Password must be at least 8 characters long and include uppercase letters, lowercase letters, digits, and special characters."
        return
    }
    else if(!passwordRegex.test(password)){

        passwordValid.innerHTML="Password must be at least 8 characters long and include uppercase letters, lowercase letters, digits, and special characters."
        return
    }
    else{
        passwordValid.innerHTML=''
    }
    

      form.submit()
    

}
const form = document.getElementById('signupValidations')
form.addEventListener('submit',signupValidation)