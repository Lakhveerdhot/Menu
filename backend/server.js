const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { fetchMenuFromSheets } = require('./utils/sheetsHelper');
const { sendOrderConfirmation } = require('./utils/emailService');
const { checkAndRotateSheet, getSheetStats } = require('./utils/sheetRotationService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for orders (in production, use a database)
const orders = [];

// Configuration loaded

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
    try {
        const { tableNumber, customerName, mobile, email, items, total } = req.body;

        // Validate required fields
        if (!tableNumber || !items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Table number and items are required' 
            });
        }

        if (!customerName) {
            return res.status(400).json({ 
                success: false, 
                error: 'Customer name is required' 
            });
        }

        if (!mobile) {
            return res.status(400).json({ 
                success: false, 
                error: 'Mobile number is required' 
            });
        }

        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        
        // Format items for Google Sheets
        const itemsString = items.map(item => 
            `${item.name} x${item.quantity} (₹${item.price * item.quantity})`
        ).join(', ');

        const orderData = {
            timestamp,
            tableNumber,
            customerName: customerName,
            mobile: mobile,
            email: email || 'N/A',
            items: itemsString,
            total: `₹${total.toFixed(2)}`
        };

        // Send to Google Sheets via webhook with automatic sheet rotation
        if (process.env.ORDERS_WEBHOOK_URL) {
            try {
                const sheetResult = await checkAndRotateSheet(process.env.ORDERS_WEBHOOK_URL, orderData);
                if (sheetResult.success) {
                    if (sheetResult.newSheetCreated) {
                        console.log(`🎉 NEW SHEET CREATED: ${sheetResult.sheetName}`);
                    }
                } else {
                    console.error('⚠️  Failed to save to Google Sheets:', sheetResult.error);
                }
            } catch (webhookError) {
                console.error('⚠️  Failed to save to Google Sheets:', webhookError.message);
                // Continue anyway - order is still processed
            }
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

        // Send response immediately to customer
        res.json({ 
            success: true, 
            message: 'Order placed successfully!',
            orderId: order.id,
            timestamp: timestamp
        });

        // Send email confirmation asynchronously (non-blocking)
        if (email && email !== 'N/A' && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
            // Don't await - send in background
            sendOrderConfirmation({
                orderId: order.id,
                tableNumber: order.tableNumber,
                customerName: order.customerName || 'Valued Customer',
                mobile: mobile,
                email: email,
                items: items,
                total: total,
                timestamp: timestamp
            }).then(() => {
                console.log('✅ Email sent successfully');
            }).catch(emailError => {
                console.error('❌ Failed to send email:', emailError.message);
            });
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
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
        }
    } catch (error) {
        console.error('Error loading orders from file:', error);
    }
}

// Get Sheet Statistics
app.get('/api/sheets/stats', async (req, res) => {
    try {
        if (!process.env.ORDERS_WEBHOOK_URL) {
            return res.status(400).json({
                success: false,
                error: 'Orders webhook URL not configured'
            });
        }

        const stats = await getSheetStats(process.env.ORDERS_WEBHOOK_URL);
        res.json(stats);
    } catch (error) {
        console.error('❌ Error getting sheet stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get sheet statistics: ' + error.message
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
        dataRetention: 'permanent (auto-creates new sheet at 10,000 rows)'
    });
});

// Automatic cleanup removed - all order data is now kept permanently
// New sheets are created automatically when current sheet reaches 10,000 rows

// Start server
loadOrdersFromFile();

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});
