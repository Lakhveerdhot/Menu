/**
 * COMPLETE BACKEND FOR RESTAURANT MENU SYSTEM
 * Deploy this as Google Apps Script Web App
 * No Node.js or Express needed - Pure serverless backend
 */

// ============================================
// CONFIGURATION - Update these values
// ============================================
const CONFIG = {
  RESTAURANT_NAME: 'My Restaurant',
  RESTAURANT_TAGLINE: 'Delicious Food, Great Service',
  MENU_SHEET_NAME: 'menu1',           // Sheet name for menu items
  ORDERS_SHEET_NAME: 'orders',        // Sheet name for orders
  MAX_ROWS_PER_SHEET: 10000,          // Auto-create new sheet at this limit
  OWNER_EMAIL: 'lakhveer.eduboss@gmail.com',   // Restaurant owner email
  CUSTOMER_EMAIL_ENABLED: true        // Send confirmation emails to customers
};

// Optional email queue configuration
// EMAIL_QUEUE_SHEET_NAME: name of the sheet used to queue outbound emails
// EMAIL_QUEUE_AUTO_CREATE: if true, the backend will create the sheet when missing
// If false (default), missing queue sheet will NOT be auto-created and emails
// will be sent immediately instead of being queued.
CONFIG.EMAIL_QUEUE_SHEET_NAME = 'EmailQueue';
CONFIG.EMAIL_QUEUE_AUTO_CREATE = false;

// ============================================
// MAIN HANDLER - Entry point for all requests
// ============================================

// Handle CORS preflight requests
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  const path = e.parameter.path || '';
  
  try {
    switch(path) {
      case 'restaurant-info':
        return jsonResponse(getRestaurantInfo());
      
      case 'menu':
        return jsonResponse(getMenu());
      
      case 'health':
        return jsonResponse(getHealthCheck());
      
      default:
        return jsonResponse({ 
          success: false, 
          error: 'Invalid endpoint',
          availableEndpoints: ['restaurant-info', 'menu', 'health']
        }, 404);
    }
  } catch (error) {
    return jsonResponse({ 
      success: false, 
      error: error.toString() 
    }, 500);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'place-order';
    
    switch(action) {
      case 'place-order':
        return jsonResponse(placeOrder(data));
      
      case 'verify-order':
        return jsonResponse(verifyOrder(data));
      
      case 'get-stats':
        return jsonResponse(getSheetStats());
      
      default:
        return jsonResponse({ 
          success: false, 
          error: 'Invalid action' 
        }, 400);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return jsonResponse({ 
      success: false, 
      error: error.toString() 
    }, 500);
  }
}

// ============================================
// RESTAURANT INFO
// ============================================
function getRestaurantInfo() {
  return {
    success: true,
    data: {
      name: CONFIG.RESTAURANT_NAME,
      tagline: CONFIG.RESTAURANT_TAGLINE
    }
  };
}

// ============================================
// MENU MANAGEMENT
// ============================================
function getMenu() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.MENU_SHEET_NAME);

    if (!sheet) {
      return {
        success: false,
        error: `Menu sheet "${CONFIG.MENU_SHEET_NAME}" not found`
      };
    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    // Use a cache key that includes sheet size so cache invalidates when rows/cols change
    const cacheKey = `menu_cache_v1_${lastRow}_${lastCol}`;

    // Attempt to read from cache using the dynamic key
    try {
      const cache = CacheService.getScriptCache();
      const cached = cache.get(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached);
        return {
          success: true,
          data: cachedData,
          source: 'cache',
          count: cachedData.length
        };
      }
    } catch (cacheErr) {
      Logger.log('Cache read error: ' + cacheErr.toString());
    }
    // If only header exists, return empty list
    if (lastRow <= 1) {
      return { success: true, data: [], source: 'google-sheets', count: 0 };
    }

    // Read the full range (ensure at least 6 columns so existing sheets work)
    const data = sheet.getRange(1, 1, lastRow, Math.max(lastCol, 6)).getValues();
    const menuItems = [];

    // Determine header mapping (case-insensitive)
    const headerRow = data[0].map(h => (h || '').toString().trim().toLowerCase());
    const idx = {
      id: headerRow.indexOf('id') >= 0 ? headerRow.indexOf('id') : 0,
      name: headerRow.indexOf('name') >= 0 ? headerRow.indexOf('name') : 1,
      description: headerRow.indexOf('description') >= 0 ? headerRow.indexOf('description') : 2,
      price: headerRow.indexOf('price') >= 0 ? headerRow.indexOf('price') : 3,
      category: headerRow.indexOf('category') >= 0 ? headerRow.indexOf('category') : 4,
      image: headerRow.indexOf('image') >= 0 ? headerRow.indexOf('image') : 5,
      rating: (headerRow.indexOf('rating') >= 0 ? headerRow.indexOf('rating') : -1),
      hasOffers: (headerRow.indexOf('hasoffers') >= 0 ? headerRow.indexOf('hasoffers') : (headerRow.indexOf('has_offers') >= 0 ? headerRow.indexOf('has_offers') : -1)),
      isVeg: (headerRow.indexOf('isveg') >= 0 ? headerRow.indexOf('isveg') : (headerRow.indexOf('is_veg') >= 0 ? headerRow.indexOf('is_veg') : -1))
    };

    // Skip header row (index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      // Skip empty rows (no id and no name)
      const rawId = row[idx.id];
      const rawName = row[idx.name];
      if (!rawId && !rawName) continue;

      const priceRaw = row[idx.price];
      const priceVal = typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw || '').replace(/[^0-9.-]+/g, '')) || 0;

      // rating
      let ratingVal = 0;
      if (idx.rating >= 0) {
        const r = row[idx.rating];
        ratingVal = typeof r === 'number' ? r : parseFloat(String(r || '').trim()) || 0;
      }

      // hasOffers - interpret truthy values
      let hasOffersVal = false;
      if (idx.hasOffers >= 0) {
        const h = String(row[idx.hasOffers] || '').toLowerCase().trim();
        hasOffersVal = (h === 'true' || h === 'yes' || h === '1');
      }

      // isVeg
      let isVegVal = null;
      if (idx.isVeg >= 0) {
        const v = String(row[idx.isVeg] || '').toLowerCase().trim();
        if (v === 'true' || v === 'yes' || v === '1') isVegVal = true;
        else if (v === 'false' || v === 'no' || v === '0') isVegVal = false;
      }

      menuItems.push({
        id: (row[idx.id] || `item-${i}`).toString(),
        name: (row[idx.name] || '').toString(),
        description: (row[idx.description] || '').toString(),
        price: priceVal,
        category: (row[idx.category] || 'Other').toString(),
        image: (row[idx.image] || '').toString(),
        // optional fields
        rating: ratingVal,
        hasOffers: hasOffersVal,
        // keep undefined/null when not specified to avoid false assumptions
        isVeg: isVegVal
      });
    }

    // Cache the parsed menu for 5 minutes to speed up repeated calls
    try {
      const cache = CacheService.getScriptCache();
      cache.put(cacheKey, JSON.stringify(menuItems), 300); // 300 seconds
    } catch (cacheErr) {
      Logger.log('Cache write error: ' + cacheErr.toString());
    }
    
    return {
      success: true,
      data: menuItems,
      source: 'google-sheets-' + CONFIG.MENU_SHEET_NAME,
      count: menuItems.length
    };
  } catch (error) {
    Logger.log('Error fetching menu: ' + error.toString());
    return {
      success: false,
      error: 'Failed to fetch menu: ' + error.toString()
    };
  }
}

// ============================================
// ORDER MANAGEMENT
// ============================================
function placeOrder(data) {
  try {
    // Validate required fields
    if (!data.tableNumber || !data.items || data.items.length === 0) {
      return {
        success: false,
        error: 'Table number and items are required'
      };
    }
    
    if (!data.customerName) {
      return {
        success: false,
        error: 'Customer name is required'
      };
    }
    
    if (!data.mobile) {
      return {
        success: false,
        error: 'Mobile number is required'
      };
    }
    
    // Generate order ID
    const orderId = 'ORD-' + Date.now();
    const timestamp = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy, hh:mm:ss a');
    
    // Format items for sheet
    const itemsString = data.items.map(item => 
      `${item.name} x${item.quantity} (₹${(item.price * item.quantity).toFixed(2)})`
    ).join(', ');
    
    // Save to Google Sheets with auto-rotation
    const sheetResult = saveOrderToSheet({
      orderId: orderId,
      timestamp: timestamp,
      tableNumber: data.tableNumber,
      customerName: data.customerName,
      mobile: data.mobile,
      email: data.email || 'N/A',
      items: itemsString,
      // store numeric total so clients can format as needed
      total: Number(data.total)
    });
    
    // Send emails (non-blocking)
    try {
      // Queue emails by appending to EmailQueue sheet. Processing the queue
      // can be done by a separate time-driven trigger which calls processEmailQueue().
      queueEmail({
        orderId: orderId,
        timestamp: timestamp,
        tableNumber: data.tableNumber,
        customerName: data.customerName,
        mobile: data.mobile,
        email: data.email || 'N/A',
        items: data.items,
        total: data.total,
        notifyCustomer: !!(data.email && data.email !== 'N/A' && CONFIG.CUSTOMER_EMAIL_ENABLED),
        notifyOwner: !!CONFIG.OWNER_EMAIL
      });
    } catch (emailError) {
      Logger.log('Email queue error (non-critical): ' + emailError.toString());
    }
    
    return {
      success: true,
      message: 'Order placed successfully!',
      orderId: orderId,
      timestamp: timestamp,
      sheetInfo: sheetResult
    };
    
  } catch (error) {
    Logger.log('Error placing order: ' + error.toString());
    return {
      success: false,
      error: 'Failed to place order: ' + error.toString()
    };
  }
}

// ============================================
// SAVE ORDER TO SHEET WITH AUTO-ROTATION
// ============================================
function saveOrderToSheet(orderData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET_NAME);
    
    // Create Orders sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.ORDERS_SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Order ID', 'Table', 'Customer Name', 'Mobile', 'Email', 'Items', 'Total']);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
    }
    
    const lastRow = sheet.getLastRow();
    
    // Check if rotation needed (10,000 rows limit)
    if (lastRow >= CONFIG.MAX_ROWS_PER_SHEET) {
      const newSheetName = CONFIG.ORDERS_SHEET_NAME + '_' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyyMMdd_HHmmss');
      sheet = ss.insertSheet(newSheetName);
      sheet.appendRow(['Timestamp', 'Order ID', 'Table', 'Customer Name', 'Mobile', 'Email', 'Items', 'Total']);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
      
      Logger.log('🎉 NEW SHEET CREATED: ' + newSheetName);
      
      return {
        newSheetCreated: true,
        newSheetName: newSheetName,
        previousSheetRows: lastRow
      };
    }
    
    // Append order to sheet
    sheet.appendRow([
      orderData.timestamp,
      orderData.orderId,
      orderData.tableNumber,
      orderData.customerName,
      orderData.mobile,
      orderData.email,
      orderData.items,
      orderData.total
    ]);
    
    return {
      success: true,
      sheetName: sheet.getName(),
      rowNumber: sheet.getLastRow()
    };
    
  } catch (error) {
    Logger.log('Error saving to sheet: ' + error.toString());
    throw error;
  }
}

// ============================================
// VERIFY ORDER (For customer tracking)
// ============================================
function verifyOrder(data) {
  try {
    if (!data.mobile && !data.orderId) {
      return {
        success: false,
        error: 'Please provide either mobile number or order ID'
      };
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const matchedOrders = [];
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
    
    // Capture request criteria and normalize
    const reqMobile = data.mobile ? String(data.mobile).trim() : '';
    const reqOrderId = data.orderId ? String(data.orderId).trim() : '';
    const debug = data.debug === true || data.debug === 'true';

    // If debug requested, prepare a small preview of sheet rows to return
    const diagnostics = {
      reqMobile: reqMobile,
      reqOrderId: reqOrderId,
      sheetsChecked: []
    };

    // Search through all order sheets
    for (let sheet of sheets) {
      const sheetName = sheet.getName();
      if (!sheetName.startsWith(CONFIG.ORDERS_SHEET_NAME)) continue;

      const rows = sheet.getDataRange().getValues();
      // Capture a preview for diagnostics
      if (debug) {
        const preview = [];
        for (let i = 1; i < Math.min(rows.length, 11); i++) {
          const r = rows[i];
          preview.push({
            rowIndex: i + 1,
            timestampRaw: r[0],
            parsedTimestamp: parseTimestamp(r[0]),
            orderId: r[1],
            mobile: r[4],
            items: r[6]
          });
        }
        diagnostics.sheetsChecked.push({ sheetName: sheetName, preview: preview, totalRows: rows.length });
      }

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const orderTimestamp = parseTimestamp(row[0]);
        const orderMobile = row[4] ? String(row[4]).trim() : '';
        const orderIdInSheet = row[1] ? String(row[1]).trim() : '';

        // Check if order is within 24 hours
        if (orderTimestamp < cutoffTime) continue;

        // Match by mobile or order ID
        const mobileMatch = reqMobile && orderMobile === reqMobile;
        const idMatch = reqOrderId && orderIdInSheet === reqOrderId;

        if (mobileMatch || idMatch) {
          // Normalize items: try JSON parse, otherwise parse human-readable string
          const rawItems = row[6];
          const parsedItems = parseItemsFromSheet(rawItems);

          // Format timestamp for client (India time) and include ISO for reference
          const formattedTimestamp = Utilities.formatDate(orderTimestamp, 'Asia/Kolkata', 'dd/MM/yyyy, hh:mm:ss a');
          const isoTimestamp = orderTimestamp instanceof Date ? orderTimestamp.toISOString() : new Date(orderTimestamp).toISOString();

          const numericTotal = parseFloat(String(row[7]).replace(/[^0-9.-]+/g, '')) || 0;
          matchedOrders.push({
            orderId: row[1],
            timestamp: formattedTimestamp,
            timestampISO: isoTimestamp,
            tableNumber: row[2],
            customerName: row[3],
            mobile: row[4],
            email: row[5],
            items: parsedItems,
            total: numericTotal,
            totalFormatted: `₹${numericTotal.toFixed(2)}`,
            orderTime: orderTimestamp
          });
        }
      }
    }
    
    if (matchedOrders.length === 0) {
      if (debug) {
        return {
          success: false,
          error: 'No recent orders found. Orders are only available for 24 hours.',
          diagnostics: diagnostics
        };
      }

      return {
        success: false,
        error: 'No recent orders found. Orders are only available for 24 hours.'
      };
    }
    
    // Add status to orders
    const ordersWithStatus = matchedOrders.map(order => {
      const minutesElapsed = Math.floor((now - order.orderTime) / (1000 * 60));
      const preparationTime = 20;
      
      let status, statusText, estimatedTime;
      
      if (minutesElapsed < 5) {
        status = 'received';
        statusText = 'Order Received';
        estimatedTime = `${preparationTime - minutesElapsed} minutes`;
      } else if (minutesElapsed < 10) {
        status = 'preparing';
        statusText = 'Preparing Your Food';
        estimatedTime = `${preparationTime - minutesElapsed} minutes`;
      } else if (minutesElapsed < preparationTime) {
        status = 'cooking';
        statusText = 'Almost Ready';
        estimatedTime = `${preparationTime - minutesElapsed} minutes`;
      } else {
        status = 'ready';
        statusText = 'Ready to Serve';
        estimatedTime = 'Now';
      }
      
      return {
        ...order,
        orderStatus: status,
        statusText: statusText,
        estimatedTime: estimatedTime,
        minutesElapsed: minutesElapsed
      };
    });
    
    return {
      success: true,
      data: ordersWithStatus,
      count: ordersWithStatus.length
    };
    
  } catch (error) {
    Logger.log('Error verifying order: ' + error.toString());
    return {
      success: false,
      error: 'Failed to verify order: ' + error.toString()
    };
  }
}

// ============================================
// GET SHEET STATISTICS
// ============================================
function getSheetStats() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.ORDERS_SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        error: 'Orders sheet not found'
      };
    }
    
    const lastRow = sheet.getLastRow();
    const orderCount = lastRow > 1 ? lastRow - 1 : 0; // Exclude header
    
    return {
      success: true,
      data: {
        currentSheet: sheet.getName(),
        totalRows: lastRow,
        orderCount: orderCount,
        remainingCapacity: CONFIG.MAX_ROWS_PER_SHEET - lastRow,
        maxRowsPerSheet: CONFIG.MAX_ROWS_PER_SHEET
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ============================================
// HEALTH CHECK
// ============================================
function getHealthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    backend: 'Google Apps Script',
    dataStorage: 'Google Sheets',
    autoRotation: 'enabled',
    maxRowsPerSheet: CONFIG.MAX_ROWS_PER_SHEET
  };
}

// ============================================
// EMAIL FUNCTIONS
// ============================================
function sendCustomerEmail(orderDetails) {
  const subject = `Order Confirmation - ${orderDetails.orderId}`;
  
  const itemsList = orderDetails.items.map(item => 
    `<li><strong>${item.name}</strong> x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>`
  ).join('');
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">🍽️ ${CONFIG.RESTAURANT_NAME}</h1>
        <p style="margin: 10px 0 0 0;">Order Confirmation</p>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #ff6b35; margin-top: 0;">✅ Order Placed Successfully!</h2>
          <p>Thank you for your order, <strong>${orderDetails.customerName}</strong>!</p>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Table:</strong> ${orderDetails.tableNumber}</p>
          <p><strong>Time:</strong> ${orderDetails.timestamp}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">🍴 Your Items</h3>
          <ul style="list-style: none; padding: 0;">
            ${itemsList}
          </ul>
          <div style="border-top: 2px solid #ff6b35; padding-top: 15px; margin-top: 15px;">
            <strong style="font-size: 1.2em;">Total: ₹${orderDetails.total.toFixed(2)}</strong>
          </div>
        </div>
        
        <div style="background: #fff3e0; padding: 15px; border-radius: 10px;">
          <p style="margin: 0;">Your order is being prepared and will be served shortly!</p>
        </div>
      </div>
      
      <div style="background: #333; padding: 20px; text-align: center; color: white;">
        <p style="margin: 0;">Thank you for dining with us!</p>
        <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #999;">${CONFIG.RESTAURANT_TAGLINE}</p>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: orderDetails.email,
    subject: subject,
    htmlBody: htmlBody
  });
  
  Logger.log('✅ Customer email sent to: ' + orderDetails.email);
}

function sendOwnerEmail(orderDetails) {
  const subject = `🔔 New Order - Table ${orderDetails.tableNumber} - ${orderDetails.orderId}`;
  
  const itemsList = orderDetails.items.map(item => 
    `<li><strong style="font-size: 1.1em;">${item.name}</strong> x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>`
  ).join('');
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2c3e50, #34495e); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">🔔 New Order Received!</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #2e7d32; margin-top: 0;">Customer Information</h2>
          <p><strong>Name:</strong> ${orderDetails.customerName}</p>
          <p><strong>Mobile:</strong> ${orderDetails.mobile}</p>
          <p><strong>Email:</strong> ${orderDetails.email}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Table:</strong> <span style="font-size: 1.5em; color: #ff6b35;">${orderDetails.tableNumber}</span></p>
          <p><strong>Time:</strong> ${orderDetails.timestamp}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">🍴 Ordered Items</h3>
          <ul style="list-style: none; padding: 0;">
            ${itemsList}
          </ul>
          <div style="background: #e8f5e9; border-top: 3px solid #2e7d32; padding: 15px; margin-top: 15px; border-radius: 5px;">
            <strong style="font-size: 1.3em; color: #2e7d32;">TOTAL: ₹${orderDetails.total.toFixed(2)}</strong>
          </div>
        </div>
        
        <div style="background: #fff3e0; padding: 15px; border-radius: 10px;">
          <p style="margin: 0; color: #e65100;"><strong>⚡ Action Required: Prepare this order for Table ${orderDetails.tableNumber}</strong></p>
        </div>
      </div>
    </div>
  `;
  
  MailApp.sendEmail({
    to: CONFIG.OWNER_EMAIL,
    subject: subject,
    htmlBody: htmlBody
  });
  
  Logger.log('✅ Owner email sent to: ' + CONFIG.OWNER_EMAIL);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function parseItemsFromSheet(raw) {
  try {
    if (!raw) return [];
    // If already an array in stringified JSON
    if (typeof raw === 'string') {
      raw = raw.trim();
      // Try JSON
      try {
        const maybe = JSON.parse(raw);
        if (Array.isArray(maybe)) return maybe.map(i => ({ name: i.name || i, quantity: i.quantity || 1, price: i.price || 0 }));
      } catch (e) {
        // not JSON, continue
      }

      // Try to parse pattern like: "Pizza x2 (₹398), Coke x1 (₹50)"
      const parts = raw.split(',');
      const items = parts.map(p => {
        const m = p.trim().match(/^(.*?)x(\d+)\s*\(₹?([0-9.]+)\)/);
        if (m) {
          return { name: m[1].trim(), quantity: parseInt(m[2], 10), price: parseFloat(m[3]) };
        }
        // fallback: name only
        return { name: p.trim(), quantity: 1, price: 0 };
      });

      return items;
    }

    // If raw is array already
    if (Array.isArray(raw)) return raw;
    return [];
  } catch (error) {
    Logger.log('parseItemsFromSheet error: ' + error.toString());
    return [];
  }
}

// Queue email by writing to EmailQueue sheet; a time-driven trigger can call processEmailQueue
function queueEmail(emailPayload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const queueName = CONFIG.EMAIL_QUEUE_SHEET_NAME || 'EmailQueue';
    let sheet = ss.getSheetByName(queueName);

    // If sheet doesn't exist and auto-create is disabled, skip queueing and send immediately
    if (!sheet && !CONFIG.EMAIL_QUEUE_AUTO_CREATE) {
      Logger.log('Email queue sheet missing and auto-create disabled. Sending immediately.');
      try {
        if (emailPayload.notifyCustomer && emailPayload.email && emailPayload.email !== 'N/A' && CONFIG.CUSTOMER_EMAIL_ENABLED) {
          sendCustomerEmail(emailPayload);
        }
        if (emailPayload.notifyOwner && CONFIG.OWNER_EMAIL) {
          sendOwnerEmail(emailPayload);
        }
      } catch (sendErr) {
        Logger.log('Immediate email send failed: ' + sendErr.toString());
      }
      return;
    }

    // Create sheet if missing and auto-create is enabled
    if (!sheet) {
      sheet = ss.insertSheet(queueName);
      // Columns: Timestamp, OrderId, To, Type, Payload, Status, Attempts, LastError
      sheet.appendRow(['Timestamp', 'OrderId', 'To', 'Type', 'Payload', 'Status', 'Attempts', 'LastError']);
    }

    sheet.appendRow([new Date(), emailPayload.orderId, emailPayload.email || 'N/A', JSON.stringify({ notifyCustomer: emailPayload.notifyCustomer, notifyOwner: emailPayload.notifyOwner }), JSON.stringify(emailPayload), 'queued', 0, '']);
  } catch (e) {
    Logger.log('queueEmail error: ' + e.toString());
  }
}

// Process queued emails (call from a time-driven trigger)
function processEmailQueue() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const queueName = CONFIG.EMAIL_QUEUE_SHEET_NAME || 'EmailQueue';
    const sheet = ss.getSheetByName(queueName);
    if (!sheet) {
      Logger.log('processEmailQueue: no queue sheet named ' + queueName);
      return;
    }
    const data = sheet.getDataRange().getValues();
    // Process rows: columns index mapping
    // 0: Timestamp,1:OrderId,2:To,3:Type,4:Payload,5:Status,6:Attempts,7:LastError
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const status = row[5];
      let attempts = Number(row[6]) || 0;
      const lastError = row[7] || '';

      // Only process queued or retryable (attempts < 3)
      if (status === 'sent' || (status === 'failed' && attempts >= 3)) continue;

      try {
        const payload = JSON.parse(row[4]);
        // Attempt send
        if (payload.notifyCustomer && payload.email && payload.email !== 'N/A') {
          sendCustomerEmail(payload);
        }
        if (payload.notifyOwner && CONFIG.OWNER_EMAIL) {
          sendOwnerEmail(payload);
        }

        // Mark sent
        sheet.getRange(i+1, 6).setValue('sent');
        sheet.getRange(i+1, 7).setValue(attempts + 1);
        sheet.getRange(i+1, 8).setValue('');
      } catch (inner) {
        attempts = attempts + 1;
        const errMsg = inner && inner.toString ? inner.toString().substring(0, 200) : String(inner);
        Logger.log('Email send failed for row ' + (i+1) + ': ' + errMsg);
        if (attempts >= 3) {
          sheet.getRange(i+1, 6).setValue('failed');
          sheet.getRange(i+1, 7).setValue(attempts);
          sheet.getRange(i+1, 8).setValue(errMsg);
        } else {
          // keep as queued to retry later
          sheet.getRange(i+1, 6).setValue('queued');
          sheet.getRange(i+1, 7).setValue(attempts);
          sheet.getRange(i+1, 8).setValue(errMsg);
        }
      }
    }
  } catch (e) {
    Logger.log('processEmailQueue error: ' + e.toString());
  }
}

// Reset failed entries back to queued (useful to retry after fixing issue)
function retryFailedEmails() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const queueName = CONFIG.EMAIL_QUEUE_SHEET_NAME || 'EmailQueue';
    const sheet = ss.getSheetByName(queueName);
    if (!sheet) return { success: false, error: 'No ' + queueName + ' sheet' };
    const data = sheet.getDataRange().getValues();
    let resetCount = 0;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const status = row[5];
      if (status && String(status).toLowerCase().startsWith('failed')) {
        sheet.getRange(i+1, 6).setValue('queued');
        sheet.getRange(i+1, 7).setValue(0);
        sheet.getRange(i+1, 8).setValue('');
        resetCount++;
      }
    }
    return { success: true, reset: resetCount };
  } catch (e) {
    Logger.log('retryFailedEmails error: ' + e.toString());
    return { success: false, error: e.toString() };
  }
}
function jsonResponse(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseTimestamp(timestamp) {
  try {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    // Parse Indian format: "DD/MM/YYYY, HH:MM:SS AM/PM"
    const parts = timestamp.toString().split(', ');
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      const [day, month, year] = datePart.split('/');
      const dateStr = `${year}-${month}-${day} ${timePart}`;
      return new Date(dateStr);
    }
    return new Date(timestamp);
  } catch (error) {
    Logger.log('Error parsing timestamp: ' + error.toString());
    return new Date();
  }
}
