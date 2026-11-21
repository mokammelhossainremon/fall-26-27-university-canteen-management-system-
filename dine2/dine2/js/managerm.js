/* =====================================================================
   manager.js  -  Everything the Manager can do (manager.html)
   ---------------------------------------------------------------------
   CRUD + Search : Manage Food Items (foodItems array)
   Unique 1      : Sales Report
   Unique 2      : Stock Alert and Restock
   Unique 3      : Order Monitor

   The forms on this page never go to another page: each onsubmit
   handler does its work with JavaScript and returns false.
   ===================================================================== */

// The ids of the sections on this page (used by showSection in common.js)
const sections = ["statsSection", "itemsSection", "stockSection", "ordersSection"];

// -1 means "adding a new item"; any other number is the index being edited
let editItemIndex = -1;

// Items with stock at or below this number are shown in the Stock Alert
let lowStockLimit = 10;


/* =====================================================================
   UNIQUE FEATURE 1: SALES REPORT
   ===================================================================== */
function generateReport() {
  // ----- Food items -----
  // Two arrays that go together: categoryNames[i] has categoryTotals[i] items
  let totalStock = 0;
  let lowStockCount = 0;
  let categoryNames = [];
  let categoryTotals = [];

  for (const item of foodItems) {
    totalStock += item.stock;
    if (item.stock <= lowStockLimit) {
      lowStockCount++;
    }

    let position = categoryNames.indexOf(item.category);   // -1 if not in the array yet
    if (position === -1) {
      categoryNames.push(item.category);
      categoryTotals.push(0);
      position = categoryNames.length - 1;
    }
    categoryTotals[position] += 1;
  }

  // ----- Orders and income -----
  let pendingOrders = 0;
  let completedOrders = 0;
  let cancelledOrders = 0;
  let revenue = 0;

  for (const order of orders) {
    if (order.status === "Pending") {
      pendingOrders++;
    } else if (order.status === "Completed") {
      completedOrders++;
      revenue += order.total;
    } else {
      cancelledOrders++;
    }
  }

  let completionPercent = 0;
  if (orders.length > 0) {
    completionPercent = Math.round(completedOrders / orders.length * 100);
  }

  // ----- Show the numbers with innerHTML -----
  document.getElementById("statItems").innerHTML = foodItems.length;
  document.getElementById("statStock").innerHTML = totalStock;
  document.getElementById("statLowStock").innerHTML = lowStockCount;
  document.getElementById("statOrders").innerHTML = orders.length;
  document.getElementById("statPendingOrders").innerHTML = pendingOrders;
  document.getElementById("statCompleted").innerHTML = completedOrders;
  document.getElementById("statCancelled").innerHTML = cancelledOrders;
  document.getElementById("statRevenue").innerHTML = revenue;
  document.getElementById("statCompletion").innerHTML = completionPercent + "%";
  document.getElementById("reportTime").innerHTML = "Generated at " + nowString();

  // Low stock is shown in red when there are any items running out (element.style)
  if (lowStockCount > 0) {
    document.getElementById("statLowStock").style.color = "#C62828";
  } else {
    document.getElementById("statLowStock").style.color = "";
  }

  // ----- Bar charts -----
  let statusNames = ["Pending", "Completed", "Cancelled"];
  let statusTotals = [pendingOrders, completedOrders, cancelledOrders];
  drawBarChart("statusChart", statusNames, statusTotals, orders.length);
  drawBarChart("categoryChart", categoryNames, categoryTotals, foodItems.length);
}


// Draws simple horizontal bars. names[i] is the label of the bar with value counts[i].
// Each bar's width is set as a percentage with an inline style.
function drawBarChart(chartId, names, counts, total) {
  let html = "";

  for (let i = 0; i < names.length; i++) {
    let percent = 0;
    if (total > 0) {
      percent = Math.round(counts[i] / total * 100);
    }
    html += "<div class='bar-row'>" +
      "<div class='bar-label'>" + names[i] + "</div>" +
      "<div class='bar-track'><div class='bar-fill' style='width:" + percent + "%'></div></div>" +
      "<div class='bar-value'>" + counts[i] + "</div>" +
      "</div>";
  }

  document.getElementById(chartId).innerHTML = html;
}


/* =====================================================================
   MANAGE FOOD ITEMS: CREATE, READ, UPDATE, DELETE, SEARCH
   ===================================================================== */

// READ + SEARCH: draw the table rows with a loop and innerHTML
function renderItems() {
  let keyword = document.getElementById("itemSearch").value;
  let categoryFilter = document.getElementById("itemCategoryFilter").value;
  let statusFilter = document.getElementById("itemStatusFilter").value;

  let rows = "";
  let shown = 0;

  for (let i = 0; i < foodItems.length; i++) {
    let item = foodItems[i];

    // SEARCH: skip items that do not match the keyword or the filters
    let matchesKeyword = containsText(item.name, keyword) || containsText(item.id, keyword);
    let matchesCategory = (categoryFilter === "All" || item.category === categoryFilter);
    let matchesStatus = (statusFilter === "All" || item.status === statusFilter);

    if (matchesKeyword && matchesCategory && matchesStatus) {
      // A colour for each status, and a red number when the stock is low
      let statusColor;
      switch (item.status) {
        case "Available":
          statusColor = "green";
          break;
        case "Unavailable":
          statusColor = "red";
          break;
        default:
          statusColor = "grey";
      }

      let stockText = item.stock;
      if (item.stock <= lowStockLimit) {
        stockText = "<strong style='color:#C62828'>" + item.stock + "</strong>";
      }

      rows += "<tr>" +
        "<td>" + item.id + "</td>" +
        "<td><strong>" + item.name + "</strong></td>" +
        "<td>" + item.category + "</td>" +
        "<td>" + item.price + " Tk</td>" +
        "<td>" + stockText + "</td>" +
        "<td><span class='badge " + statusColor + "'>" + item.status + "</span></td>" +
        "<td>" +
        "<button type='button' class='btn btn-small' onclick='editItem(" + i + ")'>Edit</button>" +
        "<button type='button' class='btn btn-small btn-danger' onclick='deleteItem(" + i + ")'>Delete</button>" +
        "</td>" +
        "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='7' class='empty-row'>No food items match your search.</td></tr>";
  }

  document.getElementById("itemTableBody").innerHTML = rows;
  document.getElementById("itemCount").innerHTML = "Showing " + shown + " of " + foodItems.length + " items";
}


// CREATE or UPDATE: runs when the food item form is submitted
function saveItem() {
  let name = document.getElementById("itemName").value.trim();
  let category = document.getElementById("itemCategory").value;
  let priceText = document.getElementById("itemPrice").value;
  let stockText = document.getElementById("itemStock").value;
  let status = getRadioValue("itemStatus");

  let price = Number(priceText);
  let stock = Number(stockText);

  // ----- Validation -----
  let isValid = true;
  clearErrors(["itemName", "itemCategory", "itemPrice", "itemStock"]);

  if (name.length < 3) {
    showError("itemName", "Name must be at least 3 characters.");
    isValid = false;
  } else if (nameUsedByOther(name)) {
    showError("itemName", "Another item already has this name.");
    isValid = false;
  }

  if (category === "") {
    showError("itemCategory", "Please choose a category.");
    isValid = false;
  }

  if (priceText === "" || price < 1 || price > 1000) {
    showError("itemPrice", "Price must be from 1 to 1000 Tk.");
    isValid = false;
  }

  if (stockText === "" || stock < 0 || stock > 500 || stock !== Math.floor(stock)) {
    showError("itemStock", "Stock must be a whole number from 0 to 500.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  // ----- Save -----
  if (editItemIndex === -1) {
    // CREATE: build a new object and push() it to the end of the array
    let newItem = {
      id: nextId("F", foodItems), name: name, category: category,
      price: price, stock: stock, status: status
    };
    foodItems.push(newItem);
    showMessage("itemMessage", "Item <strong>" + name + "</strong> was added with id " + newItem.id + ".", "success");
  } else {
    // UPDATE: change the properties of the object that is being edited
    let item = foodItems[editItemIndex];
    item.name = name;
    item.category = category;
    item.price = price;
    item.stock = stock;
    item.status = status;
    showMessage("itemMessage", "Item <strong>" + name + "</strong> was updated.", "success");
  }

  resetItemForm();
  renderItems();
  return false;   // never leave the page
}


// true if the name belongs to a DIFFERENT item than the one being edited
function nameUsedByOther(name) {
  for (let i = 0; i < foodItems.length; i++) {
    if (i !== editItemIndex && foodItems[i].name.toLowerCase() === name.toLowerCase()) {
      return true;
    }
  }
  return false;
}


// UPDATE step 1: copy the item's values into the form
function editItem(index) {
  let item = foodItems[index];
  editItemIndex = index;

  document.getElementById("itemName").value = item.name;
  document.getElementById("itemCategory").value = item.category;
  document.getElementById("itemPrice").value = item.price;
  document.getElementById("itemStock").value = item.stock;
  setRadioValue("itemStatus", item.status);

  document.getElementById("itemFormTitle").innerHTML = "Edit Item " + item.id;
  document.getElementById("itemSaveButton").value = "Update Item";
  hideMessage("itemMessage");
}


// DELETE: remove the item from the array
function deleteItem(index) {
  let item = foodItems[index];

  foodItems = removeAt(foodItems, index);
  showMessage("itemMessage", "Item <strong>" + item.name + "</strong> was deleted.", "info");

  resetItemForm();
  renderItems();
  loadStock();
}


// Clears the form and goes back to "Add" mode
function resetItemForm() {
  editItemIndex = -1;
  document.getElementById("itemForm").reset();
  clearErrors(["itemName", "itemCategory", "itemPrice", "itemStock"]);
  document.getElementById("itemFormTitle").innerHTML = "Add New Item";
  document.getElementById("itemSaveButton").value = "Add Item";
}


/* =====================================================================
   UNIQUE FEATURE 2: STOCK ALERT AND RESTOCK
   ===================================================================== */

// Fills the limit box and draws the table of items that are running out
function loadStock() {
  document.getElementById("stockLimit").value = lowStockLimit;

  let rows = "";
  let shown = 0;

  for (let i = 0; i < foodItems.length; i++) {
    let item = foodItems[i];

    if (item.stock <= lowStockLimit) {
      let level = "orange";
      let levelText = "Low";
      if (item.stock === 0) {
        level = "red";
        levelText = "Out of stock";
      }

      rows += "<tr>" +
        "<td>" + item.id + "</td>" +
        "<td><strong>" + item.name + "</strong></td>" +
        "<td>" + item.stock + "</td>" +
        "<td><span class='badge " + level + "'>" + levelText + "</span></td>" +
        "<td><button type='button' class='btn btn-small btn-success' onclick='restockItem(" + i + ")'>Restock</button></td>" +
        "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='5' class='empty-row'>All items have enough stock.</td></tr>";
  }

  document.getElementById("stockTableBody").innerHTML = rows;
  document.getElementById("stockCount").innerHTML = shown + " items need attention";
}


// Saves the new low stock limit (must be a number from 1 to 100)
function saveStockLimit() {
  clearErrors(["stockLimit"]);

  let text = document.getElementById("stockLimit").value;
  let number = Number(text);

  if (text === "" || number < 1 || number > 100) {
    showError("stockLimit", "Enter a number from 1 to 100.");
    showMessage("stockMessage", "The limit was not saved.", "error");
    return false;
  }

  lowStockLimit = number;
  showMessage("stockMessage", "Low stock limit saved: " + lowStockLimit + " units.", "success");
  loadStock();
  renderItems();
  generateReport();
  return false;
}


// Adds the amount typed in the Restock box to one item
function restockItem(index) {
  clearErrors(["restockAmount"]);

  let text = document.getElementById("restockAmount").value;
  let amount = Number(text);

  if (text === "" || amount < 1 || amount > 500 || amount !== Math.floor(amount)) {
    showError("restockAmount", "Enter a whole number from 1 to 500.");
    return;
  }

  let item = foodItems[index];
  item.stock += amount;
  if (item.stock > 0 && item.status === "Unavailable") {
    item.status = "Available";
  }

  showMessage("stockMessage", "Added " + amount + " units to <strong>" + item.name + "</strong>. New stock: " + item.stock + ".", "success");
  loadStock();
  renderItems();
}


/* =====================================================================
   UNIQUE FEATURE 3: ORDER MONITOR
   ===================================================================== */

// Draws the orders table with a search box and a status filter
function renderOrders() {
  let keyword = document.getElementById("orderSearch").value;
  let statusFilter = document.getElementById("orderStatusFilter").value;

  let rows = "";
  let shown = 0;

  // Loop backwards so the newest order is at the top
  for (let i = orders.length - 1; i >= 0; i--) {
    let order = orders[i];

    let matchesKeyword = containsText(order.id, keyword) || containsText(order.customer, keyword);
    let matchesStatus = (statusFilter === "All" || order.status === statusFilter);

    if (matchesKeyword && matchesStatus) {
      let statusColor;
      let actionButtons = "";
      switch (order.status) {
        case "Pending":
          statusColor = "orange";
          actionButtons = "<button type='button' class='btn btn-small btn-success' onclick='completeOrder(" + i + ")'>Complete</button>" +
            "<button type='button' class='btn btn-small btn-danger' onclick='cancelOrder(" + i + ")'>Cancel</button>";
          break;
        case "Completed":
          statusColor = "green";
          break;
        default:
          statusColor = "red";
      }

      rows += "<tr>" +
        "<td>" + order.id + "</td>" +
        "<td>" + order.customer + "</td>" +
        "<td>" + order.items + "</td>" +
        "<td>" + order.total + " Tk</td>" +
        "<td><span class='badge " + statusColor + "'>" + order.status + "</span></td>" +
        "<td>" + actionButtons + "</td>" +
        "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='6' class='empty-row'>No orders match your search.</td></tr>";
  }

  document.getElementById("orderTableBody").innerHTML = rows;
  document.getElementById("orderCount").innerHTML = "Showing " + shown + " of " + orders.length + " orders";
}


function completeOrder(index) {
  orders[index].status = "Completed";
  showMessage("orderMessage", "Order <strong>" + orders[index].id + "</strong> was completed.", "success");
  renderOrders();
}


function cancelOrder(index) {
  orders[index].status = "Cancelled";
  showMessage("orderMessage", "Order <strong>" + orders[index].id + "</strong> was cancelled.", "info");
  renderOrders();
}


/* =====================================================================
   START: runs once when the page has loaded (scripts are at the end of <body>)
   ===================================================================== */
generateReport();
renderItems();
loadStock();
renderOrders();
showSection("statsSection");

// Each time the manager opens Statistics, Stock or Orders, show fresh data
document.getElementById("nav-statsSection").addEventListener("click", generateReport);
document.getElementById("nav-stockSection").addEventListener("click", loadStock);
document.getElementById("nav-ordersSection").addEventListener("click", renderOrders);