// Setup admin dashboard functionality
function setupAdminDashboard() {
  const inventoryBtn = document.getElementById('inventory-btn');
  const transactionsBtn = document.getElementById('transactions-btn');
  const usersBtn = document.getElementById('users-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const dashboardContent = document.getElementById('dashboard-content');

  inventoryBtn.addEventListener('click', showInventory);
  transactionsBtn.addEventListener('click', showTransactions);
  usersBtn.addEventListener('click', showUsers);
  logoutBtn.addEventListener('click', logout);

  function showInventory() {
      const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
      let html = '<h2>Inventory Management</h2>';
      html += '<table><tr><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th><th>Actions</th></tr>';
      inventory.forEach(item => {
          html += `<tr>
              <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
              <td>${item.name}</td>
              <td>${item.price}</td>
              <td>${item.quantity}</td>
              <td>
                  <button onclick="editItem('${item.id}')">Edit</button>
                  <button onclick="deleteItem('${item.id}')">Delete</button>
              </td>
          </tr>`;
      });
      html += '</table>';
      html += '<button onclick="addItem()">Add New Item</button>';
      dashboardContent.innerHTML = html;
  }


  function showTransactions() {
      const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
      let html = '<h2>Transaction History</h2>';
      html += '<table><tr><th>Date</th><th>User</th><th>Items</th><th>Total</th></tr>';
      transactions.forEach(transaction => {
          html += `<tr>
              <td>${transaction.date}</td>
              <td>${transaction.userId}</td>
              <td>${transaction.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</td>
              <td>${transaction.total}</td>
          </tr>`;
      });
      html += '</table>';
      dashboardContent.innerHTML = html;
  }

  function showUsers() {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      let html = '<h2>User Management</h2>';
      html += '<table><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>';
      users.forEach(user => {
          html += `<tr>
              <td>${user.firstName} ${user.lastName}</td>
              <td>${user.email}</td>
              <td>${user.role || 'user'}</td>
              <td>
                  <button onclick="editUser('${user.id}')">Edit</button>
                  <button onclick="deleteUser('${user.id}')">Delete</button>
              </td>
          </tr>`;
      });
      html += '</table>';
      dashboardContent.innerHTML = html;
  }

  function logout() {
      localStorage.removeItem('loggedInUserId');
      window.location.href = 'login.html';
  }

  window.editItem = function(id) {
      const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
      const item = inventory.find(i => i.id === id);
      if (item) {
          const newName = prompt('Enter new name:', item.name);
          const newPrice = prompt('Enter new price:', item.price);
          const newQuantity = prompt('Enter new quantity:', item.quantity);
          const newImage = prompt('Enter new image URL:', item.image);
          if (newName && !isNaN(newPrice) && !isNaN(newQuantity)) {
              item.name = newName;
              item.price = parseFloat(newPrice);
              item.quantity = parseInt(newQuantity);
              item.image = newImage || item.image;
              localStorage.setItem('inventory', JSON.stringify(inventory));
              showInventory();
          } else {
              alert("Invalid input. Please provide valid values for price and quantity.");
          }
      }
  };

  window.deleteItem = function(id) {
      let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
      inventory = inventory.filter(item => item.id !== id);
      localStorage.setItem('inventory', JSON.stringify(inventory));
      showInventory();
  };

  window.addItem = function() {
      const name = prompt('Enter item name:');
      const price = parseFloat(prompt('Enter item price:'));
      const quantity = parseInt(prompt('Enter item quantity:'));
      const image = prompt('Enter image URL:');
      if (name && !isNaN(price) && !isNaN(quantity)) {
          const newItem = {
              id: Date.now().toString(),  // Generate a unique ID
              name: name,
              price: price,
              quantity: quantity,
              image: image || 'https://via.placeholder.com/150'
          };
          const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
          inventory.push(newItem);
          localStorage.setItem('inventory', JSON.stringify(inventory));
          showInventory();
      } else {
          alert("Invalid input. Please provide valid values for price and quantity.");
      }
  };

  window.editUser = function(id) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.id === id);
      if (user) {
          const newFirstName = prompt('Enter new first name:', user.firstName);
          const newLastName = prompt('Enter new last name:', user.lastName);
          const newEmail = prompt('Enter new email:', user.email);
          const newRole = prompt('Enter new role:', user.role);
          if (newFirstName && newLastName && newEmail) {
              user.firstName = newFirstName;
              user.lastName = newLastName;
              user.email = newEmail;
              user.role = newRole;
              localStorage.setItem('users', JSON.stringify(users));
              showUsers();
          } else {
              alert("Invalid input. Please provide valid values.");
          }
      }
  };

  window.deleteUser = function(id) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.filter(user => user.id !== id);
      localStorage.setItem('users', JSON.stringify(users));
      showUsers();
  };
}


// Initialize admin dashboard when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  setupAdminDashboard();
});
