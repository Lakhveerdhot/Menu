// Configuration file for frontend
// Change the API_BASE_URL to match your backend server URL

const CONFIG = {
    // For local development
    API_BASE_URL: 'http://localhost:5000',
    
    // For production, change to your deployed backend URL
    // API_BASE_URL: 'https://your-backend-url.com',
};

// Export for use in script.js
window.CONFIG = CONFIG;
