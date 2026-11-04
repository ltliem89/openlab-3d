import fs from 'fs';
const res = JSON.parse(fs.readFileSync('scripts/archetype_mesh_analysis.json', 'utf8'));
for (const [k, v] of Object.entries(res)) {
  console.log(`${k.padEnd(28)}: nodes=[${(v as any).nodeNames.join(', ')}]`);
}
