const http = require('http');
const fs = require('fs');
const path = require('path');

const SAVE_DIR = path.resolve(process.env.USERPROFILE, '.gemini/antigravity/brain/3dc5990b-b632-49e3-8514-1c23f148451a/fps_audit_screenshots');
if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url.startsWith('/save')) {
    const urlObj = new URL(req.url, 'http://localhost:3001');
    const filename = urlObj.searchParams.get('filename') || 'screenshot_' + Date.now() + '.png';
    const filePath = path.join(SAVE_DIR, filename);

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const base64Data = body.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(filePath, base64Data, 'base64');
      console.log('Saved screenshot:', filename, '(' + fs.statSync(filePath).size + ' bytes)');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, filename, path: filePath }));
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3001, () => {
  console.log('Screenshot receiver running at http://localhost:3001');
});
