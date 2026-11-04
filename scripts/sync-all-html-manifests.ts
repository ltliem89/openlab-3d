import fs from 'fs';
import path from 'path';
import { CANONICAL_ARCHETYPE_MAP, resolveDefaultModuleControls } from '../src/three-runtime/HtmlEquipmentModuleRegistry';

const BASE_DIR = path.resolve(process.cwd(), 'public/libraries3DLab');
const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });

let updatedHtmlCount = 0;
let updatedManifestCount = 0;

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folder = path.join(BASE_DIR, entry.name);
  const assetId = Object.keys(CANONICAL_ARCHETYPE_MAP).find((id) => entry.name.startsWith(id));
  if (!assetId) continue;
  const canonicalArch = CANONICAL_ARCHETYPE_MAP[assetId];

  // 1. Update HTML file
  const htmlFiles = fs.readdirSync(folder).filter((f) => f.endsWith('.html'));
  for (const hf of htmlFiles) {
    const hPath = path.join(folder, hf);
    let hContent = fs.readFileSync(hPath, 'utf-8');
    const m = hContent.match(/<script\s+id=["']ol3d-module-manifest["'][^>]*>([\s\S]*?)<\/script>/i);
    if (m) {
      try {
        const json = JSON.parse(m[1]);
        json.asset = json.asset || {};
        json.asset.geometry = json.asset.geometry || {};
        json.asset.geometry.proceduralArchetype = canonicalArch;
        
        const capVal = json.asset.scientificProperties?.capacity?.value;
        json.moduleControls = resolveDefaultModuleControls(canonicalArch, capVal, json.moduleControls);

        const replacement = `<script id="ol3d-module-manifest" type="application/json">\n${JSON.stringify(json, null, 2)}\n  </script>`;
        hContent = hContent.replace(m[0], replacement);
        fs.writeFileSync(hPath, hContent, 'utf-8');
        updatedHtmlCount++;
      } catch (err) {
        console.error(`Error updating HTML manifest in ${hPath}:`, err);
      }
    }
  }

  // 2. Update manifest.json if exists
  const manifestPath = path.join(folder, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const mContent = fs.readFileSync(manifestPath, 'utf-8');
      const json = JSON.parse(mContent);
      json.asset = json.asset || {};
      json.asset.geometry = json.asset.geometry || {};
      json.asset.geometry.proceduralArchetype = canonicalArch;

      const capVal = json.asset.scientificProperties?.capacity?.value;
      json.moduleControls = resolveDefaultModuleControls(canonicalArch, capVal, json.moduleControls);

      fs.writeFileSync(manifestPath, JSON.stringify(json, null, 2), 'utf-8');
      updatedManifestCount++;
    } catch (err) {
      console.error(`Error updating manifest.json in ${manifestPath}:`, err);
    }
  }
}

console.log(`Synced ${updatedHtmlCount} HTML files and ${updatedManifestCount} manifest.json files.`);
