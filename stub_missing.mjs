import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('client/src/shaders/neuform-isolated/NeuformIsolatedEffects.tsx', 'utf8');
const matches = [...content.matchAll(/from "\.\/sources\/(.*?)\?raw"/g)].map((m) => m[1]);
console.log('Imported html files:', matches.length);

const sourcesDir = path.join('client/src/shaders/neuform-isolated/sources');
let missingCount = 0;
for (const file of matches) {
  const filePath = path.join(sourcesDir, file);
  if (!fs.existsSync(filePath)) {
    missingCount++;
    fs.writeFileSync(filePath, '<!DOCTYPE html><html><head></head><body></body></html>', 'utf8');
  }
}
console.log('Stubbed missing html files:', missingCount);
