document.addEventListener("DOMContentLoaded", () => {
  console.log("Register.js loaded") // Debug log

  // Check if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (currentUser) {
    window.location.href = "account.html"
    return
  }

  // Update cart count
  updateCartCount()

  // Register form submission
  const registerForm = document.getElementById("register-form")
  console.log("Register form:", registerForm) // Debug log

  if (!registerForm) {
    console.error("Register form not found!") // Debug error
    return
  }

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log("Form submitted") // Debug log

    // Get form values
    const firstName = document.getElementById("first-name").value.trim()
    const lastName = document.getElementById("last-name").value.trim()
    const email = document.getElementById("email").value.trim()
    const phone = document.getElementById("phone").value.trim()
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value
    const termsAccepted = document.getElementById("terms").checked

    console.log("Form values:", { firstName, lastName, email, phone }) // Debug log

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      showNotification("Please fill in all required fields", "error")
      return
    }

    // Validate form
    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error")
      return
    }

    if (!termsAccepted) {
      showNotification("You must accept the Terms and Conditions", "error")
      return
    }

    try {
      // Get users from localStorage
      let users = []
      const storedUsers = localStorage.getItem("users")
      if (storedUsers) {
        users = JSON.parse(storedUsers)
      }

      // Check if email already exists
      if (users.some((user) => user.email === email)) {
        showNotification("Email already exists. Please login instead.", "error")
        return
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        email,
        phone,
        password, // Note: In a real application, this should be hashed
        dateRegistered: new Date().toISOString(),
        addresses: [],
        orders: [],
        wishlist: [],
      }

      console.log("New user:", newUser) // Debug log

      // Add user to users array
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Set current user
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      // Show success notification
      showNotification("Registration successful! Redirecting to your account...")

      // Redirect to account page after a short delay
      setTimeout(() => {
        window.location.href = "account.html"
      }, 1500)
    } catch (error) {
      console.error("Registration error:", error) // Debug error
      showNotification("An error occurred during registration. Please try again.", "error")
    }
  })

  // Close notification
  const notificationClose = document.querySelector(".notification-close")
  if (notificationClose) {
    notificationClose.addEventListener("click", () => {
      document.getElementById("notification").classList.remove("show")
    })
  }
})

// Update cart count
function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

    const cartCountElements = document.querySelectorAll(".cart-count")
    cartCountElements.forEach((element) => {
      element.textContent = cartCount
    })
  } catch (error) {
    console.error("Error updating cart count:", error)
  }
}

// Show notification
function showNotification(message, type = "success") {
  try {
    const notification = document.getElementById("notification")
    const notificationMessage = document.getElementById("notification-message")

    if (!notification || !notificationMessage) {
      console.error("Notification elements not found")
      alert(message) // Fallback to alert if notification elements not found
      return
    }

    notificationMessage.textContent = message
    notification.className = `notification ${type}`
    notification.classList.add("show")

    console.log("Notification shown:", message, type) // Debug log

    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  } catch (error) {
    console.error("Error showing notification:", error)
    alert(message) // Fallback to alert
  }
}
