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

function clearSearchErrors() {
  document.getElementById("nameError").innerHTML = "";
  document.getElementById("minError").innerHTML = "";
  document.getElementById("maxError").innerHTML = "";
}

function getAvailability() {
  var radios = document.getElementsByName("availability");
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return "All";
}

function showResults(list) {
  var box = document.getElementById("searchResults");
  if (list.length == 0) {
    box.innerHTML = "<p class='error'>No food found matching your search.</p>";
    return;
  }
  var html = "<div class='table-container'><table>";
  html += "<tr><th>Food ID</th><th>Food Name</th><th>Category</th><th>Price (Tk)</th><th>Availability</th></tr>";
  for (var i = 0; i < list.length; i++) {
    html += "<tr>";
    html += "<td>" + list[i].id + "</td>";
    html += "<td>" + list[i].name + "</td>";
    html += "<td>" + list[i].category + "</td>";
    html += "<td>" + list[i].price + "</td>";
    html += "<td>" + list[i].availability + "</td>";
    html += "</tr>";
  }
  html += "</table></div>";
  box.innerHTML = html;
}

function searchFood() {
  clearSearchErrors();
  var valid = true;

  var name = document.getElementById("foodname").value.trim().toLowerCase();
  var category = document.getElementById("category").value;
  var minText = document.getElementById("minprice").value;
  var maxText = document.getElementById("maxprice").value;
  var availability = getAvailability();

  if (name != "" && !isNaN(name)) {
    document.getElementById("nameError").innerHTML = "Food name cannot be a number.";
    valid = false;
  }

  if (minText != "" && Number(minText) < 0) {
    document.getElementById("minError").innerHTML = "Minimum price cannot be negative.";
    valid = false;
  }

  if (maxText != "" && Number(maxText) < 0) {
    document.getElementById("maxError").innerHTML = "Maximum price cannot be negative.";
    valid = false;
  }

  if (minText != "" && maxText != "" && Number(minText) > Number(maxText)) {
    document.getElementById("maxError").innerHTML = "Maximum price must be greater than minimum price.";
    valid = false;
  }

  if (valid == false) {
    return false;
  }

  var result = [];
  for (var i = 0; i < foods.length; i++) {
    var ok = true;
    if (foods[i].name.toLowerCase().indexOf(name) == -1) {
      ok = false;
    }
    if (category != "All" && foods[i].category != category) {
      ok = false;
    }
    if (minText != "" && foods[i].price < Number(minText)) {
      ok = false;
    }
    if (maxText != "" && foods[i].price > Number(maxText)) {
      ok = false;
    }
    if (availability != "All" && foods[i].availability != availability) {
      ok = false;
    }
    if (ok == true) {
      result.push(foods[i]);
    }
  }
  showResults(result);
  return false;
}

function resetSearch() {
  clearSearchErrors();
  document.getElementById("searchResults").innerHTML = "";
}
