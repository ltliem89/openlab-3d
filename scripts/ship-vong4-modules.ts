/**
 * Vòng 4 (C-18/C-19) — Ship module HTML PHM + STR từ hằng SAMPLE_* trong
 * HtmlEquipmentModuleRegistry.ts ra public/libraries3DLab để app nạp được
 * lúc chạy (restoreFromLocalDiskLibrary fetch library-index.json rồi fetch
 * từng file .html). Chạy: npx tsx scripts/ship-vong4-modules.ts
 * (chạy lại được — ghi đè các file đã ship).
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SAMPLE_MAGNETIC_STIRRER_HTML_MODULE,
  SAMPLE_PH_METER_HTML_MODULE,
} from '../src/three-runtime/HtmlEquipmentModuleRegistry';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB = path.join(ROOT, 'public', 'libraries3DLab');

function extractManifest(html: string): any {
  const m = html.match(
    /<script id="ol3d-module-manifest" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!m) throw new Error('Không tìm thấy khối manifest JSON trong module HTML');
  return JSON.parse(m[1]);
}

function ship(opts: {
  html: string;
  folderName: string;
  htmlFileName: string;
  moduleId: string;
  slug: string;
  nameVi: string;
  nameEn: string;
  category: string;
  sentence: string;
  paragraph: string;
}) {
  const dir = path.join(LIB, opts.folderName);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, opts.htmlFileName), opts.html, 'utf8');

  const manifest = extractManifest(opts.html);
  const asset = manifest.asset;
  const controls = manifest.moduleControls;
  if (typeof controls?.defaultValue !== 'number') {
    throw new Error(`${opts.moduleId}: moduleControls.defaultValue thiếu`);
  }
  // Quy tắc Vòng 4: mặc định phải là "chưa đo/chưa làm gì" (0), không được là giá trị đo.
  if (controls.defaultValue !== 0) {
    throw new Error(
      `${opts.moduleId}: defaultValue = ${controls.defaultValue}, phải là 0 trước khi ship`,
    );
  }
  const manifestJson = {
    schemaVersion: '1.0',
    moduleSpecVersion: 'OL3D-HTML-MODULE-v2.4',
    moduleId: opts.moduleId,
    slug: opts.slug,
    name: opts.nameVi,
    category: opts.category,
    version: '1.0.0',
    asset: {
      assetId: asset.assetId,
      slug: asset.slug,
      name: asset.name,
      category: asset.category,
      geometry: {
        dimensions: asset.geometry.dimensions,
        boundingBoxM: asset.geometry.boundingBoxM,
        realPhotoUris: [],
        proceduralArchetype: asset.geometry.proceduralArchetype,
      },
      scientificProperties: {
        referenceMass: asset.scientificProperties.referenceMass,
      },
    },
    realPhotoMeta: {
      available: false,
      caption: 'Chưa có ảnh thực tế cho thiết bị này.',
    },
    moduleControls: controls,
  };
  fs.writeFileSync(
    path.join(dir, 'manifest.json'),
    JSON.stringify(manifestJson, null, 2) + '\n',
    'utf8',
  );

  const props = [
    `name=${opts.nameVi} (${opts.moduleId})`,
    'version=1.0.0',
    'author=OpenLab 3D Studio',
    'maintainer=OpenLab Vietnam <libraries3DLab>',
    `sentence=${opts.sentence}`,
    `paragraph=${opts.paragraph}`,
    `category=${opts.category}`,
    `url=https://openlab3d.vn/libraries/${opts.moduleId}`,
    'architectures=OL3D-HTML-MODULE-v2.4,ThreeJS-WebGL',
    `includes=${opts.htmlFileName}`,
    `assetId=${opts.moduleId}`,
    `slug=${opts.slug}`,
    `updatedAt=${new Date().toISOString()}`,
    '',
  ].join('\n');
  fs.writeFileSync(path.join(dir, 'library.properties'), props, 'utf8');

  return {
    moduleId: opts.moduleId,
    assetId: opts.moduleId,
    slug: opts.slug,
    nameVi: opts.nameVi,
    nameEn: opts.nameEn,
    category: opts.category,
    folderName: opts.folderName,
    htmlFileName: opts.htmlFileName,
    manifestPath: `/libraries3DLab/${opts.folderName}/manifest.json`,
    realPhotoMeta: { available: false },
  };
}

const phmEntry = ship({
  html: SAMPLE_PH_METER_HTML_MODULE,
  folderName: 'OL3D-EQP-PHM-0001_may-do-ph-hien-so',
  htmlFileName: 'may-do-ph-hien-so.html',
  moduleId: 'OL3D-EQP-PHM-0001',
  slug: 'may-do-ph-hien-so',
  nameVi: 'Máy đo pH hiện số kèm điện cực thủy tinh',
  nameEn: 'Digital Laboratory pH Meter',
  category: 'chemical-apparatus',
  sentence: 'Máy đo độ pH hiện số (0.00 – 14.00 pH, ĐCNN 0.01 pH) có chân đế và tay đỡ điện cực thủy tinh.',
  paragraph: 'Thiet bi KHTN 9 (May do pH hien so) - Thang do: 0.00-14.00 pH - Do chia: 0.01 pH - Khoi luong: 285 g.',
});

const strEntry = ship({
  html: SAMPLE_MAGNETIC_STIRRER_HTML_MODULE,
  folderName: 'OL3D-EQP-STR-0001_may-khuay-tu-gia-nhiet',
  htmlFileName: 'may-khuay-tu-gia-nhiet.html',
  moduleId: 'OL3D-EQP-STR-0001',
  slug: 'may-khuay-tu-gia-nhiet',
  nameVi: 'Máy khuấy từ gia nhiệt kèm cá từ PTFE',
  nameEn: 'Digital Magnetic Hotplate Stirrer',
  category: 'thermal-equipment',
  sentence: 'Máy khuấy từ gia nhiệt hiện số (0 – 1500 vòng/phút, gia nhiệt tới 280°C) dùng mâm gốm Ceramic.',
  paragraph: 'Thiet bi KHTN 9 (May khuay tu gia nhiet) - Toc do: 0-1500 rpm - Gia nhiet toi 280 do C - Khoi luong: 1450 g.',
});

const indexPath = path.join(LIB, 'library-index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
for (const entry of [phmEntry, strEntry]) {
  const i = index.libraries.findIndex((l: any) => l.assetId === entry.assetId);
  if (i >= 0) index.libraries[i] = entry;
  else index.libraries.push(entry);
}
index.totalPreinstalledModules = index.libraries.length;
index.updatedAt = new Date().toISOString();
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

console.log(`✅ Đã ship PHM + STR. Tổng module trong library-index: ${index.libraries.length}`);
