const { spawn } = require('child_process');
const path = require('path');

console.log('\n🚀 Starting Restaurant Menu System...\n');

// Start backend
const backend = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true
});

backend.stdout.on('data', (data) => {
    process.stdout.write(`[Backend] ${data}`);
});

backend.stderr.on('data', (data) => {
    process.stderr.write(`[Backend] ${data}`);
});

// Wait 2 seconds then start frontend
setTimeout(() => {
    const frontend = spawn('python', ['-m', 'http.server', '8080'], {
        cwd: path.join(__dirname, 'frontend'),
        shell: true
    });

    frontend.stdout.on('data', (data) => {
        process.stdout.write(`[Frontend] ${data}`);
    });

    frontend.stderr.on('data', (data) => {
        process.stderr.write(`[Frontend] ${data}`);
    });

    setTimeout(() => {
        console.log('\n✅ Servers Started!');
        console.log('🌐 Open: \x1b[36mhttp://localhost:8080\x1b[0m');
        console.log('\nPress Ctrl+C to stop\n');
    }, 2000);
}, 2000);

// Handle exit
process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping servers...');
    process.exit();
});
