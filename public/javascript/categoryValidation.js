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








