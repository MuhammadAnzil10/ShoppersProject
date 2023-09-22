

const walletButton = document.getElementById('walletButton')

walletButton.addEventListener('click',createWallet)


async function createWallet(e){
e.preventDefault()
let walletAmount=0;
let walletBalance = document.getElementById('walletBalance')

    // Use SweetAlert to prompt the user to enter an amount
    const { value: amount } = await Swal.fire({
        title: 'Enter Amount',
        input: 'number',
        inputLabel: 'Amount:',
        inputAttributes: {
          min: 1, // Minimum allowed amount
        },
        showCancelButton: true,
        confirmButtonText: 'Recharge',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          if (!value || value < 1) {
            return 'Please enter a valid amount greater than 0';
          }
        },
      });
      if(amount){
        walletAmount = parseInt(amount)
        walletRecharge(walletAmount)
      }
    return


function walletRecharge(amount){
    fetch('/wallet',{
        method:'post',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            amount,
        })
    
    }).then((response)=>response.json()).then((data)=>{
      if(data){
        walletBalance.value=data.balance
        Swal.fire('Success','Amount Credited', 'success');
      }
    })
}


}