// category edit validation

const editCategoryForm = document.getElementById('editCategoryForm')

editCategoryForm.addEventListener('submit',editCategoryValidation)


function editCategoryValidation(event){

    event.preventDefault()
    
const editCategoryName = document.getElementById('editCategoryName')

const editCategoryDescription = document.getElementById('editCategoryDescription')
const editCategoryNameErr = document.getElementById('editCategoryNameErr')
const editCategoryDescriptionErr = document.getElementById('editCategoryDescriptionErr')


    if(editCategoryName.value.trim()==='')
    {
    
        editCategoryNameErr.innerHTML="Enter Valid Name"
        return 
    }
    else{
        editCategoryNameErr.innerHTML=''

    }
     if(editCategoryDescription.value.trim() === ''){
        editCategoryDescriptionErr.innerHTML="Enter Valid Description"
        return 
    }
    else{
        editCategoryDescriptionErr.innerHTML=''
    }

    document.getElementById('editCategoryForm').submit()



}









// category add validation

const names = document.getElementById('name')
const description = document.getElementById('description')
const errName = document.getElementById('errName')
const errDescription = document.getElementById('errDescription')

const form = document.getElementById('categoryForm')

form.addEventListener('submit',validation)

function validation(event){

    event.preventDefault()


    if(names.value.trim()==='')
    {
    
        errName.innerHTML="Enter Valid Name"
        return 
    }
    else{
        errName.innerHTML=''

    }
     if(description.value.trim() === '' || description.value.trim().length < 3){
        errDescription.innerHTML="Enter Valid Description"
        return 
    }
    else{
        errDescription.innerHTML=''
    }

    form.submit()



}