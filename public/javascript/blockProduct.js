

const blockUserButtons = document.querySelectorAll('.unlistProductButton')

blockUserButtons.forEach((button)=>{


 
    button.addEventListener('click',(e)=>{

       e.preventDefault()
      const userId =  button.getAttribute('href')
 
    Swal.fire({
        title: 'Are you sure?',
        text: "Block Product",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm!'
    }).then((result) => {
       
        if (result.isConfirmed) {
            fetch(`/admin/product/block-product?id=${userId}`,{
                method:'get',
                headers:{
                    'Content-Type':'application/json'
                }
              }).then((response)=>response.json()).then((data)=>{
                if(data.success){
                    location.href='/admin/product'
                }
              })
        
        }
    });
});

      
     
        
    
   
})


