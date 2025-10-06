# Backend Server

## Setup

1. **Install dependencies:**
```powershell
npm install
```

2. **Configure environment:**
```powershell
copy .env.example .env
```

3. **Edit `.env` file:**
- Add your Google Sheets "menu1" URL in `MENU_SHEET_URL`
- Set your restaurant name and tagline

4. **Run the server:**

Development mode (with auto-reload):
```powershell
npm run dev
```

Production mode:
```powershell
npm start
```

Server will run on `http://localhost:5000`

## Google Sheets "menu1" Setup (Required)

The system loads menu from Google Sheets:

1. **Create a public Google Sheet** with your menu
2. **Rename the first sheet to "menu1"** (important!)
3. **Sheet structure:**
   - Column A: ID
   - Column B: Name
   - Column C: Description
   - Column D: Price
   - Column E: Category

4. **Make the sheet publicly viewable:**
   - Click "Share" button
   - Change to "Anyone with the link can view"
   - Copy the URL

5. **Update `.env`:**
   - Paste your sheet URL in `MENU_SHEET_URL`

## API Endpoints

- `GET /api/restaurant-info` - Get restaurant information
- `GET /api/menu` - Get menu items
- `POST /api/orders` - Place a new order
- `GET /api/orders` - Get all orders (for restaurant owner)
- `PATCH /api/orders/:orderId` - Update order status
- `GET /api/sheets/stats` - Get Google Sheets statistics (row counts, sheet info)
- `GET /api/health` - Health check

## Data Storage & Retention

### Local Storage
Orders are stored in `backend/data/orders.json` file for persistence.

### Google Sheets - Automatic Sheet Rotation
**All order data is kept permanently - no automatic deletion!**

- Orders are saved to Google Sheets via webhook
- When a sheet reaches **10,000 rows**, a new sheet is automatically created
- Sheet naming: `Orders_1`, `Orders_2`, `Orders_3`, etc.
- All previous sheets remain intact with their data
- See `GOOGLE_APPS_SCRIPT_SHEET_ROTATION.md` for setup instructions

## Editing Menu

To edit menu items, update your Google Sheet "menu1" with these columns:
- **Column A:** ID (e.g., item1, item2)
- **Column B:** Name (e.g., Paneer Tikka)
- **Column C:** Description (e.g., Grilled cottage cheese)
- **Column D:** Price (e.g., 250)
- **Column E:** Category (e.g., Starters, Main Course, Desserts)
- **Column F:** Image URL (optional - leave blank for automatic placeholder)

**Example:**
```
ID     | Name          | Description           | Price | Category    | Image URL
-------|---------------|-----------------------|-------|-------------|---------------------------
item1  | Paneer Tikka  | Grilled cottage cheese| 250   | Starters    | https://example.com/img.jpg
item2  | Gulab Jamun   | Sweet milk dumplings  | 120   | Desserts    |
```

See `MENU_IMAGES_GUIDE.md` for detailed image setup instructions.
