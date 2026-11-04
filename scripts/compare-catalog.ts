import { MOCK_EQUIPMENT_ASSETS } from '../src/data/mockCatalog';
import fs from 'fs';

const lib = JSON.parse(fs.readFileSync('./public/libraries3DLab/library-index.json', 'utf-8'));

console.log('=== CATALOG ASSETS (' + MOCK_EQUIPMENT_ASSETS.length + ') ===');
for (const a of MOCK_EQUIPMENT_ASSETS) {
  console.log(`${a.assetId.padEnd(20)} | archetype: ${(a.geometry.proceduralArchetype || '').padEnd(25)} | ${a.name.vi}`);
}

console.log('\n=== LIBRARY INDEX ASSETS (' + lib.libraries.length + ') ===');
for (const l of lib.libraries) {
  console.log(`${l.assetId.padEnd(20)} | folder: ${l.folderName.padEnd(45)} | ${l.nameVi}`);
}
