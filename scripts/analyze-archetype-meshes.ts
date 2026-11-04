import fs from 'fs';

const code = fs.readFileSync('src/three-runtime/ProceduralLabModels.ts', 'utf8');

const archetypes = [
  'electronic-balance',
  'graduated-cylinder',
  'beaker-250',
  'overflow-can',
  'spring-dynamometer',
  'vernier-caliper',
  'calibration-weight',
  'solid-cylinder',
  'solid-sphere',
  'solid-block',
  'hollow-cylinder',
  'erlenmeyer-flask',
  'retort-stand',
  'optical-lens',
  'laser-source',
  'semicircular-slab',
  'optical-prism',
  'magnifying-glass',
  'galvanometer',
  'digital-multimeter',
  'induction-coil-led',
  'porcelain-dish',
  'separatory-funnel',
  'distillation-flask',
  'optical-microscope',
  'dna-double-helix',
  'thermometer',
  'water-dispenser',
  'optical-bench',
  'optical-lamp',
  'frosted-f-object',
  'optical-screen',
  'optical-power-supply',
  'optical-lens-box',
  'lever-balance-apparatus',
  'communicating-vessels-3way'
];

const results: Record<string, { nodeNames: string[], materials: string[], features: string[] }> = {};

for (const arch of archetypes) {
  const casePattern = new RegExp(`case\\s+['"]${arch}['"]:[\\s\\S]*?(?:break;|return\\s+group;)`, 'm');
  const match = code.match(casePattern);
  if (match) {
    const block = match[0];
    const nodeNames = [...block.matchAll(/\.name\s*=\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
    const materials = [...block.matchAll(/new\s+THREE\.(Mesh[A-Za-z0-9]+Material|LineBasicMaterial)/g)].map(m => m[1]);
    const features: string[] = [];
    if (block.includes('CanvasTexture')) features.push('CanvasTexture Dynamic Readout');
    if (block.includes('ExtrudeGeometry')) features.push('ExtrudeGeometry with Bevel');
    if (block.includes('TorusGeometry')) features.push('Torus Chamfered Edge Reflectors');
    if (block.includes('userData')) features.push('State Sync via userData');
    if (block.includes('liquid')) features.push('Dynamic Liquid Level & Meniscus');
    if (block.includes('ray') || block.includes('Ray')) features.push('Optical Ray Tracing & Refraction');
    if (block.includes('circuit') || block.includes('wire') || block.includes('terminal')) features.push('Electrical Terminal / Wiring');
    
    results[arch] = {
      nodeNames: [...new Set(nodeNames)],
      materials: [...new Set(materials)],
      features
    };
  } else {
    results[arch] = { nodeNames: [], materials: [], features: ['External / Helper Builder'] };
  }
}

fs.writeFileSync('./scripts/archetype_mesh_analysis.json', JSON.stringify(results, null, 2), 'utf-8');
console.log('Archetype mesh analysis saved!');
