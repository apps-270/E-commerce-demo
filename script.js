/* ================= CONFIGURATION ================= */
const CONFIG = {
    brandName: 'ShopHub',
    brandIcon: '🛒',
    primaryColor: '#2563eb',
    animationDuration: 300,
    currency: '₹',
    conversionRate: 83
};

/* ================= INITIALIZATION ================= */
document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
    initializeUI();
});

function initializeStorage() {
    // Products
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([
            { id: 1, name: 'iPhone 15 Pro', price: 999, category: 'Electronics', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', badge: 'Best Seller' },
            { id: 2, name: 'MacBook Pro M3', price: 2499, category: 'Electronics', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', badge: 'New' },
            { id: 3, name: 'Sony WH-1000XM5', price: 349, category: 'Audio', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500', badge: 'Sale' },
            { id: 4, name: 'Apple Watch Ultra', price: 799, category: 'Wearables', image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500', badge: 'Popular' },
            { id: 5, name: 'iPad Pro 12.9"', price: 1099, category: 'Electronics', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
            { id: 6, name: 'AirPods Pro 2', price: 249, category: 'Audio', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500', badge: 'Sale' },
            { id: 7, name: 'Samsung Galaxy S24', price: 899, category: 'Electronics', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', badge: 'New' },
            { id: 8, name: 'Nike Air Max', price: 159, category: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
            { id: 9, name: 'BTS Poster - Map of the Soul', price: 15, category: 'Posters', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500', badge: 'New' },
            { id: 10, name: 'Demon Slayer - Tanjiro Poster', price: 12, category: 'Posters', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500', badge: 'Popular' },
            { id: 11, name: 'Demon Slayer - Nezuko Poster', price: 12, category: 'Posters', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500', badge: 'New' }
        ]));
    }

    // Initialize other storage keys
    ['cart', 'orders', 'reviews', 'users'].forEach(key => {
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, '[]');
        }
    });

    // Dark mode
    if (!localStorage.getItem('darkMode')) {
        localStorage.setItem('darkMode', 'false');
    }
}

function initializeUI() {
    // Apply dark mode if enabled
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Update cart count
    updateCartCount();
}

/* ================= DATA HELPERS ================= */
function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        return [];
    }
}

function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check' : 'times'}"></i>
        </div>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* ================= AUTHENTICATION ================= */
function register() {
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    const confirmPass = document.getElementById('regConfirmPass')?.value.trim();

    // Validation
    if (!email || !pass) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (pass.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    if (confirmPass && pass !== confirmPass) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const users = getData('users');
    
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }

    users.push({ email, password: pass, isAdmin: email === 'admin@shop.com', createdAt: new Date().toISOString() });
    setData('users', users);

    showNotification('Registration successful! Please login.', 'success');
    setTimeout(() => window.location = 'login.html', 1000);
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value.trim();

    if (!email || !pass) {
        showNotification('Please enter email and password', 'error');
        return;
    }

    const users = getData('users');
    const user = users.find(u => u.email === email && u.password === pass);

    if (!user) {
        showNotification('Invalid email or password', 'error');
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    showNotification(`Welcome back, ${user.email}!`, 'success');
    
    setTimeout(() => {
        window.location = 'index.html';
    }, 1000);
}

function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => window.location = 'login.html', 1000);
}

function requireLogin() {
    if (!localStorage.getItem('currentUser') && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location = 'login.html';
    }
}

/* ================= DARK MODE ================= */
function toggleDark() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    localStorage.setItem('darkMode', !isDark);
    document.body.classList.toggle('dark-mode');
    
    if (!isDark) {
        document.body.style.background = '#1e293b';
        document.body.style.color = '#f8fafc';
    } else {
        document.body.style.background = '#f8fafc';
        document.body.style.color = '#1e293b';
    }
}

function applyDark() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.style.background = '#1e293b';
        document.body.style.color = '#f8fafc';
    }
}

/* ================= PRODUCTS ================= */
function loadProducts(filter = 'all', searchTerm = '') {
    const container = document.getElementById('products');
    if (!container) return;

    let products = getData('products');

    // Apply category filter
    if (filter !== 'all') {
        products = products.filter(p => p.category.toLowerCase() === filter.toLowerCase());
    }

    // Apply search
    if (searchTerm) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map((product, index) => `
        <div class="col-md-6 col-lg-4 col-xl-3 fade-in stagger-${(index % 4) + 1}">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Product'">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-actions">
                        <button class="product-action-btn" onclick="quickView(${product.id})" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="product-action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price">₹${(product.price * CONFIG.conversionRate).toLocaleString('en-IN')}</div>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateCartCount();
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput')?.value || '';
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
    loadProducts(activeCategory, searchTerm);
}

function filterByCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    const searchTerm = document.getElementById('searchInput')?.value || '';
    loadProducts(category, searchTerm);
}

function quickView(productId) {
    const products = getData('products');
    const product = products.find(p => p.id === productId);
    
    if (product) {
        showNotification(`Quick view: ${product.name}`, 'success');
    }
}

function addToWishlist(productId) {
    showNotification('Added to wishlist!', 'success');
}

/* ================= CART ================= */
function addToCart(productId) {
    let cart = getData('cart');
    const product = getData('products').find(p => p.id === productId);
    
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }
    
    setData('cart', cart);
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

function updateCartCount() {
    const cart = getData('cart');
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

function loadCart() {
    const cart = getData('cart');
    const products = getData('products');
    const container = document.getElementById('cartItems');
    
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <div class="empty-state-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Add some products to get started</p>
                        <a href="shop.html" class="btn btn-primary-custom">Shop Now</a>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById('total').textContent = '₹0';
        return;
    }

    let total = 0;
    
    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';
        
        const subtotal = product.price * item.qty;
        total += subtotal;

        return `
            <tr>
                <td>
                    <div class="cart-item-details">
                        <div class="cart-item-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div>
                            <h6 class="cart-item-title">${product.name}</h6>
                            <span class="cart-item-price">₹${(product.price * CONFIG.conversionRate).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQty(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.qty}</span>
                        <button class="quantity-btn" onclick="changeQty(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td class="cart-item-total">₹${(subtotal * CONFIG.conversionRate).toLocaleString('en-IN')}</td>
                <td>
                    <button class="btn-remove" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('total').textContent = '₹' + (total * CONFIG.conversionRate).toLocaleString('en-IN');
}

function changeQty(productId, change) {
    let cart = getData('cart');
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    
    setData('cart', cart);
    loadCart();
    updateCartCount();
}

function removeItem(productId) {
    let cart = getData('cart').filter(i => i.id !== productId);
    setData('cart', cart);
    loadCart();
    updateCartCount();
    showNotification('Item removed from cart', 'success');
}

function checkout() {
    const cart = getData('cart');
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    window.location = 'payment.html';
}

/* ================= PAYMENT ================= */
function completePayment() {
    const cardNumber = document.getElementById('cardNumber')?.value.trim();
    const expiry = document.getElementById('expiry')?.value.trim();
    const cvv = document.getElementById('cvv')?.value.trim();

    // Basic validation
    if (!cardNumber || !expiry || !cvv) {
        showNotification('Please fill in all payment details', 'error');
        return;
    }

    if (cardNumber.length < 16) {
        showNotification('Please enter a valid card number', 'error');
        return;
    }

    // Process payment
    const cart = getData('cart');
    const products = getData('products');
    
    const order = {
        id: Date.now(),
        items: cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return {
                ...item,
                name: product?.name,
                price: product?.price,
                image: product?.image
            };
        }),
        total: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product?.price || 0) * item.qty;
        }, 0),
        date: new Date().toISOString(),
        status: 'completed'
    };

    // Save order
    const orders = getData('orders');
    orders.unshift(order);
    setData('orders', orders);

    // Clear cart
    setData('cart', []);
    updateCartCount();

    showNotification('Payment successful! Order placed.', 'success');
    
    setTimeout(() => {
        window.location = 'order.html';
    }, 1500);
}

/* ================= ORDERS ================= */
function loadOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;

    const orders = getData('orders');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>No orders yet</h3>
                <p>Your order history will appear here</p>
                <a href="shop.html" class="btn btn-primary-custom">Start Shopping</a>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card fade-in">
            <div class="order-header">
                <div>
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-date ms-3">${new Date(order.date).toLocaleDateString()}</span>
                </div>
                <span class="order-status ${order.status}">${order.status}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="order-item-image">
                            <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.name}">
                        </div>
                        <div>
                            <h6>${item.name}</h6>
                            <small class="text-muted">Qty: ${item.qty} × ₹${(item.price * CONFIG.conversionRate).toLocaleString('en-IN')}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span class="order-total">Total: ₹${(order.total * CONFIG.conversionRate).toLocaleString('en-IN')}</span>
                <button class="btn btn-primary-custom" onclick="reorder(${order.id})">Reorder</button>
            </div>
        </div>
    `).join('');
}

function reorder(orderId) {
    const orders = getData('orders');
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        const cart = getData('cart');
        order.items.forEach(item => {
            const existing = cart.find(c => c.id === item.id);
            if (existing) {
                existing.qty += item.qty;
            } else {
                cart.push({ id: item.id, qty: item.qty });
            }
        });
        
        setData('cart', cart);
        updateCartCount();
        showNotification('Items added to cart!', 'success');
        setTimeout(() => window.location = 'cart.html', 1000);
    }
}

/* ================= REVIEWS ================= */
function loadReviews() {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    const reviews = getData('reviews');
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⭐</div>
                <h3>No reviews yet</h3>
                <p>Be the first to leave a review</p>
            </div>
        `;
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-author">${review.author}</div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
            </div>
            <p class="review-text">${review.text}</p>
            <small class="review-date">${new Date(review.date).toLocaleDateString()}</small>
        </div>
    `).join('');
}

function addReview() {
    const rating = document.getElementById('reviewRating')?.value || 5;
    const text = document.getElementById('reviewText')?.value.trim();
    
    if (!text) {
        showNotification('Please write a review', 'error');
        return;
    }

    const reviews = getData('reviews');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    reviews.unshift({
        author: user.email || 'Anonymous',
        rating: parseInt(rating),
        text: text,
        date: new Date().toISOString()
    });
    
    setData('reviews', reviews);
    loadReviews();
    showNotification('Review added!', 'success');
}

/* ================= ADMIN ================= */
function loadAdmin() {
    const orders = getData('orders');
    const products = getData('products');
    const users = getData('users');
    const cart = getData('cart');

    // Update stats
    document.getElementById('orderCount').innerText = orders.length;
    document.getElementById('productCount').innerText = products.length;
    document.getElementById('userCount').innerText = users.length;
    
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0) * CONFIG.conversionRate;
    document.getElementById('revenue').innerText = '₹' + totalRevenue.toLocaleString('en-IN');

    // Load chart
    loadSalesChart(orders);

    // Load orders list
    const ordersList = document.getElementById('ordersList');
    if (ordersList) {
        ordersList.innerHTML = orders.slice(0, 10).map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div class="order-footer">
                    <span>${order.items.length} items</span>
                    <span class="order-total">₹${(order.total * CONFIG.conversionRate).toLocaleString('en-IN')}</span>
                </div>
            </div>
        `).join('');
    }
}

function loadSalesChart(orders) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Group orders by date
    const ordersByDate = {};
    orders.forEach(order => {
        const date = new Date(order.date).toLocaleDateString();
        ordersByDate[date] = (ordersByDate[date] || 0) + (order.total || 0);
    });

    const labels = Object.keys(ordersByDate).slice(-7);
    const data = labels.map(date => ordersByDate[date]);

    // Check if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.length ? labels : ['No Data'],
                datasets: [{
                    label: 'Revenue',
                    data: data.length ? data : [0],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

/* ================= CONTACT ================= */
function submitContact() {
    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    showNotification('Message sent! We\'ll get back to you soon.', 'success');
    
    // Clear form
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
}

/* ================= UTILITIES ================= */
function formatCurrency(amount) {
    return '₹' + (amount * CONFIG.conversionRate).toFixed(2);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Auto-load functions based on page
function initPage() {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        loadProducts();
    } else if (path.includes('shop.html')) {
        loadProducts();
    } else if (path.includes('cart.html')) {
        loadCart();
    } else if (path.includes('order.html')) {
        loadOrders();
    } else if (path.includes('admin.html')) {
        loadAdmin();
    } else if (path.includes('reviews.html')) {
        loadReviews();
    }
}

// Initialize page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
