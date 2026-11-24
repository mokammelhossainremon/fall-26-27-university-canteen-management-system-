function getOrders() {
  var data = localStorage.getItem("orders");
  if (data == null) {
    return [];
  }
  return JSON.parse(data);
}

function showHistory(name) {
  var orders = getOrders();
  var html = "";
  var count = 0;
  for (var i = 0; i < orders.length; i++) {
    if (name == "" || orders[i].customer.toLowerCase().indexOf(name) != -1) {
      html += "<tr>";
      html += "<td>" + orders[i].id + "</td>";
      html += "<td>" + orders[i].customer + "</td>";
      html += "<td>" + orders[i].food + "</td>";
      html += "<td>" + orders[i].quantity + "</td>";
      html += "<td>" + orders[i].total + "</td>";
      html += "<td>" + orders[i].payment + "</td>";
      html += "<td>" + orders[i].method + "</td>";
      html += "<td>" + orders[i].date + "</td>";
      html += "</tr>";
      count++;
    }
  }
  if (count == 0) {
    html = "<tr><td colspan='8'>No orders found.</td></tr>";
  }
  document.getElementById("historyBody").innerHTML = html;
}

function filterHistory() {
  var name = document.getElementById("searchname").value.trim().toLowerCase();
  var nameError = document.getElementById("nameError");
  nameError.innerHTML = "";

  if (name != "" && !isNaN(name)) {
    nameError.innerHTML = "Customer name cannot be a number.";
    return false;
  }

  showHistory(name);
  return false;
}

function resetHistory() {
  document.getElementById("nameError").innerHTML = "";
  showHistory("");
}

function clearHistory() {
  if (confirm("Are you sure you want to delete all order history?")) {
    localStorage.removeItem("orders");
    showHistory("");
  }
}

showHistory("");
