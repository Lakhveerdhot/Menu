# Restaurant QR Menu Ordering System

A complete QR code-based restaurant menu ordering system with **optional** Google Sheets integration for easy menu management and order tracking.

## 🎯 Features

✅ **Customer Features:**
- Scan QR code to view menu
- Browse menu items by category
- Add items to cart with quantity control
- View live bill calculation
- Place orders with table number and optional contact details
- Responsive design for mobile devices

✅ **Owner Features:**
- **Google Sheets "menu1" integration** (just paste spreadsheet URL)
- Update menu by editing Google Sheets - changes appear instantly
- Track customer orders in JSON file
- No coding needed to update menu

## 📁 Project Structure

```
menu/
├── backend/              # Backend API server
│   ├── data/
│   │   └── orders.json  # Stored orders
│   ├── utils/
│   │   └── sheetsHelper.js  # Google Sheets integration
│   ├── server.js        # Main server file
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/            # Customer-facing website
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── README.md
│
└── README.md           # This file
```

## 🚀 Quick Start

### 1. Setup Backend

```powershell
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env`:
```env
MENU_SHEET_URL=your_google_sheet_url_here
PORT=5000
RESTAURANT_NAME=My Restaurant
RESTAURANT_TAGLINE=Delicious Food, Great Service
```

Start backend:
```powershell
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Setup Frontend

Open another terminal:

```powershell
cd frontend
```

Edit `frontend/script.js` line 2 to set backend URL (already set to `http://localhost:5000`)

Serve frontend using any method:
- **VS Code Live Server** extension
- **Python:** `python -m http.server 8080`
- **Node:** `npx http-server -p 8080`

Frontend runs on `http://localhost:8080` (or your chosen port)

### 3. Test the System

1. Open `http://localhost:8080` in browser
2. Browse menu items
3. Add items to cart
4. Place a test order
5. Check `backend/data/orders.json` for saved orders

## 📝 Configuration

### Google Sheets "menu1" Setup

**Super Simple - Just 4 Steps!**

#### Step 1: Create Menu Sheet Named "menu1"
1. Create a new Google Sheet
2. **Rename the first sheet to "menu1"** (click on "Sheet1" at bottom and rename)
3. Add headers in Row 1: **ID | Name | Description | Price | Category**
4. Add your menu items starting from Row 2

**Example:**
```
| ID | Name           | Description                    | Price | Category    |
|----|----------------|--------------------------------|-------|-------------|
| 1  | Butter Chicken | Creamy tomato-based curry      | 350   | Main Course |
| 2  | Paneer Tikka   | Grilled cottage cheese         | 250   | Starters    |
```

#### Step 2: Make Sheet Public
1. Click **"Share"** → **"Anyone with the link"** → **"Viewer"** → **"Copy link"**

#### Step 3: Update Backend
Edit `backend/.env`:
```env
MENU_SHEET_URL=paste_your_copied_url_here
```

#### Step 4: Restart Backend
```powershell
npm run dev
```

✅ **Done!** Edit your "menu1" sheet anytime - changes appear instantly on the website!

## 🎨 Customization

### Change Restaurant Name
Edit `backend/.env`:
```env
RESTAURANT_NAME=Your Restaurant Name
RESTAURANT_TAGLINE=Your Tagline Here
```

### Edit Menu Items
Simply edit your Google Sheets "menu1" - changes appear immediately when customers refresh the page!

### Change Colors
Edit `frontend/styles.css`:
```css
:root {
    --primary-color: #ff6b35;    /* Main color */
    --secondary-color: #f7931e;  /* Accent color */
    --success-color: #27ae60;    /* Success messages */
}
```

## 📱 Generate QR Code

1. Deploy your frontend to a public URL (see Deployment section below)
2. Go to [QR Code Generator](https://www.qr-code-generator.com/)
3. Enter your frontend URL
4. Download and print the QR code
5. Place on restaurant tables

## 📦 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Push code to GitHub
2. Connect to Railway/Render/Heroku
3. Set environment variables:
   - `USE_GOOGLE_SHEETS=false` (or true if using sheets)
   - `PORT=5000`
   - `RESTAURANT_NAME=Your Restaurant`
   - `MENU_SHEET_URL=...` (if using Google Sheets)
4. Deploy!

### Frontend Deployment (Netlify/Vercel)

1. Update `frontend/script.js` line 2 with your backend URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com';
   ```
2. Deploy frontend folder to Netlify/Vercel
3. Get your frontend URL
4. Generate QR code with this URL

## 🔧 Troubleshooting

**Menu not loading?**
- Check if backend is running (`http://localhost:5000/api/health`)
- Verify `API_BASE_URL` in frontend matches backend URL
- If using Google Sheets, ensure sheet is publicly viewable

**Orders not saving?**
- Check backend console for errors
- Verify `backend/data/orders.json` file is created
- Check file permissions

**Backend not starting?**
- Port 5000 already in use? Change PORT in `.env`
- Missing dependencies? Run `npm install` in backend folder
- Check `.env` file syntax

**Frontend can't connect to backend?**
- CORS error? Backend has CORS enabled by default
- Wrong URL? Check `API_BASE_URL` in `frontend/script.js`
- Backend not running? Start it with `npm run dev`

## 📚 Additional Resources

- **Backend README:** `backend/README.md`
- **Frontend README:** `frontend/README.md`
- **Google Sheets Setup:** `GOOGLE_SHEETS_MENU1_SETUP.md` (detailed guide for menu1 sheet)

## 💡 Tips

1. **Start Simple:** Use fallback menu first, add Google Sheets later
2. **Test Locally:** Test everything on localhost before deploying
3. **Mobile First:** Always test on mobile devices (your customers will use phones)
4. **Backup Orders:** Regularly backup `backend/data/orders.json`
5. **Monitor Orders:** Check orders file regularly or set up notifications

## 🎯 Next Steps

1. ✅ Setup backend and frontend locally
2. ✅ Test the ordering flow
3. ✅ Customize colors and restaurant name
4. ✅ Add your menu items
5. ✅ Deploy to production
6. ✅ Generate QR codes
7. ✅ Print and place QR codes on tables
8. ✅ Start receiving orders!

## 📄 License

ISC License - Free to use and modify
