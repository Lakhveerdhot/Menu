const { spawn } = require('child_process');
const path = require('path');

// Start backend server
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
    const frontend = spawn('npx', ['http-server', '-p', '8080', '-c-1'], {
        cwd: path.join(__dirname, 'frontend'),
        shell: true,
        stdio: 'inherit'
    });

    frontend.on('error', (error) => {
        console.error('❌ Frontend Error:', error);
    });
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
