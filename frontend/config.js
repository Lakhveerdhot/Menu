// API Configuration
// Automatically detects if running locally or in production
window.API_BASE_URL = {
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'  // Local development
        : 'https://menu-backend-f0zz.onrender.com'  // Production
};
