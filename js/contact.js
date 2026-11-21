const form = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const success = document.getElementById("formSuccess");

function showError(input, errorId, text) {
  document.getElementById(errorId).textContent = text;
  input.classList.add("invalid");
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(function (el) {
    el.textContent = "";
  });
  [nameInput, emailInput, messageInput].forEach(function (input) {
    input.classList.remove("invalid");
  });
  success.textContent = "";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let valid = true;

  if (name.length < 3) {
    showError(nameInput, "nameError", "Name must be at least 3 characters.");
    valid = false;
  }

  if (!emailPattern.test(email)) {
    showError(emailInput, "emailError", "Please enter a valid email address.");
    valid = false;
  }

  if (message.length < 10) {
    showError(messageInput, "messageError", "Message must be at least 10 characters.");
    valid = false;
  }

  if (valid) {
    success.textContent = "Thank you, " + name + "! Your message has been sent.";
    form.reset();
  }
});