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

function loadFoodList() {
  var select = document.getElementById("cartfood");
  for (var i = 0; i < foods.length; i++) {
    if (foods[i].availability == "Available") {
      var option = document.createElement("option");
      option.value = foods[i].name;
      option.text = foods[i].name + " - " + foods[i].price + " Tk";
      select.add(option);
    }
  }
}

function getFood(name) {
  for (var i = 0; i < foods.length; i++) {
    if (foods[i].name == name) {
      return foods[i];
    }
  }
  return null;
}

function getCart() {
  var data = localStorage.getItem("cart");
  if (data == null) {
    return [];
  }
  return JSON.parse(data);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCartErrors() {
  document.getElementById("foodError").innerHTML = "";
  document.getElementById("qtyError").innerHTML = "";
  document.getElementById("cartMessage").innerHTML = "";
}

function showCart() {
  var cart = getCart();
  var html = "";
  var total = 0;
  if (cart.length == 0) {
    html = "<tr><td colspan='5'>Your cart is empty.</td></tr>";
  }
  for (var i = 0; i < cart.length; i++) {
    var subtotal = cart[i].price * cart[i].quantity;
    total = total + subtotal;
    html += "<tr>";
    html += "<td>" + cart[i].name + "</td>";
    html += "<td>" + cart[i].price + "</td>";
    html += "<td>" + cart[i].quantity + "</td>";
    html += "<td>" + subtotal + "</td>";
    html += "<td><button type='button' class='btn btn-reset' onclick='removeItem(" + i + ")'>Remove</button></td>";
    html += "</tr>";
  }
  document.getElementById("cartBody").innerHTML = html;
  document.getElementById("cartTotal").innerHTML = total;
}

function addToCart() {
  clearCartErrors();
  var valid = true;
  var foodName = document.getElementById("cartfood").value;
  var qty = Number(document.getElementById("cartqty").value);

  if (foodName == "") {
    document.getElementById("foodError").innerHTML = "Please select a food item.";
    valid = false;
  }

  if (qty < 1 || qty > 20 || qty != Math.floor(qty)) {
    document.getElementById("qtyError").innerHTML = "Quantity must be a whole number from 1 to 20.";
    valid = false;
  }

  if (valid == false) {
    return false;
  }

  var food = getFood(foodName);
  var cart = getCart();
  var found = false;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name == foodName) {
      cart[i].quantity = cart[i].quantity + qty;
      found = true;
    }
  }

  if (found == false) {
    cart.push({ name: food.name, price: food.price, quantity: qty });
  }

  saveCart(cart);
  showCart();
  document.getElementById("cartMessage").innerHTML = food.name + " added to cart.";
  return false;
}

function removeItem(index) {
  var cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  showCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  showCart();
  document.getElementById("cartMessage").innerHTML = "";
}

loadFoodList();
showCart();
