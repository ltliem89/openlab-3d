import { ASSEMBLY_CONNECTOR_REGISTRY } from '../src/three-runtime/AssemblySystem';
import fs from 'fs';

console.log('Connector registry count:', Object.keys(ASSEMBLY_CONNECTOR_REGISTRY).length);
console.log('Connectors:');
for (const [id, spec] of Object.entries(ASSEMBLY_CONNECTOR_REGISTRY)) {
  console.log(`- ${id} (${spec.kind}): role=${spec.role}, allowedKinds=[${spec.allowedCompatibleKinds.join(', ')}]`);
}
