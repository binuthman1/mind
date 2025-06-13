document.addEventListener("DOMContentLoaded", () => {
  console.log("Login script loaded")

  // Check if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (currentUser) {
    console.log("User already logged in:", currentUser)
    // Get redirect URL from query string if available
    const urlParams = new URLSearchParams(window.location.search)
    const redirect = urlParams.get("redirect") || "account.html"
    console.log("Redirecting to:", redirect)
    window.location.href = redirect
    return
  }

  // Update cart count
  updateCartCount()

  // Login form submission
  const loginForm = document.getElementById("login-form")
  console.log("Login form found:", loginForm)

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      console.log("Login form submitted")

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const remember = document.getElementById("remember") ? document.getElementById("remember").checked : false

      console.log("Login attempt:", { email, password: "***" })

      // Get users from localStorage
      try {
        const users = JSON.parse(localStorage.getItem("users")) || []
        console.log("Users found in localStorage:", users.length)

        // Find user with matching email and password
        const user = users.find((u) => u.email === email && u.password === password)
        console.log("User found:", user)

        if (user) {
          // Set current user in localStorage
          localStorage.setItem("currentUser", JSON.stringify(user))
          console.log("User logged in successfully")

          // Show success notification
          showNotification("Login successful! Redirecting...")

          // Get redirect URL from query string if available
          const urlParams = new URLSearchParams(window.location.search)
          const redirect = urlParams.get("redirect") || "account.html"
          console.log("Redirecting to:", redirect)

          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = redirect
          }, 1500)
        } else {
          // Show error notification
          console.log("Invalid credentials")
          showNotification("Invalid email or password", "error")
        }
      } catch (error) {
        console.error("Error during login:", error)
        showNotification("An error occurred during login. Please try again.", "error")
      }
    })
  } else {
    console.error("Login form not found in the document")
  }

  // Forgot password link
  const forgotPasswordLink = document.querySelector(".forgot-password")
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Forgot password clicked")
      // Show forgot password modal or redirect to forgot password page
      alert("Forgot password functionality will be implemented soon.")
    })
  }

  // Social login buttons
  const socialLoginButtons = document.querySelectorAll(".social-login button")
  if (socialLoginButtons.length) {
    socialLoginButtons.forEach((button) => {
      button.addEventListener("click", function () {
        console.log("Social login clicked:", this.textContent)
        alert("Social login functionality will be implemented soon.")
      })
    })
  }

  // Close notification
  const notificationClose = document.querySelector(".notification-close")
  if (notificationClose) {
    notificationClose.addEventListener("click", () => {
      document.getElementById("notification").classList.remove("show")
    })
  }

  // Initialize demo users if not exists
  initializeDemoUsers()
  console.log("Login script initialization complete")
})

// Initialize demo users
function initializeDemoUsers() {
  try {
    const users = JSON.parse(localStorage.getItem("users")) || []
    console.log("Current users in localStorage:", users.length)

    if (users.length === 0) {
      // Add demo user
      users.push({
        id: "demo1",
        firstName: "Demo",
        lastName: "User",
        displayName: "Demo User",
        email: "demo@example.com",
        password: "password",
        phone: "+2348012345678",
        dateRegistered: new Date().toISOString(),
      })

      localStorage.setItem("users", JSON.stringify(users))
      console.log("Demo user created:", users[0])
    }
  } catch (error) {
    console.error("Error initializing demo users:", error)
  }
}

// Update cart count
function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

    const cartCountElements = document.querySelectorAll(".cart-count")
    cartCountElements.forEach((element) => {
      element.textContent = cartCount
    })

    // Update cart total
    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const cartTotalElements = document.querySelectorAll(".cart-total")
    cartTotalElements.forEach((element) => {
      element.textContent = formatPrice(cartTotal)
    })

    console.log("Cart updated:", { count: cartCount, total: cartTotal })
  } catch (error) {
    console.error("Error updating cart count:", error)
  }
}

// Format price
function formatPrice(price) {
  return "₦" + (price || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Show notification
function showNotification(message, type = "success") {
  console.log("Notification:", { message, type })

  try {
    const notification = document.getElementById("notification")
    const notificationMessage = document.getElementById("notification-message")

    if (notification && notificationMessage) {
      notificationMessage.textContent = message
      notification.className = `notification ${type} show`

      setTimeout(() => {
        notification.classList.remove("show")
      }, 3000)
    } else {
      // Fallback to alert if notification elements don't exist
      alert(message)
    }
  } catch (error) {
    console.error("Error showing notification:", error)
    alert(message)
  }
}

// Add this to check if localStorage is working
try {
  localStorage.setItem("test", "test")
  const testValue = localStorage.getItem("test")
  console.log("localStorage test:", testValue === "test" ? "PASSED" : "FAILED")
  localStorage.removeItem("test")
} catch (error) {
  console.error("localStorage is not available:", error)
}
