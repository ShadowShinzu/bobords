document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUserId", user.id);
        if (user.role === 'admin') {
            window.location.href = "adminDashboard.html";
        } else {
            window.location.href = "home.html";
        }
    } else {
        alert("Invalid email or password.");
    }
});