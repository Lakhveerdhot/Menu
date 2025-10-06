// This script injects the backend URL into config.js during Vercel deployment
const fs = require('fs');
const path = require('path');

const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:5000';

const configContent = `// API Configuration
// This file is automatically updated during deployment
window.BACKEND_URL = '${backendUrl}';
window.API_CONFIG = {
    BASE_URL: window.BACKEND_URL || 'http://localhost:5000'
};
`;

const configPath = path.join(__dirname, 'config.js');
fs.writeFileSync(configPath, configContent);

console.log(`✅ Backend URL injected: ${backendUrl}`);
