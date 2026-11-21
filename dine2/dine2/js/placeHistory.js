
let orders = [];

function placeOrder() {

    let customername = document.getElementById("customername").value.trim();
    let foodname = document.getElementById("foodname").value.trim();
    let quantity = document.getElementById("quantity").value;
    let totalprice = document.getElementById("totalprice").value;
    let payment = document.querySelector('input[name="payment"]:checked').value;
    let delivery = document.getElementById("delivery").value;
    let instructions = document.getElementById("instructions").value.trim();

    let isValid = true;

    // Validate customer name
    if (customername === "") {
        alert("Please enter customer name.");
        isValid = false;
    }

    // Validate food name
    if (foodname === "") {
        alert("Please enter food name.");
        isValid = false;
    }

    // Validate quantity
    if (quantity === "" || Number(quantity) <= 0) {
        alert("Please enter a valid quantity.");
        isValid = false;
    }

    // Validate total price
    if (totalprice === "" || Number(totalprice) <= 0) {
        alert("Please enter a valid total price.");
        isValid = false;
    }

    // Validate payment method
    if (payment === "") {
        alert("Please select a payment method.");
        isValid = false;
    }

    // Validate collection method
    if (delivery === "") {
        alert("Please select a collection method.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    // Create order object
    let order = {
        orderid: "O-" + (orders.length + 1),
        customername: customername,
        foodname: foodname,
        quantity: Number(quantity),
        totalprice: Number(totalprice),
        payment: payment,
        delivery: delivery,
        instructions: instructions,
        status: "Pending",
        orderdate: new Date().toLocaleDateString()
    };

    // Save order
    orders.push(order);

    alert("Your order has been placed successfully!");

    console.log(orders);

    return false;
}
