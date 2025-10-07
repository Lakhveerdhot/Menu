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

### 1. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 2. Configure Backend

```powershell
copy backend\.env.example backend\.env
```

Edit `backend/.env`:
```env
MENU_SHEET_URL=your_google_sheet_url_here
PORT=5000
RESTAURANT_NAME=My Restaurant
RESTAURANT_TAGLINE=Delicious Food, Great Service
```

### 3. Start Everything

From the root folder:
```powershell
npm start
```

This will automatically:
- ✅ Start backend server on `http://localhost:5000`
- ✅ Start frontend server on `http://localhost:8080`
- ✅ Open website in your browser

### 4. Test the System

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

**Complete deployment guides available:**

- **Quick Start:** See `DEPLOYMENT_GUIDE.md` for overview
- **Backend (Render):** See `DEPLOY_RENDER.md` for detailed steps
- **Frontend (Vercel):** See `DEPLOY_VERCEL.md` for detailed steps

**Quick Summary:**
1. Deploy backend to Render (free tier available)
2. Update `frontend/config.js` with backend URL
3. Deploy frontend to Vercel (free tier available)
4. Generate QR code with your frontend URL
5. Print and place on tables

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
- **Deployment Guides:** `DEPLOYMENT_GUIDE.md`, `DEPLOY_RENDER.md`, `DEPLOY_VERCEL.md`

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
