const fs = require('fs');
const js = fs.readFileSync('C:\\Users\\JWOS\\.gemini\\antigravity\\scratch\\birdiebash-clone\\_next\\static\\chunks\\3k463na_wafgi_v7.js', 'utf8');

let idx = js.indexOf('score-board');
if (idx === -1) idx = js.indexOf('scoreboard');
if (idx === -1) idx = js.indexOf('.score[');
console.log('scoreboard at:', idx);
if (idx !== -1) console.log(js.substring(idx - 100, idx + 300));
