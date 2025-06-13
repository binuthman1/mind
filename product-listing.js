document.addEventListener("DOMContentLoaded", () => {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.search)
  const category = urlParams.get("category") || "all"

  const searchQuery = urlParams.get("search")
  if (searchQuery) {
    // Update page title for search results
    updatePageTitleForSearch(searchQuery)

    // Load search results
    loadSearchResults(searchQuery)
  } else {
    // Load products by category as before
    updatePageTitle(category)
    loadProducts(category)
  }

  // Handle sorting
  const sortSelect = document.getElementById("sort-by")
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      if (searchQuery) {
        loadSearchResults(searchQuery, this.value)
      } else {
        loadProducts(category, this.value)
      }
    })
  }

  // Handle view options
  const viewOptions = document.querySelectorAll(".view-option")
  viewOptions.forEach((option) => {
    option.addEventListener("click", function () {
      viewOptions.forEach((opt) => opt.classList.remove("active"))
      this.classList.add("active")

      const view = this.dataset.view
      const productsGrid = document.getElementById("products-grid")

      if (view === "grid") {
        productsGrid.classList.remove("list-view")
        productsGrid.classList.add("grid-view")
      } else {
        productsGrid.classList.remove("grid-view")
        productsGrid.classList.add("list-view")
      }
    })
  })

  // Handle price range filter
  const applyPriceBtn = document.getElementById("apply-price")
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener("click", () => {
      const minPrice = Number.parseFloat(document.getElementById("min-price").value) || 0
      const maxPrice = Number.parseFloat(document.getElementById("max-price").value) || 1000

      if (searchQuery) {
        loadSearchResults(searchQuery, sortSelect.value, minPrice, maxPrice)
      } else {
        loadProducts(category, sortSelect.value, minPrice, maxPrice)
      }
    })
  }

  // Handle pagination
  const pageNumbers = document.querySelectorAll(".page-number")
  pageNumbers.forEach((page) => {
    page.addEventListener("click", function () {
      pageNumbers.forEach((p) => p.classList.remove("active"))
      this.classList.add("active")

      // In a real application, you would load products for the selected page
      // For this demo, we'll just scroll to the top
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  })

  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      const activePage = document.querySelector(".page-number.active")
      const prevPage = activePage.previousElementSibling

      if (prevPage) {
        activePage.classList.remove("active")
        prevPage.classList.add("active")
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const activePage = document.querySelector(".page-number.active")
      const nextPage = activePage.nextElementSibling

      if (nextPage) {
        activePage.classList.remove("active")
        nextPage.classList.add("active")
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }
})

// Function to update page title and breadcrumb
function updatePageTitle(category) {
  const categoryTitle = document.getElementById("category-title")
  const breadcrumbCategory = document.getElementById("breadcrumb-category")

  if (categoryTitle) {
    if (category === "all") {
      categoryTitle.textContent = "All Products"
    } else {
      // Capitalize first letter
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1)
      categoryTitle.textContent = formattedCategory
    }
  }

  if (breadcrumbCategory) {
    if (category === "all") {
      breadcrumbCategory.textContent = "Products"
    } else {
      // Capitalize first letter
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1)
      breadcrumbCategory.textContent = formattedCategory
    }
  }
}

// Function to load products
function loadProducts(category, sortBy = "popularity", minPrice = 0, maxPrice = 40000) {
  const productsGrid = document.getElementById("products-grid")
  if (!productsGrid) return

  // Get products by category
  let filteredProducts = getProductsByCategory(category)

  // Filter by price
  filteredProducts = filterProductsByPrice(minPrice, maxPrice, filteredProducts)

  // Sort products
  filteredProducts = sortProducts(filteredProducts, sortBy)

  // Generate HTML
  let html = ""

  if (filteredProducts.length === 0) {
    html = '<div class="no-products">No products found matching your criteria.</div>'
  } else {
    filteredProducts.forEach((product) => {
      html += generateProductCard(product)
    })
  }

  productsGrid.innerHTML = html

  // Add event listeners for product actions
  addProductEventListeners()
}

// Function to update page title for search results
function updatePageTitleForSearch(query) {
  const categoryTitle = document.getElementById("category-title")
  const breadcrumbCategory = document.getElementById("breadcrumb-category")

  if (categoryTitle) {
    categoryTitle.textContent = `Search Results for "${query}"`
  }

  if (breadcrumbCategory) {
    breadcrumbCategory.textContent = "Search Results"
  }
}

// Function to load search results
function loadSearchResults(query, sortBy = "popularity", minPrice = 0, maxPrice = 50000) {
  const productsGrid = document.getElementById("products-grid")
  if (!productsGrid) return

  // Search products
  let searchResults = searchProducts(query)

  // Filter by price
  searchResults = filterProductsByPrice(minPrice, maxPrice, searchResults)

  // Sort products
  searchResults = sortProducts(searchResults, sortBy)

  // Generate HTML
  let html = ""

  if (searchResults.length === 0) {
    html = `<div class="no-products">No products found matching "${query}". Try a different search term.</div>`
  } else {
    searchResults.forEach((product) => {
      html += generateProductCard(product)
    })
  }

  productsGrid.innerHTML = html

  // Add event listeners for product actions
  addProductEventListeners()
}

// Function to add event listeners to product actions
function addProductEventListeners() {
  // Quick view buttons
  const quickViewButtons = document.querySelectorAll(".quick-view")
  quickViewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId
      quickViewProduct(productId)
    })
  })

  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId
      addToCart(productId, 1)
    })
  })

  // Add to wishlist buttons
  const wishlistButtons = document.querySelectorAll(".add-to-wishlist")
  wishlistButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.productId
      addToWishlist(productId)
    })
  })
}

// Function to quick view product
function quickViewProduct(productId) {
  const product = getProductById(productId)
  if (!product) return

  // Create modal HTML
  const modalHtml = `
    <div class="quick-view-modal">
      <div class="quick-view-content">
        <button class="close-modal">&times;</button>
        <div class="quick-view-grid">
          <div class="quick-view-image">
            <img src="${product.images[0]}" alt="${product.name}">
          </div>
          <div class="quick-view-details">
            <h2>${product.name}</h2>
            <div class="product-rating">
              ${generateRatingStars(product.rating)}
              <span>(${product.reviewCount} reviews)</span>
            </div>
            <div class="product-price">
              <span class="current-price">${formatPrice(product.price)}</span>
              ${product.originalPrice > product.price ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ""}
            </div>
            <p>${product.description}</p>
            <div class="product-variants">
              <div class="size-selection">
                <h4>Size:</h4>
                <div class="size-options">
                  ${product.sizes
                    .map(
                      (size) => `
                    <div class="size-option" data-size="${size}">${size}</div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
              <div class="color-selection">
                <h4>Color:</h4>
                <div class="color-options">
                  ${product.colors
                    .map(
                      (color) => `
                    <div class="color-option" style="background-color: ${color.value}" data-color="${color.name}"></div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            </div>
            <div class="quantity-selection">
              <h4>Quantity:</h4>
              <div class="quantity-input">
                <button class="decrease-quantity">-</button>
                <input type="number" value="1" min="1" max="10">
                <button class="increase-quantity">+</button>
              </div>
            </div>
            <div class="product-actions">
              <button class="btn btn-primary add-to-cart-modal" data-product-id="${product.id}">Add to Cart</button>
              <button class="btn-icon add-to-wishlist-modal" data-product-id="${product.id}">
                <i class="far fa-heart"></i>
              </button>
            </div>
            <div class="view-details">
              <a href="product-detail.html?id=${product.id}" class="btn-link">View Full Details</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  // Add modal to body
  const modalContainer = document.createElement("div")
  modalContainer.className = "modal-container"
  modalContainer.innerHTML = modalHtml
  document.body.appendChild(modalContainer)

  // Add event listeners for modal
  const modal = document.querySelector(".quick-view-modal")
  const closeBtn = modal.querySelector(".close-modal")

  // Close modal when clicking close button
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(modalContainer)
  })

  // Close modal when clicking outside
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      document.body.removeChild(modalContainer)
    }
  })

  // Handle quantity changes
  const quantityInput = modal.querySelector(".quantity-input input")
  const decreaseBtn = modal.querySelector(".decrease-quantity")
  const increaseBtn = modal.querySelector(".increase-quantity")

  decreaseBtn.addEventListener("click", () => {
    const currentValue = Number.parseInt(quantityInput.value)
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1
    }
  })

  increaseBtn.addEventListener("click", () => {
    const currentValue = Number.parseInt(quantityInput.value)
    if (currentValue < 10) {
      quantityInput.value = currentValue + 1
    }
  })

  // Handle size selection
  const sizeOptions = modal.querySelectorAll(".size-option")
  sizeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      sizeOptions.forEach((opt) => opt.classList.remove("active"))
      option.classList.add("active")
    })
  })

  // Handle color selection
  const colorOptions = modal.querySelectorAll(".color-option")
  colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      colorOptions.forEach((opt) => opt.classList.remove("active"))
      option.classList.add("active")
    })
  })

  // Handle add to cart from modal
  const addToCartBtn = modal.querySelector(".add-to-cart-modal")
  addToCartBtn.addEventListener("click", () => {
    const selectedSize = modal.querySelector(".size-option.active")?.dataset.size
    const selectedColor = modal.querySelector(".color-option.active")?.dataset.color
    const quantity = Number.parseInt(quantityInput.value)

    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    if (!selectedColor) {
      alert("Please select a color")
      return
    }

    addToCart(productId, quantity, selectedSize, selectedColor)
    document.body.removeChild(modalContainer)
  })

  // Handle add to wishlist from modal
  const wishlistBtn = modal.querySelector(".add-to-wishlist-modal")
  wishlistBtn.addEventListener("click", () => {
    addToWishlist(productId)
  })
}

// Function to add product to cart
function addToCart(productId, quantity = 1, size = null, color = null) {
  const product = getProductById(productId)
  if (!product) return

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex(
    (item) =>
      item.id === Number(productId) && (size ? item.size === size : true) && (color ? item.color === color : true),
  )

  if (existingItemIndex !== -1) {
    // Update quantity if product exists
    cart[existingItemIndex].quantity += quantity
  } else {
    // Add new item to cart
    cart.push({
      id: Number(productId),
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      size: size,
      color: color,
    })
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Show success message
  showNotification(`${product.name} has been added to your cart.`)
}

// Function to add product to wishlist
function addToWishlist(productId) {
  const product = getProductById(productId)
  if (!product) return

  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  // Check if product already exists in wishlist
  const existingItemIndex = wishlist.findIndex((item) => item.id === Number(productId))

  if (existingItemIndex !== -1) {
    // Remove from wishlist if already exists
    wishlist.splice(existingItemIndex, 1)
    showNotification(`${product.name} has been removed from your wishlist.`)
  } else {
    // Add to wishlist
    wishlist.push({
      id: Number(productId),
      name: product.name,
      price: product.price,
      image: product.images[0],
    })
    showNotification(`${product.name} has been added to your wishlist.`)
  }

  // Save wishlist to localStorage
  localStorage.setItem("wishlist", JSON.stringify(wishlist))

  // Update wishlist button if on product page
  const wishlistBtns = document.querySelectorAll(`.add-to-wishlist[data-product-id="${productId}"]`)
  wishlistBtns.forEach((btn) => {
    const icon = btn.querySelector("i")
    if (existingItemIndex !== -1) {
      icon.className = "far fa-heart"
    } else {
      icon.className = "fas fa-heart"
    }
  })
}

// Function to update cart count
function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count")
  if (!cartCountElements.length) return

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  cartCountElements.forEach((element) => {
    element.textContent = itemCount
  })
}

// Function to show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.innerHTML = `
    <div class="notification-content">
      <p>${message}</p>
    </div>
  `

  // Add to body
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Function to generate product card HTML
function generateProductCard(product) {
  const discount = calculateDiscount(product.originalPrice, product.price)

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.images[0]}" alt="${product.name}">
        ${product.isNew ? '<span class="product-tag">New</span>' : ""}
        ${discount ? `<span class="product-tag discount">-${discount}%</span>` : ""}
        <div class="product-actions">
          <button class="btn-icon quick-view" data-product-id="${product.id}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-icon add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i>
          </button>
          <button class="btn-icon add-to-wishlist" data-product-id="${product.id}">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">
          <a href="product-detail.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ""}
        </div>
        <div class="product-rating">
          ${generateRatingStars(product.rating)}
          <span>(${product.reviewCount})</span>
        </div>
      </div>
    </div>
  `
}

// Function to calculate discount percentage
function calculateDiscount(originalPrice, currentPrice) {
  if (!originalPrice || originalPrice <= currentPrice) return null
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100
  return Math.round(discount)
}

// Function to generate rating stars
function generateRatingStars(rating) {
  let stars = ""
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += '<i class="fas fa-star"></i>'
    } else if (i === fullStars + 1 && halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>'
    } else {
      stars += '<i class="far fa-star"></i>'
    }
  }

  return stars
}

// Function to format price
function formatPrice(price) {
  return "₦" + price.toFixed(2)
}

// Function to get products by category
function getProductsByCategory(category) {
  const products = [
    {
      id: 1,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 150,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p1.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
    {
      id: 2,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 75,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p2.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
    // Add more products here
        {
      id: 3,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p3.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
        {
      id: 4,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p4.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
            {
      id: 5,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p5.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
            {
      id: 6,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p6.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
            {
      id: 7,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p7.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
            {
      id: 8,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p8.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
            {
      id: 9,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p9.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },

                {
      id: 10,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p10.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
                {
      id: 11,
      name: "clothing",
      category: "clothing",
      price: 35000,
      originalPrice: 45000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p11.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
                {
      id: 12,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p12.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
             {
      id: 13,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p13.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 14,
      name: "clothing",
      category: "clothing",
      price: 18000,
      originalPrice: 20000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p14.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 15,
      name: "clothing",
      category: "clothing",
      price: 14000,
      originalPrice: 20000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p15.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 16,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p16.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 17,
      name: "clothing",
      category: "clothing",
      price: 35000,
      originalPrice: 45000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p17.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 18,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p18.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 19,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p19.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
             {
      id: 20,
      name: "clothing",
      category: "clothing",
      price: 27000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p20.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 21,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p21.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
  ]

  if (category === "all") {
    return products
  }
  return products.filter((product) => product.category === category)
}

// Function to filter products by price
function filterProductsByPrice(minPrice, maxPrice, productList) {
  return productList.filter((product) => product.price >= minPrice && product.price <= maxPrice)
}

// Function to sort products
function sortProducts(productList, sortBy) {
  const sortedProducts = [...productList]

  switch (sortBy) {
    case "price-low":
      return sortedProducts.sort((a, b) => a.price - b.price)
    case "price-high":
      return sortedProducts.sort((a, b) => b.price - a.price)
    case "newest":
      return sortedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    case "popularity":
    default:
      return sortedProducts.sort((a, b) => b.rating - a.rating)
  }
}

// Function to search products
function searchProducts(query) {
  query = query.toLowerCase()
  const products = [
    {
      id: 1,
      name: "clothing",
      category: "clothing",
      price: 100,
      originalPrice: 150,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["image1.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
    {
      id: 2,
      name: "Product 2",
      category: "clothing",
      price: 50,
      originalPrice: 75,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["image2.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
    // Add more products here
  ]

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some((tag) => tag.toLowerCase().includes(query)),
  )
}

// Function to get product by ID
function getProductById(id) {
  const products = [
    {
      id: 1,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p1.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
    {
      id: 2,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p2.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
    // Add more products here

        {
      id: 3,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: true,
      rating: 4.5,
      reviewCount: 100,
      images: ["p3.jpg"],
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Red", value: "#FF0000" },
        { name: "Blue", value: "#0000FF" },
      ],
    },
    {
      id: 4,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p4.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },

        {
      id: 5,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p5.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
        {
      id: 6,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p6.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
        {
      id: 7,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p7.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
        {
      id: 8,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p.6jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
        {
      id: 9,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p9.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
            {
      id: 10,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p10.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
            {
      id: 11,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p11.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
            {
      id: 12,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p12.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 13,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p13.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 14,
      name: "clothing",
      category: "clothing",
      price: 18000,
      originalPrice: 20000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p14.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 15,
      name: "clothing",
      category: "clothing",
      price: 14000,
      originalPrice: 20000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p15.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 16,
      name: "clothing",
      category: "clothing",
      price: 30000,
      originalPrice: 40000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p16.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 17,
      name: "clothing",
      category: "clothing",
      price: 35000,
      originalPrice: 45000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p17.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 18,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p18.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 19,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p19.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
    
             {
      id: 20,
      name: "clothing",
      category: "clothing",
      price: 27000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p20.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
              {
      id: 21,
      name: "clothing",
      category: "clothing",
      price: 25000,
      originalPrice: 35000,
      isNew: false,
      rating: 4.0,
      reviewCount: 50,
      images: ["p21.jpg"],
      sizes: ["XS", "S", "M"],
      colors: [
        { name: "Green", value: "#00FF00" },
        { name: "Yellow", value: "#FFFF00" },
      ],
    },
  ]

  return products.find((product) => product.id === Number(id))
}
