import fs from 'fs';

const htmlPath = 'public/libraries3DLab/OL3D-EQP-SLB-0001_semicircular-glass-slab-protractor/semicircular-glass-slab-protractor.html';
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('File size:', html.length, 'bytes');

const manifestMatch = html.match(/<script id="ol3d-module-manifest" type="application\/json">([\s\S]*?)<\/script>/i);
if (manifestMatch) {
  const json = JSON.parse(manifestMatch[1]);
  console.log('✓ Manifest assetId:', json.asset.assetId);
  console.log('✓ Controls stateKey:', json.moduleControls.stateKey);
  console.log('✓ Presets count:', json.moduleControls.presets.length);
  json.moduleControls.presets.forEach(p => console.log('  -', p.label, JSON.stringify(p.statePatch)));
} else {
  console.error('✗ Manifest NOT found!');
}

const iconMatch = html.match(/<template id="ol3d-module-icon">([\s\S]*?)<\/template>/i);
console.log('✓ Icon template:', iconMatch ? 'Found (' + iconMatch[1].length + ' chars)' : 'NOT found');

const photoMatch = html.match(/<template id="ol3d-module-real-photo">([\s\S]*?)<\/template>/i);
console.log('✓ Photo template:', photoMatch ? 'Found (' + photoMatch[1].length + ' chars)' : 'NOT found');

const scriptMatch = html.match(/<script id="ol3d-module-3d-script">([\s\S]*?)<\/script>/i);
console.log('✓ 3D script:', scriptMatch ? 'Found (' + scriptMatch[1].length + ' chars)' : 'NOT found');
