import fs from 'fs';
import path from 'path';

const raw = fs.readFileSync('star-portal.json', 'utf8');
const data = JSON.parse(raw);

console.log('Assets:', data.assets ? Object.keys(data.assets) : 'none');

// Print file details
for (const file of data.files) {
  console.log(`File: ${file.path}, content length: ${file.content?.length || 0}, sha: ${file.sha256}`);
}
