const fs = require('fs');
const js = fs.readFileSync('C:\\Users\\JWOS\\.gemini\\antigravity\\scratch\\birdiebash-clone\\_next\\static\\chunks\\3k463na_wafgi_v7.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('hud.names', idx)) !== -1) {
  console.log('hud.names at', idx, ':', js.substring(idx - 40, idx + 100));
  idx += 9;
}
