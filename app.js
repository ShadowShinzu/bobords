function initializeInventory() {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    if (inventory.length === 0) {
        inventory = [
            {
                id: '1',
                name: 'Iced Cappuccino',
                price: 120,
                quantity: 1,
                category: 'coffee',
                image: 'https://img.freepik.com/free-photo/high-view-glass-cappucino-with-coffee-beans_23-2148251687.jpg'
            },
            {
                id: '2',
                name: 'Salted Caramel Cold Brew',
                price: 120,
                quantity: 1,
                category: 'coffee',
                image: 'https://img.freepik.com/free-photo/lced-cocoa-with-sweet-milk-cold-chocolate-drink_1150-25303.jpg'
            },
            {
                id: '3',
                name: 'Chocolate Muffin',
                price: 150,
                quantity: 1,
                category: 'pastries',
                image: 'https://img.freepik.com/free-photo/view-delicious-muffin_23-2150777669.jpg'
            },
            {
                id: '4',
                name: 'Croissant',
                price: 100,
                quantity: 1,
                category: 'pastries',
                image: 'https://img.freepik.com/free-photo/high-angle-croissant-with-melted-chocolate_23-2148542532.jpg'
            },
            {
                id: '5',
                name: 'High Brew Coffee',
                price: 210,
                quantity: 50,
                category: 'coffee',
                image: 'https://img.freepik.com/free-photo/view-3d-coffee-cup_23-2151083733.jpg'
            }
        ];
        localStorage.setItem('inventory', JSON.stringify(inventory));
        console.log("Inventory initialized:", inventory);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
  
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('input', performSearch);
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const itemName = item.dataset.name.toLowerCase();
        if (searchTerm === '' || fuzzyMatch(itemName, searchTerm)) {
            item.style.display = 'block';
            if (searchTerm === '') {
                removeHighlight(item);
            } else {
                highlightMatch(item, searchTerm);
            }
        } else {
            item.style.display = 'none';
            removeHighlight(item);
        }
    });
}

function fuzzyMatch(str, pattern) {
    const letters = pattern.split('');
    let index = 0;
    for (let letter of letters) {
        index = str.indexOf(letter, index);
        if (index === -1) {
            return false;
        }
        index++;
    }
    return true;
}

function highlightMatch(item, searchTerm) {
    const itemNameElement = item.querySelector('h3');
    const itemName = itemNameElement.textContent;
    const highlightedName = itemName.replace(new RegExp(`(${searchTerm.split('').join('|')})`, 'gi'), '<span class="highlight">$1</span>');
    itemNameElement.innerHTML = highlightedName;
}

function removeHighlight(item) {
    const itemNameElement = item.querySelector('h3');
    itemNameElement.innerHTML = itemNameElement.textContent;
}

function loadMenuItems() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const menuItemsContainer = document.querySelector('.menu-items');
    
    if (!menuItemsContainer) {
        console.log("Menu items container not found");
        return;
    } else {
        console.log("Menu items container found");
    }

    menuItemsContainer.innerHTML = '';
    
    inventory.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.id = item.id;
        menuItem.dataset.name = item.name;
        menuItem.dataset.price = item.price;
        menuItem.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}" >
            <h3>${item.name} <span>[${item.quantity}]</span></h3>
            <p> <strong>₱</strong>${item.price}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;
        menuItemsContainer.appendChild(menuItem);
    });
}

function setupAddToCartButtons() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const menuItem = event.target.closest(".menu-item");
            const itemId = menuItem.dataset.id;
            const itemName = menuItem.dataset.name;
            const itemPrice = parseFloat(menuItem.dataset.price);

            const loggedInUserId = localStorage.getItem("loggedInUserId");

            if (!loggedInUserId) {
                alert("You must be logged in to add items to the cart.");
                window.location.href = "login.html";
                return;
            }

            let cart = JSON.parse(localStorage.getItem(`cart_${loggedInUserId}`)) || [];
            const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
            const inventoryItem = inventory.find(item => item.id === itemId);

            if (!inventoryItem || inventoryItem.quantity <= 0) {
                alert("This item is out of stock and cannot be added to the cart.");
                return;
            }

            const cartItem = {
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: 1
            };

            const existingItemIndex = cart.findIndex(item => item.id === itemId);
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem(`cart_${loggedInUserId}`, JSON.stringify(cart));
            showNotification(`${itemName} added to your cart!`);
        });
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.opacity = '1'; 

    setTimeout(() => {
        notification.style.opacity = '0'; 

        setTimeout(() => {
            notification.style.display = 'none'; 
        }, 500); 
    }, 3000); 
}

document.addEventListener('DOMContentLoaded', () => {
    initializeInventory();
    loadMenuItems();
    setupAddToCartButtons();
    initializeAdminAccount();
    setupSearch();
});

function processCheckout() {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    const cart = JSON.parse(localStorage.getItem(`cart_${loggedInUserId}`)) || [];

    const itemsWithZeroQuantity = cart.filter(item => {
        const inventoryItem = JSON.parse(localStorage.getItem('inventory')).find(i => i.id === item.id);
        return !inventoryItem || inventoryItem.quantity <= 0;
    });

    if (itemsWithZeroQuantity.length > 0) {
        alert("Your cart contains items with zero quantity. Please update the stock before proceeding to checkout.");
        console.log("Items with zero quantity:", itemsWithZeroQuantity); 
        return;
    }

    updateInventory(cart);
    localStorage.removeItem(`cart_${loggedInUserId}`);

    alert("Checkout successful!");
}

function updateInventory(cart) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    cart.forEach(cartItem => {
        const inventoryItem = inventory.find(item => item.id === cartItem.id);
        if (inventoryItem) {
            inventoryItem.quantity -= cartItem.quantity;
            if (inventoryItem.quantity < 0) inventoryItem.quantity = 0; 
        }
    });
    
    localStorage.setItem('inventory', JSON.stringify(inventory));
    console.log("Inventory updated:", inventory); 
}

function initializeAdminAccount() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.some(user => user.role === 'admin');

    if (!adminExists) {
        const adminUser = {
            id: 'admin',
            email: 'admin@brewscape.com',
            password: 'adminpassword', 
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
        };
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log("Admin account created: email - admin@brewscape.com, password - adminpassword");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeInventory();
    loadMenuItems();
    setupAddToCartButtons();
    initializeAdminAccount();
    setupSearch();
});
