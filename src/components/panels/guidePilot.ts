/**
 * Vòng 5 (A) — Logic thuần của mạng chỉ dẫn thí điểm WF-08.
 * Tách riêng để kiểm định được bằng script mà không cần DOM/React:
 * đếm fail, mốc kẹt, khóa log chống spam. LabViewport3D dùng các hàm này
 * trong refreshGuidePilot (điểm đánh giá guard duy nhất).
 */

export interface GuidePilotTracker {
  consecutiveFails: number;
  failSinceMs: number | null;
  lastLoggedKey: string;
  hintShownStep: number;
}

export function createGuidePilotTracker(): GuidePilotTracker {
  return { consecutiveFails: 0, failSinceMs: null, lastLoggedKey: '', hintShownStep: 0 };
}

/**
 * Ghi nhận một lần đánh giá guard. Chỉ đếm fail sau thao tác của người học
 * (countAttempt = true, từ effect đồng bộ scene); tick đồng hồ 500 ms không
 * đếm, để "3 lần sai" nghĩa là 3 lần thao tác sai chứ không phải 1,5 s ngồi yên.
 * Mốc fail liên tục vẫn tính theo đồng hồ để bắt trường hợp ngồi yên ≥ 30 s.
 */
export function recordGuideEvaluation(
  t: GuidePilotTracker,
  passed: boolean,
  countAttempt: boolean,
  nowMs: number,
): void {
  if (!passed) {
    if (countAttempt) t.consecutiveFails += 1;
    if (t.failSinceMs === null) t.failSinceMs = nowMs;
  } else {
    t.consecutiveFails = 0;
    t.failSinceMs = null;
  }
}

/** Hint chỉ hiện khi kẹt: fail ≥ 3 lần liên tiếp HOẶC fail liên tục ≥ 30 s. */
export function shouldShowGuideHint(t: GuidePilotTracker, nowMs: number): boolean {
  return (
    t.consecutiveFails >= 3 ||
    (t.failSinceMs !== null && nowMs - t.failSinceMs >= 30000)
  );
}

/** Khóa log chống spam: cùng bước + cùng reason thì chỉ log 1 lần. */
export function guideLogKey(stepIndex: number, passed: boolean, reasonVi: string): string {
  return passed ? `__PASS__:${stepIndex}` : `${stepIndex}:${reasonVi}`;
}
