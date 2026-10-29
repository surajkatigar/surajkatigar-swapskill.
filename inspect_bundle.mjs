import fs from 'fs';

const raw = fs.readFileSync('star-portal.json', 'utf8');
const data = JSON.parse(raw);

console.log('Top level keys:', Object.keys(data));

if (Array.isArray(data)) {
  console.log('Is Array of length:', data.length);
  console.log('First item keys:', Object.keys(data[0]));
  data.forEach((item, i) => {
    console.log(`[${i}]`, item.path || item.name || Object.keys(item));
  });
} else if (data.files) {
  if (Array.isArray(data.files)) {
    console.log('data.files length:', data.files.length);
    data.files.forEach((f, i) => {
      console.log(`[${i}]`, f.path || f.name);
    });
  } else {
    console.log('data.files keys:', Object.keys(data.files));
  }
} else {
  for (const k of Object.keys(data)) {
    console.log(k, typeof data[k], Array.isArray(data[k]) ? `Array(${data[k].length})` : '');
  }
}
