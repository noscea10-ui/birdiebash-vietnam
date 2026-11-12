const fs = require('fs');
const content = fs.readFileSync('C:/Users/JWOS/.gemini/antigravity/scratch/birdiebash-clone/index.html', 'utf8');

console.log('index.html contains 3k463na_wafgi.js:');
let pos = 0;
while ((pos = content.indexOf('3k463na_wafgi.js', pos)) !== -1) {
  console.log(content.slice(pos - 30, pos + 40));
  pos += 16;
}

console.log('ServiceWorker check:');
let swPos = content.indexOf('serviceWorker');
console.log('serviceWorker at:', swPos);
if (swPos !== -1) {
  console.log(content.slice(swPos - 40, swPos + 100));
}
