import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const raw = fs.readFileSync('star-portal.json', 'utf8');
const data = JSON.parse(raw);

const targetBase = path.join(process.cwd(), 'client');

for (const file of data.files) {
  const filePath = path.join(targetBase, file.path);
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, file.code, 'utf8');

  // Verify sha256
  const hash = crypto.createHash('sha256').update(file.code, 'utf8').digest('hex');
  const match = hash === file.sha256;
  console.log(`Extracted: ${file.path} | Match: ${match} (${hash.slice(0, 10)}...)`);
}
