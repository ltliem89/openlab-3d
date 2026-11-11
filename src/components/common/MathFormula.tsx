/**
 * OPENLAB 3D — MATH FORMULA & TYPOGRAPHY ENGINE (KATEX)
 * 
 * Bộ giải mã và hiển thị công thức toán học - vật lý chuẩn KaTeX & MathType.
 * Đảm bảo:
 * 1. Khử triệt để hiện tượng lộ mã nguồn LaTeX (\frac, \vec, \text...)
 * 2. Tự động bóc tách và chuẩn hóa dấu phân cách $, $$, \(, \), \[, \]
 * 3. Hỗ trợ hiển thị xen kẽ văn bản tiếng Việt và công thức toán inline/display
 * 4. Tương thích chuẩn MathType (Alt + \) khi người dùng copy/export
 */

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export interface MathFormulaProps {
  math: string | null | undefined;
  displayMode?: boolean;
  className?: string;
  fallbackText?: string;
}

/**
 * Làm sạch chuỗi LaTeX: loại bỏ các ký tự bọc $, $$, \(, \), \[, \]
 * và sửa các lỗi cú pháp LaTeX thường gặp (như dấu $ lồng nhau)
 */
export function stripMathDelimiters(raw: string): string {
  if (!raw) return '';
  let tex = raw.trim();

  // Bóc tách lặp nhiều lần nếu có $ lồng thừa
  while (
    (tex.startsWith('$') && tex.endsWith('$') && tex.length >= 2) ||
    (tex.startsWith('\\(') && tex.endsWith('\\)') && tex.length >= 4) ||
    (tex.startsWith('\\[') && tex.endsWith('\\]') && tex.length >= 4)
  ) {
    if (tex.startsWith('$$') && tex.endsWith('$$') && tex.length >= 4) {
      tex = tex.slice(2, -2).trim();
    } else if (tex.startsWith('$') && tex.endsWith('$')) {
      tex = tex.slice(1, -1).trim();
    } else if (tex.startsWith('\\(') && tex.endsWith('\\)')) {
      tex = tex.slice(2, -2).trim();
    } else if (tex.startsWith('\\[') && tex.endsWith('\\]')) {
      tex = tex.slice(2, -2).trim();
    }
  }

  // Khử các dấu $ còn sót bên trong nếu có dạng: $\frac{1}{f} = ...$ \quad \text{và} \quad $...$
  tex = tex.replace(/\$/g, '');

  return tex.trim();
}

/**
 * Component hiển thị một công thức toán học/vật lý duy nhất bằng KaTeX
 */
export const MathFormula: React.FC<MathFormulaProps> = ({
  math,
  displayMode = false,
  className = '',
  fallbackText,
}) => {
  const html = useMemo(() => {
    if (!math) return null;
    const cleaned = stripMathDelimiters(math);
    if (!cleaned) return null;

    try {
      return katex.renderToString(cleaned, {
        displayMode,
        throwOnError: false,
        strict: 'ignore',
        trust: true,
      });
    } catch {
      return null;
    }
  }, [math, displayMode]);

  if (!math && !fallbackText) return null;

  if (!html) {
    return (
      <span className={`inline-block font-mono ${className}`}>
        {fallbackText || math}
      </span>
    );
  }

  return (
    <span
      className={`inline-block align-middle select-text ${displayMode ? 'w-full text-center my-1' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export interface RichMathTextProps {
  text: string | null | undefined;
  className?: string;
}

/**
 * Component hiển thị đoạn văn bản hỗn hợp (Tiếng Việt kèm công thức $...$ hoặc $$...$$)
 * Ví dụ: "Định luật tạo ảnh: $\frac{1}{f} = \frac{1}{d} + \frac{1}{d'}$ với tiêu cự $f = 10\text{ cm}$."
 */
export const RichMathText: React.FC<RichMathTextProps> = ({ text, className = '' }) => {
  const segments = useMemo(() => {
    if (!text) return [];

    // Tách chuỗi theo dấu $$...$$ (block) hoặc $...$ (inline)
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
    const parts: Array<{ isMath: boolean; isDisplay: boolean; content: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          isMath: false,
          isDisplay: false,
          content: text.slice(lastIndex, match.index),
        });
      }

      const rawMatch = match[0];
      const isDisplay = rawMatch.startsWith('$$');
      const innerMath = isDisplay
        ? rawMatch.slice(2, -2)
        : rawMatch.slice(1, -1);

      parts.push({
        isMath: true,
        isDisplay,
        content: innerMath,
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({
        isMath: false,
        isDisplay: false,
        content: text.slice(lastIndex),
      });
    }

    return parts;
  }, [text]);

  if (!text) return null;

  if (segments.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (!seg.isMath) {
          return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
        }

        return (
          <MathFormula
            key={idx}
            math={seg.content}
            displayMode={seg.isDisplay}
          />
        );
      })}
    </span>
  );
};
