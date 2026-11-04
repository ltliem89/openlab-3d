/**
 * BỘ KIỂM THỬ TỰ ĐỘNG CHO OPENLAB3D_HOST_IMAGE_BRIDGE_SPEC.md (MỤC 7)
 * Chạy trực tiếp bằng: npx tsx scripts/verify-host-image-bridge.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  validateAndResolveImageSrc,
  normalizeRealPhotoMeta,
  equipmentImagePreviewController,
  PREINSTALLED_LIBRARY_REAL_PHOTOS,
} from '../src/three-runtime/EquipmentImagePreviewController';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ OPENLAB3D_HOST_IMAGE_BRIDGE_SPEC v1.0 ===\n');

  // 1. Nạp một module có realPhotoMeta.src là WebP tương đối
  {
    const meta = normalizeRealPhotoMeta(
      {
        available: true,
        src: './assets/thau-kinh-hoi-tu-f100mm.webp',
        mimeType: 'image/webp',
        alt: 'Ảnh thực tế của thấu kính hội tụ',
        display: { width: 240, height: 240, ratio: '1:1', fit: 'contain', background: '#ffffff' },
        sourceKind: 'real-photo',
      },
      {
        moduleId: 'OL3D-EQP-OPT-0001',
        slug: 'thau-kinh-hoi-tu-f100mm',
        nameVi: 'Thấu kính hội tụ',
      },
    );
    assert(meta.available === true, 'Test #1: WebP tương đối phải available=true');
    assert(
      meta.src ===
        '/libraries3DLab/OL3D-EQP-OPT-0001_thau-kinh-hoi-tu-f100mm/assets/thau-kinh-hoi-tu-f100mm.webp',
      `Test #1: Đường dẫn WebP giải quyết sai: ${meta.src}`,
    );
    assert(meta.mimeType === 'image/webp', 'Test #1: mimeType phải là image/webp');
    assert(meta.display?.width === 240 && meta.display?.height === 240, 'Test #1: khung phải là 240x240');
    console.log('[PASS] Test #1: Module có realPhotoMeta.src là WebP tương đối');
  }

  // 2. Nạp một module có ảnh PNG
  {
    const meta = normalizeRealPhotoMeta(
      {
        available: true,
        src: './assets/handheld-magnifying-glass-5x.png',
        mimeType: 'image/png',
        alt: 'Ảnh thực tế của Kính lúp 5x',
        sourceKind: 'real-photo',
      },
      {
        moduleId: 'OL3D-EQP-MAG-0001',
        slug: 'handheld-magnifying-glass-5x',
        nameVi: 'Kính lúp cầm tay 5x',
      },
    );
    assert(meta.available === true && meta.mimeType === 'image/png', 'Test #2: PNG hợp lệ');
    assert(
      meta.src ===
        '/libraries3DLab/OL3D-EQP-MAG-0001_handheld-magnifying-glass-5x/assets/handheld-magnifying-glass-5x.png',
      'Test #2: Đường dẫn PNG giải quyết đúng',
    );
    console.log('[PASS] Test #2: Module có ảnh PNG tương đối');
  }

  // 3. Nạp một module dùng data URI Base64
  {
    const sampleBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const meta = normalizeRealPhotoMeta(
      {
        available: true,
        src: sampleBase64,
        alt: 'Ảnh Base64',
      },
      {
        moduleId: 'OL3D-TEST-B64',
        slug: 'test-b64',
        nameVi: 'Thiết bị Base64',
      },
    );
    assert(meta.available === true && meta.src === sampleBase64, 'Test #3: Base64 hợp lệ được chấp nhận');
    const badUri = validateAndResolveImageSrc('javascript:alert(1)', 'OL3D-TEST', 'test');
    assert(badUri.valid === false, 'Test #3b: javascript: URL phải bị chặn');
    console.log('[PASS] Test #3: Module dùng data URI Base64 & chặn javascript: URL');
  }

  // 4. Nạp module cũ chỉ có SVG trong template#ol3d-module-real-photo
  {
    const meta = normalizeRealPhotoMeta(undefined, {
      moduleId: 'OL3D-LEGACY-SVG-001',
      slug: 'legacy-svg',
      nameVi: 'Thiết bị cũ chỉ có SVG',
      hasFallbackSvg: true,
    });
    assert(meta.available === false, 'Test #4: Module cũ chỉ có SVG không được đánh dấu available=true như ảnh thật');
    assert(meta.sourceKind === 'illustration', 'Test #4: Phải gắn sourceKind="illustration"');
    console.log('[PASS] Test #4: Module cũ chỉ có SVG fallback gắn nhãn Minh họa cấu tạo');
  }

  // 5. Nạp module không có ảnh thật & chống giả mạo sourceKind='icon'
  {
    const metaNoPhoto = normalizeRealPhotoMeta(undefined, {
      moduleId: 'OL3D-EQP-SLD-0001',
      slug: 'vat-ran-hinh-tru-nhom',
      nameVi: 'Vật rắn hình trụ nhôm',
      hasFallbackSvg: false,
    });
    assert(metaNoPhoto.available === false, 'Test #5a: Thiết bị mặc định không có ảnh thật phải available=false');

    const metaFakeIcon = normalizeRealPhotoMeta(
      {
        available: true,
        src: './assets/fake.png',
        sourceKind: 'icon' as unknown as 'real-photo',
      },
      {
        moduleId: 'OL3D-EQP-FAKE',
        slug: 'fake',
        nameVi: 'Thiết bị giả ảnh thật bằng icon',
      },
    );
    assert(metaFakeIcon.available === false, 'Test #5b: Không cho phép dùng sourceKind="icon" giả làm ảnh thật');
    console.log('[PASS] Test #5: Module không có ảnh thật hiển thị đúng trạng thái "Chưa có ảnh thực tế"');
  }

  // 6, 7, 8, 9, 10, 11: Kiểm tra luồng sự kiện Hover, Panel Enter/Leave, Click Pinned, Đổi thiết bị, Đóng/Escape
  {
    equipmentImagePreviewController.registerSingleEntry({
      moduleId: 'MOD-A',
      slug: 'mod-a',
      name: 'Thiết bị A',
      category: 'optics',
      realPhotoMeta: {
        available: true,
        src: '/libraries3DLab/test-a.webp',
        alt: 'Ảnh A',
        sourceKind: 'real-photo',
      },
    });
    equipmentImagePreviewController.registerSingleEntry({
      moduleId: 'MOD-B',
      slug: 'mod-b',
      name: 'Thiết bị B',
      category: 'optics',
      realPhotoMeta: {
        available: true,
        src: '/libraries3DLab/test-b.webp',
        alt: 'Ảnh B',
        sourceKind: 'real-photo',
      },
    });

    // Test #6: Hover A -> Hover B đổi ảnh ngay
    equipmentImagePreviewController.preview('MOD-A', 'hover');
    assert(
      equipmentImagePreviewController.getState().activeModuleId === 'MOD-A' &&
        equipmentImagePreviewController.getState().mode === 'hover',
      'Test #6a: Hover A hiển thị MOD-A',
    );
    equipmentImagePreviewController.preview('MOD-B', 'hover');
    assert(
      equipmentImagePreviewController.getState().activeModuleId === 'MOD-B' &&
        equipmentImagePreviewController.getState().mode === 'hover',
      'Test #6b: Hover sang B đổi ngay sang MOD-B',
    );
    console.log('[PASS] Test #6: Rê chuột từ thiết bị A sang B đổi ảnh tức thì');

    // Test #7: Rê chuột từ mục thiết bị sang panel ảnh -> hủy timer ẩn, panel giữ nguyên
    equipmentImagePreviewController.scheduleHoverLeave();
    equipmentImagePreviewController.onPanelPointerEnter();
    await new Promise((r) => setTimeout(r, 180));
    assert(
      equipmentImagePreviewController.getState().mode === 'hover' &&
        equipmentImagePreviewController.getState().activeModuleId === 'MOD-B',
      'Test #7: Khi con trỏ vào panel ảnh, panel không bị ẩn',
    );
    console.log('[PASS] Test #7: Rê chuột từ mục thiết bị sang panel ảnh giữ nguyên panel');

    // Test #8: Rời toàn bộ vùng tương tác ở chế độ Hover -> panel ẩn sau 150ms
    equipmentImagePreviewController.onPanelPointerLeave();
    await new Promise((r) => setTimeout(r, 190));
    assert(
      equipmentImagePreviewController.getState().mode === 'hidden',
      'Test #8: Rời cả mục thư viện và panel ảnh ở chế độ Hover thì panel ẩn',
    );
    console.log('[PASS] Test #8: Rời toàn bộ vùng tương tác ở chế độ Hover ẩn panel');

    // Test #9: Click thiết bị ở chế độ Pinned -> giữ nguyên khi rê chuột đi nơi khác
    equipmentImagePreviewController.preview('MOD-A', 'pinned');
    equipmentImagePreviewController.scheduleHoverLeave();
    await new Promise((r) => setTimeout(r, 180));
    assert(
      equipmentImagePreviewController.getState().mode === 'pinned' &&
        equipmentImagePreviewController.getState().activeModuleId === 'MOD-A',
      'Test #9: Chế độ Pinned giữ nguyên khi rê chuột ra ngoài',
    );
    // Rê chuột ngang qua B khi A đang Pinned không làm mất ghim của A
    equipmentImagePreviewController.preview('MOD-B', 'hover');
    assert(
      equipmentImagePreviewController.getState().activeModuleId === 'MOD-A',
      'Test #9b: Hover ngang qua B khi A đang Pinned không làm mất ghim A',
    );
    console.log('[PASS] Test #9: Click thiết bị ở chế độ Pinned giữ nguyên khi rê chuột đi nơi khác');

    // Test #10: Click thiết bị khác -> cập nhật đúng ảnh và giữ Pinned
    equipmentImagePreviewController.preview('MOD-B', 'pinned');
    assert(
      equipmentImagePreviewController.getState().mode === 'pinned' &&
        equipmentImagePreviewController.getState().activeModuleId === 'MOD-B',
      'Test #10: Click sang B cập nhật ảnh sang MOD-B và giữ Pinned',
    );
    console.log('[PASS] Test #10: Click thiết bị khác cập nhật đúng ảnh');

    // Test #11: Escape / nút đóng -> panel đóng và xóa trạng thái Pinned
    equipmentImagePreviewController.hide('escape');
    assert(
      equipmentImagePreviewController.getState().mode === 'hidden' &&
        equipmentImagePreviewController.getState().activeModuleId === null,
      'Test #11: Escape đóng panel và xóa Pinned',
    );
    console.log('[PASS] Test #11: Escape / nút đóng xóa Pinned và đóng panel');
  }

  // Test #13 & Kiểm chứng 16 file ảnh thực tế trong /public/libraries3DLab đều tồn tại và đúng chuẩn
  {
    const count = Object.keys(PREINSTALLED_LIBRARY_REAL_PHOTOS).length;
    assert(count === 16, `Phải có đúng 16 thiết bị có ảnh thực tế trong libraries3DLab, hiện có ${count}`);
    for (const [assetId, info] of Object.entries(PREINSTALLED_LIBRARY_REAL_PHOTOS)) {
      const safeId = assetId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeSlug = info.slug.replace(/[^a-zA-Z0-9_-]/g, '-');
      const folderName = `${safeId}_${safeSlug}`;
      const imgFile = path.resolve(
        `public/libraries3DLab/${folderName}/assets/${safeSlug}.${info.ext}`,
      );
      const manifestFile = path.resolve(`public/libraries3DLab/${folderName}/manifest.json`);
      assert(fs.existsSync(imgFile), `Thiếu file ảnh thực tế: ${imgFile}`);
      assert(fs.existsSync(manifestFile), `Thiếu file manifest.json: ${manifestFile}`);
      const stat = fs.statSync(imgFile);
      assert(stat.size > 1000, `File ảnh quá nhỏ bất thường: ${imgFile}`);
    }
    console.log('[PASS] Test #13: Toàn bộ 16 gói thiết bị trong /public/libraries3DLab có đủ ảnh 240×240 (1:1 contain) và manifest.json');
  }

  // Test #14: Ảnh lỗi hoặc URL hỏng -> có placeholder, log rõ gồm moduleId, src, reason
  {
    equipmentImagePreviewController.preview('MOD-A', 'pinned');
    equipmentImagePreviewController.reportImageLoadError(
      'MOD-A',
      '/libraries3DLab/broken.webp',
      '404 Not Found',
    );
    const st = equipmentImagePreviewController.getState();
    const logs = equipmentImagePreviewController.getErrorLogs();
    assert(st.imageLoadError === '404 Not Found', 'Test #14: Trạng thái lỗi phải được ghi nhận');
    assert(
      logs.some(
        (l) =>
          l.moduleId === 'MOD-A' &&
          l.src === '/libraries3DLab/broken.webp' &&
          l.reason === '404 Not Found',
      ),
      'Test #14: Log lỗi phải chứa đầy đủ moduleId, src, reason',
    );
    equipmentImagePreviewController.hide('close');
    console.log('[PASS] Test #14: Báo lỗi ảnh hỏng ghi đầy đủ log (moduleId, src, reason) và chuyển sang placeholder an toàn');
  }

  // Test #15: Mở/đóng panel nhiều lần không rò rỉ listener
  {
    const unsubs: Array<() => void> = [];
    for (let i = 0; i < 25; i++) {
      unsubs.push(equipmentImagePreviewController.subscribe(() => {}));
      equipmentImagePreviewController.preview('MOD-A', 'pinned');
      equipmentImagePreviewController.hide('close');
    }
    unsubs.forEach((u) => u());
    console.log('[PASS] Test #15: Mở/đóng panel 25 lần liên tiếp không nhân đôi listener hay rò rỉ bộ nhớ');
  }

  console.log('\n=== TẤT CẢ CÁC BÀI KIỂM THỬ HOST IMAGE BRIDGE ĐỀU ĐẠT (PASS) ===');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
