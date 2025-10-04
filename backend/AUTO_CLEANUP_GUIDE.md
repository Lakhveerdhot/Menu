# 🧹 Automatic Daily Cleanup Guide

## Overview
Orders stored in Google Sheets and local storage are automatically cleared every day at **12:00 AM IST (midnight)** to prevent storage overload.

## How It Works

### 1. **Scheduled Cleanup**
- Uses `node-cron` to schedule daily cleanup at midnight
- Timezone: Asia/Kolkata (IST)
- Runs automatically when backend server is running

### 2. **What Gets Cleaned**
- ✅ Google Sheets orders (if webhook configured)
- ✅ Local `orders.json` file
- ✅ In-memory orders array

### 3. **Backup System**
Before clearing, all orders are backed up to:
```
backend/data/backups/orders_backup_YYYY-MM-DDTHH-MM-SS.json
```

## Configuration

### Google Sheets Cleanup (Optional)
To enable Google Sheets cleanup, add this to your `.env` file:

```env
CLEAR_ORDERS_WEBHOOK_URL=your_google_apps_script_webhook_url
```

**How to create the webhook:**
1. Open your Google Sheet
2. Go to Extensions → Apps Script
3. Create a new script with this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('orders');
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Orders sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Keep header row, delete all data rows
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Orders cleared successfully',
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Deploy as Web App:
   - Click Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Copy the Web App URL and add it to `.env` as `CLEAR_ORDERS_WEBHOOK_URL`

## Manual Cleanup

If you want to manually trigger cleanup without waiting for midnight:

### Using API Endpoint
```bash
curl -X POST http://localhost:5000/api/cleanup/manual
```

### Using Browser
Navigate to: `http://localhost:5000/api/cleanup/manual`

## Testing

To test if the scheduler is working:

1. Check server logs when starting:
   ```
   🕐 Daily cleanup scheduled for 12:00 AM IST
   ```

2. Wait for midnight or use manual cleanup endpoint

3. Check backup folder:
   ```
   backend/data/backups/
   ```

## Customizing Cleanup Time

To change the cleanup time, edit `backend/server.js`:

```javascript
// Current: Midnight (12:00 AM)
cron.schedule('0 0 * * *', async () => {
    // cleanup code
});

// Examples:
// '0 2 * * *'  - 2:00 AM daily
// '0 */6 * * *' - Every 6 hours
// '0 0 * * 0'  - Every Sunday at midnight
```

## Cron Schedule Format
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, 0 and 7 are Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

## Troubleshooting

### Cleanup not running?
- ✅ Make sure backend server is running
- ✅ Check server logs for scheduler confirmation
- ✅ Verify timezone is correct (Asia/Kolkata)

### Google Sheets not clearing?
- ✅ Check if `CLEAR_ORDERS_WEBHOOK_URL` is set in `.env`
- ✅ Verify webhook URL is correct
- ✅ Test webhook manually using curl or Postman

### Backups not created?
- ✅ Check if `backend/data/backups/` folder exists
- ✅ Verify write permissions on the folder

## Important Notes

⚠️ **Server Must Be Running**: The cleanup only works when the backend server is running. If the server is stopped at midnight, cleanup won't happen.

💡 **Tip**: Use a process manager like PM2 to keep your server running 24/7:
```bash
npm install -g pm2
pm2 start backend/server.js --name restaurant-backend
pm2 save
pm2 startup
```

🔒 **Backups**: Old orders are always backed up before deletion. You can restore them if needed.
