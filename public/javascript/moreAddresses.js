

const moreAddresses = document.getElementById('moreAddresses')

moreAddresses.addEventListener('click',(e)=>{

    e.preventDefault()

    fetch(`/adresses?checkout=${true}`,{
        method:'get',
        headers:{
            'Content-Type':'application/json'
        }
    }).then((response)=>response.json()).then((data)=>{
     
      if(data.address === false){
        Swal.fire({
          icon: 'error',
          title: 'No Address Data Found',
          text: 'Sorry, there is no address data available.',
        });
       return
      }
        const addressesHtml = data.addresses.map((address)=>
        
        `
        <div class="row justify-content-center mb-3">
        <div class="col-md-12 col-xl-10" style="width: 650px;">
          <div class="card shadow-0 border rounded-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 col-lg-6 col-xl-6">
                  <h5>${address.name}</h5>
                  <!-- <div class="d-flex flex-row">
                    <div class="text-danger mb-1 me-2">
                      <i class="fa fa-star"></i>
                      <i class="fa fa-star"></i>
                      <i class="fa fa-star"></i>
                      <i class="fa fa-star"></i>
                    </div>
                    <span>145</span>
                  </div> -->
                  <div class="mt-1 mb-0 text-muted small">
                    <p class="text-truncate mb-4 mb-md-0">
                     Phone : ${address.phone}
                      </p>
                  </div>
                  <div class="mt-1 mb-0 text-muted small">
                    <p class="text-truncate mb-4 mb-md-0">
                     Address Line 1 : ${address.addressLine1}
                      </p>
                  </div>
                  <div class="mb-2 text-muted small">
                    <p class="text-truncate mb-4 mb-md-0">
                      Address Line 2 : ${address.addressLine2}
                      </p>
                  </div>
                  <div class="mb-2 text-muted small">
                    <p class="text-truncate mb-4 mb-md-0">
                      Area : ${address.area}
                      </p>
                  </div>
                  <p class="text-truncate mb-4 mb-md-0">
                   State : ${address.state}
                  </p>
                </div>
                <div class="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                  <div class="d-flex flex-row align-items-center mb-1">
                    <h4 class="mb-1 me-1"></h4>
                    <span class="text-danger"><s><a href="/delete-address?id=${address._id }" class=""><button class="btn btn-danger btn-sm" type="button">Delete Address</button></a></s></span>
                  </div>
                  <h6 class="text-success"></h6>
                <div class="d-flex flex-column mt-4">
                ${
                    address.isDefault
                        ? `<a href="#"><button class="btn btn-primary btn-sm" type="button">Default Address</button></a>`
                        : `<a href="/default-address?id=${address._id}"><button class="btn btn-primary btn-sm" type="button">Make Default</button></a>`
                }
                    <a href="/edit-address?id=${address._id}"><button class="btn btn-outline-primary btn-sm mt-2" type="button"> 
                      Edit Address
                    </button></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  
  `
        
             ).join('')
        
        
             swal.fire({
                title:'Adresses',
                html:addressesHtml,
                icon:'info',
                confirmButtonText:'Close',
                width:'auto',
                height:'auto',
                
             })
    })
})