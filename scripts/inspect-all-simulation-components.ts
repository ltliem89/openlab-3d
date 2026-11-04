import { MOCK_EQUIPMENT_ASSETS } from '../src/data/mockCatalog';
import { MULTI_SOURCE_EQUIPMENT_DOSSIERS } from '../src/data/multiSourceEquipmentDossier';
import { MICROSCOPE_SPECIMENS } from '../src/data/microscopeSpecimenCatalog';
import fs from 'fs';

console.log('Total mock catalog assets:', MOCK_EQUIPMENT_ASSETS.length);
console.log('Total dossiers:', Object.keys(MULTI_SOURCE_EQUIPMENT_DOSSIERS).length);
console.log('Total microscope specimens:', MICROSCOPE_SPECIMENS.length);

const dossierKeys = Object.keys(MULTI_SOURCE_EQUIPMENT_DOSSIERS);
console.log('Dossier keys:', dossierKeys);

const data = {
  catalogCount: MOCK_EQUIPMENT_ASSETS.length,
  catalog: MOCK_EQUIPMENT_ASSETS,
  dossiers: MULTI_SOURCE_EQUIPMENT_DOSSIERS,
  specimens: MICROSCOPE_SPECIMENS
};

fs.writeFileSync('./scripts/all_data_dump.json', JSON.stringify(data, null, 2), 'utf-8');
console.log('Dumped all data to scripts/all_data_dump.json');
