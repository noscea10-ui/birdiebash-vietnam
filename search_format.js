const fs = require('fs');
const js = fs.readFileSync('C:\\Users\\JWOS\\.gemini\\antigravity\\scratch\\birdiebash-clone\\_next\\static\\chunks\\3k463na_wafgi_v7.js', 'utf8');

function findOccurrences(term) {
  let idx = 0;
  console.log('=== ' + term + ' ===');
  let count = 0;
  while ((idx = js.indexOf(term, idx)) !== -1 && count < 20) {
    console.log(idx, ':', js.substring(Math.max(0, idx - 40), Math.min(js.length, idx + 100)));
    idx += term.length;
    count++;
  }
}

findOccurrences('"doubles"');
findOccurrences('"singles"');
findOccurrences('format:');
