const { spawn } = require('child_process');
const path = require('path');

console.log('\n🚀 Starting Restaurant Menu System...\n');

// Start backend server
console.log('📦 Starting Backend Server...');
const backend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true,
    stdio: 'inherit'
});

backend.on('error', (error) => {
    console.error('❌ Backend Error:', error);
});

// Wait 3 seconds then start frontend
setTimeout(() => {
    console.log('\n🌐 Starting Frontend Server...');
    const frontend = spawn('npx', ['http-server', '-p', '8080', '-c-1'], {
        cwd: path.join(__dirname, 'frontend'),
        shell: true,
        stdio: 'inherit'
    });

    frontend.on('error', (error) => {
        console.error('❌ Frontend Error:', error);
    });

    setTimeout(() => {
        console.log('\n✅ Servers Started Successfully!');
        console.log('🌐 Frontend: \x1b[36mhttp://localhost:8080\x1b[0m');
        console.log('🔧 Backend:  \x1b[36mhttp://localhost:5000\x1b[0m');
        console.log('\n💡 Press Ctrl+C to stop all servers\n');
    }, 3000);
}, 3000);

// Handle exit gracefully
process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping all servers...');
    backend.kill();
    process.exit();
});

process.on('SIGTERM', () => {
    backend.kill();
    process.exit();
});
