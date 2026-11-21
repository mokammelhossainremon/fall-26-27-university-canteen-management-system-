let cartItems = [];

function addToCart() {

    let foodname = document.getElementById("foodname").value.trim();
    let foodid = document.getElementById("foodid").value.trim();
    let quantity = document.getElementById("quantity").value;
    let price = document.getElementById("price").value;
    let instructions = document.getElementById("instructions").value.trim();

    let isValid = true;

    // Check food name
    if (foodname === "") {
        alert("Please enter food name.");
        isValid = false;
    }

    // Check food ID
    if (foodid === "") {
        alert("Please enter food ID.");
        isValid = false;
    }

    // Check quantity
    if (quantity === "" || Number(quantity) <= 0) {
        alert("Please enter a valid quantity.");
        isValid = false;
    }

    // Check price
    if (price === "" || Number(price) <= 0) {
        alert("Please enter a valid price.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    // Calculate total price
    let totalPrice = Number(quantity) * Number(price);

    // Create a cart object
    let item = {
        foodid: foodid,
        foodname: foodname,
        quantity: Number(quantity),
        price: Number(price),
        totalPrice: totalPrice,
        instructions: instructions
    };

    // Add item to cart
    cartItems.push(item);

    alert("Food added to cart successfully!");

    console.log(cartItems);

    return false;
}
