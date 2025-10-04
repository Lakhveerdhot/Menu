# Quick Start Guide

## Get Running in 5 Minutes! ⚡

### Step 1: Setup Backend (2 minutes)

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Start the server
npm run dev
```

✅ Backend running on `http://localhost:5000`

### Step 2: Setup Frontend (2 minutes)

Open a **new terminal**:

```powershell
# Navigate to frontend folder
cd frontend

# Serve the frontend (choose one method)

# Option A: Using Python
python -m http.server 8080

# Option B: Using Node
npx http-server -p 8080

# Option C: Use VS Code Live Server extension
# Right-click index.html > "Open with Live Server"
```

✅ Frontend running on `http://localhost:8080`

### Step 3: Test It! (1 minute)

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
