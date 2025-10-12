// API Base URL - Loaded from config.js
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000';

// Global state
let cart = [];
let menuItems = [];
let selectedCategory = 'All';
let searchTerm = '';
let sortBy = 'relevance';
let selectedCuisines = [];
let priceRange = [];
let vegNonVeg = [];
let hasOffersFilter = false;
let highRating = false;

// Cart matching strategy: 'id' | 'name' | 'idOrName'
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
            merged.push({ ...item, id: item.id ? String(item.id) : item.id, name: item.name ? String(item.name) : item.name });
        }
    }
    cart = merged;
}

// Mobile detection function - Strong multi-factor detection
function isMobile() {
    // Check 1: User Agent
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'opera mini', 'mobile', 'tablet'];
    const isUserAgentMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));

    // Check 2: Touch support
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check 3: Orientation API (common on mobile)
    const hasOrientation = typeof window.orientation !== 'undefined';

    // Check 4: Screen size and DPI (mobile typically smaller screen or high DPI)
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const isSmallScreen = Math.min(screenWidth, screenHeight) < 768;
    const isHighDPI = devicePixelRatio > 1;

    // Check 5: Platform
    const platform = navigator.platform.toLowerCase();
    const isPlatformMobile = platform.includes('android') || platform.includes('iphone') || platform.includes('ipad') || platform.includes('mobile');

    // Require at least 3 out of 5 checks to pass (makes spoofing harder)
    const checks = [isUserAgentMobile, hasTouch, hasOrientation, isSmallScreen || isHighDPI, isPlatformMobile];
    const passedChecks = checks.filter(Boolean).length;

    return passedChecks >= 3;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (!isMobile()) {
        document.querySelector('.container').style.display = 'none';
        document.getElementById('desktop-message').style.display = 'flex';
        return;
    }

    loadRestaurantInfo();
    loadMenu();

    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderMenu();
    });

    document.getElementById('filterBtn').addEventListener('click', toggleFilter);
    document.getElementById('applyBtn').addEventListener('click', applyFilters);
    document.getElementById('resetBtn').addEventListener('click', resetFilters);

    const urlParams = new URLSearchParams(window.location.search);
    const addMore = urlParams.get('addMore');

    if (addMore === 'true') {
        const orderData = localStorage.getItem('addToOrder');
        if (orderData) {
            const order = JSON.parse(orderData);
            order.items.forEach(item => {
                const existingItem = cart.find(i => sameItem(i, item));
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    cart.push({ ...item, id: String(item.id) });
                }
            });
            mergeCartDuplicates();
            updateCart();
            renderMenu();
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
            document.getElementById('menuLoading').style.display = 'none';
            document.getElementById('categoryFilter').style.display = 'flex';
            try {
                localStorage.setItem('menu_cache_v1', JSON.stringify(menuItems));
            } catch (e) {
                console.warn('Failed to write menu cache:', e);
            }
            renderCategories();
            renderMenu();
        } else {
            console.error('Menu load failed:', data.error);
            menuItems = [
                { id: 1, name: 'Veg Biryani', category: 'Indian', price: 150, description: 'Spicy veg biryani', rating: 4.5, hasOffers: true, isVeg: true },
                { id: 2, name: 'Chicken Biryani', category: 'Indian', price: 250, description: 'Non-veg biryani', rating: 4.2, hasOffers: false, isVeg: false },
                { id: 3, name: 'Paneer Tikka', category: 'Starters', price: 200, description: 'Grilled paneer', rating: 4.8, hasOffers: true, isVeg: true },
                { id: 4, name: 'Mutton Curry', category: 'Main Course', price: 300, description: 'Spicy mutton', rating: 3.9, hasOffers: false, isVeg: false },
                { id: 5, name: 'Veg Pizza', category: 'Italian', price: 180, description: 'Cheese pizza', rating: 4.0, hasOffers: true, isVeg: true },
                { id: 6, name: 'Fish Fry', category: 'Seafood', price: 220, description: 'Fried fish', rating: 4.1, hasOffers: false, isVeg: false },
                { id: 7, name: 'Dal Makhani', category: 'Indian', price: 120, description: 'Creamy dal', rating: 4.3, hasOffers: true, isVeg: true },
                { id: 8, name: 'Egg Roll', category: 'Street Food', price: 80, description: 'Spicy roll', rating: 3.5, hasOffers: false, isVeg: false }
            ];
            console.log('Loaded mock menu for testing:', menuItems.length);
            document.getElementById('menuLoading').style.display = 'none';
            document.getElementById('categoryFilter').style.display = 'flex';
            renderCategories();
            renderMenu();
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        menuItems = [
            { id: 1, name: 'Veg Biryani', category: 'Indian', price: 150, description: 'Spicy veg biryani', rating: 4.5, hasOffers: true, isVeg: true },
            { id: 2, name: 'Chicken Biryani', category: 'Indian', price: 250, description: 'Non-veg biryani', rating: 4.2, hasOffers: false, isVeg: false },
            { id: 3, name: 'Paneer Tikka', category: 'Starters', price: 200, description: 'Grilled paneer', rating: 4.8, hasOffers: true, isVeg: true },
            { id: 4, name: 'Mutton Curry', category: 'Main Course', price: 300, description: 'Spicy mutton', rating: 3.9, hasOffers: false, isVeg: false },
            { id: 5, name: 'Veg Pizza', category: 'Italian', price: 180, description: 'Cheese pizza', rating: 4.0, hasOffers: true, isVeg: true },
            { id: 6, name: 'Fish Fry', category: 'Seafood', price: 220, description: 'Fried fish', rating: 4.1, hasOffers: false, isVeg: false },
            { id: 7, name: 'Dal Makhani', category: 'Indian', price: 120, description: 'Creamy dal', rating: 4.3, hasOffers: true, isVeg: true },
            { id: 8, name: 'Egg Roll', category: 'Street Food', price: 80, description: 'Spicy roll', rating: 3.5, hasOffers: false, isVeg: false }
        ];
        console.log('Loaded mock menu for testing:', menuItems.length);
        document.getElementById('menuLoading').style.display = 'none';
        document.getElementById('categoryFilter').style.display = 'flex';
        renderCategories();
        renderMenu();
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

function populateCuisines() {
    if (!menuItems.length) return;
    const uniqueCats = [...new Set(menuItems.map(item => item.category))];
    const html = uniqueCats.map(cat => `
        <label class="checkbox-label">
            <input type="checkbox" class="cuisine-checkbox" value="${cat}">
            ${cat}
        </label>
    `).join('');
    document.getElementById('cuisines').innerHTML = html;
}

function toggleFilter() {
    const sidebar = document.getElementById('filterSidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar || !overlay) {
        console.error('Filter sidebar or overlay not found');
        return;
    }
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
        populateCuisines();
        document.querySelector(`input[name="sortBy"][value="${sortBy}"]`).checked = true;
        priceRange.forEach(range => {
            const chk = document.querySelector(`input[name="priceRange"][value="${range}"]`);
            if (chk) chk.checked = true;
        });
        vegNonVeg.forEach(type => {
            const chk = document.querySelector(`input[name="vegNonVeg"][value="${type}"]`);
            if (chk) chk.checked = true;
        });
        document.getElementById('hasOffers').checked = hasOffersFilter;
        document.getElementById('highRating').checked = highRating;
        selectedCuisines.forEach(cat => {
            const chk = document.querySelector(`.cuisine-checkbox[value="${cat}"]`);
            if (chk) chk.checked = true;
        });
    }
}

function applyFilters() {
    const sortRadios = document.querySelectorAll('input[name="sortBy"]:checked');
    sortBy = sortRadios.length ? sortRadios[0].value : 'relevance';
    selectedCuisines = Array.from(document.querySelectorAll('.cuisine-checkbox:checked')).map(chk => chk.value);
    priceRange = Array.from(document.querySelectorAll('input[name="priceRange"]:checked')).map(chk => chk.value);
    vegNonVeg = Array.from(document.querySelectorAll('input[name="vegNonVeg"]:checked')).map(chk => chk.value);
    hasOffersFilter = document.getElementById('hasOffers').checked;
    highRating = document.getElementById('highRating').checked;
    if (selectedCuisines.length > 0) {
        selectedCategory = selectedCuisines.length > 1 ? 'All' : selectedCuisines[0];
    } else {
        selectedCategory = 'All';
    }
    renderCategories();
    renderMenu();
    toggleFilter();
}

function resetFilters() {
    sortBy = 'relevance';
    selectedCuisines = [];
    priceRange = [];
    vegNonVeg = [];
    hasOffersFilter = false;
    highRating = false;
    document.querySelectorAll('input[type="checkbox"]').forEach(inp => inp.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(inp => inp.checked = false);
    document.querySelector('input[name="sortBy"][value="relevance"]').checked = true;
    selectedCategory = 'All';
    renderCategories();
    renderMenu();
}

function filterByCategory(category) {
    selectedCategory = category;
    if (category === 'All') {
        selectedCuisines = [];
    } else {
        selectedCuisines = [category];
    }
    renderCategories();
    renderMenu();
}

function getCurrentQuantity(item) {
    const existingItem = cart.find(i => sameItem(i, item));
    return existingItem ? existingItem.quantity : 0;
}

// Render menu items
function renderMenu() {
    let filteredItems = menuItems;

    if (selectedCuisines.length > 0) {
        filteredItems = filteredItems.filter(item => selectedCuisines.includes(item.category));
    } else if (selectedCategory !== 'All') {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(term));
    }

    if (priceRange.length > 0) {
        filteredItems = filteredItems.filter(item => {
            const p = item.price;
            if (priceRange.includes('low') && p < 200) return true;
            if (priceRange.includes('medium') && p >= 200 && p <= 500) return true;
            if (priceRange.includes('high') && p > 500) return true;
            return false;
        });
    }

    if (vegNonVeg.length > 0) {
        filteredItems = filteredItems.filter(item => {
            let isVeg;
            if (item.hasOwnProperty('isVeg')) {
                isVeg = item.isVeg;
            } else {
                const lowerName = item.name.toLowerCase();
                const lowerCat = item.category.toLowerCase();
                isVeg = lowerName.includes('veg') || lowerCat.includes('veg') || lowerName.includes('paneer') || lowerName.includes('dal') || lowerName.includes('tofu');
            }
            const isNonVeg = !isVeg;
            return (vegNonVeg.includes('veg') && isVeg) || (vegNonVeg.includes('non-veg') && isNonVeg);
        });
    }

    if (hasOffersFilter) {
        filteredItems = filteredItems.filter(item => item.hasOffers === true);
    }

    if (highRating) {
        filteredItems = filteredItems.filter(item => (item.rating || 0) >= 4);
    }

    if (sortBy === 'price-low') {
        filteredItems.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filteredItems.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
        filteredItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (filteredItems.length === 0) {
        document.getElementById('menuGrid').innerHTML = '<p class="loading">No items found</p>';
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
        `;
        } else {
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
        `;
        }
    }).join('');

    document.getElementById('menuGrid').innerHTML = menuHtml;
}

// Add item to cart
function addToCart(itemId) {
    console.log('Adding to cart:', itemId);
    let item = menuItems.find(i => String(i.id) === String(itemId));
    if (!item) {
        item = menuItems.find(i => i.name && i.name.toLowerCase() === itemId.toLowerCase());
        if (item) {
            console.warn('Item found by name fallback:', item.name);
        } else {
            console.error('Item not found by id or name:', itemId);
            return;
        }
    }
    
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
    renderMenu();
    showNotification('Item added to cart!');
}

// Update cart quantity
function updateQuantity(itemId, change) {
    let item = cart.find(i => String(i.id) === String(itemId));
    if (!item) {
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
    renderMenu();
}

// Update cart display
function updateCart() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('cartTotal').textContent = cartTotal.toFixed(2);
    document.getElementById('cartTotalFooter').textContent = cartTotal.toFixed(2);
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.disabled = cart.length === 0;
    
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
        email: email || null,
        items: cart,
        total
    };
    
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = '⏳ Placing Order...';
    
    try {
        console.log('Placing order:', orderData);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
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
            document.getElementById('orderId').textContent = data.orderId;
            document.getElementById('checkoutModal').classList.remove('active');
            document.getElementById('successModal').classList.add('active');
            
            cart = [];
            updateCart();
            
            document.getElementById('orderForm').reset();
            
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

    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('errorMessage').classList.remove('active');
    document.getElementById('ordersListSection').style.display = 'none';
    document.getElementById('orderDetailsSection').classList.remove('active');

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
                displayOrderDetails(orders[0]);
            } else {
                displayOrdersList(orders);
            }
        } else {
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

    updateOrderStatus(order.status);

    document.getElementById('displayOrderId').textContent = order.orderId;
    document.getElementById('displayTableNumber').textContent = order.tableNumber;
    document.getElementById('displayCustomerName').textContent = order.customerName;
    document.getElementById('displayOrderTime').textContent = new Date(order.timestamp).toLocaleString();
    document.getElementById('displayTotal').textContent = order.total.toFixed(2);

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

    const orderData = {
        orderId: orderId,
        customerName: customerName,
        tableNumber: tableNumber,
        items: orderItems
    };

    localStorage.setItem('addToOrder', JSON.stringify(orderData));

    window.location.href = `${window.location.pathname}?addMore=true`;
}
