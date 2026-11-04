import fs from 'fs';

const envSource = fs.readFileSync('src/three-runtime/LabEnvironmentEngine.ts', 'utf8');

const functions = [...envSource.matchAll(/export\s+(?:function|const|class|type|interface)\s+([a-zA-Z0-9_]+)/g)];
console.log('LabEnvironmentEngine exports count:', functions.length);
functions.forEach(f => console.log(' - ' + f[1]));

// Look for room types or presets
const presets = [...envSource.matchAll(/([a-zA-Z0-9_]+Lab|[a-zA-Z0-9_]+Preset|create[a-zA-Z0-9_]+)/g)];
console.log('\nKeywords / Presets found:');
const uniqueKeywords = [...new Set(presets.map(p => p[1]))];
uniqueKeywords.slice(0, 30).forEach(k => console.log(' * ' + k));
