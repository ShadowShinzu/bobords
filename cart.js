document.addEventListener("DOMContentLoaded", function () {
    const loggedInUserId = localStorage.getItem("loggedInUserId");

    if (!loggedInUserId) {
        alert("You must be logged in to view your cart.");
        window.location.href = "login.html";
        return;
    }

    let cart = JSON.parse(localStorage.getItem(`cart_${loggedInUserId}`)) || [];
    
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

            // Create a header row for the cart items
            const headerRow = document.createElement("div");
            headerRow.className = "cart-item-row header-row";
            headerRow.innerHTML = `
                <div class="cart-item-order"><strong>Order</strong></div>
                <div class="cart-item-quantity"><strong>Quantity</strong></div>
                <div class="cart-item-price"><strong>Price</strong></div>
                <div class="cart-item-remove"></div> <!-- Placeholder for the remove button -->
            `;
            cartItemsContainer.appendChild(headerRow);

            cart.forEach((item, index) => {
                const inventoryItem = inventory.find(invItem => invItem.id === item.id);

                if (inventoryItem && inventoryItem.quantity <= 0) {
                    // Remove item from cart if inventory quantity is zero
                    cart.splice(index, 1);
                    localStorage.setItem(`cart_${loggedInUserId}`, JSON.stringify(cart));
                    updateCart(); // Re-run updateCart to reflect changes
                    return;
                }

                const itemElement = document.createElement("div");
                itemElement.className = "cart-item";
                itemElement.innerHTML = `
                    <div class="cart-item-order">${item.name}</div>
                    <div class="cart-item-quantity">${item.quantity}</div>
                    <div class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-button" onclick="removeItem(${index})">Remove</button>
                `;
                cartItemsContainer.appendChild(itemElement);

                total += item.price * item.quantity;
            });
        }

        totalPriceElement.textContent = `Total: ₱${total.toFixed(2)}`;
        console.log("Cart items:", cart);
    }

    updateCart();

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem(`cart_${loggedInUserId}`, JSON.stringify(cart));
        updateCart();
    };

    document.getElementById("checkout").addEventListener("click", function () {
        // Check for items with zero quantity before proceeding to checkout
        const itemsWithZeroQuantity = cart.filter(item => {
            const inventoryItem = JSON.parse(localStorage.getItem('inventory')).find(i => i.id === item.id);
            return !inventoryItem || inventoryItem.quantity <= 0;
        });

        console.log("Items with zero quantity:", itemsWithZeroQuantity);
        
        if (itemsWithZeroQuantity.length > 0) {
            alert("Your cart contains items with zero quantity. Please update the stock before proceeding to checkout.");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        // Redirect to checkout page
        window.location.href = "checkout.html";
    });
});
