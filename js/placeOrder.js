var foods = [
  { id: 1, name: "Chicken Burger", category: "Fast Food", price: 120, availability: "Available" },
  { id: 2, name: "Pizza", category: "Fast Food", price: 350, availability: "Available" },
  { id: 3, name: "French Fries", category: "Snacks", price: 80, availability: "Available" },
  { id: 4, name: "Samosa", category: "Snacks", price: 15, availability: "Available" },
  { id: 5, name: "Tea", category: "Drinks", price: 15, availability: "Available" },
  { id: 6, name: "Cold Coffee", category: "Drinks", price: 90, availability: "Unavailable" },
  { id: 7, name: "Fried Rice", category: "Rice Items", price: 150, availability: "Available" },
  { id: 8, name: "Khichuri", category: "Rice Items", price: 100, availability: "Available" }
];

function getFood(name) {
  for (var i = 0; i < foods.length; i++) {
    if (foods[i].name.toLowerCase() == name.toLowerCase()) {
      return foods[i];
    }
  }
  return null;
}

function getToday() {
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return d.getFullYear() + "-" + month + "-" + day;
}

function calcTotal() {
  var food = getFood(document.getElementById("foodname").value.trim());
  var qty = Number(document.getElementById("quantity").value);
  if (food != null && qty > 0) {
    document.getElementById("totalprice").value = food.price * qty;
  }
}

function clearErrors() {
  document.getElementById("nameError").innerHTML = "";
  document.getElementById("foodError").innerHTML = "";
  document.getElementById("qtyError").innerHTML = "";
  document.getElementById("priceError").innerHTML = "";
  document.getElementById("methodError").innerHTML = "";
  document.getElementById("dateError").innerHTML = "";
  document.getElementById("confirmError").innerHTML = "";
  document.getElementById("orderMessage").innerHTML = "";
}

function getPayment() {
  var radios = document.getElementsByName("payment");
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return "Cash";
}

function placeOrder() {
  clearErrors();
  var valid = true;

  var customer = document.getElementById("customername").value.trim();
  var foodText = document.getElementById("foodname").value.trim();
  var qty = Number(document.getElementById("quantity").value);
  var price = document.getElementById("totalprice").value;
  var method = document.getElementById("delivery").value;
  var orderDate = document.getElementById("pickupdate").value;
  var instructions = document.getElementById("instructions").value.trim();
  var confirmed = document.getElementById("confirm").checked;

  if (customer == "") {
    document.getElementById("nameError").innerHTML = "Customer name is required.";
    valid = false;
  } else if (customer.length < 3) {
    document.getElementById("nameError").innerHTML = "Name must be at least 3 characters.";
    valid = false;
  } else if (!/^[A-Za-z ]+$/.test(customer)) {
    document.getElementById("nameError").innerHTML = "Name can contain only letters and spaces.";
    valid = false;
  }

  var food = getFood(foodText);
  if (foodText == "") {
    document.getElementById("foodError").innerHTML = "Food name is required.";
    valid = false;
  } else if (food == null) {
    document.getElementById("foodError").innerHTML = "This food is not on the menu.";
    valid = false;
  } else if (food.availability == "Unavailable") {
    document.getElementById("foodError").innerHTML = "This food is currently unavailable.";
    valid = false;
  }

  if (document.getElementById("quantity").value == "" || qty < 1 || qty > 20 || qty != Math.floor(qty)) {
    document.getElementById("qtyError").innerHTML = "Quantity must be a whole number from 1 to 20.";
    valid = false;
  }

  if (price == "" || Number(price) <= 0) {
    document.getElementById("priceError").innerHTML = "Total price must be greater than 0.";
    valid = false;
  }

  if (method == "") {
    document.getElementById("methodError").innerHTML = "Please select a collection method.";
    valid = false;
  }

  if (orderDate == "") {
    document.getElementById("dateError").innerHTML = "Please select a date.";
    valid = false;
  } else if (orderDate < getToday()) {
    document.getElementById("dateError").innerHTML = "Date cannot be in the past.";
    valid = false;
  }

  if (confirmed == false) {
    document.getElementById("confirmError").innerHTML = "Please confirm your order.";
    valid = false;
  }

  if (valid == false) {
    return false;
  }

  var data = localStorage.getItem("orders");
  var orders = [];
  if (data != null) {
    orders = JSON.parse(data);
  }

  var orderId = orders.length + 1;
  orders.push({
    id: orderId,
    customer: customer,
    food: food.name,
    quantity: qty,
    total: Number(price),
    payment: getPayment(),
    method: method,
    date: orderDate,
    instructions: instructions
  });
  localStorage.setItem("orders", JSON.stringify(orders));

  document.forms[0].reset();
  document.getElementById("orderMessage").innerHTML = "Order placed successfully! Your Order ID is " + orderId + ".";
  return false;
}
