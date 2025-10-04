# Frontend - Customer Menu Interface

## Setup

1. **Configure backend URL:**

Open `script.js` and update the API_BASE_URL:
```javascript
const API_BASE_URL = 'http://localhost:5000'; // Change to your backend URL
```

2. **Serve the frontend:**

You can use any static file server. Options:

### Option 1: Live Server (VS Code Extension)
- Install "Live Server" extension in VS Code
- Right-click on `index.html`
- Select "Open with Live Server"

### Option 2: Node.js HTTP Server
```powershell
npx http-server -p 8080 -c-1
```
Then open `http://localhost:8080`

## Customization

### Change Colors:
Edit `styles.css` and modify CSS variables:
```css
:root {
    --primary-color: #ff6b35;
    --secondary-color: #f7931e;
    --success-color: #27ae60;
}
```

### Change Backend URL:
Edit `script.js` line 2:
```javascript
const API_BASE_URL = 'http://your-backend-url.com';
```

## For Production

1. Update `API_BASE_URL` in `script.js` to your production backend URL
2. Deploy the frontend files to any static hosting:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any web server

## QR Code Generation

1. Deploy your frontend to a public URL
2. Generate QR code pointing to that URL
3. Print and place on restaurant tables
