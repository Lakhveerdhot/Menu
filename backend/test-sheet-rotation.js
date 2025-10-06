/**
 * Test Script for Sheet Rotation
 * Run this to test if sheet rotation is working
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';

async function testSheetStats() {
    console.log('\n📊 Testing Sheet Statistics...\n');
    
    try {
        const response = await axios.get(`${BASE_URL}/api/sheets/stats`);
        
        if (response.data.success) {
            console.log('✅ Sheet Stats Retrieved Successfully!\n');
            console.log('Total Sheets:', response.data.totalSheets);
            console.log('Total Orders:', response.data.totalOrders);
            console.log('Max Rows Per Sheet:', response.data.maxRowsPerSheet);
            console.log('\nSheet Details:');
            
            response.data.sheets.forEach(sheet => {
                console.log(`\n  📄 ${sheet.name}`);
                console.log(`     Rows: ${sheet.rows}/${sheet.maxRows}`);
                console.log(`     Full: ${sheet.percentFull}%`);
            });
        } else {
            console.log('❌ Failed to get stats:', response.data.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

async function testOrderSubmission() {
    console.log('\n📝 Testing Order Submission...\n');
    
    const testOrder = {
        tableNumber: 'TEST-1',
        customerName: 'Test Customer',
        mobile: '9999999999',
        email: 'test@example.com',
        items: [
            {
                name: 'Test Item',
                quantity: 1,
                price: 100
            }
        ],
        total: 100
    };
    
    try {
        const response = await axios.post(`${BASE_URL}/api/orders`, testOrder);
        
        if (response.data.success) {
            console.log('✅ Order Placed Successfully!');
            console.log('Order ID:', response.data.orderId);
            console.log('Timestamp:', response.data.timestamp);
        } else {
            console.log('❌ Failed to place order:', response.data.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

async function testHealthCheck() {
    console.log('\n🏥 Testing Health Check...\n');
    
    try {
        const response = await axios.get(`${BASE_URL}/api/health`);
        console.log('✅ Server Health:', response.data);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function runAllTests() {
    console.log('=================================================');
    console.log('🧪 SHEET ROTATION TEST SUITE');
    console.log('=================================================');
    
    // Check if server is running
    try {
        await axios.get(`${BASE_URL}/api/health`);
    } catch (error) {
        console.error('\n❌ Server is not running!');
        console.error('Please start the server first: npm run dev\n');
        return;
    }
    
    // Check if webhook is configured
    if (!process.env.ORDERS_WEBHOOK_URL) {
        console.warn('\n⚠️  WARNING: ORDERS_WEBHOOK_URL not configured in .env');
        console.warn('Sheet rotation will not work without this!');
        console.warn('See GOOGLE_APPS_SCRIPT_SHEET_ROTATION.md for setup\n');
    }
    
    await testHealthCheck();
    await testSheetStats();
    await testOrderSubmission();
    
    console.log('\n=================================================');
    console.log('✅ ALL TESTS COMPLETED');
    console.log('=================================================\n');
}

// Run tests
runAllTests();
