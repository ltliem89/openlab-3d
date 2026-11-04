import fs from 'fs';

const viewportSource = fs.readFileSync('src/three-runtime/LabViewport3D.tsx', 'utf8');

// Look for lights
const lights = [...viewportSource.matchAll(/new THREE\.(DirectionalLight|AmbientLight|PointLight|SpotLight|HemisphereLight)/g)];
console.log('Lights found:', lights.map(l => l[1]));

// Look for camera setups
const cameras = [...viewportSource.matchAll(/new THREE\.(PerspectiveCamera|OrthographicCamera)/g)];
console.log('Cameras found:', cameras.map(c => c[1]));

// Look for camera presets / view modes
const cameraPresets = [...viewportSource.matchAll(/(cameraPreset|viewMode|orbit|preset|CAMERA_PRESETS)/gi)];
console.log('Camera preset matches count:', cameraPresets.length);

// Look for audio references
const audioMatches = [...viewportSource.matchAll(/(audio|sound|play|soundEngine|LabSoundEngine)/gi)];
console.log('Audio matches count:', audioMatches.length);

// Search for interaction handlers (drag, drop, snap, raycast)
const raycastMatches = [...viewportSource.matchAll(/(raycaster|pointer|drag|snap|intersect)/gi)];
console.log('Interaction matches count:', raycastMatches.length);
