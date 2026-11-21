
function validateLogin() {
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;

  let isValid = true;
  clearLoginErrors();

  if (isEmpty(username)) {
    showError("username", "Please enter your username or email.");
    isValid = false;
  }

  if (isEmpty(password)) {
    showError("password", "Please enter your password.");
    isValid = false;
  } else if (password.length < 8) {
    showError("password", "Password must be at least 8 characters.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  let foundUser = null;
  for (const user of users) {
    let sameName = user.username.toLowerCase() === username.toLowerCase();
    let sameEmail = user.email.toLowerCase() === username.toLowerCase();

    if (sameName || sameEmail) {
      foundUser = user;
      break;
    }
  }

  if (foundUser === null || foundUser.password !== password) {
    showMessage("loginMessage", "Wrong username or password. Please try again.", "error");
    return false;
  }

  if (foundUser.status === "Blocked") {
    showMessage("loginMessage", "This account is blocked. Please contact the canteen admin.", "error");
    return false;
  }

  let form = document.getElementById("loginForm");

  switch (foundUser.role) {
    case "Admin":
      form.action = "admin.html";
      break;

    case "Manager":
      form.action = "manager.html";
      break;

    case "Staff":
      form.action = "staff.html";
      break;

    case "Student":
      form.action = "student.html";
      break;

    default:
      showMessage(
        "loginMessage",
        "Hello " + foundUser.name + ", no dashboard is available for your role.",
        "info"
      );
      return false;
  }

  console.log("Login OK: " + foundUser.name + " (" + foundUser.role + ") -> " + form.action);
  return true;
}

function clearLoginErrors() {
  clearErrors(["username", "password"]);
  hideMessage("loginMessage");
}

function togglePassword() {
  let passwordInput = document.getElementById("password");

  if (document.getElementById("showPassword").checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

function fillDemo(username, password) {
  document.getElementById("username").value = username;
  document.getElementById("password").value = password;
  clearLoginErrors();
}
