import fs from 'fs';

const env = fs.readFileSync('src/three-runtime/LabEnvironmentEngine.ts', 'utf8');
const lines = env.split('\n');
console.log(lines.slice(1950, 2171).join('\n'));
