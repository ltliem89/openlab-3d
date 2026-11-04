import { MOCK_EQUIPMENT_ASSETS } from '../src/data/mockCatalog';
import { MULTI_SOURCE_EQUIPMENT_DOSSIERS } from '../src/data/multiSourceEquipmentDossier';

const missing = MOCK_EQUIPMENT_ASSETS.filter(a => !MULTI_SOURCE_EQUIPMENT_DOSSIERS[a.assetId]);
console.log('Missing dossiers count:', missing.length);
missing.forEach(m => {
  console.log(`- [${m.assetId}] ${m.name.vi} (${m.geometry.proceduralArchetype})`);
});
