import { MOCK_EQUIPMENT_ASSETS } from '../src/data/mockCatalog';
import { MULTI_SOURCE_EQUIPMENT_DOSSIERS } from '../src/data/multiSourceEquipmentDossier';
import { MICROSCOPE_SPECIMENS } from '../src/data/microscopeSpecimenCatalog';
import fs from 'fs';

let libMap = new Map();
try {
  const libIndex = JSON.parse(fs.readFileSync('./public/libraries3DLab/library-index.json', 'utf-8'));
  for (const item of libIndex.libraries) {
    libMap.set(item.assetId, item);
  }
} catch (e) {
  console.warn('Cannot read library-index.json', e);
}

const detailedList = MOCK_EQUIPMENT_ASSETS.map((asset, index) => {
  const dossier = MULTI_SOURCE_EQUIPMENT_DOSSIERS[asset.assetId];
  const lib = libMap.get(asset.assetId);

  return {
    index: index + 1,
    assetId: asset.assetId,
    nameVi: asset.name?.vi,
    nameEn: asset.name?.en,
    category: asset.category,
    archetype: asset.geometry?.proceduralArchetype,
    dimensionsMm: asset.geometry?.dimensions,
    boundingBoxM: asset.geometry?.boundingBoxM,
    massKg: asset.physics?.massKg ?? null,
    scientificProperties: asset.scientificProperties || {},
    ports: asset.assembly?.ports || [],
    hasDossier: !!dossier,
    technicalStandard: dossier?.technicalStandard || 'N/A',
    exactDimensionsSpec: dossier?.exactDimensionsSpec || 'N/A',
    weightOrCapacitySpec: dossier?.weightOrCapacitySpec || 'N/A',
    synthesizedFeatures: dossier?.synthesizedFeatures || [],
    fiveWebSources: dossier?.fiveWebSources || [],
    hasHtmlModule: !!lib,
    htmlFolder: lib?.folderName || null,
    htmlFile: lib?.entryHtml || null
  };
});

fs.writeFileSync('./scripts/full_equipment_details.json', JSON.stringify(detailedList, null, 2), 'utf-8');
console.log(`Generated detailed report for all ${detailedList.length} equipment items.`);
