import React, { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  Flame,
  Zap,
  Eye,
  Sliders,
  RotateCcw,
  X,
  Info,
  Sparkles
} from 'lucide-react';
import { MathFormula } from '../common/MathFormula';

interface MicroMacroLensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LensMode = 'water_boiling' | 'joule_lenz' | 'photon_refraction';

export const MicroMacroLensModal: React.FC<MicroMacroLensModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<LensMode>('water_boiling');
  const [temperatureC, setTemperatureC] = useState<number>(25);
  const [currentA, setCurrentA] = useState<number>(0.5);
  const [refractiveIndex, setRefractiveIndex] = useState<number>(1.50);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = 360);

    // Dữ liệu mô phỏng hạt phân tử
    const molecules: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      state: 'liquid' | 'vapor';
    }> = [];

    // Tạo 40 phân tử nước
    for (let i = 0; i < 45; i++) {
      molecules.push({
        x: 60 + Math.random() * (width - 120),
        y: height - 50 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 10,
        state: 'liquid',
      });
    }

    // Dữ liệu electron cho chế độ Joule-Lenz
    const electrons: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    for (let i = 0; i < 60; i++) {
      electrons.push({
        x: Math.random() * width,
        y: 60 + Math.random() * (height - 120),
        vx: 1.0,
        vy: (Math.random() - 0.5) * 0.8,
      });
    }

    let photonPhase = 0;

    const renderLoop = () => {
      ctx.fillStyle = '#060d17';
      ctx.fillRect(0, 0, width, height);

      if (mode === 'water_boiling') {
        // --- CHẾ ĐỘ 1: PHÂN TỬ NƯỚC SÔI & BẺ GÃY LIÊN KẾT HYDRO ---
        const isBoiling = temperatureC >= 100;
        const speedScale = 0.5 + (temperatureC / 100) * 3.5;

        // Vẽ đáy cốc đun nhiệt
        const heatColor = temperatureC > 60 ? `rgba(255, 100, 20, ${(temperatureC - 50) / 100})` : 'rgba(100, 150, 200, 0.2)';
        ctx.fillStyle = heatColor;
        ctx.fillRect(40, height - 20, width - 80, 8);

        // Vẽ vùng nước lỏng
        ctx.fillStyle = 'rgba(20, 80, 160, 0.15)';
        ctx.fillRect(40, 140, width - 80, height - 160);

        // Vẽ đường thoáng mặt nước
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 140);
        ctx.lineTo(width - 40, 140);
        ctx.stroke();

        // Vẽ các liên kết Hydro (Hydrogen bonds) nếu dưới 100 độ C
        if (!isBoiling) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.setLineDash([3, 4]);
          for (let i = 0; i < molecules.length; i++) {
            for (let j = i + 1; j < molecules.length; j++) {
              const dx = molecules[i].x - molecules[j].x;
              const dy = molecules[i].y - molecules[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 45 && molecules[i].state === 'liquid' && molecules[j].state === 'liquid') {
                ctx.beginPath();
                ctx.moveTo(molecules[i].x, molecules[i].y);
                ctx.lineTo(molecules[j].x, molecules[j].y);
                ctx.stroke();
              }
            }
          }
          ctx.setLineDash([]);
        }

        // Cập nhật và vẽ các phân tử H2O (Gồm 1 Oxygen đỏ và 2 Hydrogen trắng)
        for (const m of molecules) {
          m.x += m.vx * speedScale;
          m.y += m.vy * speedScale;

          // Nếu sôi thì bứt phá thành hơi nước (vapor) bay lên không gian phía trên
          if (isBoiling && m.y < 140) {
            m.state = 'vapor';
            m.vy -= 0.15; // Lực nổi khí bay lên
          }

          // Phản xạ biên
          if (m.x < 50 || m.x > width - 50) m.vx *= -1;
          if (m.y > height - 30) {
            m.y = height - 30;
            m.vy *= -1;
          }
          if (m.y < 30) {
            // Hơi bay ra ngoài hồi lưu về đáy
            m.y = height - 40;
            m.x = 60 + Math.random() * (width - 120);
            m.state = 'liquid';
            m.vy = (Math.random() - 0.5) * 1.5;
          }

          // Vẽ nguyên tử Oxy (Red)
          ctx.fillStyle = m.state === 'vapor' ? '#f43f5e' : '#ef4444';
          ctx.beginPath();
          ctx.arc(m.x, m.y, 7, 0, Math.PI * 2);
          ctx.fill();

          // Vẽ 2 nguyên tử Hydro (White)
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.arc(m.x - 7, m.y - 6, 4, 0, Math.PI * 2);
          ctx.arc(m.x + 7, m.y - 6, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Nhãn chú thích
        ctx.fillStyle = isBoiling ? '#38bdf8' : '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText(
          isBoiling
            ? 'T >= 100°C: Động năng nhiệt thắng thế -> Bẻ gãy liên kết Hydro -> Hơi nước bay lên!'
            : 'T < 100°C: Liên kết Hydro (nét đứt) giữ các phân tử nước ở thể lỏng',
          50,
          30
        );

      } else if (mode === 'joule_lenz') {
        // --- CHẾ ĐỘ 2: ELECTRON VA CHẠM NÚT MẠNG ION SINH NHIỆT JOULE-LENZ ---
        const driftSpeed = currentA * 3.5;
        const latticeTemp = 1.0 + currentA * 4.0;

        // Vẽ dây dẫn kim loại (vỏ ống)
        ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
        ctx.fillRect(40, 50, width - 80, height - 100);
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
        ctx.strokeRect(40, 50, width - 80, height - 100);

        // Vẽ các nút mạng ion kim loại đồng (Cu²⁺) dao động nhiệt
        const cols = 9;
        const rows = 4;
        const stepX = (width - 140) / (cols - 1);
        const stepY = (height - 180) / (rows - 1);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const baseX = 70 + c * stepX;
            const baseY = 80 + r * stepY;
            // Dao động nhiệt xung quanh vị trí cân bằng
            const jiggleX = (Math.random() - 0.5) * latticeTemp;
            const jiggleY = (Math.random() - 0.5) * latticeTemp;

            // Màu ion chuyển từ vàng sang cam đỏ rực khi dòng điện lớn
            const redAmount = Math.min(255, Math.floor(100 + currentA * 50));
            ctx.fillStyle = `rgb(${redAmount}, 160, 40)`;
            ctx.beginPath();
            ctx.arc(baseX + jiggleX, baseY + jiggleY, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = '9px sans-serif';
            ctx.fillText('Cu(2+)', baseX + jiggleX - 12, baseY + jiggleY + 3);
          }
        }

        // Cập nhật và vẽ các electron tự do (e⁻) trôi dạt sang phải dưới điện trường
        for (const e of electrons) {
          e.x += driftSpeed + (Math.random() - 0.5) * 1.2;
          e.y += (Math.random() - 0.5) * 1.5;

          if (e.x > width - 50) e.x = 50;
          if (e.y < 60) e.y = 65;
          if (e.y > height - 60) e.y = height - 65;

          // Vẽ electron phát quang xanh
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#38bdf8';
        ctx.font = '12px sans-serif';
        ctx.fillText(
          `Dòng I = ${currentA.toFixed(2)} A | Electron va chạm mạng ion kim loại đồng làm sinh nhiệt!`,
          50,
          30
        );

      } else if (mode === 'photon_refraction') {
        // --- CHẾ ĐỘ 3: QUANG HỌC LƯỢNG TỬ (PHOTON CHẬM PHA QUA THỦY TINH) ---
        photonPhase += 0.06;

        // Vùng không khí (bên trái, n=1.0) & Vùng thủy tinh (bên phải, n=refractiveIndex)
        const midX = width / 2;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.fillRect(40, 50, midX - 40, height - 100);

        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fillRect(midX, 50, width - midX - 40, height - 100);

        // Pháp tuyến mặt phân cách
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(midX, 40);
        ctx.lineTo(midX, height - 40);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vẽ các photon ánh sáng tới theo góc i = 45 độ
        const angleI = (45 * Math.PI) / 180;
        // sin(i) / sin(r) = n -> sin(r) = sin(i) / n
        const angleR = Math.asin(Math.sin(angleI) / refractiveIndex);

        // Vận tốc pha: v = c / n
        const vAir = 3.0;
        const vGlass = vAir / refractiveIndex;

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(80, 90);
        ctx.lineTo(midX, height / 2);
        ctx.lineTo(midX + Math.cos(angleR) * 160, height / 2 + Math.sin(angleR) * 160);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Không khí (n1 = 1.00, v = c)`, 80, 75);
        ctx.fillText(`Thủy tinh Borosilicate (n2 = ${refractiveIndex.toFixed(2)}, v = c / ${refractiveIndex.toFixed(2)})`, midX + 30, 75);
        ctx.fillText(`Định luật Snell: Photon bị giảm tốc độ pha khi đi vào môi trường chiết suất cao!`, 50, height - 15);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isOpen, mode, temperatureC, currentA, refractiveIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/60 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <ZoomIn className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Lăng Kính Đa Thang Đo Vi Mô</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                  Micro-Macro Quantum Lens
                </span>
              </div>
              <h2 className="text-base font-semibold text-slate-100">
                Xuyên Thấu Cấu Trúc Hạt & Giải Mã Bản Chất Khoa Học
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-3 gap-2">
          <button
            onClick={() => setMode('water_boiling')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              mode === 'water_boiling'
                ? 'bg-slate-800/90 text-cyan-300 border-t-2 border-cyan-400 border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Nhiệt Động Nước Sôi & Khí Hóa (100°C)</span>
          </button>
          <button
            onClick={() => setMode('joule_lenz')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              mode === 'joule_lenz'
                ? 'bg-slate-800/90 text-cyan-300 border-t-2 border-cyan-400 border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="flex items-center gap-1.5">
              <span>Electron & Nhiệt Joule - Lenz (</span>
              <MathFormula math="Q = I^2 R t" />
              <span>)</span>
            </span>
          </button>
          <button
            onClick={() => setMode('photon_refraction')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              mode === 'photon_refraction'
                ? 'bg-slate-800/90 text-cyan-300 border-t-2 border-cyan-400 border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="flex items-center gap-1.5">
              <span>Photon Giảm Tốc Pha Snell (</span>
              <MathFormula math="v = \frac{c}{n}" />
              <span>)</span>
            </span>
          </button>
        </div>

        {/* Main Canvas Simulation Viewport */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner">
            <canvas ref={canvasRef} className="w-full block" />
          </div>

          {/* Live KaTeX Law Display Banner */}
          <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between gap-3 flex-wrap text-xs">
            <span className="font-bold text-cyan-300 uppercase tracking-wider">Phương trình vật lý đang mô phỏng:</span>
            <div className="text-amber-200 font-semibold">
              {mode === 'water_boiling' && (
                <MathFormula math={`E_k = \\frac{3}{2} k_B T \\quad | \\quad T = ${temperatureC}^\\circ\\text{C} \\; ${temperatureC >= 100 ? '\\ge 100^\\circ\\text{C (Bẻ gãy liên kết H)}' : '< 100^\\circ\\text{C (Lỏng)}'}`} />
              )}
              {mode === 'joule_lenz' && (
                <MathFormula math={`Q = I^2 R t \\quad | \\quad I = ${currentA.toFixed(2)}\\,\\text{A}`} />
              )}
              {mode === 'photon_refraction' && (
                <MathFormula math={`n_1 \\sin i = n_2 \\sin r, \\quad v = \\frac{c}{n_2} \\quad (n_2 = ${refractiveIndex.toFixed(2)})`} />
              )}
            </div>
          </div>

          {/* Sliders & Interactive Controls */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {mode === 'water_boiling' && (
              <div className="space-y-1.5 col-span-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Nhiệt độ mẫu nước (T):</span>
                  <span className="text-cyan-400 font-mono text-sm">{temperatureC}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="125"
                  step="1"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>20°C (Phòng)</span>
                  <span className="text-amber-400 font-bold">100°C (Ngưỡng Sôi)</span>
                  <span>125°C (Hơi quá nhiệt)</span>
                </div>
              </div>
            )}

            {mode === 'joule_lenz' && (
              <div className="space-y-1.5 col-span-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Cường độ dòng điện (I):</span>
                  <span className="text-amber-400 font-mono text-sm">{currentA.toFixed(2)} A</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.05"
                  value={currentA}
                  onChange={(e) => setCurrentA(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.1A (Dòng nhẹ)</span>
                  <span>1.0A (Đèn halogen)</span>
                  <span className="text-rose-400 font-bold">3.0A (Quá nhiệt)</span>
                </div>
              </div>
            )}

            {mode === 'photon_refraction' && (
              <div className="space-y-1.5 col-span-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300 flex items-center gap-1">
                    <span>Chiết suất môi trường (</span>
                    <MathFormula math="n_2" />
                    <span>):</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-sm">{refractiveIndex.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.42"
                  step="0.01"
                  value={refractiveIndex}
                  onChange={(e) => setRefractiveIndex(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1.00 (Không khí)</span>
                  <span className="text-cyan-400 font-bold">1.474 (Thủy tinh Borosilicate)</span>
                  <span>2.42 (Kim cương)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Mô hình hạt phân tử vi mô giúp học sinh thấu hiểu cơ chế vật lý đằng sau phương trình vĩ mô.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Quay lại phòng thí nghiệm
          </button>
        </div>
      </div>
    </div>
  );
};
