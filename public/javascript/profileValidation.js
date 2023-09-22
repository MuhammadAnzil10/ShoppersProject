const profileForm = document.getElementById('profileForm')
profileForm.addEventListener('submit',(event)=>{
   
    event.preventDefault();

    const nameInput = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address1 = document.getElementById('address1').value.trim()
    const address2 = document.getElementById('address2').value.trim()
    const postcode = document.getElementById('postcode').value.trim()
    const area = document.getElementById('area').value.trim()
    const country = document.getElementById('country').value.trim()
    const state = document.getElementById('state').value.trim()

    const regexName = /^[a-zA-Z]+$/;
    const mobilePattern = /^[6-9]\d{9}$/;
    const regexPostCode = /^[0-9]{6}$/;

    function alertInput(message){
        Swal.fire({
            icon:"error",
            title:"Invalid Input",
            text:message
        })
    }
    
    if(!nameInput || nameInput.length < 3 ||!regexName.test(nameInput) ){
        
       alertInput('Please enter a valid name with at least 3 characters.')
       return

    }else if(!phone || !mobilePattern.test(phone)){
      alertInput('Please enter a valid Phone Number.')
      return
    }
    else if(!address1 || address1.length < 3){
        
        alertInput('Please enter a valid address line 1')
        return
 
     }else if(!address2 || address2.length < 3){
        
        alertInput('Please enter a valid address line 2')
        return
 
     }else if(!postcode || !regexPostCode.test(postcode)){
        
        alertInput('Please enter a valid Postcode')
        return
 
     }else if(!area || area.length < 3){
        
        alertInput('Please enter a valid area.')
        return
 
     }else if(!country || country.length < 3){
        
        alertInput('Please enter a valid country .')
        return
 
     }else if(!state || state.length < 3){
        
        alertInput('Please enter a valid state.')
        return
 
     }
    
    else{
        profileForm.submit();
    }
    

 
})