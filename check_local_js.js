const fs = require('fs');
const content = fs.readFileSync('C:/Users/JWOS/.gemini/antigravity/scratch/birdiebash-clone/_next/static/chunks/3k463na_wafgi.js', 'utf8');

console.log('Local file contains Game Làm Cho Vợ:', content.includes('Game Làm Cho Vợ'));
console.log('Local file contains Đỡ nè con chó:', content.includes('Đỡ nè con chó'));
console.log('Local file contains Birdie:', content.includes('Birdie'));

let pos = content.indexOf('logo-a');
console.log('logo-a at:', pos);
if (pos !== -1) {
  console.log(content.slice(pos - 30, pos + 200));
}
