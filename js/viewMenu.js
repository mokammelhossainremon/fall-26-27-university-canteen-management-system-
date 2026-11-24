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

function showMenu(list) {
  var html = "";
  if (list.length == 0) {
    html = "<tr><td colspan='5'>No food items found.</td></tr>";
  }
  for (var i = 0; i < list.length; i++) {
    html += "<tr>";
    html += "<td>" + list[i].id + "</td>";
    html += "<td>" + list[i].name + "</td>";
    html += "<td>" + list[i].category + "</td>";
    html += "<td>" + list[i].price + "</td>";
    html += "<td>" + list[i].availability + "</td>";
    html += "</tr>";
  }
  document.getElementById("menuBody").innerHTML = html;
}

function viewMenu() {
  var category = document.getElementById("category").value;
  var name = document.getElementById("foodname").value.trim().toLowerCase();
  var nameError = document.getElementById("nameError");
  nameError.innerHTML = "";

  if (name != "" && !isNaN(name)) {
    nameError.innerHTML = "Food name cannot be a number.";
    return false;
  }

  var result = [];
  for (var i = 0; i < foods.length; i++) {
    var categoryMatch = (category == "All" || foods[i].category == category);
    var nameMatch = (foods[i].name.toLowerCase().indexOf(name) != -1);
    if (categoryMatch && nameMatch) {
      result.push(foods[i]);
    }
  }
  showMenu(result);
  return false;
}

function resetMenu() {
  document.getElementById("nameError").innerHTML = "";
  showMenu(foods);
}

showMenu(foods);
