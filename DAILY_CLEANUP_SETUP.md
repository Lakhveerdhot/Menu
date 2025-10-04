# 🧹 Daily Automatic Cleanup - Complete Setup

## ✅ What Has Been Implemented

Your restaurant ordering system now automatically clears orders **every night at 12:00 AM IST** to prevent storage overload.

### Features Added:
1. **Automatic Daily Cleanup** - Runs at midnight (12:00 AM IST)
2. **Backup System** - All orders backed up before deletion
3. **Google Sheets Integration** - Clears orders from Google Sheets
4. **Local Storage Cleanup** - Clears `orders.json` file
5. **Manual Cleanup API** - Test cleanup anytime via API endpoint

---

## 📋 Setup Instructions

### Step 1: Install Dependencies (If Not Already Done)

```bash
cd backend
npm install
```

The `node-cron` package is already added to `package.json`.

---

### Step 2: Configure Google Sheets Cleanup (Optional but Recommended)

#### A. Create Google Apps Script

1. Open your **Google Sheet** where orders are stored
2. Go to **Extensions → Apps Script**
3. Delete any existing code
4. Copy and paste the script from: `backend/GOOGLE_SHEETS_CLEANUP_SCRIPT.txt`
5. **Save** the script (Ctrl+S)

#### B. Deploy as Web App

1. Click **Deploy** button (top right)
2. Select **New deployment**
3. Click gear icon ⚙️ → Choose **Web app**
4. Configure:
   - **Description**: Order Cleanup Webhook
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize** the app when prompted
7. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC.../exec`)

#### C. Add to .env File

Open `backend/.env` and add:

```env
CLEAR_ORDERS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with your actual script URL.

---

### Step 3: Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
🕐 Daily cleanup scheduled for 12:00 AM IST
🚀 Backend server running on http://localhost:5000
🧹 Auto-cleanup: Orders will be cleared daily at midnight
```

---

## 🧪 Testing the Cleanup

### Option 1: Manual API Test

**Using PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/cleanup/manual" -Method POST
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/cleanup/manual
```

**Using Browser:**
Open: `http://localhost:5000/api/cleanup/manual`

### Option 2: Check Health Endpoint

```bash
curl http://localhost:5000/api/health
```

Should show:
```json
{
  "status": "ok",
  "autoCleanup": "enabled (daily at 12:00 AM IST)"
}
```

---

## 📁 What Gets Cleaned

### 1. **Google Sheets** (if webhook configured)
- All order rows deleted (header row kept)
- Happens via Google Apps Script webhook

### 2. **Local Storage** (`backend/data/orders.json`)
- File cleared (reset to empty array `[]`)
- Backup created before deletion

### 3. **In-Memory Orders**
- Server's orders array cleared
- Fresh start for new day

---

## 💾 Backup System

Before cleanup, orders are automatically backed up to:

```
backend/data/backups/orders_backup_YYYY-MM-DDTHH-MM-SS.json
```

**Example:**
```
backend/data/backups/orders_backup_2025-10-04T00-00-00.json
```

You can restore from these backups if needed.

---

## ⏰ Cleanup Schedule

**Current Schedule:** Every day at 12:00 AM IST

### To Change the Time:

Edit `backend/server.js` line 288:

```javascript
// Current: Midnight (12:00 AM)
cron.schedule('0 0 * * *', async () => {
    // cleanup code
});
```

**Examples:**
```javascript
'0 2 * * *'   // 2:00 AM daily
'0 */6 * * *' // Every 6 hours
'0 0 * * 0'   // Every Sunday at midnight
'30 23 * * *' // 11:30 PM daily
```

**Cron Format:**
```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-7, Sunday = 0 or 7)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

---

## 🔧 Configuration Files

### `.env` Variables

```env
# Required for orders storage
ORDERS_WEBHOOK_URL=your_orders_webhook_url

# Optional for automatic cleanup
CLEAR_ORDERS_WEBHOOK_URL=your_cleanup_webhook_url
```

If `CLEAR_ORDERS_WEBHOOK_URL` is not set:
- ✅ Local files still get cleaned
- ✅ In-memory orders still cleared
- ⚠️ Google Sheets won't be cleared automatically

---

## 🚀 Running 24/7 (Production)

For cleanup to work, the server must be running at midnight. Use **PM2** to keep it running:

### Install PM2
```bash
npm install -g pm2
```

### Start Server with PM2
```bash
cd backend
pm2 start server.js --name restaurant-backend
pm2 save
pm2 startup
```

### PM2 Commands
```bash
pm2 status              # Check status
pm2 logs restaurant-backend  # View logs
pm2 restart restaurant-backend  # Restart
pm2 stop restaurant-backend     # Stop
```

---

## 📊 Monitoring Cleanup

### Check Logs

When cleanup runs, you'll see:
```
========================================
🧹 DAILY CLEANUP STARTED
========================================
⏰ Time: 04/10/2025, 12:00:00 AM
✅ Google Sheets orders cleared successfully
📦 Orders backed up to: backend/data/backups/orders_backup_2025-10-04T00-00-00.json
✅ Local orders.json cleared successfully
✅ In-memory orders cleared
========================================
✅ DAILY CLEANUP COMPLETED
========================================
```

---

## ❓ Troubleshooting

### Cleanup Not Running?
- ✅ Check if backend server is running
- ✅ Look for "Daily cleanup scheduled" message on startup
- ✅ Verify timezone is Asia/Kolkata

### Google Sheets Not Clearing?
- ✅ Check if `CLEAR_ORDERS_WEBHOOK_URL` is set in `.env`
- ✅ Test webhook manually using curl/Postman
- ✅ Verify Google Apps Script is deployed correctly
- ✅ Check Apps Script execution logs

### Backups Not Created?
- ✅ Check if `backend/data/backups/` folder exists
- ✅ Verify write permissions
- ✅ Check server logs for errors

### Manual Cleanup Fails?
- ✅ Check if server is running
- ✅ Verify endpoint: `http://localhost:5000/api/cleanup/manual`
- ✅ Check server logs for error messages

---

## 📝 Files Created/Modified

### New Files:
- ✅ `backend/utils/cleanupService.js` - Cleanup logic
- ✅ `backend/AUTO_CLEANUP_GUIDE.md` - Detailed guide
- ✅ `backend/GOOGLE_SHEETS_CLEANUP_SCRIPT.txt` - Apps Script code
- ✅ `backend/.env.example` - Environment variables template
- ✅ `DAILY_CLEANUP_SETUP.md` - This file

### Modified Files:
- ✅ `backend/server.js` - Added cron scheduler and cleanup endpoint
- ✅ `backend/package.json` - Already has node-cron dependency

---

## 🎯 Summary

Aapka system ab **automatically har raat 12 baje** orders clear kar dega:

✅ **Google Sheets** - Clear (agar webhook set hai)  
✅ **Local File** - Clear (`orders.json`)  
✅ **Memory** - Clear (in-memory orders array)  
✅ **Backup** - Automatic backup before deletion  
✅ **Manual Control** - API endpoint se kabhi bhi test kar sakte ho  

**Important:** Server running hona chahiye midnight ko. Production ke liye PM2 use karo.

---

## 🔗 Quick Links

- **Manual Cleanup API**: `http://localhost:5000/api/cleanup/manual`
- **Health Check**: `http://localhost:5000/api/health`
- **Backups Location**: `backend/data/backups/`
- **Google Apps Script**: `backend/GOOGLE_SHEETS_CLEANUP_SCRIPT.txt`

---

**Setup Complete! 🎉**

Agar koi problem aaye ya kuch change karna ho, to documentation dekh lo ya mujhe batao.
