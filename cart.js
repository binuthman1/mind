document.addEventListener("DOMContentLoaded", () => {
  console.log("Cart.js loaded");

  // Load cart items
  loadCartItems();

  // Handle checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // Check if cart is empty
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        alert("Your cart is empty. Please add some products before proceeding to checkout.");
        return;
      }

      window.location.href = "checkout.html";
    });
  }
  
  // Update cart count on page load
  updateCartCount();
});

// Function to load cart items
function loadCartItems() {
  console.log("Loading cart items");
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  if (!cartItemsContainer) {
    console.error("Cart items container not found");
    return;
  }

  // Get cart from localStorage
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart from localStorage:", cart);
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
  }

  if (cart.length === 0) {
    console.log("Cart is empty");
    // Show empty cart message
    if (emptyCart) {
      emptyCart.style.display = "block";
    }

    // Update totals
    if (subtotalElement) subtotalElement.textContent = formatPrice(0);
    if (shippingElement) shippingElement.textContent = formatPrice(0);
    if (taxElement) taxElement.textContent = formatPrice(0);
    if (totalElement) totalElement.textContent = formatPrice(0);

    return;
  }

  // Hide empty cart message
  if (emptyCart) {
    emptyCart.style.display = "none";
  }

  // Generate HTML for cart items
  let html = "";

  cart.forEach((item) => {
    console.log("Processing cart item:", item);
    
    // Use the item data directly instead of fetching from products
    const itemTotal = item.price * item.quantity;

    html += `
      <div class="cart-item" data-item-id="${item.id}" data-item-size="${item.size || ''}" data-item-color="${item.color || ''}">
        <div class="cart-item-image">
          <img src="${item.image || "/placeholder.svg?height=100&width=100"}" alt="${item.name}" onerror="this.src='/placeholder.svg?height=100&width=100'">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <div class="cart-item-variant">
            ${item.size ? `Size: ${item.size}` : ""}
            ${item.color ? `Color: ${item.color}` : ""}
          </div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-actions">
          <div class="cart-item-quantity">
            <button class="decrease-quantity">-</button>
            <input type="number" value="${item.quantity}" min="1" max="10">
            <button class="increase-quantity">+</button>
          </div>
          <div class="cart-item-total">${formatPrice(itemTotal)}</div>
          <div class="cart-item-remove">
            <button class="remove-item"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = html;
  console.log("Cart HTML generated");

  // Add event listeners for quantity changes and remove buttons
  const cartItems = document.querySelectorAll(".cart-item");
  console.log(`Found ${cartItems.length} cart items to attach listeners to`);
  
  cartItems.forEach((item) => {
    const itemId = parseInt(item.dataset.itemId);
    const itemSize = item.dataset.itemSize;
    const itemColor = item.dataset.itemColor;
    
    console.log(`Setting up listeners for item: ${itemId}, size: ${itemSize}, color: ${itemColor}`);

    const quantityInput = item.querySelector(".cart-item-quantity input");
    const decreaseBtn = item.querySelector(".decrease-quantity");
    const increaseBtn = item.querySelector(".increase-quantity");
    const removeBtn = item.querySelector(".remove-item");

    if (decreaseBtn) {
      decreaseBtn.addEventListener("click", () => {
        console.log(`Decrease quantity clicked for item: ${itemId}`);
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
          updateCartItemQuantity(itemId, currentValue - 1, itemSize, itemColor);
        }
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener("click", () => {
        console.log(`Increase quantity clicked for item: ${itemId}`);
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
          quantityInput.value = currentValue + 1;
          updateCartItemQuantity(itemId, currentValue + 1, itemSize, itemColor);
        }
      });
    }

    if (quantityInput) {
      quantityInput.addEventListener("change", function() {
        console.log(`Quantity input changed for item: ${itemId}`);
        const newValue = parseInt(this.value);
        if (newValue < 1) {
          this.value = 1;
          updateCartItemQuantity(itemId, 1, itemSize, itemColor);
        } else if (newValue > 10) {
          this.value = 10;
          updateCartItemQuantity(itemId, 10, itemSize, itemColor);
        } else {
          updateCartItemQuantity(itemId, newValue, itemSize, itemColor);
        }
      });
    }

    if (removeBtn) {
      console.log(`Adding click event to remove button for item: ${itemId}`);
      removeBtn.addEventListener("click", () => {
        console.log(`Remove button clicked for item: ${itemId}`);
        removeCartItem(itemId, itemSize, itemColor);
      });
    } else {
      console.error(`Remove button not found for item: ${itemId}`);
    }
  });

  // Calculate and update totals
  updateCartTotals();
}

// Function to update cart item quantity
function updateCartItemQuantity(itemId, quantity, size, color) {
  console.log(`Updating quantity for item: ${itemId}, size: ${size}, color: ${color}, new quantity: ${quantity}`);
  
  // Get cart from localStorage
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return;
  }

  // Find the item in the cart
  const itemIndex = cart.findIndex(
    (item) => 
      item.id === itemId && 
      (item.size || '') === (size || '') && 
      (item.color || '') === (color || '')
  );

  console.log(`Item index in cart: ${itemIndex}`);

  if (itemIndex !== -1) {
    // Update quantity
    cart[itemIndex].quantity = quantity;

    // Update item total in UI
    const cartItem = document.querySelector(
      `.cart-item[data-item-id="${itemId}"][data-item-size="${size || ''}"][data-item-color="${color || ''}"]`
    );
    
    if (cartItem) {
      const itemTotal = cart[itemIndex].price * quantity;
      const totalElement = cartItem.querySelector(".cart-item-total");
      if (totalElement) {
        totalElement.textContent = formatPrice(itemTotal);
      }
    }

    // Save cart to localStorage
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Cart updated in localStorage");
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }

    // Update cart count
    updateCartCount();

    // Update cart totals
    updateCartTotals();
  }
}

// Function to remove cart item
function removeCartItem(itemId, size, color) {
  console.log(`Removing item: ${itemId}, size: ${size}, color: ${color}`);
  
  // Get cart from localStorage
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Current cart:", cart);
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return;
  }

  // Find the item in the cart
  const itemIndex = cart.findIndex(
    (item) => 
      item.id === itemId && 
      (item.size || '') === (size || '') && 
      (item.color || '') === (color || '')
  );

  console.log(`Item index to remove: ${itemIndex}`);

  if (itemIndex !== -1) {
    // Remove item from cart
    cart.splice(itemIndex, 1);
    console.log("Item removed from cart array");

    // Save cart to localStorage
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Updated cart saved to localStorage");
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }

    // Update cart count
    updateCartCount();

    // Show notification
    showNotification("Item removed from cart", "success");

    // Reload cart items
    loadCartItems();
  } else {
    console.error("Item not found in cart");
    showNotification("Error removing item from cart", "error");
  }
}

// Function to update cart totals
function updateCartTotals() {
  console.log("Updating cart totals");
  
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  if (!subtotalElement || !shippingElement || !taxElement || !totalElement) {
    console.error("One or more total elements not found");
    return;
  }

  // Get cart from localStorage
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return;
  }

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Calculate shipping (free shipping over ₦20,000)
  const shipping = subtotal > 20000 ? 0 : 1300;

  // Calculate tax (7.5% - Nigerian VAT)
  const tax = subtotal * 0.075;

  // Calculate total
  const total = subtotal + shipping + tax;

  // Update UI
  subtotalElement.textContent = formatPrice(subtotal);
  shippingElement.textContent = formatPrice(shipping);
  taxElement.textContent = formatPrice(tax);
  totalElement.textContent = formatPrice(total);
  
  console.log(`Cart totals updated: Subtotal: ${formatPrice(subtotal)}, Shipping: ${formatPrice(shipping)}, Tax: ${formatPrice(tax)}, Total: ${formatPrice(total)}`);
}

// Function to update cart count
function updateCartCount() {
  console.log("Updating cart count");
  
  const cartCountElements = document.querySelectorAll(".cart-count");
  if (!cartCountElements.length) {
    console.warn("No cart count elements found");
    return;
  }

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return;
  }

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  cartCountElements.forEach((element) => {
    element.textContent = itemCount;
  });
  
  console.log(`Cart count updated: ${itemCount} items`);
}

// Function to format price in Naira
function formatPrice(price) {
  return "₦" + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

// Function to show notification
function showNotification(message, type = "info") {
  console.log(`Showing notification: ${message}, type: ${type}`);
  
  // Check if notification container exists, if not create it
  let notificationContainer = document.querySelector(".notification-container");
  if (!notificationContainer) {
    notificationContainer = document.createElement("div");
    notificationContainer.className = "notification-container";
    document.body.appendChild(notificationContainer);
    
    // Add styles if not already in CSS
    const style = document.createElement("style");
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
      }
      .notification {
        padding: 15px 20px;
        margin-bottom: 10px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        opacity: 0;
        transform: translateX(50px);
        transition: opacity 0.3s, transform 0.3s;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      .notification.show {
        opacity: 1;
        transform: translateX(0);
      }
      .notification.success {
        background-color: #4CAF50;
      }
      .notification.error {
        background-color: #F44336;
      }
      .notification.info {
        background-color: #2196F3;
      }
      .notification .close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        margin-left: 10px;
      }
    `;
    document.head.appendChild(style);
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    ${message}
    <button class="close-btn">&times;</button>
  `;

  // Add to container
  notificationContainer.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Add close button functionality
  const closeBtn = notification.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    });
  }

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}
