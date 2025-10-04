// Global state
let menuItems = [];
let cart = [];
let selectedCategory = 'All';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadRestaurantInfo();
    loadMenu();
});

// Load restaurant info
async function loadRestaurantInfo() {
    try {
        const response = await fetch('/api/restaurant-info');
        const data = await response.json();
        if (data.success) {
            document.getElementById('restaurantName').textContent = data.data.name;
            document.title = data.data.name + ' - Menu';
        }
    } catch (error) {
        console.error('Error loading restaurant info:', error);
    }
}

// Load menu from API
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        
        if (data.success) {
            menuItems = data.data;
            renderCategories();
            renderMenu();
        } else {
            document.getElementById('menuGrid').innerHTML = '<p class="error">Failed to load menu</p>';
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menuGrid').innerHTML = '<p class="error">Error loading menu. Please refresh.</p>';
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
    
    const menuHtml = filteredItems.map(item => `
        <div class="menu-item">
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
    `).join('');
    
    document.getElementById('menuGrid').innerHTML = menuHtml;
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
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
    const contact = document.getElementById('contact').value;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        tableNumber,
        customerName,
        contact,
        items: cart,
        total
    };
    
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Placing Order...';
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Show success modal
            document.getElementById('orderId').textContent = data.orderId;
            document.getElementById('checkoutModal').classList.remove('active');
            document.getElementById('successModal').classList.add('active');
            
            // Clear cart
            cart = [];
            updateCart();
            
            // Reset form
            document.getElementById('orderForm').reset();
        } else {
            alert('Failed to place order: ' + data.error);
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
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
