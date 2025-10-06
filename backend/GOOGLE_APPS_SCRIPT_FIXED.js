// Configuration
const MAX_ROWS_PER_SHEET = 10000;
const FIRST_SHEET_NAME = "Orders"; // First sheet will be named "Orders"
const SHEET_NAME_PREFIX = "Orders_"; // Subsequent sheets: Orders_2, Orders_3, etc.

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
  let previousSheetName = currentSheet.getName();
  
  // Only rotate if we have data rows (excluding header)
  if (lastRow > 1 && lastRow >= MAX_ROWS_PER_SHEET) {
    // Create new sheet
    previousSheetRows = lastRow - 1; // Exclude header
    currentSheet = createNewSheet(ss);
    newSheetCreated = true;
    Logger.log('🎉 NEW SHEET CREATED: ' + currentSheet.getName() + ' (Previous: ' + previousSheetName + ' had ' + previousSheetRows + ' orders)');
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
  
  Logger.log('✅ Order saved to: ' + currentSheet.getName() + ' (Row: ' + newRowNumber + ')');
  
  // Return response
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    currentSheet: currentSheet.getName(),
    rowNumber: newRowNumber,
    newSheetCreated: newSheetCreated,
    previousSheetRows: previousSheetRows,
    newSheetName: newSheetCreated ? currentSheet.getName() : null
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get current active sheet or create first one
 */
function getCurrentOrCreateSheet(ss) {
  const sheets = ss.getSheets();
  
  // First, check if "Orders" sheet exists (the first sheet)
  let ordersSheet = ss.getSheetByName(FIRST_SHEET_NAME);
  if (ordersSheet) {
    const lastRow = ordersSheet.getLastRow();
    // If Orders sheet is not full, use it
    if (lastRow < MAX_ROWS_PER_SHEET) {
      return ordersSheet;
    }
  }
  
  // Find the latest numbered Orders sheet
  let latestSheet = null;
  let latestNumber = 1;
  
  for (let i = 0; i < sheets.length; i++) {
    const sheetName = sheets[i].getName();
    if (sheetName.startsWith(SHEET_NAME_PREFIX)) {
      const number = parseInt(sheetName.replace(SHEET_NAME_PREFIX, '')) || 2;
      if (number > latestNumber) {
        latestNumber = number;
        latestSheet = sheets[i];
      }
    }
  }
  
  // If we found a numbered sheet, check if it's full
  if (latestSheet) {
    const lastRow = latestSheet.getLastRow();
    if (lastRow < MAX_ROWS_PER_SHEET) {
      return latestSheet;
    }
  }
  
  // If no Orders sheet exists at all, create the first one
  if (!ordersSheet && !latestSheet) {
    ordersSheet = createFirstSheet(ss);
    return ordersSheet;
  }
  
  // If we reach here, current sheet is full, need to create new one
  return createNewSheet(ss);
}

/**
 * Create the first "Orders" sheet with headers
 */
function createFirstSheet(ss) {
  // Check if sheet already exists
  let sheet = ss.getSheetByName(FIRST_SHEET_NAME);
  if (sheet) {
    return sheet;
  }
  
  // Create new sheet
  sheet = ss.insertSheet(FIRST_SHEET_NAME);
  
  // Add headers
  const headers = ['Timestamp', 'Table Number', 'Customer Name', 'Mobile', 'Email', 'Items', 'Total'];
  sheet.appendRow(headers);
  
  // Format headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  
  // Auto-resize columns
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  Logger.log('✅ Created first sheet: ' + FIRST_SHEET_NAME);
  
  return sheet;
}

/**
 * Create a new numbered sheet with headers
 */
function createNewSheet(ss) {
  const sheets = ss.getSheets();
  let maxNumber = 1;
  
  // Find the highest number
  for (let i = 0; i < sheets.length; i++) {
    const sheetName = sheets[i].getName();
    if (sheetName.startsWith(SHEET_NAME_PREFIX)) {
      const number = parseInt(sheetName.replace(SHEET_NAME_PREFIX, '')) || 0;
      if (number > maxNumber) {
        maxNumber = number;
      }
    }
  }
  
  const sheetNumber = maxNumber + 1;
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
  
  Logger.log('✅ Created new sheet: ' + sheetName);
  
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
    
    // Include "Orders" and "Orders_X" sheets
    if (sheetName === FIRST_SHEET_NAME || sheetName.startsWith(SHEET_NAME_PREFIX)) {
      const rowCount = Math.max(0, sheet.getLastRow() - 1); // Exclude header
      totalOrders += rowCount;
      
      orderSheets.push({
        name: sheetName,
        rows: rowCount,
        maxRows: MAX_ROWS_PER_SHEET,
        percentFull: ((rowCount / MAX_ROWS_PER_SHEET) * 100).toFixed(2),
        isFull: rowCount >= MAX_ROWS_PER_SHEET
      });
    }
  }
  
  // Sort by sheet name (Orders first, then Orders_2, Orders_3, etc.)
  orderSheets.sort((a, b) => {
    if (a.name === FIRST_SHEET_NAME) return -1;
    if (b.name === FIRST_SHEET_NAME) return 1;
    return a.name.localeCompare(b.name);
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    totalSheets: orderSheets.length,
    totalOrders: totalOrders,
    sheets: orderSheets,
    maxRowsPerSheet: MAX_ROWS_PER_SHEET,
    currentSheet: orderSheets.length > 0 ? orderSheets[orderSheets.length - 1].name : FIRST_SHEET_NAME
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup function - Run this once to create the first "Orders" sheet
 */
function setupFirstSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = createFirstSheet(ss);
  Logger.log('✅ First sheet "' + FIRST_SHEET_NAME + '" created successfully!');
  Logger.log('📊 Sheet has ' + (sheet.getLastRow() - 1) + ' orders');
}

/**
 * Test function - Add a test order
 */
function testAddOrder() {
  const testOrder = {
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    tableNumber: '1',
    customerName: 'Test Customer',
    mobile: '9876543210',
    email: 'test@example.com',
    items: 'Test Item x1 (₹100)',
    total: '₹100.00'
  };
  
  const result = handleOrderSubmission(testOrder);
  Logger.log(result.getContent());
}
