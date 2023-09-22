
  const productContainers = document.querySelectorAll('.product-container');  //----table row id ----//

  productContainers.forEach((container) => {
    const quantityInput = container.querySelector('.quantity-amount');  //--- getting quantity ----//
    const increaseButton = container.querySelector('.increase');    //---- button ----//
    const decreaseButton = container.querySelector('.decrease');    //-----button ----//
    const productId = container.querySelector('.productId').value;  //--- product-id ----//
    const totalCell = container.querySelector('.productIdInput'); //--- product subtotoal --- //
   

     
    increaseButton.addEventListener('click', handleQuantityUpdate.bind(null, 'increase', quantityInput, productId, totalCell));
    decreaseButton.addEventListener('click', handleQuantityUpdate.bind(null, 'decrease', quantityInput, productId, totalCell));
  });

  function handleQuantityUpdate(action, quantityInput, productId, totalCell) {
   
    const currentQuantity = parseInt(quantityInput.value);
    let newQuantity;

    if (action === 'increase') {
      newQuantity = currentQuantity ;
    } else if (action === 'decrease') {
      newQuantity = Math.max(1, currentQuantity );
    }

    updateQuantity(productId, newQuantity).then((response) => {
   
        const cartItem = response.products.find((product)=>{

             
          return product.productId === productId
   })

   quantityInput.value = cartItem.quantity;
   
   totalCell.textContent = cartItem.subtotal;
        
     
    
      

      // const cartSubTotals =document.getElementById('cartSubtotals')
      // const cartTotal = document.getElementById('cartTotals')
      const cartTotal = document.querySelector('.cartTotals')
        cartTotal.textContent =response.totalAmount
        const cartSubtotal = document.querySelector('.cartSubtotal')
        cartSubtotal.textContent = response.cartSubtotal
      // cartSubTotals.textContent = response.cartSubTotals
      // cartTotal.textContent = response.totalAmount
      

    }).catch((error) => {
      console.error('Error Updating Quantity', error);
    });
  }

 async function updateQuantity(productId, newQuantity) {
    return await fetch('/updateQuantity', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: productId,
        quantity: newQuantity
      })
    }).then(response => response.json());
  }

