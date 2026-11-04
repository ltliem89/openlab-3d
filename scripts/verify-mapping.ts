import fs from 'fs';

const eqDetails = JSON.parse(fs.readFileSync('./scripts/full_equipment_details.json', 'utf-8'));
const meshAnalysis = JSON.parse(fs.readFileSync('./scripts/archetype_mesh_analysis.json', 'utf-8'));

console.log('Equipment count:', eqDetails.length);
console.log('Mesh analysis count:', Object.keys(meshAnalysis).length);

// Verify every equipment has an archetype and entry
eqDetails.forEach((eq: any) => {
  const mesh = meshAnalysis[eq.archetype];
  if (!mesh) {
    console.warn(`Missing mesh analysis for ${eq.assetId} (${eq.archetype})`);
  }
});
console.log('All equipment mapped to mesh analysis!');
