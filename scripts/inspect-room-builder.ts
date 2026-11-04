import fs from 'fs';

const env = fs.readFileSync('src/three-runtime/LabEnvironmentEngine.ts', 'utf8');
const lines = env.split('\n');
const idx = lines.findIndex(l => l.includes('buildStandardLabRoomV2'));
console.log('buildStandardLabRoomV2 starts at line ' + idx);

// Find what groups/meshes are added to roomGroup
const submeshes: string[] = [];
for (let i = idx; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('.name =') || line.includes('roomGroup.add') || line.includes('new THREE.Mesh') || line.includes('new THREE.Group')) {
    submeshes.push(`${i+1}: ${line.trim()}`);
  }
}

fs.writeFileSync('./scripts/room_mesh_elements.txt', submeshes.join('\n'), 'utf-8');
console.log(`Saved ${submeshes.length} structural elements to scripts/room_mesh_elements.txt`);
