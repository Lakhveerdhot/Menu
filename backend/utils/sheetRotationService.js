const axios = require('axios');

/**
 * Sheet Rotation Service
 * Automatically creates new sheets when current sheet reaches 10,000 rows
 * All data is kept permanently - no deletion
 */

const MAX_ROWS_PER_SHEET = 10000;

/**
 * Check if current sheet needs rotation and handle it
 * @param {string} webhookUrl - Google Apps Script webhook URL for orders
 * @param {object} orderData - The order data to be saved
 * @returns {Promise<object>} - Result of the operation
 */
async function checkAndRotateSheet(webhookUrl, orderData) {
    try {
        if (!webhookUrl) {
            console.log('⚠️  No webhook URL configured - skipping sheet rotation check');
            return { success: false, message: 'No webhook configured' };
        }

        // Send order data with rotation check flag
        const response = await axios.post(webhookUrl, {
            ...orderData,
            checkRotation: true,
            maxRows: MAX_ROWS_PER_SHEET
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000 // 10 second timeout
        });

        const result = response.data;

        // Check if new sheet was created
        if (result.newSheetCreated) {
            console.log(`📊 NEW SHEET CREATED: ${result.newSheetName}`);
            console.log(`📈 Previous sheet had ${result.previousSheetRows} rows`);
        }

        console.log(`✅ Order saved to sheet: ${result.currentSheet || 'Orders'}`);
        
        return {
            success: true,
            sheetName: result.currentSheet,
            rowNumber: result.rowNumber,
            newSheetCreated: result.newSheetCreated || false
        };

    } catch (error) {
        console.error('❌ Error in sheet rotation service:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get current sheet statistics
 * @param {string} webhookUrl - Google Apps Script webhook URL
 * @returns {Promise<object>} - Sheet statistics
 */
async function getSheetStats(webhookUrl) {
    try {
        if (!webhookUrl) {
            return { success: false, message: 'No webhook configured' };
        }

        const response = await axios.post(webhookUrl, {
            action: 'getStats'
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000
        });

        return {
            success: true,
            data: response.data
        };

    } catch (error) {
        console.error('❌ Error getting sheet stats:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    checkAndRotateSheet,
    getSheetStats,
    MAX_ROWS_PER_SHEET
};
