import fs from 'fs';

const proceduralSource = fs.readFileSync('src/three-runtime/ProceduralLabModels.ts', 'utf8');

// Find all exported functions or builders
const functionMatches = [...proceduralSource.matchAll(/export\s+function\s+([a-zA-Z0-9_]+)/g)];
console.log('ProceduralLabModels exported functions count:', functionMatches.length);
functionMatches.forEach(m => console.log(' - ' + m[1]));

// Check procedural archetypes map / switch cases
const switchCases = [...proceduralSource.matchAll(/case\s+['"]([^'"]+)['"]:/g)];
console.log('\nSwitch cases / Archetypes in ProceduralLabModels:');
const cases = [...new Set(switchCases.map(m => m[1]))];
cases.forEach(c => console.log(' * ' + c));
