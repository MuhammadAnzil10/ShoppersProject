const  categoryBlockButtons = document.querySelectorAll('.unlistCategory')


categoryBlockButtons.forEach((button)=>{
    button.addEventListener('click',(e)=>{

        e.preventDefault()
        const categoryId = button.getAttribute('href')
         console.log(categoryId);
         
    Swal.fire({
        title: 'Are you sure?',
        text: "Block User",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm!'
    }).then((result) => {
       
        if (result.isConfirmed) {
        fetch(`/admin/category/block-category?id=${categoryId}`,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then((response)=>response.json()).then((data)=>{
            if(data.success){
                location.href='/admin/category'
            }
        })
    }
})
    })
})
