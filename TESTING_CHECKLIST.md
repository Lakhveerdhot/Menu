# Testing Checklist

## Test 1: Start Server with Node (Not Nodemon)

```powershell
cd e:\EDUBOSS\menu\backend
node server.js
```

**Expected Output:**
```
🚀 Server running on http://localhost:5002
```

---

## Test 2: Place Test Order

1. Open browser: `http://localhost:8080` (or your frontend URL)
2. Add items to cart
3. Fill form:
   - Name: Test Customer
   - Mobile: 9999999999
   - Email: YOUR_EMAIL@gmail.com (use your actual email)
   - Table: 5
4. Click "Place Order"

---

## Test 3: Check Backend Logs

**Look for these logs in terminal:**

✅ **Success:**
```
✅ Email sent successfully
✅ Order confirmation email sent to customer: customer@email.com
✅ Order notification email sent to owner: owner@email.com
```

❌ **Failure:**
```
⚠️ Email failed (non-critical): <error message>
⚠️ Email not configured - skipping email notification
```

---

## Test 4: Check Email Inbox

1. Check customer email inbox
2. Check owner email inbox (lakhveer.eduboss@gmail.com)
3. Check spam folder if not in inbox

---

## Common Issues:

### Issue 1: "Email not configured" message
**Fix:** Environment variables not loaded
```powershell
# Check if .env exists
Test-Path backend\.env

# Test env loading
node backend/test-env-loading.js
```

### Issue 2: "Invalid login" error
**Fix:** Wrong Gmail App Password
- Create new App Password: https://myaccount.google.com/apppasswords
- Update EMAIL_PASSWORD in .env

### Issue 3: Email sends with nodemon but not with node
**Fix:** Usually same - just restart terminal and try again

---

## Production Deployment (Render):

**Environment Variables to set in Render Dashboard:**
```
PORT=5002
RESTAURANT_NAME=My Restaurant
RESTAURANT_TAGLINE=Delicious Food, Great Service
MENU_SHEET_URL=<your-google-sheet-url>
ORDERS_WEBHOOK_URL=<your-apps-script-url>
EMAIL_USER=lakhveer.eduboss@gmail.com
EMAIL_PASSWORD=<your-16-char-app-password>
OWNER_EMAIL=lakhveer.eduboss@gmail.com
```

**Start Command in Render:**
```
npm start
```
(This runs `node server.js` automatically)
