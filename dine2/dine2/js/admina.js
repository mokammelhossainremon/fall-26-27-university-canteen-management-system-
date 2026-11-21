
const sections = ["statsSection", "usersSection", "foodSection", "rulesSection", "logSection"];

let editUserIndex = -1;
let editFoodIndex = -1;

const defaultRules = { serviceCharge: 5, maxItems: 10, lowStockLimit: 5, cancelMinutes: 10 };
function addLog(type, message) {
  activityLog.push({ time: nowString(), user: "admin", type: type, message: message });
  renderLog();
}
function generateReport() {
  let active = 0;
  let blocked = 0;
  let roleNames = ["Admin", "Manager", "Staff", "Student"];
  let roleCounts = [0, 0, 0, 0];

  for (const user of users) {
    if (user.status === "Active") { active++; } else { blocked++; }
    roleCounts[roleNames.indexOf(user.role)]++;
  }

  let lowStock = 0;
  let categoryNames = ["Meals", "Snacks", "Drinks", "Desserts"];
  let categoryCounts = [0, 0, 0, 0];

  for (const food of foods) {
    if (food.quantity <= canteenRules.lowStockLimit) { lowStock++; }
    categoryCounts[categoryNames.indexOf(food.category)]++;
  }

  let sales = 0;
  let completed = 0;
  for (const order of orders) {
    if (order.status === "Completed") {
      sales += order.total;
      completed++;
    }
  }
  let average = (completed === 0) ? 0 : Math.round(sales / completed);

  document.getElementById("statUsers").innerHTML = users.length;
  document.getElementById("statActive").innerHTML = active;
  document.getElementById("statBlocked").innerHTML = blocked;
  document.getElementById("statFoods").innerHTML = foods.length;
  document.getElementById("statLowStock").innerHTML = lowStock;
  document.getElementById("statOrders").innerHTML = orders.length;
  document.getElementById("statSales").innerHTML = sales;
  document.getElementById("statAverage").innerHTML = average;
  document.getElementById("reportTime").innerHTML = "Updated " + nowString();

  drawBars("roleChart", roleNames, roleCounts);
  drawBars("categoryChart", categoryNames, categoryCounts);
  console.log("Report: " + users.length + " users, " + foods.length + " foods, sales Tk " + sales);
}
function drawBars(boxId, labels, values) {
  let biggest = 1;
  for (let i = 0; i < values.length; i++) {
    if (values[i] > biggest) { biggest = values[i]; }
  }

  let html = "";
  for (let i = 0; i < labels.length; i++) {
    let percent = Math.round(values[i] / biggest * 100);
    html += "<div class='bar-row'>" +
              "<span class='bar-label'>" + labels[i] + "</span>" +
              "<div class='bar-track'><div class='bar-fill' style='width:" + percent + "%'></div></div>" +
              "<span class='bar-value'>" + values[i] + "</span>" +
            "</div>";
  }
  document.getElementById(boxId).innerHTML = html;
}

function renderUsers() {
  let keyword = document.getElementById("userSearch").value;
  let role = document.getElementById("userRoleFilter").value;
  let status = document.getElementById("userStatusFilter").value;

  let rows = "";
  let shown = 0;

  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    let matchesKeyword = containsText(user.name, keyword) || containsText(user.username, keyword) ||
                         containsText(user.email, keyword) || containsText(user.id, keyword);
    let matchesRole = (role === "All" || user.role === role);
    let matchesStatus = (status === "All" || user.status === status);

    if (matchesKeyword && matchesRole && matchesStatus) {
      let statusBadge = (user.status === "Active") ? "green" : "red";
      rows += "<tr>" +
                "<td>" + user.id + "</td>" +
                "<td><strong>" + user.name + "</strong><br><span class='hint'>" + user.email + "</span></td>" +
                "<td>" + user.username + "</td>" +
                "<td><span class='badge " + user.role.toLowerCase() + "'>" + user.role + "</span></td>" +
                "<td><span class='badge " + statusBadge + "'>" + user.status + "</span></td>" +
                "<td><button type='button' class='btn btn-small' onclick='editUser(" + i + ")'>Edit</button> " +
                    "<button type='button' class='btn btn-small btn-danger' onclick='deleteUser(" + i + ")'>Delete</button></td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='6' class='empty-row'>No users match your search.</td></tr>";
  }
  document.getElementById("userTableBody").innerHTML = rows;
  document.getElementById("userCount").innerHTML = shown + " user(s) found";
}
function isUserTaken(property, value) {
  for (let i = 0; i < users.length; i++) {
    if (i !== editUserIndex && users[i][property].toLowerCase() === value.toLowerCase()) {
      return true;
    }
  }
  return false;
}
function saveUser() {
  clearErrors(["userName", "userUsername", "userEmail", "userPassword", "userRole"]);
  hideMessage("userMessage");

  let name = document.getElementById("userName").value.trim();
  let username = document.getElementById("userUsername").value.trim();
  let email = document.getElementById("userEmail").value.trim();
  let password = document.getElementById("userPassword").value;
  let role = document.getElementById("userRole").value;
  let status = getRadioValue("userStatus");
  let isValid = true;

  if (name.length < 3) {
    showError("userName", "Full name must be at least 3 characters.");
    isValid = false;
  }

  if (username.length < 4) {
    showError("userUsername", "Username must be at least 4 characters.");
    isValid = false;
  } else if (username.indexOf(" ") !== -1) {
    showError("userUsername", "Username cannot contain spaces.");
    isValid = false;
  } else if (isUserTaken("username", username)) {
    showError("userUsername", "This username is already taken.");
    isValid = false;
  }

  if (isEmpty(email)) {
    showError("userEmail", "Email is required.");
    isValid = false;
  } else if (isValidEmail(email) === false) {
    showError("userEmail", "Please enter a valid email address.");
    isValid = false;
  } else if (isUserTaken("email", email)) {
    showError("userEmail", "An account with this email already exists.");
    isValid = false;
  }

  if (password.length < 8) {
    showError("userPassword", "Password must be at least 8 characters.");
    isValid = false;
  } else if (hasDigit(password) === false) {
    showError("userPassword", "Password must contain at least one digit.");
    isValid = false;
  }

  if (role === "") {
    showError("userRole", "Please select a role.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  if (editUserIndex === -1) {
    let newUser = { id: nextId("U", users), name: name, username: username, password: password,
                    email: email, role: role, status: status };
    users.push(newUser);
    addLog("User", "Created " + role.toLowerCase() + " account for " + name);
    showMessage("userMessage", "User " + name + " was added (" + newUser.id + ").", "success");
  } else {
    let user = users[editUserIndex];
    user.name = name;
    user.username = username;
    user.email = email;
    user.password = password;
    user.role = role;
    user.status = status;
    addLog("User", "Updated account of " + name + " (" + user.id + ")");
    showMessage("userMessage", "User " + name + " was updated.", "success");
  }

  resetUserForm();
  renderUsers();
  generateReport();
  return false;   
}
function editUser(index) {
  let user = users[index];
  editUserIndex = index;
  document.getElementById("userName").value = user.name;
  document.getElementById("userUsername").value = user.username;
  document.getElementById("userEmail").value = user.email;
  document.getElementById("userPassword").value = user.password;
  document.getElementById("userRole").value = user.role;
  setRadioValue("userStatus", user.status);
  document.getElementById("userFormTitle").innerHTML = "Edit User " + user.id;
  document.getElementById("userSaveButton").value = "Save Changes";
  hideMessage("userMessage");
}

function deleteUser(index) {
  let user = users[index];
  if (user.username === "admin") {
    showMessage("userMessage", "The main admin account cannot be deleted.", "error");
    return;
  }
  if (confirm("Delete the account of " + user.name + "?") === false) {
    return;
  }
  users = removeAt(users, index);
  addLog("User", "Deleted account of " + user.name + " (" + user.id + ")");
  showMessage("userMessage", "User " + user.name + " was deleted.", "success");
  resetUserForm();
  renderUsers();
  generateReport();
}

function resetUserForm() {
  document.getElementById("userForm").reset();
  clearErrors(["userName", "userUsername", "userEmail", "userPassword", "userRole"]);
  editUserIndex = -1;
  document.getElementById("userFormTitle").innerHTML = "Add New User";
  document.getElementById("userSaveButton").value = "Add User";
}

function renderFoods() {
  let keyword = document.getElementById("foodSearch").value;
  let category = document.getElementById("foodCategoryFilter").value;
  let status = document.getElementById("foodStatusFilter").value;

  let rows = "";
  let shown = 0;

  for (let i = 0; i < foods.length; i++) {
    let food = foods[i];
    let matchesKeyword = containsText(food.name, keyword) || containsText(food.category, keyword) ||
                         containsText(food.id, keyword);
    let matchesCategory = (category === "All" || food.category === category);
    let matchesStatus = (status === "All" || food.status === status);

    if (matchesKeyword && matchesCategory && matchesStatus) {
      let stock = food.quantity;
      if (food.quantity <= canteenRules.lowStockLimit) {
        stock += " <span class='badge red'>Low</span>";
      }
      let statusBadge = (food.status === "Available") ? "green" : "red";
      rows += "<tr>" +
                "<td>" + food.id + "</td>" +
                "<td><strong>" + food.name + "</strong></td>" +
                "<td>" + food.category + "</td>" +
                "<td>Tk " + food.price + "</td>" +
                "<td>" + stock + "</td>" +
                "<td><span class='badge " + statusBadge + "'>" + food.status + "</span></td>" +
                "<td><button type='button' class='btn btn-small' onclick='editFood(" + i + ")'>Edit</button> " +
                    "<button type='button' class='btn btn-small btn-danger' onclick='deleteFood(" + i + ")'>Delete</button></td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='7' class='empty-row'>No food items match your search.</td></tr>";
  }
  document.getElementById("foodTableBody").innerHTML = rows;
  document.getElementById("foodCount").innerHTML = shown + " item(s) found";
}

// CREATE or UPDATE
function saveFood() {
  clearErrors(["foodName", "foodCategory", "foodPrice", "foodQuantity"]);
  hideMessage("foodMessage");

  let name = document.getElementById("foodName").value.trim();
  let category = document.getElementById("foodCategory").value;
  let priceText = document.getElementById("foodPrice").value;
  let quantityText = document.getElementById("foodQuantity").value;
  let price = Number(priceText);
  let quantity = Number(quantityText);
  let status = getRadioValue("foodStatus");
  let isValid = true;

  if (name.length < 2) {
    showError("foodName", "Name must be at least 2 characters.");
    isValid = false;
  } else {
    // the same name cannot be used twice (the item being edited is skipped)
    for (let i = 0; i < foods.length; i++) {
      if (i !== editFoodIndex && foods[i].name.toLowerCase() === name.toLowerCase()) {
        showError("foodName", "A food item with this name already exists.");
        isValid = false;
      }
    }
  }

  if (category === "") {
    showError("foodCategory", "Please select a category.");
    isValid = false;
  }

  if (priceText === "" || price < 1 || price > 1000) {
    showError("foodPrice", "Enter a price from 1 to 1000 Tk.");
    isValid = false;
  }

  if (quantityText === "" || quantity < 0 || quantity > 500 || quantity !== Math.floor(quantity)) {
    showError("foodQuantity", "Enter a whole number from 0 to 500.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  if (editFoodIndex === -1) {
    let newFood = { id: nextId("F", foods), name: name, category: category, price: price,
                    quantity: quantity, status: status };
    foods.push(newFood);
    addLog("Food", "Added food item: " + name + " (" + newFood.id + ")");
    showMessage("foodMessage", name + " was added to the menu (" + newFood.id + ").", "success");
  } else {
    let food = foods[editFoodIndex];
    food.name = name;
    food.category = category;
    food.price = price;
    food.quantity = quantity;
    food.status = status;
    addLog("Food", "Updated food item: " + name + " (" + food.id + ")");
    showMessage("foodMessage", name + " was updated.", "success");
  }

  resetFoodForm();
  renderFoods();
  generateReport();
  return false;
}

function editFood(index) {
  let food = foods[index];
  editFoodIndex = index;
  document.getElementById("foodName").value = food.name;
  document.getElementById("foodCategory").value = food.category;
  document.getElementById("foodPrice").value = food.price;
  document.getElementById("foodQuantity").value = food.quantity;
  setRadioValue("foodStatus", food.status);
  document.getElementById("foodFormTitle").innerHTML = "Edit Food Item " + food.id;
  document.getElementById("foodSaveButton").value = "Save Changes";
  hideMessage("foodMessage");
}

function deleteFood(index) {
  let food = foods[index];
  if (confirm("Delete " + food.name + " from the menu?") === false) {
    return;
  }
  foods = removeAt(foods, index);
  addLog("Food", "Deleted food item: " + food.name + " (" + food.id + ")");
  showMessage("foodMessage", food.name + " was deleted.", "success");
  resetFoodForm();
  renderFoods();
  generateReport();
}

function resetFoodForm() {
  document.getElementById("foodForm").reset();
  clearErrors(["foodName", "foodCategory", "foodPrice", "foodQuantity"]);
  editFoodIndex = -1;
  document.getElementById("foodFormTitle").innerHTML = "Add New Food Item";
  document.getElementById("foodSaveButton").value = "Add Food Item";
}
function showRules() {
  document.getElementById("ruleServiceCharge").value = canteenRules.serviceCharge;
  document.getElementById("ruleMaxItems").value = canteenRules.maxItems;
  document.getElementById("ruleLowStock").value = canteenRules.lowStockLimit;
  document.getElementById("ruleCancelMinutes").value = canteenRules.cancelMinutes;

  document.getElementById("currentRulesBody").innerHTML =
    "<tr><td>Service charge</td><td><strong>" + canteenRules.serviceCharge + "%</strong></td></tr>" +
    "<tr><td>Max items per order</td><td><strong>" + canteenRules.maxItems + "</strong></td></tr>" +
    "<tr><td>Low stock limit</td><td><strong>" + canteenRules.lowStockLimit + "</strong></td></tr>" +
    "<tr><td>Cancel window</td><td><strong>" + canteenRules.cancelMinutes + " minutes</strong></td></tr>";
  previewRules();
}
function previewRules() {
  let charge = Number(document.getElementById("ruleServiceCharge").value);
  let maxItems = Number(document.getElementById("ruleMaxItems").value);
  let subtotal = 300;
  let extra = Math.round(subtotal * charge / 100);

  document.getElementById("rulesPreview").innerHTML =
    "an order of Tk " + subtotal + " costs Tk " + (subtotal + extra) + " (Tk " + extra +
    " service charge), and a student can order up to " + maxItems + " items at once.";
}

function saveRules() {
  clearErrors(["ruleServiceCharge", "ruleMaxItems", "ruleLowStock", "ruleCancelMinutes"]);
  hideMessage("rulesMessage");

  let charge = Number(document.getElementById("ruleServiceCharge").value);
  let maxItems = Number(document.getElementById("ruleMaxItems").value);
  let lowStock = Number(document.getElementById("ruleLowStock").value);
  let cancelMinutes = Number(document.getElementById("ruleCancelMinutes").value);
  let isValid = true;

  if (document.getElementById("ruleServiceCharge").value === "" || charge < 0 || charge > 20) {
    showError("ruleServiceCharge", "Enter a number from 0 to 20.");
    isValid = false;
  }
  if (document.getElementById("ruleMaxItems").value === "" || maxItems < 1 || maxItems > 20) {
    showError("ruleMaxItems", "Enter a number from 1 to 20.");
    isValid = false;
  }
  if (document.getElementById("ruleLowStock").value === "" || lowStock < 0 || lowStock > 50) {
    showError("ruleLowStock", "Enter a number from 0 to 50.");
    isValid = false;
  }
  if (document.getElementById("ruleCancelMinutes").value === "" || cancelMinutes < 0 || cancelMinutes > 60) {
    showError("ruleCancelMinutes", "Enter a number from 0 to 60.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  canteenRules.serviceCharge = charge;
  canteenRules.maxItems = maxItems;
  canteenRules.lowStockLimit = lowStock;
  canteenRules.cancelMinutes = cancelMinutes;

  addLog("Settings", "Changed canteen rules (service charge " + charge + "%, max " + maxItems + " items)");
  showMessage("rulesMessage", "The rules were saved.", "success");
  showRules();
  renderFoods();
  generateReport();
  return false;
}

function restoreDefaultRules() {
  canteenRules.serviceCharge = defaultRules.serviceCharge;
  canteenRules.maxItems = defaultRules.maxItems;
  canteenRules.lowStockLimit = defaultRules.lowStockLimit;
  canteenRules.cancelMinutes = defaultRules.cancelMinutes;

  clearErrors(["ruleServiceCharge", "ruleMaxItems", "ruleLowStock", "ruleCancelMinutes"]);
  addLog("Settings", "Restored the default canteen rules");
  showMessage("rulesMessage", "The default rules were restored.", "info");
  showRules();
  renderFoods();
  generateReport();
}

function logClass(type) {
  switch (type) {
    case "User":
      return "log-user";
    case "Food":
      return "log-food";
    case "Security":
      return "log-security";
    case "Settings":
      return "log-settings";
    default:
      return "";
  }
}

function renderLog() {
  let type = document.getElementById("logTypeFilter").value;
  let who = document.getElementById("logUserFilter").value;

  let html = "";
  let shown = 0;

  for (let i = activityLog.length - 1; i >= 0; i--) {
    let entry = activityLog[i];
    if ((type === "All" || entry.type === type) && (who === "All" || entry.user === who)) {
      html += "<div class='notice-item " + logClass(entry.type) + "'>" +
                "<strong>" + entry.type + "</strong> by " + entry.user +
                " <span class='hint'>" + entry.time + "</span><br>" + entry.message +
              "</div>";
      shown++;
    }
  }

  if (shown === 0) {
    html = "<p class='empty-row'>No activity to show.</p>";
  }
  document.getElementById("logBoard").innerHTML = html;
  document.getElementById("logCount").innerHTML = shown + " entry(ies)";
}

function clearLog() {
  if (confirm("Clear the whole activity log?") === false) {
    return;
  }
  activityLog = [];
  addLog("Security", "Cleared the activity log");
}
generateReport();
renderUsers();
renderFoods();
showRules();
renderLog();
showSection("statsSection");
