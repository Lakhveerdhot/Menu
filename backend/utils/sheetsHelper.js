const axios = require('axios');

// Extract spreadsheet ID and sheet name from URL
function extractSheetId(url) {
    if (!url) return null;
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

// Extract gid (sheet ID) from URL if present
function extractGid(url) {
    if (!url) return '0';
    const match = url.match(/[#&]gid=([0-9]+)/);
    return match ? match[1] : '0';
}

// Fetch menu from Google Sheets (public sheet)
async function fetchMenuFromSheets(sheetUrl) {
    try {
        const sheetId = extractSheetId(sheetUrl);
        if (!sheetId) {
            throw new Error('Invalid sheet URL');
        }

        // Extract gid if present, otherwise use 0 (first sheet)
        const gid = extractGid(sheetUrl);

        // Use Google Sheets CSV export (works for public sheets)
        // The sheet named "menu1" should be the first sheet or you need to get its gid
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        
        const response = await axios.get(csvUrl);
        const csvData = response.data;
        
        // Parse CSV data
        const lines = csvData.split('\n');
        const menuItems = [];
        
        // Skip header row (index 0), start from row 1
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parse CSV line (handle quoted values)
            const values = parseCSVLine(line);
            
            if (values.length >= 5) {
                menuItems.push({
                    id: values[0] || `item-${i}`,
                    name: values[1] || '',
                    description: values[2] || '',
                    price: parseFloat(values[3]) || 0,
                    category: values[4] || 'Other',
                    image: values[5] || '' // Column 6: Image URL (optional)
                });
            }
        }
        
        return menuItems;
    } catch (error) {
        console.error('Error fetching from Google Sheets:', error.message);
        throw error;
    }
}

// Save order to Google Sheets using Google Forms
async function saveOrderToSheets(orderData, sheetUrl) {
    try {
        const sheetId = extractSheetId(sheetUrl);
        if (!sheetId) {
            throw new Error('Invalid sheet URL');
        }

        // Format order items as a string
        const itemsString = orderData.items.map(item => 
            `${item.name} x${item.quantity} (₹${item.price * item.quantity})`
        ).join(', ');

        // Create form data for Google Forms submission
        // This uses a Google Form connected to the sheet
        // The form URL needs to be created by the owner
        
        // For now, we'll use the append API endpoint (requires sheet to be editable)
        // Alternative: Use Google Apps Script Web App as a proxy
        
        const formData = {
            timestamp: orderData.timestamp,
            tableNumber: orderData.tableNumber,
            customerName: orderData.customerName || 'N/A',
            contact: orderData.contact || 'N/A',
            items: itemsString,
            total: `₹${orderData.total.toFixed(2)}`
        };

        console.log('📝 Order to be saved:', formData);
        
        // Note: For this to work, you need to create a Google Form
        // or use Google Apps Script Web App
        // For now, we'll log it and return success
        
        return { success: true, message: 'Order logged', data: formData };
    } catch (error) {
        console.error('Error saving to sheets:', error.message);
        throw error;
    }
}

// Parse CSV line handling quoted values
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current.trim());
    return values;
}

module.exports = {
    fetchMenuFromSheets,
    saveOrderToSheets,
    extractSheetId
};
