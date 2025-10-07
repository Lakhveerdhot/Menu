// API Configuration
// Automatically detects if running locally or in production
(function() {
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('192.168');
    
    window.API_BASE_URL = {
        BASE_URL: isLocal 
            ? 'http://localhost:5000'  // Local development
            : 'https://menu-backend-f0zz.onrender.com'  // Production
    };
    
    console.log('🔧 API Config:', window.API_BASE_URL.BASE_URL);
})();
