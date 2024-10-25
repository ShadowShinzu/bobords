document.addEventListener("DOMContentLoaded", function() {
    const cartItemsContainer = document.getElementById("cart-items");
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (!loggedInUserId) {
        alert("You must be logged in to complete the checkout.");
        window.location.href = "login.html";
        return;
    }

    // Load the user's cart
    const cart = JSON.parse(localStorage.getItem(`cart_${loggedInUserId}`)) || [];
    console.log("Loaded cart:", cart); // Debugging line

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <p><strong>Item:</strong> ${item.name}</p>
                <p><strong>Price:</strong> ₱${item.price} </p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <p><strong>Total:</strong> ₱${item.price * item.quantity} </p>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        const totalElement = document.createElement("div");
        totalElement.className = "cart-total";
        totalElement.innerHTML = `<h3>Total Cost: ₱${total} </h3>`;
        cartItemsContainer.appendChild(totalElement);
    }

    updateCartDisplay();

    document.getElementById("checkout-form").addEventListener("submit", function(event) {
        event.preventDefault();

        // Retrieve payment details
        const name = document.getElementById("name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        console.log("Payment details:", { name, cardNumber, expiryDate, cvv }); // Debugging line

        if (!name || !cardNumber || !expiryDate || !cvv) {
            alert("Please fill in all payment details.");
            return;
        }

        // Basic card number and CVV validation
        if (cardNumber.length !== 6) {
            alert("Please enter a valid card number (6 digits).");
            return;
        }
        
        if (cvv.length < 3 || cvv.length > 4) {
            alert("Please enter a valid CVV.");
            return;
        }

        // Process the order
        const purchaseDateTime = new Date().toLocaleString();
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        console.log("Total amount:", total); // Debugging line

        // Update inventory
        function updateInventory(cart) {
            const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

            cart.forEach(cartItem => {
                const inventoryItem = inventory.find(item => item.name === cartItem.name);
                if (inventoryItem) {
                    inventoryItem.quantity -= cartItem.quantity;
                    if (inventoryItem.quantity < 0) inventoryItem.quantity = 0; // Prevent negative quantities
                }
            });

            localStorage.setItem('inventory', JSON.stringify(inventory));
        }
        updateInventory(cart);

        // Save purchase history
        let purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${loggedInUserId}`)) || [];
        const purchase = {
            date: purchaseDateTime,
            items: cart,
            total: total,
            paymentDetails: {
                name: name,
                cardNumber: cardNumber.slice(-4), // Only store last 4 digits for security
                expiryDate: expiryDate
            }
        };
        purchaseHistory.push(purchase);
        localStorage.setItem(`purchaseHistory_${loggedInUserId}`, JSON.stringify(purchaseHistory));

        // Save transaction for admin dashboard
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        const transaction = {
            date: purchaseDateTime,
            userId: loggedInUserId,
            items: cart,
            total: total
        };
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Clear the cart
        localStorage.removeItem(`cart_${loggedInUserId}`);

        alert("Thank you for your purchase!");
        window.location.href = "home.html";
    });
});
