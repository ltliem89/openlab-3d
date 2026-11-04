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
    const m = content.match(/<script\s+id=["']ol3d-module-manifest["'][^>]*>([\s\S]*?)<\/script>/i);
    if (m) {
      try {
        const json = JSON.parse(m[1]);
        const asset = json.asset || {};
        const controls = json.moduleControls || {};
        console.log(`[${entry.name}]`);
        console.log(`   assetId: ${asset.assetId}`);
        console.log(`   nameVi: ${asset.name?.vi || asset.name}`);
        console.log(`   archetype: ${asset.geometry?.proceduralArchetype}`);
        console.log(`   controlKey: ${controls.stateKey} (${controls.label})`);
      } catch (err) {
        console.log(`[${entry.name}] JSON parse error:`, err);
      }
    }
  }
}
