const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { fetchMenuFromSheets } = require('./utils/sheetsHelper');
const { sendOrderConfirmation } = require('./utils/emailService');
const { performDailyCleanup, clearInMemoryOrders } = require('./utils/cleanupService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for orders (in production, use a database)
const orders = [];

console.log('🔧 Configuration:');
console.log(`   Google Sheets: ENABLED (menu1 sheet)`);
console.log(`   Restaurant: ${process.env.RESTAURANT_NAME || 'My Restaurant'}`);
console.log(`   Sheet URL: ${process.env.MENU_SHEET_URL ? 'Configured ✓' : 'NOT SET ✗'}`);

// API Routes

// Get Restaurant Info
app.get('/api/restaurant-info', (req, res) => {
    res.json({
        success: true,
        data: {
            name: process.env.RESTAURANT_NAME || 'Our Restaurant',
            tagline: process.env.RESTAURANT_TAGLINE || 'Delicious Food, Great Service'
        }
    });
});

// Get Menu Items - Only from Google Sheets
app.get('/api/menu', async (req, res) => {
    try {
        if (!process.env.MENU_SHEET_URL) {
            return res.status(500).json({ 
                success: false, 
                error: 'Google Sheets URL not configured. Please set MENU_SHEET_URL in .env file'
            });
        }

        console.log('📊 Fetching menu from Google Sheets "menu1"...');
        const menuItems = await fetchMenuFromSheets(process.env.MENU_SHEET_URL);
        console.log(`✅ Loaded ${menuItems.length} items from Google Sheets`);

        res.json({ 
            success: true, 
            data: menuItems,
            source: 'google-sheets-menu1'
        });
    } catch (error) {
        console.error('❌ Error fetching menu from Google Sheets:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load menu from Google Sheets. Please check your sheet configuration.',
            details: error.message
        });
    }
});

// Place Order - Save to Google Sheets
app.post('/api/orders', async (req, res) => {
    console.log('\n\n========================================');
    console.log('🛒🛒🛒 NEW ORDER RECEIVED! 🛒🛒🛒');
    console.log('========================================\n');
    
    try {
        const { tableNumber, customerName, email, items, total } = req.body;
        console.log('📋 Order Details:', { tableNumber, customerName, email, itemCount: items.length, total });

        // Validate required fields
        if (!tableNumber || !items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Table number and items are required' 
            });
        }

        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email is required' 
            });
        }

        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        console.log('⏰ Timestamp:', timestamp);
        
        // Format items for Google Sheets
        const itemsString = items.map(item => 
            `${item.name} x${item.quantity} (₹${item.price * item.quantity})`
        ).join(', ');

        const orderData = {
            timestamp,
            tableNumber,
            customerName: customerName || 'N/A',
            email: email,
            items: itemsString,
            total: `₹${total.toFixed(2)}`
        };

        // Send to Google Sheets via webhook
        if (process.env.ORDERS_WEBHOOK_URL) {
            try {
                const axios = require('axios');
                const response = await axios.post(process.env.ORDERS_WEBHOOK_URL, orderData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log(`✅ Order saved to Google Sheets - Table ${tableNumber}`);
            } catch (webhookError) {
                console.error('⚠️  Failed to save to Google Sheets:', webhookError.message);
                // Continue anyway - order is still processed
            }
        } else {
            console.log('⚠️  ORDERS_WEBHOOK_URL not configured - order not saved to sheets');
        }

        // Also save to local file as backup
        const order = {
            id: `ORD-${Date.now()}`,
            ...orderData,
            items: items, // Keep original format for local storage
            total: total,
            status: 'pending'
        };
        orders.push(order);
        saveOrdersToFile();

        // Send email confirmation
        console.log('🔍 Checking email config...');
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set');
        
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            console.log('📧 Attempting to send email to:', email);
            try {
                await sendOrderConfirmation({
                    orderId: order.id,
                    tableNumber: order.tableNumber,
                    customerName: order.customerName || 'Valued Customer',
                    email: email,
                    items: items,
                    total: total,
                    timestamp: timestamp
                });
                console.log('✅ Email sent successfully to:', email);
            } catch (emailError) {
                console.error('❌ Failed to send email:', emailError.message);
                console.error('Full error:', emailError);
                // Continue anyway - order is still placed
            }
        } else {
            console.log('⚠️  Email not configured - skipping email notification');
        }

        res.json({ 
            success: true, 
            message: 'Order placed successfully!',
            orderId: order.id,
            timestamp: timestamp
        });
    } catch (error) {
        console.error('❌❌❌ ERROR PLACING ORDER:', error.message);
        console.error('Full error stack:', error.stack);
        res.status(500).json({ success: false, error: 'Failed to place order: ' + error.message });
    }
});

// Get All Orders (for restaurant owner)
app.get('/api/orders', (req, res) => {
    res.json({
        success: true,
        data: orders.reverse() // Most recent first
    });
});

// Get Single Order by ID (for customer tracking)
app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        return res.status(404).json({ 
            success: false, 
            error: 'Order not found' 
        });
    }

    res.json({ 
        success: true, 
        data: order 
    });
});

// Update Order Status
app.patch('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.status = status;
    saveOrdersToFile();

    console.log(`📝 Order ${orderId} status updated to: ${status}`);

    res.json({ success: true, data: order });
});

// Save orders to file
function saveOrdersToFile() {
    const ordersDir = path.join(__dirname, 'data');
    const ordersFile = path.join(ordersDir, 'orders.json');
    
    try {
        if (!fs.existsSync(ordersDir)) {
            fs.mkdirSync(ordersDir, { recursive: true });
        }
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    } catch (error) {
        console.error('Error saving orders to file:', error);
    }
}

// Load orders from file on startup
function loadOrdersFromFile() {
    const ordersFile = path.join(__dirname, 'data', 'orders.json');
    
    try {
        if (fs.existsSync(ordersFile)) {
            const data = fs.readFileSync(ordersFile, 'utf8');
            const loadedOrders = JSON.parse(data);
            orders.push(...loadedOrders);
            console.log(`📦 Loaded ${orders.length} previous orders`);
        }
    } catch (error) {
        console.error('Error loading orders from file:', error);
    }
}

// Manual cleanup endpoint (for testing)
app.post('/api/cleanup/manual', async (req, res) => {
    try {
        console.log('🧹 Manual cleanup triggered by API request');
        await performDailyCleanup();
        clearInMemoryOrders(orders);
        
        res.json({
            success: true,
            message: 'Manual cleanup completed successfully',
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });
    } catch (error) {
        console.error('❌ Manual cleanup failed:', error);
        res.status(500).json({
            success: false,
            error: 'Cleanup failed: ' + error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        googleSheets: 'enabled',
        ordersWebhook: process.env.ORDERS_WEBHOOK_URL ? 'configured' : 'not configured',
        autoCleanup: 'enabled (daily at 12:00 AM IST)'
    });
});

// Schedule daily cleanup at midnight (12:00 AM IST)
cron.schedule('0 0 * * *', async () => {
    console.log('\n⏰ Midnight cleanup triggered...');
    await performDailyCleanup();
    clearInMemoryOrders(orders);
}, {
    timezone: "Asia/Kolkata"
});

console.log('🕐 Daily cleanup scheduled for 12:00 AM IST');

// Start server
loadOrdersFromFile();

app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`\n💡 Tip: Make sure your Google Sheet "menu1" is publicly accessible`);
    if (process.env.ORDERS_WEBHOOK_URL) {
        console.log(`📝 Orders will be saved to Google Sheets`);
    } else {
        console.log(`⚠️  Orders webhook not configured - orders saved to local file only`);
    }
    console.log('🧹 Auto-cleanup: Orders will be cleared daily at midnight');
    console.log('');
});
