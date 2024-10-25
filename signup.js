document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault();

  console.log("Form submitted!");

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const location = document.getElementById("location").value;
  const birthday = document.getElementById("birthday").value;
  const gender = document.getElementById("gender").value;

  if (!firstName || !lastName || !email || !phone || !password || !location || !birthday || !gender) {
    alert("Please fill in all fields.");
    return;
  }

  const userId = Date.now();

  const userData = {
    id: userId,
    firstName,
    lastName,
    email,
    phone,
    password,
    location,
    birthday,
    gender
  };

  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.push(userData);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully!");

  window.location.href = "login.html";
});
