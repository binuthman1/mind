// Product data
const products = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        price: 19.99,
        originalPrice: 24.99,
        images: ["images/product1-1.jpg", "images/product1-2.jpg", "images/product1-3.jpg"],
        category: "men",
        tags: ["t-shirt", "casual", "summer"],
        rating: 4.5,
        reviewCount: 24,
        description: "A comfortable classic white t-shirt made from 100% organic cotton. Perfect for everyday wear.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "White", value: "#FFFFFF" },
            { name: "Black", value: "#000000" },
            { name: "Gray", value: "#808080" }
        ],
        inStock: true,
        isNew: true,
        isFeatured: true,
        specifications: {
            material: "100% Organic Cotton",
            fit: "Regular",
            care: "Machine wash cold, tumble dry low",
            origin: "Made in USA"
        }
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        price: 49.99,
        originalPrice: 59.99,
        images: ["images/product2-1.jpg", "images/product2-2.jpg"],
        category: "men",
        tags: ["jeans", "denim", "casual"],
        rating: 4.2,
        reviewCount: 18,
        description: "Stylish slim fit jeans with a modern look. Made from high-quality denim for durability and comfort.",
        sizes: ["30", "32", "34", "36", "38"],
        colors: [
            { name: "Blue", value: "#0000FF" },
            { name: "Black", value: "#000000" }
        ],
        inStock: true,
        isNew: false,
        isFeatured: true,
        specifications: {
            material: "98% Cotton, 2% Elastane",
            fit: "Slim",
            care: "Machine wash cold, inside out",
            origin: "Imported"
        }
    },
    {
        id: 3,
        name: "Floral Summer Dress",
        price: 39.99,
        originalPrice: 49.99,
        images: ["images/product3-1.jpg", "images/product3-2.jpg", "images/product3-3.jpg"],
        category: "women",
        tags: ["dress", "summer", "floral"],
        rating: 4.8,
        reviewCount: 32,
        description: "Beautiful floral summer dress with a flattering silhouette. Perfect for warm weather and special occasions.",
        sizes: ["XS", "S", "M", "L"],
        colors: [
            { name: "Blue", value: "#0000FF" },
            { name: "Pink", value: "#FFC0CB" }
        ],
        inStock: true,
        isNew: true,
        isFeatured: true,
        specifications: {
            material: "100% Rayon",
            fit: "Regular",
            care: "Hand wash cold, line dry",
            origin: "Imported"
        }
    },
    {
        id: 4,
        name: "Casual Hoodie",
        price: 34.99,
        originalPrice: 44.99,
        images: ["images/product4-1.jpg", "images/product4-2.jpg"],
        category: "men",
        tags: ["hoodie", "casual", "winter"],
        rating: 4.3,
        reviewCount: 15,
        description: "Comfortable casual hoodie perfect for layering. Features a kangaroo pocket and adjustable hood.",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "Gray", value: "#808080" },
            { name: "Black", value: "#000000" },
            { name: "Navy", value: "#000080" }
        ],
        inStock: true,
        isNew: false,
        isFeatured: true,
        specifications: {
            material: "80% Cotton, 20% Polyester",
            fit: "Regular",
            care: "Machine wash cold, tumble dry low",
            origin: "Imported"
        }
    },
    {
        id: 5,
        name: "Leather Jacket",
        price: 89.99,
        originalPrice: 119.99,
        images: ["images/product5-1.jpg", "images/product5-2.jpg"],
        category: "women",
        tags: ["jacket", "leather", "winter"],
        rating: 4.7,
        reviewCount: 28,
        description: "Stylish faux leather jacket with a modern design. Features multiple pockets and a comfortable lining.",
        sizes: ["S", "M", "L"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Brown", value: "#8B4513" }
        ],
        inStock: true,
        isNew: false,
        isFeatured: true,
        specifications: {
            material: "Faux Leather",
            fit: "Slim",
            care: "Wipe clean with damp cloth",
            origin: "Imported"
        }
    },
    {
        id: 6,
        name: "Athletic Shorts",
        price: 24.99,
        originalPrice: 29.99,
        images: ["images/product6-1.jpg", "images/product6-2.jpg"],
        category: "men",
        tags: ["shorts", "athletic", "summer"],
        rating: 4.4,
        reviewCount: 20,
        description: "Comfortable athletic shorts perfect for workouts or casual wear. Features moisture-wicking fabric and an elastic waistband.",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Gray", value: "#808080" },
            { name: "Blue", value: "#0000FF" }
        ],
        inStock: true,
        isNew: true,
        isFeatured: true,
        specifications: {
            material: "90% Polyester, 10% Elastane",
            fit: "Regular",
            care: "Machine wash cold, tumble dry low",
            origin: "Imported"
        }
    },
    {
        id: 7,
        name: "Formal Blouse",
        price: 29.99,
        originalPrice: 39.99,
        images: ["images/product7-1.jpg", "images/product7-2.jpg"],
        category: "women",
        tags: ["blouse", "formal", "office"],
        rating: 4.6,
        reviewCount: 22,
        description: "Elegant formal blouse perfect for office wear or special occasions. Features a flattering cut and high-quality fabric.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: [
            { name: "White", value: "#FFFFFF" },
            { name: "Black", value: "#000000" },
            { name: "Blue", value: "#0000FF" }
        ],
        inStock: true,
        isNew: false,
        isFeatured: false,
        specifications: {
            material: "95% Polyester, 5% Elastane",
            fit: "Regular",
            care: "Machine wash cold, hang dry",
            origin: "Imported"
        }
    },
    {
        id: 8,
        name: "Kids Denim Overalls",
        price: 34.99,
        originalPrice: 44.99,
        images: ["images/product8-1.jpg", "images/product8-2.jpg"],
        category: "kids",
        tags: ["overalls", "denim", "casual"],
        rating: 4.9,
        reviewCount: 30,
        description: "Adorable denim overalls for kids. Durable, comfortable, and perfect for play or casual outings.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: [
            { name: "Blue", value: "#0000FF" },
            { name: "Light Blue", value: "#ADD8E6" }
        ],
        inStock: true,
        isNew: true,
        isFeatured: false,
        specifications: {
            material: "100% Cotton",
            fit: "Regular",
            care: "Machine wash cold, tumble dry low",
            origin: "Imported"
        }
    },
    {
        id: 9,
        name: "Leather Belt",
        price: 19.99,
        originalPrice: 24.99,
        images: ["images/product9-1.jpg", "images/product9-2.jpg"],
        category: "accessories",
        tags: ["belt", "leather", "formal"],
        rating: 4.5,
        reviewCount: 25,
        description: "Classic leather belt with a timeless design. Perfect for formal or casual wear.",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Brown", value: "#8B4513" }
        ],
        inStock: true,
        isNew: false,
        isFeatured: false,
        specifications: {
            material: "Genuine Leather",
            fit: "Regular",
            care: "Wipe clean with damp cloth",
            origin: "Imported"
        }
    },
    {
        id: 10,
        name: "Winter Scarf",
        price: 14.99,
        originalPrice: 19.99,
        images: ["images/product10-1.jpg", "images/product10-2.jpg"],
        category: "accessories",
        tags: ["scarf", "winter", "warm"],
        rating: 4.7,
        reviewCount: 18,
        description: "Soft and warm winter scarf. Perfect for keeping cozy during cold weather.",
        sizes: ["One Size"],
        colors: [
            { name: "Red", value: "#FF0000" },
            { name: "Gray", value: "#808080" },
            { name: "Black", value: "#000000" }
        ],
        inStock: true,
        isNew: false,
        isFeatured: false,
        specifications: {
            material: "100% Acrylic",
            fit: "One Size",
            care: "Hand wash cold, lay flat to dry",
            origin: "Imported"
        }
    },
    {
        id: 11,
        name: "Summer Hat",
        price: 19.99,
        originalPrice: 24.99,
        images: ["images/product11-1.jpg", "images/product11-2.jpg"],
        category: "accessories",
        tags: ["hat", "summer", "beach"],
        rating: 4.4,
        reviewCount: 15,
        description: "Stylish summer hat perfect for beach days or outdoor activities. Provides great sun protection.",
        sizes: ["One Size"],
        colors: [
            { name: "Beige", value: "#F5F5DC" },
            { name: "White", value: "#FFFFFF" }
        ],
        inStock: true,
        isNew: true,
        isFeatured: false,
        specifications: {
            material: "100% Straw",
            fit: "One Size",
            care: "Spot clean only",
            origin: "Imported"
        }
    },
    {
        id: 12,
        name: "Kids Graphic T-Shirt",
        price: 14.99,
        originalPrice: 19.99,
        images: ["images/product12-1.jpg", "images/product12-2.jpg"],
        category: "kids",
        tags: ["t-shirt", "casual", "graphic"],
        rating: 4.8,
        reviewCount: 22,
        description: "Fun graphic t-shirt for kids. Made from soft, comfortable fabric that's perfect for everyday wear.",
        sizes: ["2T", "3T", "4T", "5T", "6T"],
        colors: [
            { name: "Blue", value: "#0000FF" },
            { name: "Red", value: "#FF0000" },
            { name: "Green", value: "#008000" }
        ],
        inStock: true,
        isNew: false,
        isFeatured: false,
        specifications: {
            material: "100% Cotton",
            fit: "Regular",
            care: "Machine wash cold, tumble dry low",
            origin: "Imported"
        }
    }
];

// Function to get products by category
function getProductsByCategory(category) {
    if (category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Function to get featured products
function getFeaturedProducts() {
    return products.filter(product => product.isFeatured);
}

// Function to get new arrivals
function getNewArrivals() {
    return products.filter(product => product.isNew);
}

// Function to get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Function to get related products
function getRelatedProducts(productId, limit = 4) {
    const currentProduct = getProductById(productId);
    if (!currentProduct) return [];
    
    return products
        .filter(product => product.id !== parseInt(productId) && product.category === currentProduct.category)
        .slice(0, limit);
}

// Function to search products
function searchProducts(query) {
    query = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
    );
}

// Function to filter products by price range
function filterProductsByPrice(minPrice, maxPrice, productList = products) {
    return productList.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

// Function to sort products
function sortProducts(productList, sortBy = 'popularity') {
    const sortedProducts = [...productList];
    
    switch (sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'newest':
            return sortedProducts.sort((a, b) => b.isNew - a.isNew);
        case 'popularity':
        default:
            return sortedProducts.sort((a, b) => b.rating - a.rating);
    }
}

// Function to format price
function formatPrice(price) {
    return '$' + price.toFixed(2);
}

// Function to calculate discount percentage
function calculateDiscount(originalPrice, currentPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return null;
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return Math.round(discount);
}

// Function to generate product HTML for product cards
function generateProductCard(product) {
    const discount = calculateDiscount(product.originalPrice, product.price);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0] || 'images/placeholder.jpg'}" alt="${product.name}">
                ${product.isNew ? '<span class="product-tag">New</span>' : ''}
                ${discount ? `<span class="product-tag discount">-${discount}%</span>` : ''}
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
                    ${product.originalPrice > product.price ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${generateRatingStars(product.rating)}
                    <span>(${product.reviewCount})</span>
                </div>
            </div>
        </div>
    `;
}

// Function to generate rating stars
function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}
