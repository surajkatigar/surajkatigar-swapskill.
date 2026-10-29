import fs from 'fs';

const raw = fs.readFileSync('star-portal.json', 'utf8');
const data = JSON.parse(raw);

console.log('Sample file item keys:', Object.keys(data.files[0]));
console.log('Sample file item:', data.files[0]);
