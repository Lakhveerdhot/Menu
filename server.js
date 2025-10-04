const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { google } = require('googleapis');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Google Sheets Authentication
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// API Routes

// Get Menu Items from Google Sheets
app.get('/api/menu', async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.MENU_SHEET_ID,
            range: 'Menu!A2:E', // Assumes headers in row 1: ID, Name, Description, Price, Category
        });

        const rows = response.data.values || [];
        const menuItems = rows.map(row => ({
            id: row[0] || '',
            name: row[1] || '',
            description: row[2] || '',
            price: parseFloat(row[3]) || 0,
            category: row[4] || 'Other',
        }));

        res.json({ success: true, data: menuItems });
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch menu items' });
    }
});

// Get Restaurant Info
app.get('/api/restaurant-info', (req, res) => {
    res.json({
        success: true,
        data: {
            name: process.env.RESTAURANT_NAME || 'Our Restaurant',
        }
    });
});

// Place Order - Save to Google Sheets
app.post('/api/orders', async (req, res) => {
    try {
        const { tableNumber, customerName, contact, items, total } = req.body;

        // Validate required fields
        if (!tableNumber || !items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Table number and items are required' 
            });
        }

        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const orderItems = items.map(item => 
            `${item.name} x${item.quantity} (₹${item.price * item.quantity})`
        ).join(', ');

        // Prepare row data
        const rowData = [
            timestamp,
            tableNumber,
            customerName || 'N/A',
            contact || 'N/A',
            orderItems,
            `₹${total.toFixed(2)}`
        ];

        // Append to Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.ORDERS_SHEET_ID,
            range: 'Orders!A:F', // Columns: Timestamp, Table, Name, Contact, Items, Total
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [rowData],
            },
        });

        res.json({ 
            success: true, 
            message: 'Order placed successfully!',
            orderId: timestamp 
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, error: 'Failed to place order' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Access the menu at http://localhost:${PORT}`);
});
