const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Cleanup Service - Clears old orders from Google Sheets and local storage
 * Runs daily at midnight to prevent storage overload
 */

// Clear orders from Google Sheets using webhook
async function clearGoogleSheetsOrders() {
    try {
        // If you have a webhook URL for clearing data, use it
        // Otherwise, this will just log the action
        if (process.env.CLEAR_ORDERS_WEBHOOK_URL) {
            await axios.post(process.env.CLEAR_ORDERS_WEBHOOK_URL, {
                action: 'clear_orders',
                timestamp: new Date().toISOString()
            });
            console.log('✅ Google Sheets orders cleared successfully');
        } else {
            console.log('⚠️  CLEAR_ORDERS_WEBHOOK_URL not configured - skipping Google Sheets cleanup');
        }
    } catch (error) {
        console.error('❌ Error clearing Google Sheets orders:', error.message);
    }
}

// Clear local orders.json file
function clearLocalOrders() {
    try {
        const ordersFile = path.join(__dirname, '..', 'data', 'orders.json');
        
        if (fs.existsSync(ordersFile)) {
            // Backup old orders before clearing
            const backupDir = path.join(__dirname, '..', 'data', 'backups');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            const backupFile = path.join(backupDir, `orders_backup_${timestamp}.json`);
            
            // Copy to backup
            fs.copyFileSync(ordersFile, backupFile);
            console.log(`📦 Orders backed up to: ${backupFile}`);
            
            // Clear the main file
            fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
            console.log('✅ Local orders.json cleared successfully');
        }
    } catch (error) {
        console.error('❌ Error clearing local orders:', error.message);
    }
}

// Main cleanup function
async function performDailyCleanup() {
    console.log('\n========================================');
    console.log('🧹 DAILY CLEANUP STARTED');
    console.log('========================================');
    console.log('⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    
    // Clear Google Sheets orders
    await clearGoogleSheetsOrders();
    
    // Clear local orders
    clearLocalOrders();
    
    console.log('========================================');
    console.log('✅ DAILY CLEANUP COMPLETED');
    console.log('========================================\n');
}

// Clear in-memory orders array (to be called from server.js)
function clearInMemoryOrders(ordersArray) {
    if (ordersArray && Array.isArray(ordersArray)) {
        ordersArray.length = 0; // Clear array
        console.log('✅ In-memory orders cleared');
    }
}

module.exports = {
    performDailyCleanup,
    clearInMemoryOrders,
    clearGoogleSheetsOrders,
    clearLocalOrders
};
