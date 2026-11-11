/**
 * OPENLAB 3D — REALISTIC PHYSICAL PHENOMENON & INTERACTION SOUND ENGINE (Web Audio API)
 * Mô phỏng âm thanh vật lý chân thực theo đúng từng động tác, chức năng và hiện tượng thí nghiệm KHTN 9
 * (Không phụ thuộc file âm thanh rời bên ngoài, hoạt động tức thì 100% trên mọi trình duyệt
 * và hỗ trợ xuất luồng Audio trực tiếp vào Video Ghi Hình Thực Hành 3D):
 *
 * 1. Hiện tượng & Thao tác Dụng cụ Thí nghiệm:
 *  - 'water-pour': Tiếng mở van xả nước / rót nước róc rách có tần số cộng hưởng tăng theo mực nước dâng
 *  - 'water-splash': Tiếng thả vật rắn chạm mặt nước ("tõm" + bọt khí)
 *  - 'water-overflow': Tiếng thả vật vào Bình tràn + tiếng tia nước chảy qua vòi tràn sang cốc hứng
 *  - 'scale-place': Tiếng đặt vật lên đĩa cân Inox + tiếng "Bíp" (2750 Hz) khi cân điện tử khóa số đo
 *  - 'scale-tare': Tiếng "Bíp-Bíp" kép khi bấm nút TARE về 0.00 g
 *  - 'glass-clink': Tiếng chạm lanh canh của dụng cụ thủy tinh Borosilicate
 *  - 'wood-place': Tiếng đặt dụng cụ trầm ấm lên mặt bàn gỗ thí nghiệm
 *  - 'grab-pickup': Tiếng nhấc/cầm dụng cụ khỏi mặt bàn hoặc kéo từ kho thiết bị
 *  - 'dock-hover-snap': Tiếng khớp từ tính nhẹ khi rê vật vào đúng vùng thả hợp lệ (đĩa cân, miệng ống đong, móc lực kế)
 *  - 'rotate-object': Tiếng xoay dụng cụ 90° hoặc xoay trên bàn
 *  - 'caliper-slide': Tiếng trượt hàm thép Thước cặp Vernier kẹp đo mẫu vật
 *  - 'funnel-valve': Tiếng vặn khóa PTFE Phễu chiết / Van định lượng và dòng chất lỏng tách lớp
 *  - 'mechanical-click': Tiếng "tách" cơ khí khi xoay mâm vật kính Kính hiển vi (10x/40x/100x) hoặc chuyển thang đo
 *  - 'spring-stretch': Tiếng giãn lò xo thép khi móc quả nặng vào Lực kế lò xo
 *  - 'burner-ignite': Tiếng bùng ngọn lửa đèn cồn và tiếng sôi lăn tăn khi đun nóng
 *  - 'burner-extinguish': Tiếng đậy nắp chụp thủy tinh dập tắt đèn cồn
 *  - 'laser-switch': Tiếng bật công tắc nguồn tia Laser / Đèn quang học
 *  - 'optics-angle': Tiếng xoay bàn chia độ khúc xạ ánh sáng (kèm âm báo khi đạt phản xạ toàn phần)
 *  - 'electric-induction': Âm xung cảm ứng điện từ khi đưa nam châm lại gần / ra xa cuộn dây
 *  - 'probe-measure': Tiếng nhúng đầu dò điện cực vào dung dịch + tiếng bíp máy đo pH/nhiệt độ
 *
 * 2. Động tác Chức năng & Điều khiển Khung nhìn 3D:
 *  - 'camera-shutter': Tiếng màn trập máy ảnh khi chụp ảnh bàn thí nghiệm (.png) hoặc lưu mốc bước thực hành
 *  - 'record-start': Tiếng khởi động ghi hình thực hành 3D
 *  - 'record-stop': Hợp âm hoàn tất ghi hình / xuất Video Tóm Tắt
 *  - 'step-complete': Âm báo chuyển bước hướng dẫn thực hành / đổi bài thí nghiệm
 *  - 'camera-zoom': Tiếng dịch chuyển góc nhìn camera / phóng to / thu nhỏ / nhìn từ trên
 *  - 'ui-toggle': Tiếng bật/tắt Lưới mặt bàn, Lưới không gian, Trục O-XYZ, Nhãn, Kích thước
 */

export type LabSoundPhenomenonType =
  | 'water-pour'
  | 'water-drip'
  | 'water-splash'
  | 'water-overflow'
  | 'scale-place'
  | 'scale-tare'
  | 'glass-clink'
  | 'wood-place'
  | 'grab-pickup'
  | 'dock-hover-snap'
  | 'rotate-object'
  | 'caliper-slide'
  | 'funnel-valve'
  | 'mechanical-click'
  | 'spring-stretch'
  | 'burner-ignite'
  | 'burner-extinguish'
  | 'water-simmer'
  | 'water-boil-rumble'
  | 'laser-switch'
  | 'optics-angle'
  | 'electric-induction'
  | 'probe-measure'
  | 'camera-shutter'
  | 'record-start'
  | 'record-stop'
  | 'step-complete'
  | 'camera-zoom'
  | 'ui-toggle';

export interface LabSoundPlayOptions {
  intensity?: number;
  value?: number;
  fillRatio?: number;
}

class LabSoundEngineImpl {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private streamDest: MediaStreamAudioDestinationNode | null = null;
  private muted = false;
  private listeners = new Set<(muted: boolean) => void>();
  private lastHoverSnapMs = 0;

  private ensureAudioGraph(): {
    ctx: AudioContext;
    out: AudioNode;
  } | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (!this.ctx) return null;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);
      try {
        if (typeof this.ctx.createMediaStreamDestination === 'function') {
          this.streamDest = this.ctx.createMediaStreamDestination();
          this.masterGain.connect(this.streamDest);
        }
      } catch {
        // Ignore if MediaStreamDestination is not supported
      }
    }
    return { ctx: this.ctx, out: this.masterGain };
  }

  /**
   * Trả về AudioTrack của Web Audio API để ghép trực tiếp vào MediaRecorder khi ghi hình 3D
   */
  getRecordingAudioTracks(): MediaStreamTrack[] {
    const graph = this.ensureAudioGraph();
    if (!graph || !this.streamDest) return [];
    return this.streamDest.stream.getAudioTracks();
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(nextMuted: boolean): void {
    this.muted = nextMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        nextMuted ? 0 : 1,
        this.ctx.currentTime,
      );
    }
    this.listeners.forEach((fn) => fn(this.muted));
  }

  toggleMute(): boolean {
    this.setMuted(!this.muted);
    if (!this.muted) {
      this.play('scale-tare');
    }
    return this.muted;
  }

  subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Phát âm thanh thực tế tương ứng với động tác, chức năng hoặc hiện tượng thí nghiệm
   * @param phenomenon Loại hiện tượng hoặc động tác tương tác
   * @param optionsOrRatio Hệ số cường độ (0.0 -> 1.0) hoặc object tùy chọn { intensity, value }
   */
  play(
    phenomenon: LabSoundPhenomenonType,
    optionsOrRatio: number | LabSoundPlayOptions = 0.5,
  ): void {
    const graph = this.ensureAudioGraph();
    if (!graph) return;
    const { ctx, out } = graph;
    const now = ctx.currentTime;

    const rawRatio =
      typeof optionsOrRatio === 'number'
        ? optionsOrRatio
        : (optionsOrRatio.intensity ??
          (optionsOrRatio.value !== undefined
            ? optionsOrRatio.value / 100
            : 0.5));
    const ratio = Math.max(0, Math.min(1, rawRatio));

    try {
      switch (phenomenon) {
        case 'water-pour': {
          // Tiếng nước chảy vào bình thủy tinh: tạp âm trắng lọc dải thông quét tần số tăng dần theo mực nước + giọt nước cộng hưởng
          const duration = 0.72;
          const bufferSize = Math.floor(ctx.sampleRate * duration);
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] =
              (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
          }

          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const bandpass = ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          const startFreq = 420 + ratio * 260;
          const endFreq = startFreq + 340;
          bandpass.frequency.setValueAtTime(startFreq, now);
          bandpass.frequency.exponentialRampToValueAtTime(
            endFreq,
            now + duration,
          );
          bandpass.Q.value = 4.5;

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.01, now);
          gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.008, now + duration);

          noise.connect(bandpass);
          bandpass.connect(gain);
          gain.connect(out);
          noise.start(now);
          noise.stop(now + duration);

          // 3 tiếng bọt nước róc rách (water droplets)
          [0.12, 0.31, 0.52].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const dGain = ctx.createGain();
            osc.type = 'sine';
            const baseF = 580 + idx * 140 + ratio * 220;
            osc.frequency.setValueAtTime(baseF, now + offset);
            osc.frequency.exponentialRampToValueAtTime(
              baseF * 1.65,
              now + offset + 0.09,
            );
            dGain.gain.setValueAtTime(0.085, now + offset);
            dGain.gain.exponentialRampToValueAtTime(
              0.001,
              now + offset + 0.095,
            );
            osc.connect(dGain);
            dGain.connect(out);
            osc.start(now + offset);
            osc.stop(now + offset + 0.1);
          });
          break;
        }

        case 'water-drip': {
          // Tiếng giọt nước tí tách nhỏ giọt "tong tong" thanh mảnh dưới trọng lực
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const baseFreq = 1620 + Math.random() * 260;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.52, now + 0.042);
          gain.gain.setValueAtTime(0.14 * (ratio || 0.8), now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'water-splash':
        case 'water-overflow': {
          // Tiếng "Tõm" khi thả vật rắn chìm vào nước (Low impact + Rising bubble plop)
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(195, now);
          osc1.frequency.exponentialRampToValueAtTime(92, now + 0.11);
          gain1.gain.setValueAtTime(0.28, now);
          gain1.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
          osc1.connect(gain1);
          gain1.connect(out);
          osc1.start(now);
          osc1.stop(now + 0.13);

          // Tiếng bọt nước nổi lên "blup"
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(360, now + 0.06);
          osc2.frequency.exponentialRampToValueAtTime(940, now + 0.21);
          gain2.gain.setValueAtTime(0.18, now + 0.06);
          gain2.gain.exponentialRampToValueAtTime(0.004, now + 0.22);
          osc2.connect(gain2);
          gain2.connect(out);
          osc2.start(now + 0.06);
          osc2.stop(now + 0.23);

          // Nếu là Bình tràn (water-overflow), thêm tiếng tia nước chảy qua vòi tràn sang cốc hứng
          if (phenomenon === 'water-overflow') {
            setTimeout(() => this.play('water-pour', 0.65), 140);
          }
          break;
        }

        case 'scale-place': {
          // 1. Tiếng đặt vật tiếp xúc mặt đĩa cân Inox
          const thudOsc = ctx.createOscillator();
          const thudGain = ctx.createGain();
          thudOsc.type = 'triangle';
          thudOsc.frequency.setValueAtTime(240, now);
          thudOsc.frequency.exponentialRampToValueAtTime(85, now + 0.065);
          thudGain.gain.setValueAtTime(0.2, now);
          thudGain.gain.exponentialRampToValueAtTime(0.005, now + 0.07);
          thudOsc.connect(thudGain);
          thudGain.connect(out);
          thudOsc.start(now);
          thudOsc.stop(now + 0.075);

          // 2. Tiếng "Bíp" chuẩn của Cân điện tử kỹ thuật số sau khi ổn định khối lượng (2750 Hz)
          const beepOsc = ctx.createOscillator();
          const beepGain = ctx.createGain();
          beepOsc.type = 'sine';
          beepOsc.frequency.setValueAtTime(2750, now + 0.11);
          beepGain.gain.setValueAtTime(0.13, now + 0.11);
          beepGain.gain.exponentialRampToValueAtTime(0.002, now + 0.23);
          beepOsc.connect(beepGain);
          beepGain.connect(out);
          beepOsc.start(now + 0.11);
          beepOsc.stop(now + 0.24);
          break;
        }

        case 'scale-tare': {
          // Tiếng "Bíp-Bíp" kép khi bấm nút TARE về 0.00 g
          [0, 0.095].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(
              idx === 0 ? 2400 : 3100,
              now + offset,
            );
            gain.gain.setValueAtTime(0.11, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.003, now + offset + 0.075);
            osc.connect(gain);
            gain.connect(out);
            osc.start(now + offset);
            osc.stop(now + offset + 0.08);
          });
          break;
        }

        case 'glass-clink': {
          // Tiếng chạm thanh mảnh của thủy tinh Borosilicate (2 họa âm cao)
          [1840, 2980].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(idx === 0 ? 0.12 : 0.065, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.connect(gain);
            gain.connect(out);
            osc.start(now);
            osc.stop(now + 0.19);
          });
          break;
        }

        case 'wood-place': {
          // Tiếng đặt dụng cụ lên mặt bàn gỗ sồi trầm ấm
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(58, now + 0.085);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.004, now + 0.09);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.095);
          break;
        }

        case 'grab-pickup': {
          // Tiếng nhấc/cầm dụng cụ khỏi mặt bàn: tần số vuốt nhẹ hướng lên tạo cảm giác nhấc bổng
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(210, now);
          osc.frequency.exponentialRampToValueAtTime(520, now + 0.065);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.002, now + 0.07);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.075);
          break;
        }

        case 'dock-hover-snap': {
          // Tiếng "tích" nam châm êm dịu khi rê vật vào đúng vùng thả hợp lệ (chống lặp quá nhanh < 180ms)
          const nowMs = Date.now();
          if (nowMs - this.lastHoverSnapMs < 180) break;
          this.lastHoverSnapMs = nowMs;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1320, now);
          osc.frequency.exponentialRampToValueAtTime(1980, now + 0.045);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.055);
          break;
        }

        case 'rotate-object': {
          // Tiếng xoay dụng cụ 90°: tiếng lướt nhanh kèm tiếng khóa góc nhẹ
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(340, now);
          osc.frequency.exponentialRampToValueAtTime(680, now + 0.075);
          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.002, now + 0.08);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.085);
          break;
        }

        case 'caliper-slide': {
          // Tiếng trượt hàm kim loại Thước cặp Vernier + tiếng chạm mẫu vật
          const dur = 0.14;
          const buf = ctx.createBuffer(
            1,
            Math.floor(ctx.sampleRate * dur),
            ctx.sampleRate,
          );
          const ch = buf.getChannelData(0);
          for (let i = 0; i < ch.length; i++) {
            ch[i] = (Math.random() * 2 - 1) * 0.35;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buf;
          const bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(2200, now);
          bp.frequency.linearRampToValueAtTime(3400, now + dur);
          bp.Q.value = 6.0;
          const nGain = ctx.createGain();
          nGain.gain.setValueAtTime(0.1, now);
          nGain.gain.exponentialRampToValueAtTime(0.002, now + dur);
          noise.connect(bp);
          bp.connect(nGain);
          nGain.connect(out);
          noise.start(now);
          noise.stop(now + dur);

          // Tiếng "tách" khi hàm thước cặp ôm sát mẫu vật
          setTimeout(() => this.play('mechanical-click'), 110);
          break;
        }

        case 'funnel-valve': {
          // Tiếng vặn khóa van PTFE + tiếng dòng chất lỏng chảy
          this.play('mechanical-click');
          setTimeout(() => this.play('water-pour', 0.45), 60);
          break;
        }

        case 'mechanical-click': {
          // Tiếng "Tách" cơ khí chuẩn xác (xoay mâm vật kính 10x/40x/100x, đóng hàm thước cặp, vặn thang đo)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1450, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.032);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.003, now + 0.035);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'spring-stretch': {
          // Tiếng giãn lò xo thép khi móc vật nặng vào Lực kế lò xo
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(480, now);
          filter.frequency.linearRampToValueAtTime(760, now + 0.18);
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(265, now + 0.18);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.003, now + 0.22);
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.23);
          break;
        }

        case 'burner-ignite': {
          // Tiếng bùng lửa đèn cồn + tiếng sôi lăn tăn của dung dịch
          const dur = 0.55;
          const buf = ctx.createBuffer(
            1,
            Math.floor(ctx.sampleRate * dur),
            ctx.sampleRate,
          );
          const ch = buf.getChannelData(0);
          for (let i = 0; i < ch.length; i++) {
            ch[i] =
              (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.22));
          }
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(520, now);
          lp.frequency.exponentialRampToValueAtTime(180, now + dur);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.28, now);
          g.gain.exponentialRampToValueAtTime(0.008, now + dur);
          src.connect(lp);
          lp.connect(g);
          g.connect(out);
          src.start(now);
          src.stop(now + dur);
          break;
        }

        case 'burner-extinguish': {
          // Tiếng đậy nắp chụp dập tắt đèn cồn
          this.play('glass-clink');
          break;
        }

        case 'water-simmer': {
          // Tiếng nước bắt đầu reo / sôi lăn tăn ở 70..90°C (tiếng sủi bọt khí nhỏ li ti)
          const simDur = 0.55;
          const buf = ctx.createBuffer(
            1,
            Math.floor(ctx.sampleRate * simDur),
            ctx.sampleRate,
          );
          const ch = buf.getChannelData(0);
          for (let i = 0; i < ch.length; i++) {
            const env = Math.sin((i / ch.length) * Math.PI);
            ch[i] = (Math.random() * 2 - 1) * env * 0.45;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buf;

          const hp = ctx.createBiquadFilter();
          hp.type = 'bandpass';
          hp.frequency.setValueAtTime(1400 + ratio * 900, now);
          hp.Q.value = 3.2;

          const g = ctx.createGain();
          g.gain.setValueAtTime(0.08 + ratio * 0.08, now);
          noise.connect(hp);
          hp.connect(g);
          g.connect(out);
          noise.start(now);
          noise.stop(now + simDur);

          // 4 tiếng bọt khí li ti vỡ trên mặt thoáng
          [0.05, 0.17, 0.29, 0.43].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const bg = ctx.createGain();
            osc.type = 'sine';
            const f0 = 920 + idx * 180 + Math.random() * 220;
            osc.frequency.setValueAtTime(f0, now + offset);
            osc.frequency.exponentialRampToValueAtTime(f0 * 1.45, now + offset + 0.035);
            bg.gain.setValueAtTime(0.045, now + offset);
            bg.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);
            osc.connect(bg);
            bg.connect(out);
            osc.start(now + offset);
            osc.stop(now + offset + 0.045);
          });
          break;
        }

        case 'water-boil-rumble': {
          // Tiếng nước sôi sùng sục mạnh ở 100°C (rền trầm đối lưu + bọt khí vỡ liên tục)
          const boilDur = 0.85;
          const buf = ctx.createBuffer(
            1,
            Math.floor(ctx.sampleRate * boilDur),
            ctx.sampleRate,
          );
          const ch = buf.getChannelData(0);
          for (let i = 0; i < ch.length; i++) {
            const env = Math.sin((i / ch.length) * Math.PI);
            ch[i] = (Math.random() * 2 - 1) * env * 0.7;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buf;

          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(520 + ratio * 220, now);
          lp.Q.value = 1.8;

          const g = ctx.createGain();
          g.gain.setValueAtTime(0.18 + ratio * 0.1, now);
          noise.connect(lp);
          lp.connect(g);
          g.connect(out);
          noise.start(now);
          noise.stop(now + boilDur);

          // Bọt khí lớn vỡ trên mặt nước sôi
          [0.06, 0.14, 0.24, 0.35, 0.47, 0.59, 0.71].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const bg = ctx.createGain();
            osc.type = 'sine';
            const f0 = 320 + (idx % 3) * 150 + Math.random() * 140;
            osc.frequency.setValueAtTime(f0, now + offset);
            osc.frequency.exponentialRampToValueAtTime(f0 * 1.8, now + offset + 0.055);
            bg.gain.setValueAtTime(0.08, now + offset);
            bg.gain.exponentialRampToValueAtTime(0.002, now + offset + 0.06);
            osc.connect(bg);
            bg.connect(out);
            osc.start(now + offset);
            osc.stop(now + offset + 0.065);
          });
          break;
        }

        case 'laser-switch': {
          // Tiếng bật công tắc nguồn tia Laser / Quang học
          this.play('mechanical-click');
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, now + 0.03);
          osc.frequency.exponentialRampToValueAtTime(2150, now + 0.14);
          gain.gain.setValueAtTime(0.08, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.002, now + 0.15);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now + 0.03);
          osc.stop(now + 0.16);
          break;
        }

        case 'optics-angle': {
          // Tiếng xoay bàn chia độ khúc xạ + âm vang phản xạ toàn phần nếu góc lớn
          this.play('mechanical-click');
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const f = 880 + ratio * 880;
          osc.frequency.setValueAtTime(f, now + 0.025);
          gain.gain.setValueAtTime(0.09, now + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.002, now + 0.14);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now + 0.025);
          osc.stop(now + 0.15);
          break;
        }

        case 'electric-induction': {
          // Tiếng xung dòng điện cảm ứng từ trường biến thiên
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const startF = ratio >= 0.5 ? 520 : 440;
          const endF = ratio >= 0.5 ? 880 : 290;
          osc.frequency.setValueAtTime(startF, now);
          osc.frequency.exponentialRampToValueAtTime(endF, now + 0.18);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.003, now + 0.19);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'probe-measure': {
          // Tiếng nhúng đầu dò điện cực vào dung dịch + tiếng "Bíp" xác nhận kết quả pH / nhiệt độ
          const oscDip = ctx.createOscillator();
          const gainDip = ctx.createGain();
          oscDip.type = 'sine';
          oscDip.frequency.setValueAtTime(420, now);
          oscDip.frequency.exponentialRampToValueAtTime(760, now + 0.09);
          gainDip.gain.setValueAtTime(0.1, now);
          gainDip.gain.exponentialRampToValueAtTime(0.003, now + 0.095);
          oscDip.connect(gainDip);
          gainDip.connect(out);
          oscDip.start(now);
          oscDip.stop(now + 0.1);

          const oscBeep = ctx.createOscillator();
          const gainBeep = ctx.createGain();
          oscBeep.type = 'sine';
          const beepFreq = 2100 + ratio * 900;
          oscBeep.frequency.setValueAtTime(beepFreq, now + 0.11);
          gainBeep.gain.setValueAtTime(0.11, now + 0.11);
          gainBeep.gain.exponentialRampToValueAtTime(0.002, now + 0.21);
          oscBeep.connect(gainBeep);
          gainBeep.connect(out);
          oscBeep.start(now + 0.11);
          oscBeep.stop(now + 0.22);
          break;
        }

        case 'camera-shutter': {
          // Tiếng màn trập máy ảnh cơ học (2 nhịp click-clack sắc nét)
          [0, 0.048].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(idx === 0 ? 1800 : 1250, now + offset);
            osc.frequency.exponentialRampToValueAtTime(240, now + offset + 0.028);
            gain.gain.setValueAtTime(0.16, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.002, now + offset + 0.03);
            osc.connect(gain);
            gain.connect(out);
            osc.start(now + offset);
            osc.stop(now + offset + 0.032);
          });
          break;
        }

        case 'record-start': {
          // Tiếng "Bíp-Bíp" cao khởi động máy quay ghi hình thực hành
          [0, 0.11].forEach((offset, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(idx === 0 ? 880 : 1760, now + offset);
            gain.gain.setValueAtTime(0.12, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.002, now + offset + 0.09);
            osc.connect(gain);
            gain.connect(out);
            osc.start(now + offset);
            osc.stop(now + offset + 0.095);
          });
          break;
        }

        case 'record-stop': {
          // Hợp âm hoàn tất ghi hình / xuất báo cáo
          [1320, 1046.5, 784].forEach((freq, idx) => {
            const offset = idx * 0.075;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + offset);
            gain.gain.setValueAtTime(0.1, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.002, now + offset + 0.12);
            osc.connect(gain);
            gain.connect(out);
            osc.start(now + offset);
            osc.stop(now + offset + 0.13);
          });
          break;
        }

        case 'step-complete': {
          // Giai điệu Chime 2 nốt tươi sáng khi hoàn thành bước thực hành / chuyển bước
          [659.25, 987.77].forEach((freq, idx) => {
            const offset = idx * 0.085;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + offset);
            gain.gain.setValueAtTime(0.1, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.002, now + offset + 0.16);
            osc.connect(gain);
            gain.connect(out);
            osc.start(now + offset);
            osc.stop(now + offset + 0.17);
          });
          break;
        }

        case 'camera-zoom': {
          // Tiếng chuyển ống kính camera êm nhẹ
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(ratio >= 0.5 ? 320 : 480, now);
          osc.frequency.exponentialRampToValueAtTime(
            ratio >= 0.5 ? 540 : 280,
            now + 0.09,
          );
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case 'ui-toggle': {
          // Tiếng bật/tắt công tắc Lưới mặt bàn, Lưới không gian, Trục O-XYZ, Nhãn
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(ratio >= 0.5 ? 1150 : 820, now);
          gain.gain.setValueAtTime(0.065, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
          osc.connect(gain);
          gain.connect(out);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }
      }
    } catch {
      // Ignore Web Audio autoplay restrictions until first user gesture
    }
  }

  playTriumphChime(): void {
    this.play('record-stop');
    setTimeout(() => this.play('step-complete'), 100);
  }

  playBeep(freq?: number, dur?: number): void {
    this.play('scale-tare');
  }

  playChime(freq?: number): void {
    this.play('step-complete');
  }
}

export const labSoundEngine = new LabSoundEngineImpl();
