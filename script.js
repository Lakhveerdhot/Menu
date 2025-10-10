// API Base URL - Loaded from config.js
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000';

// Global state
let cart = [];
let selectedCategory = 'All';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    loadRestaurantInfo();
    loadMenu();

    // Check if coming from "Add More Items"
    window.onload = function() {
        const urlParams = new URLSearchParams(window.location.search);
        const addMore = urlParams.get('addMore');
        
        if (addMore === 'true') {
            const orderData = localStorage.getItem('addToOrder');
            if (orderData) {
                const order = JSON.parse(orderData);
                
                // Add order items to cart
                order.items.forEach(item => {
                    const existingItem = cart.find(i => i.id === item.id);
                    if (existingItem) {
                        existingItem.quantity += item.quantity;
                    } else {
                        cart.push({ ...item });
                    }
                });
                
                updateCart();
                localStorage.removeItem('addToOrder');
                
                showNotification('Previous order items added! Add more items and place order.');
                toggleCart();
            }
        }
    };
});

// Load restaurant info
async function loadRestaurantInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}?path=restaurant-info`);
        const data = await response.json();
        if (data.success) {
            document.getElementById('restaurantName').textContent = data.data.name;
            document.getElementById('restaurantTagline').textContent = data.data.tagline;
            document.title = data.data.name + ' - Menu';
        }
    } catch (error) {
        console.error('Error loading restaurant info:', error);
    }
}

// Load menu from API
async function loadMenu() {
    try {
        console.log('Fetching menu from:', `${API_BASE_URL}?path=menu`);
        const response = await fetch(`${API_BASE_URL}?path=menu`);
        const data = await response.json();
        console.log('Menu response:', data);
        
        if (data.success) {
            menuItems = data.data;
            console.log('Menu items loaded:', menuItems.length);
            
            // Hide loading spinner
            document.getElementById('menuLoading').style.display = 'none';
            document.getElementById('categoryFilter').style.display = 'flex';
            
            renderCategories();
            renderMenu();
        } else {
            console.error('Menu load failed:', data.error);
            document.getElementById('menuLoading').style.display = 'none';
            document.getElementById('menuGrid').innerHTML = '<p class="error">Failed to load menu. Please refresh the page.</p>';
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menuLoading').style.display = 'none';
        document.getElementById('menuGrid').innerHTML = '<p class="error">Failed to load menu. Please check your connection.</p>';
    }
}

// Render category filter
function renderCategories() {
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];
    const filterHtml = categories.map(cat => 
        `<button class="category-btn ${cat === selectedCategory ? 'active' : ''}" 
                onclick="filterByCategory('${cat}')">${cat}</button>`
    ).join('');
    
    document.getElementById('categoryFilter').innerHTML = filterHtml;
}

// Filter by category
function filterByCategory(category) {
    selectedCategory = category;
    renderCategories();
    renderMenu();
}

// Render menu items
function renderMenu() {
    const filteredItems = selectedCategory === 'All' 
        ? menuItems 
        : menuItems.filter(item => item.category === selectedCategory);
    
    if (filteredItems.length === 0) {
        document.getElementById('menuGrid').innerHTML = '<p class="loading">No items in this category</p>';
        return;
    }
    
    const menuHtml = filteredItems.map(item => {
        // Only show image if owner has added image URL in Google Sheet
        if (item.image && item.image.trim() !== '') {
            return `
            <div class="menu-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <h3 class="item-name">${item.name}</h3>
                        <span class="item-price">₹${item.price.toFixed(2)}</span>
                    </div>
                    <p class="item-description">${item.description}</p>
                    <span class="item-category">${item.category}</span>
                    <button class="add-to-cart" onclick="addToCart('${item.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `} else {
            // No image - show compact card without image
            return `
            <div class="menu-item menu-item-no-image">
                <div class="item-content">
                    <div class="item-header">
                        <h3 class="item-name">${item.name}</h3>
                        <span class="item-price">₹${item.price.toFixed(2)}</span>
                    </div>
                    <p class="item-description">${item.description}</p>
                    <span class="item-category">${item.category}</span>
                    <button class="add-to-cart" onclick="addToCart('${item.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `}
    }).join('');
    
    document.getElementById('menuGrid').innerHTML = menuHtml;
}

// Add item to cart
function addToCart(itemId) {
    console.log('Adding to cart:', itemId);
    // Convert to string for comparison (IDs from Google Sheets might be strings)
    const item = menuItems.find(i => String(i.id) === String(itemId));
    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }
    
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
    showNotification('Item added to cart!');
}

// Update cart quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== itemId);
    }
    
    updateCart();
}

// Update cart display
function updateCart() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('cartTotal').textContent = cartTotal.toFixed(2);
    document.getElementById('cartTotalFooter').textContent = cartTotal.toFixed(2);
    
    // Enable/disable checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = cart.length === 0;
    
    // Render cart items
    if (cart.length === 0) {
        document.getElementById('cartItems').innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        const cartHtml = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">₹${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');
        
        document.getElementById('cartItems').innerHTML = cartHtml;
    }
}

// Toggle cart sidebar
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Show checkout modal
function showCheckout() {
    if (cart.length === 0) return;
    
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('overlay');
    
    // Render order summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const summaryHtml = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    document.getElementById('orderSummaryItems').innerHTML = summaryHtml;
    document.getElementById('orderTotal').textContent = total.toFixed(2);
    
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // Close cart sidebar
    document.getElementById('cartSidebar').classList.remove('active');
}

// Close checkout modal
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Place order
async function placeOrder(event) {
    event.preventDefault();
    
    const tableNumber = document.getElementById('tableNumber').value;
    const customerName = document.getElementById('customerName').value;
    const mobile = document.getElementById('mobile').value;
    const email = document.getElementById('email').value;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        tableNumber,
        customerName,
        mobile,
        email: email || null, // Email is optional now
        items: cart,
        total
    };
    
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = '⏳ Placing Order...';
    
    try {
        console.log('Placing order:', orderData);
        // Add timeout for better UX
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
        
        // Send JSON as plain text. Using 'text/plain' keeps the request a
        // "simple" request (avoids preflight) while allowing the backend
        // to parse JSON from the request body.
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({ action: 'place-order', ...orderData }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('Order response status:', response.status);
        
        const data = await response.json();
        console.log('Order response data:', data);
        
        if (data.success) {
            // Show success modal briefly
            document.getElementById('orderId').textContent = data.orderId;
            document.getElementById('checkoutModal').classList.remove('active');
            document.getElementById('successModal').classList.add('active');
            
            // Clear cart
            cart = [];
            updateCart();
            
            // Reset form
            document.getElementById('orderForm').reset();
            
            // Redirect to view-order page after 2 seconds
            setTimeout(() => {
                window.location.href = `view-order.html?orderId=${data.orderId}`;
            }, 1000);
        } else {
            alert('Failed to place order: ' + data.error);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        if (error.name === 'AbortError') {
            alert('⚠️ Request timeout. Backend might be starting up (takes 30-60 seconds on first request). Please try again.');
        } else {
            alert('❌ Error placing order. Please check your connection and try again.');
        }
    } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
    }
}

// Close success modal
function closeSuccess() {
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Close all modals
function closeAll() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Show notification
function showNotification(message) {
    // Simple notification - you can enhance this
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
