
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

  const dashboards = {
    admin: "admin.html",
    manager: "manager.html",
    staff: "staff.html",
    student: "student/student.html"
  };

  const role = String(foundUser.role || "").trim().toLowerCase();
  const destination = dashboards[role];

  if (!destination) {
    showMessage(
      "loginMessage",
      "Hello " + foundUser.name + ", no dashboard is available for your role.",
      "info"
    );
    return false;
  }

  sessionStorage.setItem("canteenCurrentUser", JSON.stringify({
    id: foundUser.id,
    name: foundUser.name.trim(),
    username: foundUser.username,
    role: foundUser.role
  }));

  window.location.href = destination;
  return false;
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
