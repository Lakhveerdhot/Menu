// API Base URL - Loaded from config.js
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000';

// Global state
let cart = [];
let menuItems = []; // Add global declaration for menuItems
let selectedCategory = 'All';
// Cart matching strategy: 'id' | 'name' | 'idOrName'
// Change this value if you want matching behavior different (e.g., match by name)
const CART_MATCH_STRATEGY = 'idOrName';

function sameItem(a, b) {
    if (!a || !b) return false;
    const idA = a.id ? String(a.id).trim() : '';
    const idB = b.id ? String(b.id).trim() : '';
    const nameA = a.name ? String(a.name).trim().toLowerCase() : '';
    const nameB = b.name ? String(b.name).trim().toLowerCase() : '';

    if (CART_MATCH_STRATEGY === 'id') return idA !== '' && idA === idB;
    if (CART_MATCH_STRATEGY === 'name') return nameA !== '' && nameA === nameB;
    // idOrName
    if (idA !== '' && idA === idB) return true;
    if (nameA !== '' && nameA === nameB) return true;
    return false;
}

function mergeCartDuplicates() {
    const merged = [];
    for (const item of cart) {
        const existing = merged.find(m => sameItem(m, item));
        if (existing) {
            existing.quantity = (existing.quantity || 0) + (item.quantity || 0);
        } else {
            // clone to avoid references
            merged.push({ ...item, id: item.id ? String(item.id) : item.id, name: item.name ? String(item.name) : item.name });
        }
    }
    cart = merged;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    loadRestaurantInfo();
    loadMenu();

    // Check if coming from "Add More Items" - integrated directly
    const urlParams = new URLSearchParams(window.location.search);
    const addMore = urlParams.get('addMore');
    
    if (addMore === 'true') {
        const orderData = localStorage.getItem('addToOrder');
        if (orderData) {
            const order = JSON.parse(orderData);
            
            // Add order items to cart
            order.items.forEach(item => {
                // Find existing by strategy
                const existingItem = cart.find(i => sameItem(i, item));
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    cart.push({ ...item, id: String(item.id) });
                }
            });
            
            mergeCartDuplicates();
            updateCart();
            renderMenu(); // Refresh menu to show quantities
            localStorage.removeItem('addToOrder');
            
            showNotification('Previous order items added! Add more items and place order.');
            toggleCart();
        }
    }
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
        // If we have cached menu in localStorage, render it first for fast UX
        const cached = localStorage.getItem('menu_cache_v1');
        if (cached) {
            try {
                const cachedMenu = JSON.parse(cached);
                menuItems = cachedMenu;
                renderCategories();
                renderMenu();
                document.getElementById('menuLoading').style.display = 'none';
                document.getElementById('categoryFilter').style.display = 'flex';
            } catch (e) {
                console.warn('Failed to parse cached menu:', e);
            }
        }

        const response = await fetch(`${API_BASE_URL}?path=menu`);
        const data = await response.json();
        console.log('Menu response:', data);
        
        if (data.success) {
            menuItems = data.data;
            console.log('Menu items loaded:', menuItems.length);
            
            // Hide loading spinner
            document.getElementById('menuLoading').style.display = 'none';
            document.getElementById('categoryFilter').style.display = 'flex';
            // Save to local cache for fast subsequent loads
            try {
                localStorage.setItem('menu_cache_v1', JSON.stringify(menuItems));
            } catch (e) {
                console.warn('Failed to write menu cache:', e);
            }

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

function getCurrentQuantity(item) {
    const existingItem = cart.find(i => sameItem(i, item));
    return existingItem ? existingItem.quantity : 0;
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
        const currentQty = getCurrentQuantity(item);
        const actionHtml = `
            <div class="order-bar">
                ${currentQty === 0 
                    ? `<button class="add-btn" onclick="addToCart('${item.id}')">Add to Cart</button>`
                    : `
                        <button class="qty-btn minus" onclick="updateQuantity('${item.id}', -1)">−</button>
                        <span class="qty-display">${currentQty}</span>
                        <button class="qty-btn plus" onclick="addToCart('${item.id}')">+</button>
                    `
                }
            </div>
        `;

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
                    ${actionHtml}
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
                    ${actionHtml}
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
    let item = menuItems.find(i => String(i.id) === String(itemId));
    if (!item) {
        // Fallback: try find by name if id not found (in case onclick uses name or id missing)
        item = menuItems.find(i => i.name && i.name.toLowerCase() === itemId.toLowerCase());
        if (item) {
            console.warn('Item found by name fallback:', item.name);
        } else {
            console.error('Item not found by id or name:', itemId);
            return;
        }
    }
    
    // Normalize id comparisons as strings to avoid type mismatch duplicates
    const existingItem = cart.find(i => sameItem(i, item) || String(i.id) === String(itemId));

    if (existingItem) {
        existingItem.quantity++;
        console.log('Incremented quantity for:', existingItem.name, 'New qty:', existingItem.quantity);
    } else {
        const newItem = { ...item, id: String(item.id || item.name), quantity: 1 };
        cart.push(newItem);
        console.log('Added new item to cart:', newItem.name);
    }
    mergeCartDuplicates();
    
    updateCart();
    renderMenu(); // Refresh menu to show updated quantity controls
    showNotification('Item added to cart!');
}

// Update cart quantity
function updateQuantity(itemId, change) {
    // Find by id first
    let item = cart.find(i => String(i.id) === String(itemId));
    if (!item) {
        // Fallback: try find by name in cart
        item = cart.find(i => i.name && i.name.toLowerCase() === itemId.toLowerCase());
        if (!item) {
            console.error('Cart item not found for update:', itemId);
            return;
        }
        console.warn('Cart item found by name fallback for update:', item.name);
    }
    
    item.quantity += change;
    console.log('Updated quantity for:', item.name, 'Change:', change, 'New qty:', item.quantity);
    
    if (item.quantity <= 0) {
        cart = cart.filter(i => String(i.id) !== String(itemId));
        console.log('Removed item from cart:', item.name);
    }
    
    mergeCartDuplicates();
    updateCart();
    renderMenu(); // Refresh menu to show updated quantity controls
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
    document.body.classList.add('modal-open');

    // Close cart sidebar
    document.getElementById('cartSidebar').classList.remove('active');
}

// Close checkout modal
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.classList.remove('modal-open');
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
    document.body.classList.remove('modal-open');
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

// View Order Functions
function showViewOrder() {
    const modal = document.getElementById('viewOrderModal');
    const overlay = document.getElementById('overlay');

    // Reset modal state
    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('errorMessage').classList.remove('active');
    document.getElementById('ordersListSection').style.display = 'none';
    document.getElementById('orderDetailsSection').classList.remove('active');

    // Clear inputs
    document.getElementById('mobileInput').value = '';
    document.getElementById('orderIdInput').value = '';

    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeViewOrder() {
    document.getElementById('viewOrderModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

async function searchOrder() {
    const mobile = document.getElementById('mobileInput').value.trim();
    const orderId = document.getElementById('orderIdInput').value.trim();

    if (!mobile && !orderId) {
        alert('Please enter either mobile number or order ID');
        return;
    }

    // Show loading
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('loading').style.display = 'block';
    document.getElementById('errorMessage').classList.remove('active');

    try {
        let queryParams = '';
        if (mobile) queryParams = `mobile=${encodeURIComponent(mobile)}`;
        if (orderId) queryParams = `orderId=${encodeURIComponent(orderId)}`;

        const response = await fetch(`${API_BASE_URL}?path=orders&${queryParams}`);
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
            const orders = data.data;

            if (orders.length === 1) {
                // Single order - show details directly
                displayOrderDetails(orders[0]);
            } else {
                // Multiple orders - show list
                displayOrdersList(orders);
            }
        } else {
            // No orders found
            document.getElementById('loading').style.display = 'none';
            document.getElementById('errorMessage').classList.add('active');
        }
    } catch (error) {
        console.error('Error searching orders:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('errorMessage').classList.add('active');
    }
}

function displayOrdersList(orders) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('ordersListSection').style.display = 'block';

    const ordersHtml = orders.map(order => {
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);

        return `
            <div class="order-card" onclick="displayOrderDetails(${JSON.stringify(order).replace(/"/g, '"')})">
                <div class="order-card-header">
                    <span class="order-card-id">${order.orderId}</span>
                    <span class="order-card-status ${statusClass}">${statusText}</span>
                </div>
                <div>
                    <strong>${order.customerName}</strong> • Table ${order.tableNumber}<br>
                    <small>${new Date(order.timestamp).toLocaleString()}</small><br>
                    <small>Total: ₹${order.total.toFixed(2)}</small>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('ordersList').innerHTML = ordersHtml;
}

function displayOrderDetails(order) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('ordersListSection').style.display = 'none';
    document.getElementById('orderDetailsSection').classList.add('active');

    // Update status section
    updateOrderStatus(order.status);

    // Fill order details
    document.getElementById('displayOrderId').textContent = order.orderId;
    document.getElementById('displayTableNumber').textContent = order.tableNumber;
    document.getElementById('displayCustomerName').textContent = order.customerName;
    document.getElementById('displayOrderTime').textContent = new Date(order.timestamp).toLocaleString();
    document.getElementById('displayTotal').textContent = order.total.toFixed(2);

    // Render items
    const itemsHtml = order.items.map(item => `
        <div class="item-row">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    document.getElementById('itemsList').innerHTML = itemsHtml;
}

function updateOrderStatus(status) {
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const estimatedTime = document.getElementById('estimatedTime');
    const progressBar = document.getElementById('statusProgressBar');

    let icon = '🍳';
    let text = 'Preparing Your Order';
    let time = 'Estimated time: 15 minutes';
    let progress = '50%';

    switch (status.toLowerCase()) {
        case 'received':
            icon = '📋';
            text = 'Order Received';
            time = 'Estimated time: 20 minutes';
            progress = '20%';
            break;
        case 'preparing':
            icon = '🍳';
            text = 'Preparing Your Order';
            time = 'Estimated time: 15 minutes';
            progress = '50%';
            break;
        case 'cooking':
            icon = '🔥';
            text = 'Cooking Your Order';
            time = 'Estimated time: 10 minutes';
            progress = '75%';
            break;
        case 'ready':
            icon = '✅';
            text = 'Order Ready!';
            time = 'Please collect your order';
            progress = '100%';
            break;
        case 'completed':
            icon = '🎉';
            text = 'Order Completed';
            time = 'Thank you for dining with us!';
            progress = '100%';
            break;
    }

    statusIcon.textContent = icon;
    statusText.textContent = text;
    estimatedTime.textContent = time;
    progressBar.style.width = progress;
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'received': return 'status-received';
        case 'preparing': return 'status-preparing';
        case 'cooking': return 'status-cooking';
        case 'ready': return 'status-ready';
        case 'completed': return 'status-completed';
        default: return 'status-received';
    }
}

function getStatusText(status) {
    switch (status.toLowerCase()) {
        case 'received': return 'Received';
        case 'preparing': return 'Preparing';
        case 'cooking': return 'Cooking';
        case 'ready': return 'Ready';
        case 'completed': return 'Completed';
        default: return 'Received';
    }
}

function addMoreItems() {
    const orderId = document.getElementById('displayOrderId').textContent;
    const customerName = document.getElementById('displayCustomerName').textContent;
    const tableNumber = document.getElementById('displayTableNumber').textContent;

    // Get current order items
    const itemsList = document.getElementById('itemsList');
    const itemRows = itemsList.querySelectorAll('.item-row');
    const orderItems = [];

    itemRows.forEach(row => {
        const name = row.querySelector('.item-name').textContent;
        const quantityText = row.querySelector('.item-quantity').textContent;
        const quantity = parseInt(quantityText.replace('Quantity: ', ''));
        const priceText = row.querySelector('.item-price').textContent;
        const price = parseFloat(priceText.replace('₹', '')) / quantity;

        orderItems.push({
            name: name,
            quantity: quantity,
            price: price
        });
    });

    // Store order data for adding more items
    const orderData = {
        orderId: orderId,
        customerName: customerName,
        tableNumber: tableNumber,
        items: orderItems
    };

    localStorage.setItem('addToOrder', JSON.stringify(orderData));

    // Redirect to menu with addMore flag
    window.location.href = `${window.location.pathname}?addMore=true`;
}

// Close all modals (updated to include viewOrderModal)
function closeAll() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('viewOrderModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.classList.remove('modal-open');
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
