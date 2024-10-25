document.addEventListener("DOMContentLoaded", function () {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let userData = users.find(user => user.id === parseInt(loggedInUserId)) || {};

    const profileInfoContainer = document.getElementById("profile-info");
    const purchaseHistoryContainer = document.getElementById("purchase-history-content");
    const totalPriceElement = document.getElementById("total-price");

    function displayUserProfile() {
        profileInfoContainer.innerHTML = `
            <div class="info-item" style="border: 1px solid #ddd; width: 350px; padding: 2px;">
                <p><strong>First Name:</strong> ${userData.firstName || 'N/A'}</p>
            </div>
            <div class="info-item" style="border: 1px solid #ddd; width: 350px; padding: 2px;">
                <p><strong>Last Name:</strong> ${userData.lastName || 'N/A'}</p>
            </div>
            <div class="info-item" style="border: 1px solid #ddd; width: 350px; padding: 2px;">
                <p><strong>Email:</strong> ${userData.email || 'N/A'}</p>
            </div>
            <div class="info-item" style="border: 1px solid #ddd; width: 350px; padding: 2px;">
                <p><strong>Phone:</strong> ${userData.phone || 'N/A'}</p>
            </div>
            <div class="info-item" style="border: 1px solid #ddd; width: 350px; padding: 2px;">
                <p><strong>Location:</strong> ${userData.location || 'N/A'}</p>
            </div>
            <div class="info-item" style="border: 1px solid #ddd; width: 350px; padding: 2px;">
                <p><strong>Birthday:</strong> ${userData.birthday || 'N/A'}</p>
            </div>
            <div class="info-item" style="border: 1px solid #ddd; width: 350px; padding: 2px;">
                <p><strong>Gender:</strong> ${userData.gender || 'N/A'}</p>
            </div>
            <button id="edit-profile-btn">Edit Profile</button>
        `;
        document.getElementById("edit-profile-btn").addEventListener("click", openEditProfileModal);
    }

    function openEditProfileModal() {
        const modalHTML = `
            <div id="edit-profile-modal" class="modal">
                <div class="modal-content">
                    <span id="close-modal" class="close">&times;</span>
                    <h2 class="modal-heading">Edit Profile</h2>
                    <div class="form-group">
                        <label for="first-name">First Name:</label>
                        <input type="text" id="first-name" value="${userData.firstName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="last-name">Last Name:</label>
                        <input type="text" id="last-name" value="${userData.lastName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="email">Email:</label>
                        <input type="email" id="email" value="${userData.email || ''}">
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone:</label>
                        <input type="text" id="phone" value="${userData.phone || ''}">
                    </div>
                    <div class="form-group">
                        <label for="location">Location:</label>
                        <input type="text" id="location" value="${userData.location || ''}">
                    </div>
                    <div class="form-group">
                        <label for="birthday">Birthday:</label>
                        <input type="date" id="birthday" value="${userData.birthday || ''}">
                    </div>
                    <div class="form-group">
                        <label for="gender">Gender:</label>
                        <input type="text" id="gender" value="${userData.gender || ''}">
                    </div>
                    <button id="save-changes-btn">Save Changes</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById("close-modal").onclick = closeEditProfileModal;
        document.getElementById("save-changes-btn").onclick = saveProfileChanges;
    }

    function saveProfileChanges() {
        const updatedUserData = {
            firstName: document.getElementById("first-name").value,
            lastName: document.getElementById("last-name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            location: document.getElementById("location").value,
            birthday: document.getElementById("birthday").value,
            gender: document.getElementById("gender").value,
        };
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(user => user.id === parseInt(loggedInUserId));
        if (userIndex !== -1) {
            users[userIndex] = { id: parseInt(loggedInUserId), ...updatedUserData };
            localStorage.setItem("users", JSON.stringify(users));
            userData = users[userIndex];
            displayUserProfile();
            showNotification("Profile successfully updated!");
            closeEditProfileModal();
        }
    }

    function showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function closeEditProfileModal() {
        const modal = document.getElementById("edit-profile-modal");
        if (modal) {
            modal.remove();
        }
    }

    if (userData) {
        displayUserProfile();
    } else {
        profileInfoContainer.innerHTML = "<p>No user data found.</p>";
    }

    const purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${loggedInUserId}`)) || [];
    let totalPrice = 0;

    if (purchaseHistory.length > 0) {
        purchaseHistory.forEach(purchase => {
            purchase.items.forEach(item => {
                const purchaseRow = document.createElement("tr");
                purchaseRow.className = "purchase-row";
                const itemPrice = item.price || 0;
                totalPrice += itemPrice;
                purchaseRow.innerHTML = `
                    <td>${item.name || 'N/A'}</td>
                    <td>₱ ${itemPrice ? itemPrice.toFixed(2) : 'N/A'}</td>
                    <td>BrewScape</td>
                    <td>${purchase.date || 'N/A'}</td>
                `;
                purchaseHistoryContainer.appendChild(purchaseRow);
            });
        });
        totalPriceElement.innerHTML = `<strong>Total Spend:</strong> ₱ ${totalPrice.toFixed(2)}`;
    } else {
        purchaseHistoryContainer.innerHTML = "<tr><td colspan='4' class='no-purchases'>No purchase history found.</td></tr>";
    }
});
