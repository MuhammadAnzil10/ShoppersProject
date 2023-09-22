

const listProductButton = document.querySelectorAll('.listProduct')

listProductButton.forEach((button)=>{


 
    button.addEventListener('click',(e)=>{

       e.preventDefault()
      const userId =  button.getAttribute('href')
 
    Swal.fire({
        title: 'Are you sure?',
        text: "Unblock Product",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm!'
    }).then((result) => {
       
        if (result.isConfirmed) {
            fetch(`/admin/product/unblock-product?id=${userId}`,{
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


