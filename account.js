document.addEventListener("DOMContentLoaded", () => {
  console.log("Account page script loaded");

  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    console.log("No user logged in, redirecting to login page");
    window.location.href = "login.html?redirect=account.html";
    return;
  }

  console.log("User logged in:", currentUser);

  // Update user info in sidebar
  updateUserInfo(currentUser);

  // Load account data
  loadAccountData(currentUser);

  // Tab switching
  const tabLinks = document.querySelectorAll(".account-menu a");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("id") === "sidebar-logout") {
        return; // Skip for logout link
      }

      e.preventDefault();
      const tabId = this.getAttribute("href").substring(1);
      console.log("Tab clicked:", tabId);

      // Remove active class from all tabs
      tabLinks.forEach((tab) => tab.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to current tab
      this.classList.add("active");
      document.getElementById(tabId + "-tab").classList.add("active");

      // Update URL hash
      window.location.hash = tabId;
    });
  });

  // Check for hash in URL
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const tabLink = document.querySelector(`.account-menu a[href="#${hash}"]`);
    if (tabLink) {
      tabLink.click();
    }
  }

  // Logout functionality
  const logoutLinks = document.querySelectorAll("#logout-link, #sidebar-logout");
  logoutLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Logging out");

      localStorage.removeItem("currentUser");
      showNotification("You have been logged out successfully.");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    });
  });

  // Profile form handling
  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Profile form submitted");

      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const displayName = document.getElementById("display-name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const currentPassword = document.getElementById("current-password").value;
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      // Validate form
      if (!firstName || !lastName || !email) {
        showNotification("Please fill in all required fields.", "error");
        return;
      }

      try {
        // Get all users
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find current user
        const userIndex = users.findIndex((user) => user.id === currentUser.id);

        if (userIndex !== -1) {
          // Update user data
          users[userIndex].firstName = firstName;
          users[userIndex].lastName = lastName;
          users[userIndex].displayName = displayName || `${firstName} ${lastName}`;
          users[userIndex].email = email;
          users[userIndex].phone = phone;

          // Update password if changing
          if (newPassword && currentPassword === currentUser.password && newPassword === confirmPassword) {
            users[userIndex].password = newPassword;
          } else if (newPassword && currentPassword !== currentUser.password) {
            showNotification("Current password is incorrect.", "error");
            return;
          } else if (newPassword && newPassword !== confirmPassword) {
            showNotification("New passwords do not match.", "error");
            return;
          }

          // Save updated users
          localStorage.setItem("users", JSON.stringify(users));

          // Update current user
          const updatedUser = users[userIndex];
          localStorage.setItem("currentUser", JSON.stringify(updatedUser));

          // Update user info in sidebar
          updateUserInfo(updatedUser);

          // Show success message
          showNotification("Your account details have been updated successfully.");

          // Clear password fields
          if (document.getElementById("current-password")) document.getElementById("current-password").value = "";
          if (document.getElementById("new-password")) document.getElementById("new-password").value = "";
          if (document.getElementById("confirm-password")) document.getElementById("confirm-password").value = "";
        } else {
          showNotification("User not found. Please try logging in again.", "error");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        showNotification("An error occurred while updating your profile.", "error");
      }
    });
  }

  // Add address functionality
  const addAddressBtn = document.getElementById("add-address");
  if (addAddressBtn) {
    addAddressBtn.addEventListener("click", () => {
      showAddressForm();
    });
  }

  // Address form handling
  const addressForm = document.getElementById("address-form");
  if (addressForm) {
    addressForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveAddress();
    });
  }

  // Cancel address form
  const cancelAddressBtn = document.getElementById("cancel-address");
  if (cancelAddressBtn) {
    cancelAddressBtn.addEventListener("click", () => {
      hideAddressForm();
    });
  }

  // View order details
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-view") || e.target.closest(".btn-view")) {
      const btn = e.target.classList.contains("btn-view") ? e.target : e.target.closest(".btn-view");
      const orderId = btn.dataset.orderId;
      if (orderId) {
        viewOrderDetails(orderId);
      }
    }
  });

  // Close order modal
  const closeOrderModal = document.getElementById("close-order-modal");
  if (closeOrderModal) {
    closeOrderModal.addEventListener("click", () => {
      const orderModal = document.getElementById("order-modal");
      if (orderModal) {
        orderModal.style.display = "none";
      }
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    const orderModal = document.getElementById("order-modal");
    if (orderModal && e.target === orderModal) {
      orderModal.style.display = "none";
    }
  });
});

// Update user info in sidebar
function updateUserInfo(user) {
  console.log("Updating user info with:", user);

  // Update avatar
  const userAvatar = document.getElementById("user-avatar");
  if (userAvatar) {
    const initials = (user.firstName ? user.firstName.charAt(0) : "") + (user.lastName ? user.lastName.charAt(0) : "");
    userAvatar.textContent = initials;
  }

  // Update name and email
  const userName = document.getElementById("user-name");
  const userEmail = document.getElementById("user-email");
  const dashboardName = document.getElementById("dashboard-name");

  if (userName) userName.textContent = user.displayName || `${user.firstName} ${user.lastName}`;
  if (userEmail) userEmail.textContent = user.email;
  if (dashboardName) dashboardName.textContent = user.firstName;
}

// Load account data
function loadAccountData(user) {
  console.log("Loading account data for:", user);

  // Load orders
  loadOrders(user);

  // Load addresses
  loadAddresses(user);

  // Load wishlist
  loadWishlist(user);

  // Fill profile form
  fillProfileForm(user);

  // Update dashboard stats
  updateDashboardStats(user);
}

// Update dashboard stats
function updateDashboardStats(user) {
  console.log("Updating dashboard stats for user:", user.id);

  try {
    // Get orders
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const userOrders = orders.filter(order => order.userId === user.id);
    
    // Get wishlist
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    
    // Get addresses
    const addresses = JSON.parse(localStorage.getItem(`addresses_${user.id}`)) || [];
    
    // Update stats
    const ordersCount = document.getElementById("orders-count");
    const wishlistCount = document.getElementById("wishlist-count");
    const addressesCount = document.getElementById("addresses-count");
    
    if (ordersCount) ordersCount.textContent = userOrders.length;
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
    if (addressesCount) addressesCount.textContent = addresses.length;
    
    console.log("Dashboard stats updated:", {
      orders: userOrders.length,
      wishlist: wishlist.length,
      addresses: addresses.length
    });
  } catch (error) {
    console.error("Error updating dashboard stats:", error);
  }
}

// Fill profile form
function fillProfileForm(user) {
  console.log("Filling profile form with:", user);

  const firstNameInput = document.getElementById("first-name");
  const lastNameInput = document.getElementById("last-name");
  const displayNameInput = document.getElementById("display-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  if (firstNameInput) firstNameInput.value = user.firstName || "";
  if (lastNameInput) lastNameInput.value = user.lastName || "";
  if (displayNameInput) displayNameInput.value = user.displayName || `${user.firstName} ${user.lastName}`;
  if (emailInput) emailInput.value = user.email || "";
  if (phoneInput) phoneInput.value = user.phone || "";
}

// Load orders
function loadOrders(user) {
  console.log("Loading orders for user:", user.id);

  try {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    console.log("All orders:", orders);

    // Filter orders for current user
    const userOrders = orders.filter((order) => order.userId === user.id);
    console.log("User orders:", userOrders);

    // Update orders count
    const ordersCount = document.getElementById("orders-count");
    if (ordersCount) ordersCount.textContent = userOrders.length;

    // Populate recent orders table
    const recentOrdersTable = document.getElementById("recent-orders-table");
    const ordersTable = document.getElementById("orders-table");

    if (recentOrdersTable) {
      if (userOrders.length > 0) {
        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get recent orders (up to 5)
        const recentOrders = userOrders.slice(0, 5);

        // Generate HTML for recent orders
        let recentOrdersHtml = "";

        recentOrders.forEach((order) => {
          recentOrdersHtml += `
            <tr>
              <td>#${order.id}</td>
              <td>${formatDate(order.date)}</td>
              <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
              <td>${formatPrice(order.total)}</td>
              <td><a href="#" class="btn-view" data-order-id="${order.id}">View</a></td>
            </tr>
          `;
        });

        recentOrdersTable.innerHTML = recentOrdersHtml;
      } else {
        recentOrdersTable.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>No orders yet</h3>
                <p>You haven't placed any orders yet.</p>
                <a href="products.html" class="btn-shop-now">Shop Now</a>
              </div>
            </td>
          </tr>
        `;
      }
    }

    if (ordersTable) {
      if (userOrders.length > 0) {
        // Sort orders by date (newest first)
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Generate HTML for all orders
        let ordersHtml = "";

        userOrders.forEach((order) => {
          ordersHtml += `
            <tr>
              <td>#${order.id}</td>
              <td>${formatDate(order.date)}</td>
              <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
              <td>${formatPrice(order.total)}</td>
              <td><a href="#" class="btn-view" data-order-id="${order.id}">View</a></td>
            </tr>
          `;
        });

        ordersTable.innerHTML = ordersHtml;
      } else {
        ordersTable.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>No orders yet</h3>
                <p>You haven't placed any orders yet.</p>
                <a href="products.html" class="btn-shop-now">Shop Now</a>
              </div>
            </td>
          </tr>
        `;
      }
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    showNotification("An error occurred while loading your orders.", "error");
  }
}

// View order details
function viewOrderDetails(orderId) {
  console.log("Viewing order details for order:", orderId);

  try {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    
    // Find the order
    const order = orders.find(order => order.id.toString() === orderId.toString());
    
    if (!order) {
      console.error("Order not found:", orderId);
      showNotification("Order not found.", "error");
      return;
    }
    
    console.log("Order found:", order);
    
    // Get the modal
    const orderModal = document.getElementById("order-modal");
    const orderContent = document.getElementById("order-content");
    
    if (!orderModal || !orderContent) {
      console.error("Order modal elements not found");
      return;
    }
    
    // Generate order details HTML
    let orderHtml = `
      <div class="order-meta">
        <h3>Order #${order.id}</h3>
        <p><strong>Date:</strong> ${formatDate(order.date)}</p>
        <p><strong>Status:</strong> <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod === "pay-on-delivery" ? "Payment on Delivery" : order.paymentMethod === "paypal" ? "PayPal" : "Credit Card"}</p>
      </div>
      
      <div class="order-address">
        <div class="shipping-address">
          <h4>Shipping Address</h4>
          <p>${order.customer.firstName} ${order.customer.lastName}</p>
          <p>${order.customer.address}</p>
          <p>${order.customer.city}, ${order.customer.state} ${order.customer.zip}</p>
          <p>${order.customer.country}</p>
          <p>Phone: ${order.customer.phone}</p>
        </div>
      </div>
      
      <div class="order-items">
        <h4>Order Items</h4>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add order items
    order.items.forEach(item => {
      orderHtml += `
        <tr>
          <td>
            ${item.name}
            ${item.size ? `<br><small>Size: ${item.size}</small>` : ""}
            ${item.color ? `<br><small>Color: ${item.color}</small>` : ""}
          </td>
          <td>${formatPrice(item.price)}</td>
          <td>${item.quantity}</td>
          <td>${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `;
    });
    
    // Add order totals
    orderHtml += `
          </tbody>
        </table>
      </div>
      
      <div class="order-totals">
        <table>
          <tr>
            <td>Subtotal:</td>
            <td>${formatPrice(order.subtotal)}</td>
          </tr>
          <tr>
            <td>Shipping:</td>
            <td>${formatPrice(order.shipping)}</td>
          </tr>
          <tr>
            <td>Tax:</td>
            <td>${formatPrice(order.tax)}</td>
          </tr>
          <tr class="order-total">
            <td>Total:</td>
            <td>${formatPrice(order.total)}</td>
          </tr>
        </table>
      </div>
    `;
    
    // Update modal content
    orderContent.innerHTML = orderHtml;
    
    // Show the modal
    orderModal.style.display = "block";
    
  } catch (error) {
    console.error("Error viewing order details:", error);
    showNotification("An error occurred while loading order details.", "error");
  }
}

// Load addresses
function loadAddresses(user) {
  console.log("Loading addresses for user:", user.id);

  try {
    // Get addresses from localStorage
    const addresses = JSON.parse(localStorage.getItem(`addresses_${user.id}`)) || [];
    console.log("User addresses:", addresses);
    
    // Update addresses count
    const addressesCount = document.getElementById("addresses-count");
    if (addressesCount) addressesCount.textContent = addresses.length;
    
    // Get the addresses container
    const addressList = document.getElementById("address-list");
    if (!addressList) return;
    
    // Clear existing addresses (except the add address button)
    const addAddressBtn = document.getElementById("add-address");
    if (addAddressBtn) {
      addressList.innerHTML = '';
      addressList.appendChild(addAddressBtn);
    }
    
    // Add addresses to the list
    if (addresses.length > 0) {
      addresses.forEach((address, index) => {
        const addressCard = document.createElement("div");
        addressCard.className = "address-card";
        addressCard.innerHTML = `
          <h4>
            ${address.addressName || `Address ${index + 1}`}
            ${address.isDefault ? '<span class="address-default">Default</span>' : ''}
          </h4>
          <div class="address-actions">
            <button class="edit-address" data-index="${index}"><i class="fas fa-edit"></i></button>
            <button class="delete-address" data-index="${index}"><i class="fas fa-trash"></i></button>
          </div>
          <p>${address.firstName} ${address.lastName}</p>
          <p>${address.address}</p>
          <p>${address.city}, ${address.state} ${address.zip}</p>
          <p>${address.country}</p>
          <p>Phone: ${address.phone}</p>
        `;
        
        // Add before the add address button
        if (addAddressBtn) {
          addressList.insertBefore(addressCard, addAddressBtn);
        } else {
          addressList.appendChild(addressCard);
        }
        
        // Add event listeners for edit and delete
        const editBtn = addressCard.querySelector(".edit-address");
        const deleteBtn = addressCard.querySelector(".delete-address");
        
        if (editBtn) {
          editBtn.addEventListener("click", () => {
            editAddress(index);
          });
        }
        
        if (deleteBtn) {
          deleteBtn.addEventListener("click", () => {
            deleteAddress(index);
          });
        }
      });
    }
    
  } catch (error) {
    console.error("Error loading addresses:", error);
    showNotification("An error occurred while loading your addresses.", "error");
  }
}

// Show address form
function showAddressForm(addressData = null) {
  console.log("Showing address form with data:", addressData);
  
  const addressFormContainer = document.getElementById("address-form-container");
  if (!addressFormContainer) return;
  
  // Show the form
  addressFormContainer.style.display = "block";
  
  // Scroll to the form
  addressFormContainer.scrollIntoView({ behavior: "smooth" });
  
  // Fill the form if editing
  if (addressData) {
    document.getElementById("address-index").value = addressData.index;
    document.getElementById("address-name").value = addressData.addressName || "";
    document.getElementById("address-first-name").value = addressData.firstName || "";
    document.getElementById("address-last-name").value = addressData.lastName || "";
    document.getElementById("address-line").value = addressData.address || "";
    document.getElementById("address-city").value = addressData.city || "";
    document.getElementById("address-state").value = addressData.state || "";
    document.getElementById("address-zip").value = addressData.zip || "";
    document.getElementById("address-country").value = addressData.country || "";
    document.getElementById("address-phone").value = addressData.phone || "";
    document.getElementById("address-default").checked = addressData.isDefault || false;
  } else {
    // Reset the form
    document.getElementById("address-form").reset();
    document.getElementById("address-index").value = "";
  }
}

// Hide address form
function hideAddressForm() {
  const addressFormContainer = document.getElementById("address-form-container");
  if (addressFormContainer) {
    addressFormContainer.style.display = "none";
  }
}

// Save address
function saveAddress() {
  console.log("Saving address");
  
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      showNotification("You must be logged in to save addresses.", "error");
      return;
    }
    
    // Get form values
    const addressIndex = document.getElementById("address-index").value;
    const addressName = document.getElementById("address-name").value;
    const firstName = document.getElementById("address-first-name").value;
    const lastName = document.getElementById("address-last-name").value;
    const address = document.getElementById("address-line").value;
    const city = document.getElementById("address-city").value;
    const state = document.getElementById("address-state").value;
    const zip = document.getElementById("address-zip").value;
    const country = document.getElementById("address-country").value;
    const phone = document.getElementById("address-phone").value;
    const isDefault = document.getElementById("address-default").checked;
    
    // Validate form
    if (!firstName || !lastName || !address || !city || !state || !zip || !country || !phone) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }
    
    // Create address object
    const addressData = {
      addressName,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      country,
      phone,
      isDefault
    };
    
    // Get existing addresses
    const addresses = JSON.parse(localStorage.getItem(`addresses_${currentUser.id}`)) || [];
    
    // If this is set as default, remove default from others
    if (isDefault) {
      addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // If editing existing address
    if (addressIndex !== "") {
      addresses[addressIndex] = addressData;
      showNotification("Address updated successfully.");
    } else {
      // If no addresses yet, make this the default
      if (addresses.length === 0) {
        addressData.isDefault = true;
      }
      
      // Add new address
      addresses.push(addressData);
      showNotification("Address added successfully.");
    }
    
    // Save addresses
    localStorage.setItem(`addresses_${currentUser.id}`, JSON.stringify(addresses));
    
    // Hide form
    hideAddressForm();
    
    // Reload addresses
    loadAddresses(currentUser);
    
  } catch (error) {
    console.error("Error saving address:", error);
    showNotification("An error occurred while saving your address.", "error");
  }
}

// Edit address
function editAddress(index) {
  console.log("Editing address at index:", index);
  
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    
    // Get addresses
    const addresses = JSON.parse(localStorage.getItem(`addresses_${currentUser.id}`)) || [];
    
    // Get address data
    const addressData = addresses[index];
    if (!addressData) return;
    
    // Add index to data
    addressData.index = index;
    
    // Show form with data
    showAddressForm(addressData);
    
  } catch (error) {
    console.error("Error editing address:", error);
    showNotification("An error occurred while editing your address.", "error");
  }
}

// Delete address
function deleteAddress(index) {
  console.log("Deleting address at index:", index);
  
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    // Get addresses
    const addresses = JSON.parse(localStorage.getItem(`addresses_${currentUser.id}`)) || [];
    
    // Remove address
    addresses.splice(index, 1);
    
    // If we removed the default and there are still addresses, make the first one default
    if (addresses.length > 0) {
      const hasDefault = addresses.some(addr => addr.isDefault);
      if (!hasDefault) {
        addresses[0].isDefault = true;
      }
    }
    
    // Save addresses
    localStorage.setItem(`addresses_${currentUser.id}`, JSON.stringify(addresses));
    
    // Show notification
    showNotification("Address deleted successfully.");
    
    // Reload addresses
    loadAddresses(currentUser);
    
  } catch (error) {
    console.error("Error deleting address:", error);
    showNotification("An error occurred while deleting your address.", "error");
  }
}

// Load wishlist
function loadWishlist(user) {
  console.log("Loading wishlist for user:", user.id);

  try {
    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    console.log("User wishlist:", wishlist);
    
    // Update wishlist count
    const wishlistCount = document.getElementById("wishlist-count");
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
    
    // Get the wishlist container
    const wishlistGrid = document.getElementById("wishlist-grid");
    if (!wishlistGrid) return;
    
    // Clear existing wishlist
    wishlistGrid.innerHTML = '';
    
    // Add wishlist items
    if (wishlist.length > 0) {
      // Get products
      const products = JSON.parse(localStorage.getItem("products")) || [];
      
      wishlist.forEach((item, index) => {
        // Find product
        const product = products.find(p => p.id === item.productId);
        if (!product) return;
        
        const wishlistItem = document.createElement("div");
        wishlistItem.className = "wishlist-item";
        wishlistItem.innerHTML = `
          <button class="remove-wishlist" data-index="${index}"><i class="fas fa-times"></i></button>
          <div class="wishlist-image">
            <img src="${product.image || '/placeholder.svg?height=200&width=200'}" alt="${product.name}" onerror="this.src='/placeholder.svg?height=200&width=200'">
          </div>
          <div class="wishlist-details">
            <h3 class="wishlist-name">${product.name}</h3>
            <div class="wishlist-price">${formatPrice(product.price)}</div>
            <div class="wishlist-actions">
              <button class="btn-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
              <button class="btn-remove" data-index="${index}">Remove</button>
            </div>
          </div>
        `;
        
        wishlistGrid.appendChild(wishlistItem);
        
        // Add event listeners
        const addToCartBtn = wishlistItem.querySelector(".btn-add-to-cart");
        const removeBtn = wishlistItem.querySelector(".btn-remove");
        const quickRemoveBtn = wishlistItem.querySelector(".remove-wishlist");
        
        if (addToCartBtn) {
          addToCartBtn.addEventListener("click", () => {
            addToCartFromWishlist(product.id);
          });
        }
        
        if (removeBtn) {
          removeBtn.addEventListener("click", () => {
            removeFromWishlist(index);
          });
        }
        
        if (quickRemoveBtn) {
          quickRemoveBtn.addEventListener("click", () => {
            removeFromWishlist(index);
          });
        }
      });
    } else {
      // Show empty state
      wishlistGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-heart-broken"></i>
          <h3>Your wishlist is empty</h3>
          <p>Add items to your wishlist to save them for later.</p>
          <a href="products.html" class="btn-shop-now">Shop Now</a>
        </div>
      `;
    }
    
  } catch (error) {
    console.error("Error loading wishlist:", error);
    showNotification("An error occurred while loading your wishlist.", "error");
  }
}

// Add to cart from wishlist
function addToCartFromWishlist(productId) {
  console.log("Adding to cart from wishlist:", productId);
  
  try {
    // Get products
    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    // Find product
    const product = products.find(p => p.id === productId);
    if (!product) {
      showNotification("Product not found.", "error");
      return;
    }
    
    // Get cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      // Increment quantity
      existingItem.quantity += 1;
      showNotification(`Increased quantity of ${product.name} in your cart.`);
    } else {
      // Add to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      showNotification(`${product.name} added to your cart.`);
    }
    
    // Save cart
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
  } catch (error) {
    console.error("Error adding to cart from wishlist:", error);
    showNotification("An error occurred while adding to cart.", "error");
  }
}

// Remove from wishlist
function removeFromWishlist(index) {
  console.log("Removing from wishlist at index:", index);
  
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    
    // Get wishlist
    const wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || [];
    
    // Remove item
    wishlist.splice(index, 1);
    
    // Save wishlist
    localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist));
    
    // Show notification
    showNotification("Item removed from your wishlist.");
    
    // Reload wishlist
    loadWishlist(currentUser);
    
    // Update dashboard stats
    updateDashboardStats(currentUser);
    
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    showNotification("An error occurred while removing from wishlist.", "error");
  }
}

// Update cart count
function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll(".cart-count");
    cartCountElements.forEach(element => {
      element.textContent = cartCount;
    });
    
  } catch (error) {
    console.error("Error updating cart count:", error);
  }
}

// Format price
function formatPrice(price) {
  return "₦" + (price || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

// Show notification
function showNotification(message, type = "success") {
  console.log("Notification:", { message, type });

  try {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    if (notification && notificationMessage) {
      notificationMessage.textContent = message;
      notification.className = `notification ${type} show`;

      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    } else {
      // Fallback to alert if notification elements don't exist
      alert(message);
    }
  } catch (error) {
    console.error("Error showing notification:", error);
    alert(message);
  }
}
