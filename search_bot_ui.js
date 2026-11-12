const fs = require('fs');
const js = fs.readFileSync('C:\\Users\\JWOS\\.gemini\\antigravity\\scratch\\birdiebash-clone\\_next\\static\\chunks\\3k463na_wafgi_v7.js', 'utf8');

let idx = js.indexOf('Bắt đầu trận đấu');
console.log('Bắt đầu trận đấu at:', idx);
if (idx !== -1) console.log(js.substring(idx - 600, idx + 200));
