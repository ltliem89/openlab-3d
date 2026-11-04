import fs from 'fs';

const assemblySource = fs.readFileSync('src/three-runtime/AssemblySystem.ts', 'utf8');
const soundSource = fs.readFileSync('src/three-runtime/LabSoundEngine.ts', 'utf8');

console.log('=== ASSEMBLY SYSTEM ===');
const assemblyTypes = [...assemblySource.matchAll(/export\s+(?:type|interface|class|const|function)\s+([a-zA-Z0-9_]+)/g)];
assemblyTypes.forEach(t => console.log(' - ' + t[1]));

console.log('\n=== SOUND ENGINE ===');
const soundTypes = [...soundSource.matchAll(/export\s+(?:type|interface|class|const|function)\s+([a-zA-Z0-9_]+)/g)];
soundTypes.forEach(t => console.log(' - ' + t[1]));

// Look for sound events in LabSoundEngine
const soundEvents = [...soundSource.matchAll(/case\s+['"]([^'"]+)['"]:/g)];
console.log('\nSound events:', [...new Set(soundEvents.map(e => e[1]))]);
