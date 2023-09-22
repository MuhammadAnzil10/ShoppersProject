const btn = document.getElementById("placeOrderBtn");

let obj = {};

function checkPayment(selectedOption) {
  obj.value = selectedOption.value;
}

btn.addEventListener("click", orderCreate);

async function orderCreate(event) {
  event.preventDefault();

  let paymentMethod = obj.value;

  if (obj.value) {
    const response = await fetch("/orders", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethod,
      }),
    });

    const data = await response.json();

    if(data.lessWalletBalance ==='false'){
      Swal.fire({
        icon: "error",
        title: "Insufficiant Balance",
        text: "Please Reacharge or Use Other payment",
      });
      return
    }

    if (data.cartItem === false) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cart is empty",
      });

      return;
    }
    if(data.address === false){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Provide address for placing order",
      });
      return
    }

    if (data.codSuccess) {
      window.location.href = "/order-success";
    } else if(data.walletSuccess){
      window.location.href = "/order-success";
    }
    
    else {
      razorPayPayment(data);
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please select payment method to place order",
    });
  }
}

function razorPayPayment(order) {
  var options = {
    key: "rzp_test_kWQJmYv9l0tjPr", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Shoppers", //your business name
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature)
      verifyPayment(response, order);
    },
    prefill: {
      //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
      name: "Gaurav Kumar", //your customer's name
      email: "gaurav.kumar@example.com",
      contact: "9000090000", //Provide the customer's phone number for better conversion rates
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp = new Razorpay(options);
  rzp.open();
  rzp.on('payment.failed', function (response){

   location.href='/order-failed'
});
  
}
async function verifyPayment(payment, order) {
  const response = await fetch("/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payment,
      order,
    }),
  });

  const data = await response.json();
  if (data.status) {
    location.href = "/order-success";
  } else {
    alert("payment failed");
  }
}
