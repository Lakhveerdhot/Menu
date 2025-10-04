# Quick Start Guide

## Get Running in 5 Minutes! ⚡

### Step 1: Install Dependencies (2 minutes)

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Go back to root
cd ..
```

### Step 2: Configure Backend (1 minute)

```powershell
# Create environment file
copy backend\.env.example backend\.env
```

Edit `backend/.env` and add your Google Sheets URL.

### Step 3: Start Everything (1 minute)

From the root folder:

```powershell
npm start
```

✅ Both servers start automatically!
✅ Website opens in your browser at `http://localhost:8080`

### Step 4: Test It! (1 minute)

1. Open browser: `http://localhost:8080`
2. You should see the restaurant menu
3. Add items to cart
4. Place a test order
5. Check `backend/data/orders.json` - your order is there!

---

## What's Next?

### Setup Your Google Sheet "menu1" (Required)

1. Create a Google Sheet and rename first sheet to **"menu1"**
2. Add headers: ID | Name | Description | Price | Category
3. Add your menu items starting from Row 2
4. Make sheet public (Share → Anyone with link → Viewer)
5. Copy the sheet URL
6. Edit `backend/.env`:
   ```env
   MENU_SHEET_URL=paste_your_url_here
   ```
7. Restart backend - your menu now loads from "menu1" sheet!

### Customize Your Restaurant

Edit `backend/.env`:
```env
RESTAURANT_NAME=Your Restaurant Name
RESTAURANT_TAGLINE=Your Amazing Tagline
```

Restart backend to see changes.

### Change Colors

Edit `frontend/styles.css`:
```css
:root {
    --primary-color: #ff6b35;
    --secondary-color: #f7931e;
}
```

---

## Common Issues

**Port already in use?**
- Backend: Change `PORT=5000` to `PORT=5001` in `backend/.env`
- Frontend: Use a different port like `8081`

**Can't connect to backend?**
- Make sure backend is running on port 5000
- Check `frontend/script.js` line 2 has correct URL

**Menu not showing?**
- Check browser console for errors (F12)
- Verify backend is running: visit `http://localhost:5000/api/health`

---

## Ready for Production?

See `README.md` for deployment instructions!

**Questions?** Check the detailed guides:
- `README.md` - Complete documentation
- `backend/README.md` - Backend details
- `frontend/README.md` - Frontend details
- `GOOGLE_SHEETS_SETUP.md` - Google Sheets integration
