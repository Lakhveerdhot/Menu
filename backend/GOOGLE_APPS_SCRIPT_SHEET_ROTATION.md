# Google Apps Script - Sheet Rotation Setup

यह script Google Sheets में automatic sheet rotation के लिए है। जब current sheet में 10,000 rows हो जाएंगी, तो automatically एक नई sheet बन जाएगी।

## Setup Instructions

### Step 1: Open Google Apps Script Editor

1. अपनी Google Sheet खोलें
2. **Extensions** > **Apps Script** पर जाएं
3. नीचे दिया गया code paste करें

### Step 2: Apps Script Code

```javascript
// Configuration
const MAX_ROWS_PER_SHEET = 10000;
const SHEET_NAME_PREFIX = "Orders_";

/**
 * Handle incoming POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Check if this is a stats request
    if (data.action === 'getStats') {
      return getSheetStatistics();
    }
    
    // Handle order submission with rotation check
    return handleOrderSubmission(data);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle order submission and check for sheet rotation
 */
function handleOrderSubmission(orderData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let currentSheet = getCurrentOrCreateSheet(ss);
  
  // Check if rotation is needed
  const lastRow = currentSheet.getLastRow();
  let newSheetCreated = false;
  let previousSheetRows = 0;
  
  if (lastRow >= MAX_ROWS_PER_SHEET) {
    // Create new sheet
    previousSheetRows = lastRow;
    currentSheet = createNewSheet(ss);
    newSheetCreated = true;
  }
  
  // Add order to current sheet
  const rowData = [
    orderData.timestamp,
    orderData.tableNumber,
    orderData.customerName,
    orderData.mobile,
    orderData.email,
    orderData.items,
    orderData.total
  ];
  
  currentSheet.appendRow(rowData);
  const newRowNumber = currentSheet.getLastRow();
  
  // Return response
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    currentSheet: currentSheet.getName(),
    rowNumber: newRowNumber,
    newSheetCreated: newSheetCreated,
    previousSheetRows: previousSheetRows
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get current active sheet or create first one
 */
function getCurrentOrCreateSheet(ss) {
  const sheets = ss.getSheets();
  
  // Find the latest Orders sheet
  let latestSheet = null;
  let latestNumber = 0;
  
  for (let i = 0; i < sheets.length; i++) {
    const sheetName = sheets[i].getName();
    if (sheetName.startsWith(SHEET_NAME_PREFIX)) {
      const number = parseInt(sheetName.replace(SHEET_NAME_PREFIX, '')) || 1;
      if (number > latestNumber) {
        latestNumber = number;
        latestSheet = sheets[i];
      }
    }
  }
  
  // If no Orders sheet exists, create the first one
  if (!latestSheet) {
    latestSheet = createNewSheet(ss, 1);
  }
  
  return latestSheet;
}

/**
 * Create a new sheet with headers
 */
function createNewSheet(ss, sheetNumber = null) {
  // Determine sheet number
  if (sheetNumber === null) {
    const sheets = ss.getSheets();
    let maxNumber = 0;
    
    for (let i = 0; i < sheets.length; i++) {
      const sheetName = sheets[i].getName();
      if (sheetName.startsWith(SHEET_NAME_PREFIX)) {
        const number = parseInt(sheetName.replace(SHEET_NAME_PREFIX, '')) || 0;
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    }
    
    sheetNumber = maxNumber + 1;
  }
  
  const sheetName = SHEET_NAME_PREFIX + sheetNumber;
  const newSheet = ss.insertSheet(sheetName);
  
  // Add headers
  const headers = ['Timestamp', 'Table Number', 'Customer Name', 'Mobile', 'Email', 'Items', 'Total'];
  newSheet.appendRow(headers);
  
  // Format headers
  const headerRange = newSheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    newSheet.autoResizeColumn(i);
  }
  
  Logger.log('Created new sheet: ' + sheetName);
  
  return newSheet;
}

/**
 * Get statistics about current sheets
 */
function getSheetStatistics() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  const orderSheets = [];
  let totalOrders = 0;
  
  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    const sheetName = sheet.getName();
    
    if (sheetName.startsWith(SHEET_NAME_PREFIX)) {
      const rowCount = sheet.getLastRow() - 1; // Exclude header
      totalOrders += rowCount;
      
      orderSheets.push({
        name: sheetName,
        rows: rowCount,
        maxRows: MAX_ROWS_PER_SHEET,
        percentFull: ((rowCount / MAX_ROWS_PER_SHEET) * 100).toFixed(2)
      });
    }
  }
  
  // Sort by sheet name
  orderSheets.sort((a, b) => a.name.localeCompare(b.name));
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    totalSheets: orderSheets.length,
    totalOrders: totalOrders,
    sheets: orderSheets,
    maxRowsPerSheet: MAX_ROWS_PER_SHEET
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to create first sheet manually
 */
function setupFirstSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  createNewSheet(ss, 1);
  Logger.log('First sheet created successfully!');
}
```

### Step 3: Deploy as Web App

1. **Deploy** > **New deployment** पर क्लिक करें
2. **Type** में **Web app** select करें
3. **Description** में लिखें: "Order Sheet Rotation Service"
4. **Execute as**: **Me** (your email)
5. **Who has access**: **Anyone** (important!)
6. **Deploy** पर क्लिक करें
7. **Authorize access** करें
8. **Web app URL** को copy करें

### Step 4: Update .env File

Copy किए गए Web App URL को अपनी `.env` file में paste करें:

```env
ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### Step 5: Test Setup

Backend में यह command चलाएं:

```bash
curl http://localhost:5000/api/sheets/stats
```

यह आपको current sheets की statistics दिखाएगा।

## How It Works

1. **जब order आता है**: Backend sheet rotation service को call करती है
2. **Row count check**: Script check करती है कि current sheet में कितनी rows हैं
3. **10,000 rows पर**: अगर 10,000 या ज्यादा rows हैं, तो नई sheet बनती है
4. **Automatic naming**: Sheets का नाम होगा: `Orders_1`, `Orders_2`, `Orders_3`, etc.
5. **Data preservation**: सभी पुरानी sheets वैसे ही रहती हैं, कोई data delete नहीं होता

## Sheet Structure

हर sheet में ये columns होंगे:

| Timestamp | Table Number | Customer Name | Mobile | Email | Items | Total |
|-----------|--------------|---------------|--------|-------|-------|-------|
| 2025-10-06 11:30 AM | 5 | John Doe | 9876543210 | john@example.com | Pizza x2, Coke x1 | ₹450.00 |

## Benefits

✅ **No data loss** - सभी orders permanently save रहते हैं
✅ **Automatic rotation** - 10,000 rows पर automatically नई sheet बनती है
✅ **Easy to manage** - हर sheet अलग से देख सकते हैं
✅ **Performance** - छोटी sheets fast load होती हैं
✅ **Backup friendly** - हर sheet को अलग से export कर सकते हैं

## Troubleshooting

### Error: "Script not authorized"
- Apps Script में फिर से authorize करें
- "Who has access" को "Anyone" पर set करें

### Error: "Sheet not found"
- `setupFirstSheet()` function को Apps Script editor में run करें
- यह पहली sheet manually बना देगा

### Orders save नहीं हो रहे
- Webhook URL check करें `.env` file में
- Apps Script logs check करें: **Executions** tab में

## Manual Testing

Apps Script editor में `setupFirstSheet()` function को run करके पहली sheet manually बना सकते हैं।
