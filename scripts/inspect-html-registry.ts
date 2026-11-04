import fs from 'fs';

const htmlSource = fs.readFileSync('src/three-runtime/HtmlEquipmentModuleRegistry.ts', 'utf8');

const functions = [...htmlSource.matchAll(/export\s+(?:type|interface|class|const|function)\s+([a-zA-Z0-9_]+)/g)];
console.log('HtmlEquipmentModuleRegistry exports:');
functions.forEach(f => console.log(' - ' + f[1]));

// Check built-in modules
const builtins = [...htmlSource.matchAll(/BUILTIN_[a-zA-Z0-9_]+/g)];
console.log('Builtin modules matched:', [...new Set(builtins.map(b => b[0]))]);
