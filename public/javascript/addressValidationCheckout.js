

const addressSaveForm = document.getElementById('addressSaveForm')


addressSaveForm.addEventListener('submit',(e)=>{

    e.preventDefault()

    const addressName = document.getElementById('addressName').value
    const addressNumber = document.getElementById('addressNumber').value
    const addressLine1 = document.getElementById('addressLine1').value
    const addressLine2 = document.getElementById('addressLine2').value
    const addressPostcode = document.getElementById('addressPostcode').value
    const addressArea = document.getElementById('addressArea').value
    const addressCountry = document.getElementById('addressCountry').value
    const addressState = document.getElementById('addressState').value
    const regex = /^[a-zA-Z]+$/;
    const mobilePattern = /^[6-9]\d{9}$/;
    const regexPostCode = /^[0-9]{6}$/;
    const nameError = document.getElementById('nameError')
    const address1Error = document.getElementById('address1Error')
    const address2Error = document.getElementById('address2Error')
    const postcodeError = document.getElementById('postcodeError')
    const areaError = document.getElementById('areaError')
    const countryError = document.getElementById('countryError')
    const stateError = document.getElementById('stateError')
    const numberError = document.getElementById('numberError')


    if(!regex.test(addressName) || addressName.trim() === ''){
        nameError.innerHTML="Please enter valid name (Only letters are allowed.)"
        return
    }else{
        nameError.innerHTML=''
    }

    if(addressNumber.trim()==='' || !mobilePattern.test(addressNumber.trim())){
        numberError.innerHTML='Enter Valid Phone Number'
        return
    }else{
        numberError.innerHTML=''
    }

    if(addressLine1.trim()===''||addressLine1.trim().length < 3){
        address1Error.innerHTML='Enter Valid address'
        return
    }
    else{
        address1Error.innerHTML=''
    }
    if(addressLine2.trim()==='' || addressLine2.trim().length < 3){
        address2Error.innerHTML='Enter Valid address'
        return
    }else{
        address2Error.innerHTML=''
    }

    if(addressPostcode.trim()==='' ||  !regexPostCode.test(addressPostcode.trim())){
        postcodeError.innerHTML='Enter Valid Post Code'
        return
    }else{
        postcodeError.innerHTML=''
    }

    if(addressArea.trim()==='' ||  addressArea.trim().length < 3){
        areaError.innerHTML='Enter Valid Area name'
        return
    }else{
        areaError.innerHTML=''
    }

    if(addressCountry.trim()==='' ||  addressCountry.trim().length < 3){
        countryError.innerHTML='Enter Valid Country name'
        return
    }else{
        countryError.innerHTML=''
    }

    if(addressState.trim()==='' ||  addressState.trim().length < 3){
        stateError.innerHTML='Enter Valid State name'
        return
    }else{
        stateError.innerHTML=''
    }



addressSaveForm.submit()
     
    
})