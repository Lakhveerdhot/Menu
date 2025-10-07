const { spawn } = require('child_process');
const path = require('path');

console.log('\n🚀 Starting Restaurant Menu System...\n');

// Start backend server
console.log('📦 Starting Backend Server...');
const backend = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true,
    stdio: 'inherit'
});

backend.on('error', (error) => {
    console.error('❌ Backend Error:', error);
});

// Wait 3 seconds then start frontend
setTimeout(() => {
    console.log('🌐 Starting Frontend Server...\n');
    const frontend = spawn('npx', ['http-server', '-p', '8080', '-c-1', '-o'], {
        cwd: path.join(__dirname, 'frontend'),
        shell: true,
        stdio: 'inherit'
    });

    frontend.on('error', (error) => {
        console.error('❌ Frontend Error:', error);
    });

    setTimeout(() => {
        console.log('\n✅ Servers Started Successfully!\n');
        console.log('📍 Backend:  http://localhost:5000');
        console.log('📍 Frontend: http://localhost:8080');
        console.log('📍 Track Orders: http://localhost:8080/view-order.html\n');
        console.log('Press Ctrl+C to stop servers\n');
    }, 2000);
}, 3000);

// Handle exit gracefully
process.on('SIGINT', () => {
    console.log('\n👋 Stopping servers...');
    backend.kill();
    process.exit();
});

process.on('SIGTERM', () => {
    backend.kill();
    process.exit();
});
