#!/usr/bin/env node
/**
 * NexusAI Project
 * Enterprise Software Development Agency
 * 
 * This is the main landing page that showcases enterprise solutions
 * and provides access to the client portal dashboard.
 * 
 * Key Files:
 * - index.html (public/) - Main website & landing page
 * - dashboard.html (public/) - Client portal for logged-in users
 * - analytics/ - Backend API endpoints
 * 
 * To run: npm run dev
 * Visit: http://localhost:8000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Simple routing
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  // Try to serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Default to index.html for SPA routes
      filePath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(filePath, (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        }
      });
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      };

      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(data);
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 NexusAI Server running at http://localhost:${PORT}`);
  console.log(`📈 Website: http://localhost:${PORT}`);
  console.log(`🔐 Dashboard: http://localhost:${PORT}/dashboard.html`);
  console.log(`\nDemo credentials: user=demo, password=demo123`);
});
