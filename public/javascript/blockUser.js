

const blockUserButtons = document.querySelectorAll('.blockUser')

blockUserButtons.forEach((button)=>{


 
    button.addEventListener('click',(e)=>{

       e.preventDefault()
      const userId =  button.getAttribute('href')
 
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
            fetch(`/admin/block-user?id=${userId}`,{
                method:'get',
                headers:{
                    'Content-Type':'application/json'
                }
              }).then((response)=>response.json()).then((data)=>{
                if(data.success){
                    location.href='/admin/user-management'
                }
              })
        
        }
    });
});

      
     
        
    
   
})


