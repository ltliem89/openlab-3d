import React, { useMemo } from 'react';
import {
  SpecimenDefinition,
  StructureAnnotation,
} from '../../data/microscopeSpecimenCatalog';

interface MicroscopeSpecimenSvgRendererProps {
  specimen: SpecimenDefinition;
  objectiveMag: number; // 4, 10, 40, 100
  stageX: number; // Tọa độ bàn kính (mm hoặc tương đối -50 đến 50)
  stageY: number; // Tọa độ bàn kính
  focalBlurPx: number; // Độ mờ quang học (px)
  eyepieceMag?: 10 | 16; // Độ phóng đại thị kính
  deltaZ?: number; // Độ lệch tiêu điểm cơ học (mm): z - targetFocusZ
  brightness: number; // 0 đến 1.0
  diaphragm: number; // 0.1 đến 1.0 (khẩu độ - tương phản)
  isLightOn: boolean;
  showAnnotations: boolean;
  activeAnnotationId: string | null;
  onSelectAnnotation?: (ann: StructureAnnotation) => void;
  animTimeSec: number;
}

export const MicroscopeSpecimenSvgRenderer: React.FC<
  MicroscopeSpecimenSvgRendererProps
> = ({
  specimen,
  objectiveMag,
  eyepieceMag = 10,
  deltaZ = 0,
  stageX,
  stageY,
  focalBlurPx,
  brightness,
  diaphragm,
  isLightOn,
  showAnnotations,
  activeAnnotationId,
  onSelectAnnotation,
  animTimeSec,
}) => {
  // QUY TẮC QUANG HỌC KÍNH HIỂN VI (Optical Inversion Rule):
  // Di chuyển bàn kính sang Trái (stageX < 0) -> Ảnh trong thị kính dịch sang Phải (viewX > 0)
  // Di chuyển bàn kính Lên trên (stageY > 0) -> Ảnh trong thị kính dịch Xuống dưới (viewY < 0)
  const viewX = -stageX * (objectiveMag / 10) * 16;
  const viewY = stageY * (objectiveMag / 10) * 16;

  // Hệ số khuếch đại thị kính (Eyepiece Factor): 10x -> 1.0, 16x -> 1.6
  const eyeFactor = eyepieceMag / 10;

  // Tỉ lệ scale mẫu vật theo vật kính kết hợp thị kính:
  // Tổng độ phóng đại = Vật kính × Thị kính.
  // Khi tăng độ phóng đại (ví dụ chuyển từ 10x lên 16x thị kính, hoặc 10x lên 40x vật kính),
  // kích thước biểu kiến của mẫu vật tăng lên và trường nhìn FOV thực tế thu hẹp tương ứng.
  const baseScale = useMemo(() => {
    let rawObjScale = 1.0;
    switch (objectiveMag) {
      case 4:
        rawObjScale = 0.38;
        break;
      case 10:
        rawObjScale = 1.0;
        break;
      case 40:
        rawObjScale = 3.8;
        break;
      case 100:
        rawObjScale = 9.2;
        break;
      default:
        rawObjScale = 1.0;
    }
    return rawObjScale * eyeFactor;
  }, [objectiveMag, eyeFactor]);

  // HIỆN TƯỢNG TIÊU TÁN BOKEH KHI MẤT NÉT HOÀN TOÀN (Total Defocus Dissipation):
  // Khi bàn kính lệch tiêu cự (|deltaZ| > 0.35 mm), chùm sáng tụ quang Abbe phân tán rộng,
  // làm độ tương phản mẫu vật suy giảm nghiêm trọng.
  // Khi |deltaZ| >= 0.85 mm, mẫu vật hoàn toàn biến mất (opacity = 0), trường nhìn chỉ còn lại
  // đĩa sáng trắng đồng nhất. Khi học sinh quay núm chỉnh về gần tiêu điểm, bóng mờ mới hiện dần ra.
  const absDeltaZ = Math.abs(deltaZ);
  const specimenOpacity = useMemo(() => {
    if (absDeltaZ <= 0.35) return 1.0;
    if (absDeltaZ >= 0.85) return 0.0;
    return Math.max(0.0, 1.0 - (absDeltaZ - 0.35) / 0.5);
  }, [absDeltaZ]);

  // Độ sáng & Tương phản theo hệ thống chiếu sáng & màn chắn sáng
  const exposureFilter = useMemo(() => {
    if (!isLightOn || brightness <= 0.01) {
      return 'brightness(0.02) contrast(0.5)';
    }
    const bVal = Math.max(0.05, brightness * 1.15);
    // Diaphragm (khẩu độ): khép nhỏ tăng tương phản (contrast), mở rộng làm sáng chói (glare)
    const cVal = 0.85 + (1.0 - diaphragm) * 0.45;
    return `brightness(${bVal.toFixed(2)}) contrast(${cVal.toFixed(2)}) blur(${focalBlurPx.toFixed(1)}px)`;
  }, [isLightOn, brightness, diaphragm, focalBlurPx]);

  // Chuyển động sinh học vi mô (microbial swimming/drift)
  const swimX =
    specimen.id === 'spc-paramecium'
      ? Math.sin(animTimeSec * 0.8) * 18 + Math.cos(animTimeSec * 0.4) * 12
      : specimen.id === 'spc-euglena'
        ? Math.sin(animTimeSec * 1.2) * 14
        : 0;

  const swimY =
    specimen.id === 'spc-paramecium'
      ? Math.cos(animTimeSec * 0.7) * 14 + Math.sin(animTimeSec * 0.3) * 8
      : specimen.id === 'spc-euglena'
        ? Math.cos(animTimeSec * 1.0) * 10
        : 0;

  const swimRotate =
    specimen.id === 'spc-paramecium'
      ? Math.sin(animTimeSec * 0.6) * 14 - 15
      : specimen.id === 'spc-euglena'
        ? Math.sin(animTimeSec * 1.5) * 8 - 25
        : 0;

  return (
    <div className="w-full h-full relative overflow-hidden select-none pointer-events-auto">
      {/* Container áp dụng hiệu ứng mờ tiêu cự & độ sáng quang học */}
      <div
        style={{
          filter: exposureFilter,
          transition: 'filter 0.08s ease-out',
        }}
        className="w-full h-full relative flex items-center justify-center"
      >
        <svg
          viewBox="-250 -250 500 500"
          className="w-full h-full"
          style={{
            transform: `translate(${viewX}px, ${viewY}px)`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Nền tiêu bản nhuộm màu mờ */}
            <radialGradient id="substageLightGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#f8fafc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.6" />
            </radialGradient>

            {/* Gradient cho trùng giày */}
            <radialGradient id="parameciumBodyGrad" cx="42%" cy="46%" r="55%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.88" />
              <stop offset="65%" stopColor="#bae6fd" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
            </radialGradient>

            {/* Gradient cho Amip */}
            <radialGradient id="amoebaEctoGrad" cx="48%" cy="50%" r="52%">
              <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.82" />
              <stop offset="75%" stopColor="#dcfce7" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#86efac" stopOpacity="0.85" />
            </radialGradient>

            {/* Gradient cho tế bào biểu bì hành (Lugol nâu vàng) */}
            <linearGradient id="onionLugolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#fde68a" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
            </linearGradient>

            {/* Gradient cho lục lạp lá */}
            <radialGradient id="chloroplastGrad" cx="40%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="55%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>

            {/* Gradient cho tế bào niêm mạc miệng (Xanh metylen) */}
            <radialGradient id="cheekCellGrad" cx="48%" cy="48%" r="52%">
              <stop offset="0%" stopColor="#eff6ff" stopOpacity="0.88" />
              <stop offset="70%" stopColor="#bfdbfe" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.85" />
            </radialGradient>
          </defs>

          {/* Ánh sáng xuyên thấu từ tụ quang Abbe */}
          <rect
            x="-350"
            y="-350"
            width="700"
            height="700"
            fill="url(#substageLightGrad)"
          />

          {/* Vùng mẫu vật chính phóng to/thu nhỏ theo độ phóng đại vật kính & tiêu tán Bokeh khi mất nét */}
          <g
            style={{
              transform: `scale(${baseScale})`,
              transformOrigin: '0px 0px',
              opacity: specimenOpacity,
              transition: 'opacity 0.08s ease-out',
            }}
          >
            {/* ========================================================
                1. MẪU VẬT: TRÙNG GIÀY (Paramecium caudatum)
               ======================================================== */}
            {specimen.id === 'spc-paramecium' && (
              <g
                style={{
                  transform: `translate(${swimX}px, ${swimY}px) rotate(${swimRotate}deg)`,
                  transformOrigin: '0px 0px',
                }}
              >
                {/* Hàng lông bơi bao quanh (Cilia fringe) */}
                <path
                  d="M -30 -110 C 25 -110 50 -70 52 -10 C 54 50 35 110 -5 125 C -45 130 -55 70 -52 10 C -50 -50 -45 -110 -30 -110 Z"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeDasharray="2.5 3"
                  opacity="0.85"
                />

                {/* Thân màng pellicle hình đế giày */}
                <path
                  d="M -30 -108 C 24 -108 48 -68 50 -10 C 52 48 34 108 -6 122 C -44 126 -53 68 -50 10 C -48 -48 -44 -108 -30 -108 Z"
                  fill="url(#parameciumBodyGrad)"
                  stroke="#0284c7"
                  strokeWidth="2.2"
                />

                {/* Hạt nội chất mịn trong tế bào chất */}
                {Array.from({ length: 42 }).map((_, i) => {
                  const gx = ((i * 37) % 70) - 35;
                  const gy = ((i * 49) % 210) - 95;
                  return (
                    <circle
                      key={i}
                      cx={gx}
                      cy={gy}
                      r={(i % 3) * 0.7 + 0.8}
                      fill="#0284c7"
                      opacity="0.28"
                    />
                  );
                })}

                {/* Rãnh miệng (Oral groove) uốn xiên */}
                <path
                  d="M -18 -42 Q -4 -10 -16 28"
                  fill="none"
                  stroke="#0369a1"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <circle cx="-16" cy="30" r="4.2" fill="#0c4a6e" />

                {/* Nhân lớn hình hạt đậu (Macronucleus) & Nhân nhỏ (Micronucleus) */}
                <ellipse
                  cx="10"
                  cy="-15"
                  rx="14"
                  ry="20"
                  transform="rotate(15 10 -15)"
                  fill="#0369a1"
                  stroke="#075985"
                  strokeWidth="1.6"
                  opacity="0.92"
                />
                <ellipse cx="9" cy="-14" rx="10" ry="15" fill="#0284c7" opacity="0.65" />
                <circle cx="24" cy="-22" r="3.2" fill="#0c4a6e" />

                {/* Không bào co bóp hình hoa cúc ở cực trước */}
                <g transform="translate(18, -68)">
                  <circle
                    cx="0"
                    cy="0"
                    r={6 + Math.sin(animTimeSec * 3) * 2.2}
                    fill="#ffffff"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  {/* 6 ống tỏa hình nan hoa */}
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <line
                      key={deg}
                      x1="0"
                      y1="0"
                      x2={Math.cos((deg * Math.PI) / 180) * 12}
                      y2={Math.sin((deg * Math.PI) / 180) * 12}
                      stroke="#0284c7"
                      strokeWidth="1.2"
                      opacity="0.8"
                    />
                  ))}
                </g>

                {/* Không bào co bóp ở cực sau */}
                <g transform="translate(-16, 75)">
                  <circle
                    cx="0"
                    cy="0"
                    r={5.5 + Math.cos(animTimeSec * 3.2) * 2.0}
                    fill="#ffffff"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                  {[30, 90, 150, 210, 270, 330].map((deg) => (
                    <line
                      key={deg}
                      x1="0"
                      y1="0"
                      x2={Math.cos((deg * Math.PI) / 180) * 11}
                      y2={Math.sin((deg * Math.PI) / 180) * 11}
                      stroke="#0284c7"
                      strokeWidth="1.2"
                      opacity="0.8"
                    />
                  ))}
                </g>

                {/* Các không bào tiêu hóa (Food vacuoles) trôi dạt */}
                <circle cx="-12" cy="-65" r="5" fill="#22c55e" opacity="0.75" />
                <circle cx="22" cy="18" r="6" fill="#f59e0b" opacity="0.7" />
                <circle cx="-6" cy="45" r="5.5" fill="#38bdf8" opacity="0.8" />
                <circle cx="16" cy="55" r="4.5" fill="#10b981" opacity="0.75" />
              </g>
            )}

            {/* ========================================================
                2. MẪU VẬT: TRÙNG BIẾN HÌNH (Amoeba proteus)
               ======================================================== */}
            {specimen.id === 'spc-amoeba' && (
              <g>
                {/* Lớp ngoại chất trong suốt mỏng (Ectoplasm rim) */}
                <path
                  d="M -70 -60 C -120 -80 -140 -20 -95 10 C -150 45 -120 110 -60 100 C -20 135 45 125 70 85 C 130 95 155 40 120 -15 C 145 -70 95 -115 45 -85 C 10 -125 -45 -105 -70 -60 Z"
                  fill="url(#amoebaEctoGrad)"
                  stroke="#16a34a"
                  strokeWidth="2.8"
                  opacity="0.9"
                />

                {/* Lớp nội chất hạt đậm đặc (Endoplasm) */}
                <path
                  d="M -55 -45 C -95 -60 -110 -15 -75 8 C -115 35 -90 85 -48 78 C -15 105 35 98 55 68 C 100 75 120 30 95 -10 C 115 -50 75 -85 35 -65 C 8 -95 -35 -80 -55 -45 Z"
                  fill="#bbf7d0"
                  opacity="0.7"
                />

                {/* Hạt nội chất lơ lửng */}
                {Array.from({ length: 65 }).map((_, i) => {
                  const r = Math.sqrt((i * 137.5) % 4500);
                  const theta = i * 2.399;
                  const gx = Math.cos(theta) * r * 0.9;
                  const gy = Math.sin(theta) * r * 0.9;
                  return (
                    <circle
                      key={i}
                      cx={gx}
                      cy={gy}
                      r={(i % 3) * 0.6 + 0.9}
                      fill="#15803d"
                      opacity="0.35"
                    />
                  );
                })}

                {/* Nhân tế bào amip tròn có đĩa cromatin */}
                <ellipse
                  cx="12"
                  cy="14"
                  rx="18"
                  ry="16"
                  fill="#15803d"
                  stroke="#14532d"
                  strokeWidth="1.8"
                  opacity="0.88"
                />
                <circle cx="12" cy="14" r="7" fill="#86efac" opacity="0.65" />

                {/* Không bào co bóp */}
                <circle
                  cx="-38"
                  cy="-26"
                  r={12 + Math.sin(animTimeSec * 2.5) * 3}
                  fill="#ffffff"
                  stroke="#16a34a"
                  strokeWidth="1.8"
                />

                {/* Bọng thức ăn nuốt tảo cát / vi khuẩn */}
                <circle cx="48" cy="-30" r="8" fill="#eab308" opacity="0.8" />
                <circle cx="48" cy="-30" r="5" fill="#ca8a04" />
                <circle cx="-15" cy="55" r="7" fill="#0284c7" opacity="0.65" />
              </g>
            )}

            {/* ========================================================
                3. MẪU VẬT: TRÙNG ROI XANH (Euglena viridis)
               ======================================================== */}
            {specimen.id === 'spc-euglena' && (
              <g
                style={{
                  transform: `translate(${swimX}px, ${swimY}px) rotate(${swimRotate}deg)`,
                  transformOrigin: '0px 0px',
                }}
              >
                {/* Roi bơi (Flagellum) uốn lượn hình sin */}
                <path
                  d="M -75 -15 Q -105 -35 -125 -10 T -165 -25 T -200 5"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Thân hình thoi nhọn đuôi */}
                <path
                  d="M -75 -15 C -45 -45 25 -42 75 -5 C 95 12 110 22 135 32 C 90 28 45 35 -15 28 C -55 22 -75 0 -75 -15 Z"
                  fill="#86efac"
                  stroke="#16a34a"
                  strokeWidth="2.4"
                  opacity="0.9"
                />

                {/* Vết lõm mang roi ở đầu trước */}
                <ellipse cx="-70" cy="-12" rx="7" ry="5" fill="#bbf7d0" />

                {/* Điểm mắt đỏ nhạy sáng (Stigma) */}
                <circle cx="-62" cy="-18" r="4.2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />

                {/* Các hạt diệp lục hình đĩa màu xanh lục sáng */}
                {[-35, -15, 5, 25, 45, 65, 85].map((lx, idx) => (
                  <ellipse
                    key={lx}
                    cx={lx}
                    cy={idx % 2 === 0 ? -12 : 8}
                    rx="8.5"
                    ry="5.5"
                    fill="url(#chloroplastGrad)"
                    stroke="#14532d"
                    strokeWidth="0.8"
                  />
                ))}

                {/* Nhân tế bào hình cầu */}
                <ellipse
                  cx="18"
                  cy="-2"
                  rx="12"
                  ry="11"
                  fill="#15803d"
                  stroke="#14532d"
                  strokeWidth="1.5"
                  opacity="0.92"
                />
                <circle cx="18" cy="-2" r="4" fill="#86efac" opacity="0.75" />
              </g>
            )}

            {/* ========================================================
                4. MẪU VẬT: BIỂU BÌ VẢY HÀNH (Allium cepa)
               ======================================================== */}
            {specimen.id === 'spc-onion-epidermis' && (
              <g>
                {/* Lưới các tế bào hình hộp chữ nhật/lục giác xếp sít nhau */}
                {[-2, -1, 0, 1, 2].map((row) =>
                  [-1, 0, 1].map((col) => {
                    const cx = col * 180 + (row % 2 === 0 ? 0 : 90);
                    const cy = row * 65;
                    const w = 175;
                    const h = 60;
                    return (
                      <g key={`${row}-${col}`}>
                        {/* Lòng tế bào & dịch bào nhuộm Lugol vàng nhạt */}
                        <rect
                          x={cx - w / 2}
                          y={cy - h / 2}
                          width={w}
                          height={h}
                          rx="4"
                          fill="url(#onionLugolGrad)"
                          stroke="#b45309"
                          strokeWidth="2.5"
                        />

                        {/* Thành tế bào kép (cellulose wall) */}
                        <rect
                          x={cx - w / 2 + 3}
                          y={cy - h / 2 + 3}
                          width={w - 6}
                          height={h - 6}
                          rx="2"
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="1.0"
                          opacity="0.6"
                        />

                        {/* Không bào trung tâm lớn */}
                        <ellipse
                          cx={cx - 15}
                          cy={cy}
                          rx={w * 0.36}
                          ry={h * 0.35}
                          fill="#fef9c3"
                          opacity="0.55"
                        />

                        {/* Nhân tế bào hình cầu lệch sát thành tế bào (bắt màu Lugol nâu đậm) */}
                        <circle
                          cx={cx + 42}
                          cy={cy - 12}
                          r="10.5"
                          fill="#92400e"
                          stroke="#78350f"
                          strokeWidth="1.5"
                        />
                        <circle cx={cx + 43} cy={cy - 11} r="3.5" fill="#fde68a" />

                        {/* Dải tế bào chất nối quanh nhân */}
                        <path
                          d={`M ${cx + 30} ${cy - 8} Q ${cx} ${cy} ${cx - 40} ${cy - 14}`}
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="1.2"
                          opacity="0.45"
                        />
                      </g>
                    );
                  }),
                )}
              </g>
            )}

            {/* ========================================================
                5. MẪU VẬT: KHÍ KHỔNG VÀ LỤC LẠP LÁ CÂY (Stomata)
               ======================================================== */}
            {specimen.id === 'spc-leaf-stomata' && (
              <g>
                {/* Tế bào biểu bì phụ cận bao quanh hình lượn sóng */}
                <path
                  d="M -180 -140 Q -100 -180 0 -150 Q 120 -180 180 -130 Q 210 -40 180 50 Q 140 160 0 160 Q -120 180 -180 120 Q -210 20 -180 -140 Z"
                  fill="#ecfdf5"
                  stroke="#a7f3d0"
                  strokeWidth="3"
                />

                {/* Vách ngăn tế bào biểu bì nền */}
                <line x1="-180" y1="-20" x2="-65" y2="-10" stroke="#6ee7b7" strokeWidth="2.2" />
                <line x1="65" y1="10" x2="180" y2="20" stroke="#6ee7b7" strokeWidth="2.2" />
                <line x1="-30" y1="-150" x2="-20" y2="-75" stroke="#6ee7b7" strokeWidth="2.2" />
                <line x1="20" y1="75" x2="30" y2="160" stroke="#6ee7b7" strokeWidth="2.2" />

                {/* Cụm khí khổng trung tâm: 2 tế bào bảo vệ hình hạt đậu */}
                {/* Tế bào bảo vệ bên Trái */}
                <path
                  d="M 0 -68 C -45 -65 -65 -30 -65 0 C -65 30 -45 65 0 68 C -22 45 -22 -45 0 -68 Z"
                  fill="#bbf7d0"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                />
                {/* Mép vách trong dày cộp màu xanh đậm */}
                <path
                  d="M 0 -68 C -22 -45 -22 45 0 68"
                  fill="none"
                  stroke="#14532d"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />

                {/* Tế bào bảo vệ bên Phải */}
                <path
                  d="M 0 -68 C 45 -65 65 -30 65 0 C 65 30 45 65 0 68 C 22 45 22 -45 0 -68 Z"
                  fill="#bbf7d0"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                />
                <path
                  d="M 0 -68 C 22 -45 22 45 0 68"
                  fill="none"
                  stroke="#14532d"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />

                {/* Lỗ khí khổng hình thoi (Stoma pore) xuyên thấu */}
                <ellipse cx="0" cy="0" rx="9" ry="24" fill="#042f2e" opacity="0.88" />

                {/* Các hạt lục lạp xanh lục dày đặc trong 2 tế bào bảo vệ */}
                {/* Hạt lục lạp tế bào trái */}
                {[
                  [-34, -40],
                  [-44, -22],
                  [-48, 0],
                  [-42, 24],
                  [-32, 42],
                  [-28, -12],
                  [-28, 14],
                ].map(([lx, ly], idx) => (
                  <ellipse
                    key={`l-${idx}`}
                    cx={lx}
                    cy={ly}
                    rx="6.5"
                    ry="5"
                    fill="url(#chloroplastGrad)"
                    stroke="#14532d"
                    strokeWidth="0.8"
                  />
                ))}

                {/* Hạt lục lạp tế bào phải */}
                {[
                  [34, -40],
                  [44, -22],
                  [48, 0],
                  [42, 24],
                  [32, 42],
                  [28, -12],
                  [28, 14],
                ].map(([rx, ry], idx) => (
                  <ellipse
                    key={`r-${idx}`}
                    cx={rx}
                    cy={ry}
                    rx="6.5"
                    ry="5"
                    fill="url(#chloroplastGrad)"
                    stroke="#14532d"
                    strokeWidth="0.8"
                  />
                ))}

                {/* Nhân của 2 tế bào bảo vệ */}
                <circle cx="-38" cy="2" r="7.5" fill="#15803d" opacity="0.9" />
                <circle cx="38" cy="-2" r="7.5" fill="#15803d" opacity="0.9" />
              </g>
            )}

            {/* ========================================================
                6. MẪU VẬT: TẾ BÀO NIÊM MẠC MIỆNG (Cheek Epithelium)
               ======================================================== */}
            {specimen.id === 'spc-cheek-epithelium' && (
              <g>
                {/* Cụm 3 tế bào dẹt xếp gối lên nhau */}
                {/* Tế bào nền 1 */}
                <path
                  d="M -110 -80 C -40 -115 65 -90 100 -50 C 130 -10 120 70 85 105 C 40 140 -60 125 -105 85 C -145 40 -135 -35 -110 -80 Z"
                  fill="url(#cheekCellGrad)"
                  stroke="#3b82f6"
                  strokeWidth="2.4"
                  opacity="0.85"
                />

                {/* Nếp gấp màng tế bào uốn lượn mỏng */}
                <path
                  d="M -75 -45 Q -20 -70 45 -45 Q 85 -20 60 40"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="1.2"
                  opacity="0.55"
                />

                {/* Hạt nội chất mịn */}
                {Array.from({ length: 48 }).map((_, i) => {
                  const gx = ((i * 31) % 180) - 90;
                  const gy = ((i * 47) % 170) - 85;
                  return (
                    <circle
                      key={i}
                      cx={gx}
                      cy={gy}
                      r={(i % 2) * 0.6 + 0.8}
                      fill="#1e40af"
                      opacity="0.3"
                    />
                  );
                })}

                {/* Nhân tế bào chính giữa bắt màu Xanh Metylen rực rỡ */}
                <circle
                  cx="5"
                  cy="6"
                  r="16"
                  fill="#1e3a8a"
                  stroke="#172554"
                  strokeWidth="2.2"
                />
                <circle cx="3" cy="4" r="12" fill="#1d4ed8" opacity="0.85" />
                <circle cx="8" cy="8" r="4.5" fill="#93c5fd" />

                {/* Tế bào phụ kế bên */}
                <path
                  d="M 90 40 C 130 15 180 35 195 70 C 210 110 180 150 145 165 C 105 175 75 140 70 100 C 65 70 75 50 90 40 Z"
                  fill="url(#cheekCellGrad)"
                  stroke="#60a5fa"
                  strokeWidth="1.8"
                  opacity="0.65"
                />
                <circle cx="135" cy="105" r="11" fill="#1e3a8a" opacity="0.8" />
              </g>
            )}

            {/* ========================================================
                7. MẪU VẬT: TẢO XOẮN (Spirogyra crassa)
               ======================================================== */}
            {specimen.id === 'spc-spirogyra' && (
              <g>
                {/* Ống sợi tế bào hình trụ nằm ngang qua trường nhìn */}
                {[-1, 0, 1].map((segIdx) => {
                  const sx = segIdx * 200;
                  const sw = 195;
                  const sh = 100;
                  return (
                    <g key={segIdx}>
                      {/* Thân tế bào hình ống */}
                      <rect
                        x={sx - sw / 2}
                        y={-sh / 2}
                        width={sw}
                        height={sh}
                        fill="#f0fdf4"
                        stroke="#16a34a"
                        strokeWidth="3.2"
                      />

                      {/* Vách ngăn ngang (Septum) */}
                      <line
                        x1={sx + sw / 2}
                        y1={-sh / 2}
                        x2={sx + sw / 2}
                        y2={sh / 2}
                        stroke="#15803d"
                        strokeWidth="3.6"
                      />

                      {/* Dải lục lạp hình dải băng xoắn ốc uốn lượn hình sin */}
                      <path
                        d={`M ${sx - sw / 2} ${-35} Q ${sx - 50} 45 ${sx} ${-35} Q ${sx + 50} 45 ${sx + sw / 2} ${-35}`}
                        fill="none"
                        stroke="url(#chloroplastGrad)"
                        strokeWidth="15"
                        strokeLinecap="round"
                        opacity="0.9"
                      />

                      {/* Các hạt tạo tinh bột (Pyrenoids) đính dọc dải xoắn */}
                      {[-70, -35, 0, 35, 70].map((px, pIdx) => {
                        const py = Math.sin((pIdx * Math.PI) / 2) * 35;
                        return (
                          <g key={px}>
                            <circle
                              cx={sx + px}
                              cy={py}
                              r="5.5"
                              fill="#ffffff"
                              stroke="#15803d"
                              strokeWidth="1.4"
                            />
                            <circle cx={sx + px} cy={py} r="2.8" fill="#ca8a04" />
                          </g>
                        );
                      })}

                      {/* Nhân tế bào treo lơ lửng ở trung tâm */}
                      <ellipse
                        cx={sx}
                        cy="0"
                        rx="13"
                        ry="11"
                        fill="#15803d"
                        stroke="#14532d"
                        strokeWidth="1.6"
                        opacity="0.92"
                      />
                      <circle cx={sx} cy="0" r="4.2" fill="#86efac" />

                      {/* Sợi chất nguyên sinh neo giữ nhân */}
                      <line
                        x1={sx}
                        y1="-11"
                        x2={sx - 20}
                        y2="-50"
                        stroke="#86efac"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                      <line
                        x1={sx}
                        y1="11"
                        x2={sx + 20}
                        y2="50"
                        stroke="#86efac"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* ========================================================
                8. MẪU VẬT: TRỰC KHUẨN LACTOBACILLUS (Vi khuẩn lên men)
               ======================================================== */}
            {specimen.id === 'spc-lactobacillus' && (
              <g>
                {/* Lưu ý khoa học: Ở vật kính 4x vi khuẩn quá nhỏ nên chỉ thấy mờ ảo */}
                {objectiveMag === 4 ? (
                  <ellipse cx="0" cy="0" rx="160" ry="120" fill="#7c3aed" opacity="0.08" />
                ) : (
                  <>
                    {/* Bụi vi khuẩn nền */}
                    {Array.from({ length: 85 }).map((_, i) => {
                      const ang = (i * 2.4) % (Math.PI * 2);
                      const dist = ((i * 29) % 180) + 15;
                      const bx = Math.cos(ang) * dist;
                      const by = Math.sin(ang) * dist;
                      const rot = (i * 47) % 180;
                      const isDouble = i % 4 === 0;

                      return (
                        <g
                          key={i}
                          transform={`translate(${bx}, ${by}) rotate(${rot})`}
                        >
                          {/* Trực khuẩn que ngắn (Bacillus) */}
                          <rect
                            x="-6"
                            y="-2.5"
                            width="12"
                            height="5"
                            rx="2.5"
                            fill="#6d28d9"
                            stroke="#4c1d95"
                            strokeWidth="0.8"
                          />
                          {isDouble && (
                            <rect
                              x="7"
                              y="-2.5"
                              width="12"
                              height="5"
                              rx="2.5"
                              fill="#7c3aed"
                              stroke="#4c1d95"
                              strokeWidth="0.8"
                            />
                          )}
                        </g>
                      );
                    })}

                    {/* Cụm chuỗi vi khuẩn ở trung tâm tiêu điểm */}
                    <g transform="translate(0, 0)">
                      {[-24, -12, 0, 12, 24].map((chainX, idx) => (
                        <rect
                          key={chainX}
                          x={chainX - 5}
                          y={Math.sin(idx * 0.8) * 8 - 3}
                          width="11"
                          height="6"
                          rx="3"
                          fill="#5b21b6"
                          stroke="#312e81"
                          strokeWidth="1.2"
                        />
                      ))}
                    </g>
                  </>
                )}
              </g>
            )}
          </g>

          {/* ========================================================
              CHÚ THÍCH CẤU TRÚC TẾ BÀO (Structure Annotations)
              Chỉ hiển thị khi hình ảnh trong vùng nét (|deltaZ| <= 0.15 mm)
             ======================================================== */}
          {showAnnotations && absDeltaZ <= 0.15 && (
            <g
              style={{
                transform: `scale(${baseScale})`,
                transformOrigin: '0px 0px',
              }}
            >
              {specimen.annotations.map((ann) => {
                // Chỉ hiển thị chú thích khi độ phóng đại đạt mức tối thiểu
                if (objectiveMag < ann.minObjective) return null;

                // Tọa độ tính theo pixel hệ tọa độ SVG (-250 đến 250)
                const pinX = (ann.xPercent / 50) * 120 + swimX;
                const pinY = (ann.yPercent / 50) * 120 + swimY;
                const isActive = ann.id === activeAnnotationId;

                return (
                  <g
                    key={ann.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => onSelectAnnotation?.(ann)}
                  >
                    {/* Đường chỉ dẫn từ nhãn đến cấu trúc */}
                    <circle
                      cx={pinX}
                      cy={pinY}
                      r={isActive ? 6 : 4}
                      fill={isActive ? '#38bdf8' : '#ef4444'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="animate-pulse"
                    />

                    {/* Hộp nhãn tên cấu trúc */}
                    <g transform={`translate(${pinX + 8}, ${pinY - 14})`}>
                      <rect
                        x="0"
                        y="0"
                        width={ann.nameVi.length * 7.2 + 14}
                        height="20"
                        rx="4"
                        fill={isActive ? '#0284c7' : 'rgba(15, 23, 42, 0.85)'}
                        stroke={isActive ? '#7dd3fc' : '#94a3b8'}
                        strokeWidth="1.2"
                      />
                      <text
                        x="7"
                        y="14"
                        fill="#ffffff"
                        fontSize="10"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                      >
                        {ann.nameVi}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
