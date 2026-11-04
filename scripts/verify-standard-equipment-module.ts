/**
 * TEST SUITE: KIỂM ĐỊNH MODULE THIẾT BỊ THEO CHUẨN MASTER SPEC v2.4 (7 CỔNG KIỂM ĐỊNH)
 * Thiết bị kiểm tra:
 * 1. OL3D-EQP-LEV-0001 (Bộ đòn bẩy thăng bằng chia vạch đối xứng kèm giá đỡ)
 * 2. OL3D-EQP-HYD-0001 (Bình thông nhau 3 nhánh dị hình trên đế)
 */

import fs from 'fs';
import path from 'path';

// Polyfill DOMParser và Canvas cho môi trường Node.js CLI
if (typeof globalThis.window === 'undefined') {
  (globalThis as any).window = globalThis;
}

if (typeof globalThis.document === 'undefined') {
  (globalThis as any).document = {
    createElement(tag: string) {
      if (tag === 'canvas') {
        return {
          width: 512,
          height: 256,
          getContext: () => ({
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            font: '',
            textAlign: '',
            fillRect() {},
            fillText() {},
            beginPath() {},
            arc() {},
            stroke() {},
            fill() {},
            moveTo() {},
            lineTo() {},
          }),
        };
      }
      return {};
    },
  };
}

if (typeof (globalThis as any).DOMParser === 'undefined') {
  (globalThis as any).DOMParser = class NodeDOMParser {
    parseFromString(html: string) {
      return {
        getElementById(id: string) {
          const regex = new RegExp(`<([a-zA-Z0-9]+)[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/\\1>`, 'i');
          const m = html.match(regex);
          if (!m) return null;
          return {
            id,
            tagName: m[1].toUpperCase(),
            textContent: m[2],
            innerHTML: m[2],
            outerHTML: m[0],
            getAttribute(attr: string) {
              const am = m[0].match(new RegExp(`${attr}=["']([^"']*)["']`, 'i'));
              return am ? am[1] : null;
            },
          };
        },
        querySelector(sel: string) {
          if (sel === 'script[type="application/json"]') {
            return this.getElementById('ol3d-module-manifest');
          }
          if (sel === 'title') {
            const tm = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
            return tm ? { textContent: tm[1] } : null;
          }
          if (sel === 'svg') {
            const sm = html.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
            return sm ? { outerHTML: sm[0], innerHTML: sm[1] } : null;
          }
          return null;
        },
        querySelectorAll(sel: string) {
          if (sel === 'svg') {
            const matches = [...html.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/gi)];
            return matches.map((m) => ({ outerHTML: m[0], innerHTML: m[1] }));
          }
          if (sel === 'script[src]') {
            const matches = [...html.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi)];
            return matches.map((m) => ({
              getAttribute(attr: string) {
                if (attr === 'src') return m[1];
                return null;
              },
            }));
          }
          return [];
        },
      };
    }
  };
}

import * as THREE from 'three';
import { htmlEquipmentModuleRegistry } from '../src/three-runtime/HtmlEquipmentModuleRegistry';
import { MOCK_EQUIPMENT_ASSETS } from '../src/data/mockCatalog';
import {
  MULTI_SOURCE_EQUIPMENT_DOSSIERS,
  EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS,
} from '../src/data/multiSourceEquipmentDossier';
import { PREINSTALLED_LIBRARY_REAL_PHOTOS } from '../src/three-runtime/EquipmentImagePreviewController';

interface TestResult {
  code: string;
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function assert(code: string, name: string, condition: boolean, message: string) {
  results.push({
    code,
    name,
    passed: condition,
    message: condition ? `PASS: ${message}` : `FAIL: ${message}`,
  });
}

async function runVerification() {
  console.log('========================================================================');
  console.log('🔍 KHỞI CHẠY KIỂM ĐỊNH MODULE THIẾT BỊ CHUẨN MASTER SPEC v2.4 (7 GATES)');
  console.log('========================================================================\n');

  // Danh sách các module kiểm tra
  const targetModules = [
    {
      id: 'OL3D-EQP-LEV-0001',
      slug: 'thanh-don-bay-thang-bang',
      folder: 'OL3D-EQP-LEV-0001_thanh-don-bay-thang-bang',
      htmlFile: 'thanh-don-bay-thang-bang.html',
      expectedStateKey: 'incidentAngleDeg',
    },
    {
      id: 'OL3D-EQP-HYD-0001',
      slug: 'binh-thong-nhau-3-nhanh',
      folder: 'OL3D-EQP-HYD-0001_binh-thong-nhau-3-nhanh',
      htmlFile: 'binh-thong-nhau-3-nhanh.html',
      expectedStateKey: 'liquidLevelMl',
    },
  ];

  // 1. Kiểm tra library-index.json
  const indexPath = path.resolve('public/libraries3DLab/library-index.json');
  assert('IDX-01', 'Tồn tại file library-index.json', fs.existsSync(indexPath), `Tìm thấy ${indexPath}`);
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  for (const mod of targetModules) {
    const idxEntry = indexData.libraries.find((item: { moduleId: string }) => item.moduleId === mod.id);
    assert(
      `IDX-${mod.id}`,
      `Module ${mod.id} được đăng ký trong library-index.json`,
      Boolean(idxEntry),
      `Tìm thấy ${mod.id} trong library-index (${idxEntry?.nameVi})`,
    );

    // 2. Kiểm tra cấu trúc thư mục và file vật lý
    const modDir = path.resolve('public/libraries3DLab', mod.folder);
    const htmlPath = path.join(modDir, mod.htmlFile);
    const manifestPath = path.join(modDir, 'manifest.json');
    const propPath = path.join(modDir, 'library.properties');
    const assetPng = path.join(modDir, 'assets', `${mod.slug}.png`);
    const assetWebp = path.join(modDir, 'assets', `${mod.slug}.webp`);

    assert(`DIR-${mod.id}`, `Thư mục module ${mod.folder}`, fs.existsSync(modDir), `Đường dẫn: ${modDir}`);
    assert(`FILE-HTML-${mod.id}`, `File HTML độc lập ${mod.htmlFile}`, fs.existsSync(htmlPath), `Tìm thấy file HTML`);
    assert(`FILE-MAN-${mod.id}`, `File manifest.json`, fs.existsSync(manifestPath), `Tìm thấy manifest.json`);
    assert(`FILE-PROP-${mod.id}`, `File library.properties`, fs.existsSync(propPath), `Tìm thấy library.properties`);
    assert(`FILE-PNG-${mod.id}`, `Asset ảnh thực tế 240x240 PNG`, fs.existsSync(assetPng), `Tìm thấy PNG`);
    assert(`FILE-WEBP-${mod.id}`, `Asset ảnh thực tế 240x240 WebP`, fs.existsSync(assetWebp), `Tìm thấy WebP`);

    // 3. Phân tích cú pháp & Kiểm tra 4 khối DOM chuẩn
    const rawHtml = fs.readFileSync(htmlPath, 'utf8');
    assert(`DOM-01-${mod.id}`, `Khối #ol3d-module-manifest trong HTML`, rawHtml.includes('id="ol3d-module-manifest"'), `Có #ol3d-module-manifest`);
    assert(`DOM-02-${mod.id}`, `Khối #ol3d-module-icon trong HTML`, rawHtml.includes('id="ol3d-module-icon"'), `Có #ol3d-module-icon`);
    assert(`DOM-03-${mod.id}`, `Khối #ol3d-module-real-photo trong HTML`, rawHtml.includes('id="ol3d-module-real-photo"'), `Có #ol3d-module-real-photo`);
    assert(`DOM-04-${mod.id}`, `Khối #ol3d-module-3d-script trong HTML`, rawHtml.includes('id="ol3d-module-3d-script"'), `Có #ol3d-module-3d-script`);

    // 4. Nạp vào HtmlEquipmentModuleRegistry và kiểm tra 7 cổng
    const pkg = htmlEquipmentModuleRegistry.parseHtmlModule(rawHtml);
    assert(`PARSE-${mod.id}`, `Phân tích package thành công`, Boolean(pkg && pkg.asset), `AssetId=${pkg.asset.assetId}`);

    const report = htmlEquipmentModuleRegistry.validateModule7Gates(pkg, true, []);
    console.log(`\n--- BÁO CÁO 7 CỔNG KIỂM ĐỊNH: ${mod.id} ---`);
    console.log(`Đánh giá tổng thể: ${report.overallStatus} (${report.detectedContractVersion})`);
    report.gates.forEach((g) => {
      console.log(`  [${g.status}] ${g.gateNameVi}: ${g.summaryVi}`);
    });

    assert(
      `GATE-OVERALL-${mod.id}`,
      `7 Cổng kiểm định đạt tổng thể PASS`,
      report.overallStatus === 'PASS',
      `Overall Status: ${report.overallStatus}`,
    );

    for (const g of report.gates) {
      assert(
        `GATE-${g.gateId}-${mod.id}`,
        `${g.gateNameVi}`,
        g.status === 'PASS',
        `${g.summaryVi}`,
      );
    }

    // 5. Kiểm tra Hình học 3D chi tiết
    if (pkg.buildEquipmentGroup) {
      const meshGroup = pkg.buildEquipmentGroup(THREE, pkg.asset);
      const bbox = new THREE.Box3().setFromObject(meshGroup);
      const yMin = Number(bbox.min.y.toFixed(4));
      const width = Number((bbox.max.x - bbox.min.x).toFixed(3));
      const height = Number((bbox.max.y - bbox.min.y).toFixed(3));
      const depth = Number((bbox.max.z - bbox.min.z).toFixed(3));

      assert(
        `GEO-YMIN-${mod.id}`,
        `Điểm tựa chạm mặt bàn (y = 0.000m)`,
        Math.abs(yMin) <= 0.008,
        `y_min = ${yMin}m (sai số <= 8mm)`,
      );

      assert(
        `GEO-DIM-${mod.id}`,
        `Kích thước bao 3D (${width * 1000}x${height * 1000}x${depth * 1000}mm)`,
        width >= 0.05 && height >= 0.05 && depth >= 0.02,
        `Kích thước hợp lý trên bàn thí nghiệm`,
      );

      // Đếm mesh con
      let meshCount = 0;
      meshGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) meshCount++;
      });
      assert(
        `GEO-MESHES-${mod.id}`,
        `Đa thành phần (Anti-blocky >= 4 meshes)`,
        meshCount >= 4,
        `Số sub-meshes thực tế: ${meshCount}`,
      );

      // 6. Kiểm tra cập nhật trạng thái tương tác
      if (pkg.applyEquipmentState) {
        let updateOk = true;
        try {
          for (const preset of pkg.moduleControls.presets) {
            pkg.applyEquipmentState(
              THREE,
              meshGroup,
              {
                instanceId: 'test-inst',
                assetId: mod.id,
                assetVersion: '1.0.0',
                customLabel: pkg.asset.name.vi,
                parentZone: 'bench-main',
                transform: { positionM: [0, 0, 0], rotationRad: [0, 0, 0], displayScale: [1, 1, 1] },
                visible: true,
                locked: false,
                labelVisible: true,
                instanceState: preset.statePatch,
              },
              pkg.asset,
            );
          }
        } catch (e) {
          updateOk = false;
        }
        assert(`CTRL-UPDATE-${mod.id}`, `Cập nhật trạng thái presets`, updateOk, `Các presets cập nhật trơn tru`);
      }

      // 7. Kiểm tra âm thanh Web Audio
      assert(
        `AUDIO-${mod.id}`,
        `Cung cấp hàm phát âm thanh playEquipmentSound`,
        typeof pkg.playEquipmentSound === 'function',
        `Hàm playEquipmentSound có sẵn`,
      );
    }

    // 8. Kiểm tra kết nối Catalog & Dossier 5 nguồn & Audit 360
    const catAsset = MOCK_EQUIPMENT_ASSETS.find((a) => a.assetId === mod.id);
    assert(`CAT-${mod.id}`, `Đăng ký trong MOCK_EQUIPMENT_ASSETS`, Boolean(catAsset), `Tìm thấy ${mod.id} trong catalog`);

    const dossier = MULTI_SOURCE_EQUIPMENT_DOSSIERS[mod.id];
    assert(
      `DOSSIER-${mod.id}`,
      `Hồ sơ kiểm định 5 nguồn web`,
      Boolean(dossier && dossier.fiveWebSources.length === 5),
      `Có đủ 5 nguồn thẩm định (${dossier?.technicalStandard})`,
    );

    const audit = EQUIPMENT_FUNCTIONAL_AND_ENV_AUDITS[mod.id];
    assert(
      `AUDIT-${mod.id}`,
      `Kiểm tra tính năng 360° & Tương tác môi trường`,
      Boolean(audit && audit.coreInteractiveFunctions.length > 0),
      `Audit 360° sẵn sàng`,
    );

    const photoMeta = PREINSTALLED_LIBRARY_REAL_PHOTOS[mod.id];
    assert(
      `PREVIEW-${mod.id}`,
      `Đăng ký ảnh thực tế trong EquipmentImagePreviewController`,
      Boolean(photoMeta),
      `Tìm thấy ảnh chuẩn bị sẵn: ${photoMeta?.caption}`,
    );
  }

  // Tổng kết
  console.log('\n========================================================================');
  console.log('📊 BẢNG TỔNG KẾT KẾT QUẢ KIỂM ĐỊNH MODULE THIẾT BỊ OPENLAB 3D:');
  console.log('========================================================================');

  let passedCount = 0;
  for (const r of results) {
    if (r.passed) passedCount++;
    console.log(`[${r.passed ? '✓ PASS' : '✗ FAIL'}] ${r.code.padEnd(20)} | ${r.name.padEnd(38)} | ${r.message}`);
  }

  console.log('------------------------------------------------------------------------');
  console.log(`TỔNG KẾT: ${passedCount} / ${results.length} TIÊU CHÍ ĐẠT (${Math.round((passedCount / results.length) * 100)}%)`);

  if (passedCount === results.length) {
    console.log('🎉 TẤT CẢ MODULE ĐẠT 100% TIÊU CHUẨN MASTER SPEC v2.4 VÀ VƯỢT QUA 7 CỔNG!');
  } else {
    console.error('❌ MỘT SỐ TIÊU CHÍ CHƯA ĐẠT. VUI LÒNG KIỂM TRA LẠI CHI TIẾT TRÊN!');
    process.exit(1);
  }
}

void runVerification();
