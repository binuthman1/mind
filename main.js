// Update header based on login status
function updateHeaderLoginStatus() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const userActionsDiv = document.querySelector(".user-actions")

  if (userActionsDiv) {
    if (currentUser) {
      userActionsDiv.innerHTML = `
        <a href="account.html"><i class="fas fa-user"></i> My Account</a>
        <a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
        <a href="admin/login.html"><i class="fas fa-lock"></i> Admin</a>
      `

      // Add logout functionality
      const logoutLink = document.getElementById("logout-link")
      if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
          e.preventDefault()
          localStorage.removeItem("currentUser")
          window.alert("Logged out successfully!") // Declared showNotification as window.alert
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }
    } else {
      userActionsDiv.innerHTML = `
        <a href="login.html"><i class="fas fa-user"></i> Login</a>
        <a href="register.html"><i class="fas fa-user-plus"></i> Register</a>
        <a href="admin/login.html"><i class="fas fa-lock"></i> Admin</a>
      `
    }
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Existing code...

  // Update header based on login status
  updateHeaderLoginStatus()
})
