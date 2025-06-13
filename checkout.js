document.addEventListener("DOMContentLoaded", () => {
  console.log("Checkout script loaded")

  // Load cart items in checkout summary
  loadCheckoutItems()

  // Handle shipping form submission
  const shippingNext = document.getElementById("shipping-next")
  if (shippingNext) {
    shippingNext.addEventListener("click", () => {
      // Validate shipping form
      const shippingForm = document.getElementById("shipping-form")
      if (!shippingForm.checkValidity()) {
        shippingForm.reportValidity()
        return
      }

      // Move to payment step
      document.getElementById("shipping-step").classList.remove("active")
      document.getElementById("payment-step").classList.add("active")

      // Update progress steps
      document.querySelectorAll(".progress-step")[1].classList.add("active")
    })
  }

  // Handle payment back button
  const paymentBack = document.getElementById("payment-back")
  if (paymentBack) {
    paymentBack.addEventListener("click", () => {
      // Move back to shipping step
      document.getElementById("payment-step").classList.remove("active")
      document.getElementById("shipping-step").classList.add("active")

      // Update progress steps
      document.querySelectorAll(".progress-step")[1].classList.remove("active")
    })
  }

  // Handle payment method selection
  const paymentMethods = document.querySelectorAll('input[name="payment-method"]')
  const creditCardForm = document.getElementById("credit-card-form")

  if (paymentMethods && creditCardForm) {
    paymentMethods.forEach((method) => {
      method.addEventListener("change", function () {
        // Show/hide credit card form based on selected payment method
        if (this.value === "credit-card") {
          creditCardForm.style.display = "block"
        } else {
          creditCardForm.style.display = "none"
        }
      })
    })
  }

  // Handle payment form submission
  const paymentNext = document.getElementById("payment-next")
  if (paymentNext) {
    paymentNext.addEventListener("click", () => {
      // Get selected payment method
      const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value

      // Validate payment form if credit card is selected
      if (selectedPaymentMethod === "credit-card") {
        const paymentForm = document.getElementById("payment-form")
        if (!paymentForm.checkValidity()) {
          paymentForm.reportValidity()
          return
        }
      }

      // Process order
      processOrder()

      // Move to confirmation step
      document.getElementById("payment-step").classList.remove("active")
      document.getElementById("confirmation-step").classList.add("active")

      // Update progress steps
      document.querySelectorAll(".progress-step")[2].classList.add("active")
    })
  }

  // Handle billing address checkbox
  const sameAddressCheckbox = document.getElementById("same-address")
  const billingAddressForm = document.getElementById("billing-address-form")

  if (sameAddressCheckbox && billingAddressForm) {
    sameAddressCheckbox.addEventListener("change", function () {
      if (this.checked) {
        billingAddressForm.style.display = "none"
      } else {
        billingAddressForm.style.display = "block"
      }
    })
  }

  // Handle shipping method selection
  const shippingOptions = document.querySelectorAll('input[name="shipping-method"]')
  shippingOptions.forEach((option) => {
    option.addEventListener("change", () => {
      updateCheckoutTotals()
    })
  })
})

// Function to load checkout items
function loadCheckoutItems() {
  console.log("Loading checkout items")

  const checkoutItemsContainer = document.getElementById("checkout-items")
  const subtotalElement = document.getElementById("checkout-subtotal")
  const shippingElement = document.getElementById("checkout-shipping")
  const taxElement = document.getElementById("checkout-tax")
  const totalElement = document.getElementById("checkout-total")

  if (!checkoutItemsContainer) return

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  if (cart.length === 0) {
    window.location.href = "cart.html"
    return
  }

  // Generate HTML for checkout items
  let html = ""

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity

    html += `
      <div class="summary-item">
        <div class="summary-item-details">
          <div class="summary-item-image">
            <img src="${item.image || "images/placeholder.jpg"}" alt="${item.name}">
          </div>
          <div class="summary-item-info">
            <div class="summary-item-name">${item.name}</div>
            <div class="summary-item-variant">
              ${item.size ? `Size: ${item.size}` : ""}
              ${item.color ? ` | Color: ${item.color}` : ""}
              ${item.quantity > 1 ? ` | Qty: ${item.quantity}` : ""}
            </div>
          </div>
        </div>
        <div class="summary-item-price">${formatPrice(itemTotal)}</div>
      </div>
    `
  })

  checkoutItemsContainer.innerHTML = html

  // Calculate and update totals
  updateCheckoutTotals()
}

// Function to update checkout totals
function updateCheckoutTotals() {
  console.log("Updating checkout totals")

  const subtotalElement = document.getElementById("checkout-subtotal")
  const shippingElement = document.getElementById("checkout-shipping")
  const taxElement = document.getElementById("checkout-tax")
  const totalElement = document.getElementById("checkout-total")

  if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Get selected shipping method
  const shippingMethod = document.querySelector('input[name="shipping-method"]:checked')
  let shipping = 1300 // Default shipping cost in Naira

  if (shippingMethod) {
    shipping = shippingMethod.value === "express" ? 5000 : 1300
  }

  // Calculate tax (7.5% - Nigerian VAT)
  const tax = subtotal * 0.075

  // Calculate total
  const total = subtotal + shipping + tax

  // Update UI
  subtotalElement.textContent = formatPrice(subtotal)
  shippingElement.textContent = formatPrice(shipping)
  taxElement.textContent = formatPrice(tax)
  totalElement.textContent = formatPrice(total)
}

// Function to process order
function processOrder() {
  console.log("Processing order")

  try {
    // Get form data
    const firstName = document.getElementById("first-name").value
    const lastName = document.getElementById("last-name").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const state = document.getElementById("state").value
    const zip = document.getElementById("zip").value
    const country = document.getElementById("country").value
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value

    // Get cart items
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    // Create order object
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      customer: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zip,
        country,
      },
      items: cart,
      subtotal: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      shipping: document.querySelector('input[name="shipping-method"]:checked').value === "express" ? 5000 : 1300,
      tax: cart.reduce((total, item) => total + item.price * item.quantity, 0) * 0.075,
      paymentMethod: paymentMethod,
      status: paymentMethod === "pay-on-delivery" ? "pending" : "processing",
    }

    // Calculate total
    order.total = order.subtotal + order.shipping + order.tax

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || []
    orders.push(order)
    localStorage.setItem("orders", JSON.stringify(orders))

    // Send confirmation emails
    sendCustomerConfirmationEmail(order)
    sendAdminNotificationEmail(order)

    // Clear cart
    localStorage.removeItem("cart")

    // Update confirmation page
    document.getElementById("confirmation-email").textContent = email
    document.getElementById("order-number").textContent = order.id

    // Add payment method info to confirmation
    const confirmationElement = document.querySelector(".order-info")
    if (confirmationElement) {
      const paymentInfo = document.createElement("p")
      paymentInfo.innerHTML = `<strong>Payment Method:</strong> <span>${paymentMethod === "pay-on-delivery" ? "Payment on Delivery" : paymentMethod === "paypal" ? "PayPal" : "Credit Card"}</span>`
      confirmationElement.appendChild(paymentInfo)
    }

    // Set delivery date (5-7 days from now)
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + (order.shipping === 5000 ? 2 : 5))
    document.getElementById("delivery-date").textContent = deliveryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    console.log("Order processed successfully:", order)
  } catch (error) {
    console.error("Error processing order:", error)
  }
}

// Function to send customer confirmation email
function sendCustomerConfirmationEmail(order) {
  console.log("Sending customer confirmation email")

  try {
    // In a real application, you would use an email service API here
    // For this demo, we'll simulate sending an email by logging it

    const customerName = `${order.customer.firstName} ${order.customer.lastName}`
    const customerEmail = order.customer.email

    // Create email content
    const emailSubject = `Order Confirmation #${order.id} - FashionHub`

    let emailBody = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; color: #333; }
          .order-details { margin: 20px 0; }
          .order-items { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-items th, .order-items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .order-summary { background-color: #f8f9fa; padding: 15px; margin-top: 20px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">FashionHub</div>
          </div>
          
          <h2>Thank you for your order!</h2>
          
          <p>Dear ${customerName},</p>
          
          <p>We're happy to let you know that we've received your order.</p>
          
          <div class="order-details">
            <p><strong>Order Number:</strong> #${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === "pay-on-delivery" ? "Payment on Delivery" : order.paymentMethod === "paypal" ? "PayPal" : "Credit Card"}</p>
          </div>
          
          <h3>Order Summary</h3>
          
          <table class="order-items">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
    `

    // Add order items
    order.items.forEach((item) => {
      emailBody += `
              <tr>
                <td>${item.name} ${item.size ? `(Size: ${item.size})` : ""} ${item.color ? `(Color: ${item.color})` : ""}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price * item.quantity)}</td>
              </tr>
      `
    })

    // Add order totals
    emailBody += `
            </tbody>
          </table>
          
          <div class="order-summary">
            <p><strong>Subtotal:</strong> ${formatPrice(order.subtotal)}</p>
            <p><strong>Shipping:</strong> ${formatPrice(order.shipping)}</p>
            <p><strong>Tax:</strong> ${formatPrice(order.tax)}</p>
            <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
          </div>
          
          <div class="shipping-info">
            <h3>Shipping Information</h3>
            <p>${order.customer.firstName} ${order.customer.lastName}</p>
            <p>${order.customer.address}</p>
            <p>${order.customer.city}, ${order.customer.state} ${order.customer.zip}</p>
            <p>${order.customer.country}</p>
            <p>Phone: ${order.customer.phone}</p>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          
          <p>If you have any questions, please contact our customer service at support@fashionhub.com or call us at +234 800 123 4567.</p>
          
          <p>Thank you for shopping with us!</p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} FashionHub. All rights reserved.</p>
            <p>This email was sent to ${customerEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Log the email (in a real application, you would send it)
    console.log("Customer confirmation email:", {
      to: customerEmail,
      subject: emailSubject,
      body: "HTML Email Content (see browser console for details)",
    })

    // In a real application, you would use an email service API like this:
    /*
    fetch('https://your-email-service-api.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        to: customerEmail,
        subject: emailSubject,
        html: emailBody
      })
    })
    .then(response => response.json())
    .then(data => console.log('Email sent successfully:', data))
    .catch(error => console.error('Error sending email:', error));
    */

    // Store the email in localStorage for demo purposes
    const sentEmails = JSON.parse(localStorage.getItem("sentEmails")) || []
    sentEmails.push({
      to: customerEmail,
      subject: emailSubject,
      body: emailBody,
      timestamp: new Date().toISOString(),
      type: "customer",
    })
    localStorage.setItem("sentEmails", JSON.stringify(sentEmails))
  } catch (error) {
    console.error("Error sending customer confirmation email:", error)
  }
}

// Function to send admin notification email
function sendAdminNotificationEmail(order) {
  console.log("Sending admin notification email")

  try {
    // In a real application, you would use an email service API here
    // For this demo, we'll simulate sending an email by logging it

    const adminEmail = "admin@fashionhub.com" // Change this to your actual admin email
    const customerName = `${order.customer.firstName} ${order.customer.lastName}`

    // Create email content
    const emailSubject = `New Order #${order.id} - FashionHub`

    let emailBody = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .logo { font-size: 24px; font-weight: bold; color: #333; }
          .order-details { margin: 20px 0; }
          .order-items { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .order-items th, .order-items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .order-summary { background-color: #f8f9fa; padding: 15px; margin-top: 20px; }
          .customer-info { margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">FashionHub Admin</div>
          </div>
          
          <h2>New Order Received</h2>
          
          <p>A new order has been placed on your store.</p>
          
          <div class="order-details">
            <p><strong>Order Number:</strong> #${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === "pay-on-delivery" ? "Payment on Delivery" : order.paymentMethod === "paypal" ? "PayPal" : "Credit Card"}</p>
            <p><strong>Order Status:</strong> ${order.status}</p>
          </div>
          
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}, ${order.customer.country}</p>
          </div>
          
          <h3>Order Items</h3>
          
          <table class="order-items">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
    `

    // Add order items
    order.items.forEach((item) => {
      emailBody += `
              <tr>
                <td>${item.name} ${item.size ? `(Size: ${item.size})` : ""} ${item.color ? `(Color: ${item.color})` : ""}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price * item.quantity)}</td>
              </tr>
      `
    })

    // Add order totals
    emailBody += `
            </tbody>
          </table>
          
          <div class="order-summary">
            <p><strong>Subtotal:</strong> ${formatPrice(order.subtotal)}</p>
            <p><strong>Shipping:</strong> ${formatPrice(order.shipping)}</p>
            <p><strong>Tax:</strong> ${formatPrice(order.tax)}</p>
            <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="https://yourstore.com/admin/orders/${order.id}" class="button">View Order Details</a>
          </p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} FashionHub. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Log the email (in a real application, you would send it)
    console.log("Admin notification email:", {
      to: adminEmail,
      subject: emailSubject,
      body: "HTML Email Content (see browser console for details)",
    })

    // Store the email in localStorage for demo purposes
    const sentEmails = JSON.parse(localStorage.getItem("sentEmails")) || []
    sentEmails.push({
      to: adminEmail,
      subject: emailSubject,
      body: emailBody,
      timestamp: new Date().toISOString(),
      type: "admin",
    })
    localStorage.setItem("sentEmails", JSON.stringify(sentEmails))
  } catch (error) {
    console.error("Error sending admin notification email:", error)
  }
}

// Function to generate order ID
function generateOrderId() {
  return (
    "FH" +
    Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(8, "0")
  )
}

// Function to format price in Naira
function formatPrice(price) {
  return "₦" + price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
}
