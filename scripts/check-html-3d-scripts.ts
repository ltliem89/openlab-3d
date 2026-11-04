import fs from 'fs';
import path from 'path';

const BASE_DIR = path.resolve(process.cwd(), 'public/libraries3DLab');
const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folder = path.join(BASE_DIR, entry.name);
  const files = fs.readdirSync(folder).filter((f) => f.endsWith('.html'));
  for (const f of files) {
    const filePath = path.join(folder, f);
    const content = fs.readFileSync(filePath, 'utf-8');
    const has3DScript = content.includes('ol3d-module-3d-script') || content.includes('buildEquipmentGroup') || content.includes('buildEquipmentMesh');
    const hasManifest = content.includes('ol3d-module-manifest');
    
    // Check what buildEquipmentGroup creates
    let createsWhat = 'none';
    if (content.includes('buildEquipmentGroup')) {
      const m = content.match(/buildEquipmentGroup\s*[:=]\s*function[^{]*\{([\s\S]{1,300})/);
      createsWhat = m ? m[1].replace(/\n/g, ' ').slice(0, 100) : 'found';
    }
    console.log(`${entry.name.padEnd(50)} | 3dScript: ${has3DScript} | Manifest: ${hasManifest} | snippet: ${createsWhat}`);
  }
}
