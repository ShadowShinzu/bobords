document.getElementById("logout-button").addEventListener("click", function() {
  const loggedInUserId = localStorage.getItem("loggedInUserId");

  if (loggedInUserId) {
      const purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${loggedInUserId}`)) || [];
  }
  localStorage.removeItem("loggedInUserId");

  window.location.href = "login.html";
});
