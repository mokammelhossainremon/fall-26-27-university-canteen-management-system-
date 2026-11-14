
const commonFields = ["fullName", "email", "phone", "gender", "dob",
                      "newUsername", "newPassword", "confirmPassword"];

const studentFields = ["studentId", "department", "semester"];
const managerFields = ["managerEmployeeId", "managerQualification", "managerExperience", "managerShift"];
const staffFields = ["staffEmployeeId", "staffPosition", "staffShift", "staffAddress"];



function showTypeFields() {
  let type = getRadioValue("userType");

  document.getElementById("formBody").style.display = (type === "") ? "none" : "block";

  document.getElementById("studentFields").style.display = (type === "Student") ? "block" : "none";
  document.getElementById("managerFields").style.display = (type === "Manager") ? "block" : "none";
  document.getElementById("staffFields").style.display = (type === "Staff") ? "block" : "none";

  document.getElementById("typeCardStudent").className = (type === "Student") ? "type-option selected" : "type-option";
  document.getElementById("typeCardManager").className = (type === "Manager") ? "type-option selected" : "type-option";
  document.getElementById("typeCardStaff").className = (type === "Staff") ? "type-option selected" : "type-option";

  if (type !== "") {
    document.getElementById("registerButton").value = "Create " + type + " Account";
  }

  clearAllRegisterErrors();
}



function validateRegister() {
  let type = getRadioValue("userType");
  clearAllRegisterErrors();

  if (type === "") {
    showError("userType", "Please choose the type of account.");
    return false;
  }

  let commonOk = validateCommon(type);
  let typeOk;

  switch (type) {
    case "Student":
      typeOk = validateStudent();
      break;
    case "Manager":
      typeOk = validateManager();
      break;
    case "Staff":
      typeOk = validateStaff();
      break;
  }

  if (!(commonOk && typeOk)) {
    showMessage("registerMessage", "Please fix the fields marked in red.", "error");
    return false;
  }

  let newUser = {
    id: nextId("U", users),
    name: document.getElementById("fullName").value.trim(),
    username: document.getElementById("newUsername").value.trim(),
    password: document.getElementById("newPassword").value,
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    gender: getRadioValue("gender"),
    dob: document.getElementById("dob").value,
    role: type,
    status: "Active"
  };

  if (type === "Student") {
    newUser.studentId = document.getElementById("studentId").value.trim();
    newUser.department = document.getElementById("department").value;
    newUser.semester = document.getElementById("semester").value;
    newUser.favourites = getCheckedValues("favourite");
  } else if (type === "Manager") {
    newUser.employeeId = document.getElementById("managerEmployeeId").value.trim().toUpperCase();
    newUser.qualification = document.getElementById("managerQualification").value;
    newUser.experience = Number(document.getElementById("managerExperience").value);
    newUser.shift = getRadioValue("managerShift");
    newUser.status = "Pending";             
  } else {
    newUser.employeeId = document.getElementById("staffEmployeeId").value.trim().toUpperCase();
    newUser.position = document.getElementById("staffPosition").value;
    newUser.shift = getRadioValue("staffShift");
    newUser.address = document.getElementById("staffAddress").value.trim();
    newUser.duties = getCheckedValues("duty");
    newUser.status = "Pending";              
  }

  users.push(newUser);
  console.log("New user:", newUser);

  let text = "Welcome, <strong>" + newUser.name + "</strong>! Your " + type.toLowerCase() +
             " account was created (user id " + newUser.id + "). ";
  if (newUser.status === "Pending") {
    text += "An admin will check your details; you can log in after approval.";
  } else {
    text += "<a href='login.html'>Log in now</a>.";
  }
  text += "<br><span class='hint'>Frontend version: the account is kept until this page reloads. " +
          "The PHP backend will save it permanently.</span>";
  showMessage("registerMessage", text, "success");

  // Empty the form and go back to step 1
  document.getElementById("registerForm").reset();
  resetRegisterForm();
  return false;  
}


function validateCommon(type) {
  let isValid = true;

  let fullName = document.getElementById("fullName").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let dob = document.getElementById("dob").value;
  let username = document.getElementById("newUsername").value.trim();
  let password = document.getElementById("newPassword").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  if (fullName.length < 3) {
    showError("fullName", "Full name must be at least 3 characters.");
    isValid = false;
  }

  if (isEmpty(email)) {
    showError("email", "Email is required.");
    isValid = false;
  } else if (isValidEmail(email) === false) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  } else if (isTaken("email", email)) {
    showError("email", "An account with this email already exists.");
    isValid = false;
  }

  if (isDigitsOnly(phone) === false || phone.length !== 11 || phone.slice(0, 2) !== "01") {
    showError("phone", "Phone must be 11 digits and start with 01.");
    isValid = false;
  }

  if (getRadioValue("gender") === "") {
    showError("gender", "Please select an option.");
    isValid = false;
  }

  let minimumAge;
  switch (type) {
    case "Manager":
      minimumAge = 21;
      break;
    case "Staff":
      minimumAge = 18;
      break;
    default:
      minimumAge = 16;
  }

  if (dob === "") {
    showError("dob", "Date of birth is required.");
    isValid = false;
  } else if (getAge(dob) < minimumAge) {
    showError("dob", "A " + type.toLowerCase() + " must be at least " + minimumAge + " years old.");
    isValid = false;
  }

  if (username.length < 4) {
    showError("newUsername", "Username must be at least 4 characters.");
    isValid = false;
  } else if (username.indexOf(" ") !== -1) {
    showError("newUsername", "Username cannot contain spaces.");
    isValid = false;
  } else if (isTaken("username", username)) {
    showError("newUsername", "This username is already taken.");
    isValid = false;
  }

  if (password.length < 8) {
    showError("newPassword", "Password must be at least 8 characters.");
    isValid = false;
  } else if (hasDigit(password) === false) {
    showError("newPassword", "Password must contain at least one digit.");
    isValid = false;
  }

  if (confirmPassword === "" || confirmPassword !== password) {
    showError("confirmPassword", "Password and Confirm Password must match.");
    isValid = false;
  }

  return isValid;
}


function validateStudent() {
  let isValid = true;
  let studentId = document.getElementById("studentId").value.trim();

  if (isValidStudentId(studentId) === false) {
    showError("studentId", "Use the format 23-51234-1.");
    isValid = false;
  } else if (isTaken("studentId", studentId)) {
    showError("studentId", "This student ID is already registered.");
    isValid = false;
  }

  if (document.getElementById("department").value === "") {
    showError("department", "Please select your department.");
    isValid = false;
  }

  if (document.getElementById("semester").value === "") {
    showError("semester", "Please select your semester.");
    isValid = false;
  }

  return isValid;
}


function validateManager() {
  let isValid = true;
  let employeeId = document.getElementById("managerEmployeeId").value.trim().toUpperCase();
  let experienceText = document.getElementById("managerExperience").value;
  let experience = Number(experienceText);

  if (isValidEmployeeId(employeeId, "MGR-") === false) {
    showError("managerEmployeeId", "Use the format MGR-1234.");
    isValid = false;
  } else if (isTaken("employeeId", employeeId)) {
    showError("managerEmployeeId", "This employee ID is already registered.");
    isValid = false;
  }

  if (document.getElementById("managerQualification").value === "") {
    showError("managerQualification", "Please select your qualification.");
    isValid = false;
  }

  if (experienceText === "" || experience < 0 || experience > 40) {
    showError("managerExperience", "Enter a number from 0 to 40.");
    isValid = false;
  }

  if (getRadioValue("managerShift") === "") {
    showError("managerShift", "Please choose a shift.");
    isValid = false;
  }

  return isValid;
}


function validateStaff() {
  let isValid = true;
  let employeeId = document.getElementById("staffEmployeeId").value.trim().toUpperCase();
  let address = document.getElementById("staffAddress").value.trim();

  if (isValidEmployeeId(employeeId, "STF-") === false) {
    showError("staffEmployeeId", "Use the format STF-1234.");
    isValid = false;
  } else if (isTaken("employeeId", employeeId)) {
    showError("staffEmployeeId", "This employee ID is already registered.");
    isValid = false;
  }

  if (document.getElementById("staffPosition").value === "") {
    showError("staffPosition", "Please select your position.");
    isValid = false;
  }

  if (getRadioValue("staffShift") === "") {
    showError("staffShift", "Please choose a shift.");
    isValid = false;
  }

  if (address.length < 10) {
    showError("staffAddress", "Please write your full address (at least 10 characters).");
    isValid = false;
  } else if (address.length > 200) {
    showError("staffAddress", "Address must be 200 characters or less.");
    isValid = false;
  }

  return isValid;
}



function isTaken(property, value) {
  for (const user of users) {
    if (user[property] !== undefined && String(user[property]).toLowerCase() === value.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function isValidStudentId(text) {
  if (text.length !== 10 || text[2] !== "-" || text[8] !== "-") {
    return false;
  }
  return isDigitsOnly(text.slice(0, 2)) && isDigitsOnly(text.slice(3, 8)) && isDigitsOnly(text.slice(9));
}

function isValidEmployeeId(text, prefix) {
  if (text.length !== 8 || text.slice(0, 4) !== prefix) {
    return false;
  }
  return isDigitsOnly(text.slice(4));
}


function getAge(dob) {
  let today = todayString();
  let age = Number(today.slice(0, 4)) - Number(dob.slice(0, 4));
  if (today.slice(5) < dob.slice(5)) {
    age--;                     
  }
  return age;
}

function getCheckedValues(groupName) {
  let boxes = document.getElementsByName(groupName);
  let selected = [];
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      selected.push(boxes[i].value);
    }
  }
  return selected;
}

function showPasswordStrength() {
  let password = document.getElementById("newPassword").value;
  let text = document.getElementById("strengthText");
  let score = 0;

  if (password.length >= 8) { score++; }
  if (password.length >= 12) { score++; }
  if (hasDigit(password)) { score++; }
  if (password.toLowerCase() !== password) { score++; }   // has a capital letter

  if (password === "") {
    text.innerHTML = "";
  } else if (score <= 1) {
    text.innerHTML = "Strength: weak";
    text.style.color = "#C62828";
  } else if (score <= 2) {
    text.innerHTML = "Strength: fair";
    text.style.color = "#EF6C00";
  } else {
    text.innerHTML = "Strength: strong";
    text.style.color = "#2E7D32";
  }
}

function toggleRegisterButton() {
  document.getElementById("registerButton").disabled = !document.getElementById("terms").checked;
}

function clearAllRegisterErrors() {
  clearError("userType");
  clearErrors(commonFields);
  clearErrors(studentFields);
  clearErrors(managerFields);
  clearErrors(staffFields);
}

function resetRegisterForm() {
  clearAllRegisterErrors();
  document.getElementById("formBody").style.display = "none";
  document.getElementById("typeCardStudent").className = "type-option";
  document.getElementById("typeCardManager").className = "type-option";
  document.getElementById("typeCardStaff").className = "type-option";
  document.getElementById("registerButton").disabled = true;
  document.getElementById("registerButton").value = "Create Account";
  document.getElementById("strengthText").innerHTML = "";
}
