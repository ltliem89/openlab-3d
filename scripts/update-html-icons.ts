import fs from 'fs';
import path from 'path';

const ICON_SVGS: Record<string, string> = {
  'OL3D-EQP-BAL-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="70" rx="30" ry="5" fill="#E2E8F0" />
    <path d="M16 58 C16 54 18 52 22 52 H58 C62 52 64 54 64 58 L62 65 C62 66 60 67 58 67 H22 C20 67 18 66 18 65 Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect x="25" y="55" width="30" height="9" rx="1.5" fill="#DCE7F5" stroke="#94A3B8" stroke-width="0.8"/>
    <text x="52" y="62" fill="#0F172A" font-size="6.5" font-family="monospace" font-weight="bold" text-anchor="end">0.00g</text>
    <rect x="20" y="38" width="40" height="13" rx="4" fill="#94A3B8" stroke="#64748B" stroke-width="1.2"/>
    <rect x="22" y="39" width="36" height="10" rx="3" fill="#F1F5F9"/>
  </svg>`,

  'OL3D-EQP-BKR-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 24 L22 64 Q22 68 26 68 H54 Q58 68 58 64 L60 24 Z" fill="#E0F2FE" fill-opacity="0.45" stroke="#0284C7" stroke-width="1.6"/>
    <path d="M22 46 H58 L57.5 64 Q57.5 67 54 67 H26 Q22.5 67 22.5 64 Z" fill="#38BDF8" fill-opacity="0.6"/>
    <ellipse cx="40" cy="24" rx="20" ry="3" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.4"/>
    <line x1="28" y1="34" x2="36" y2="34" stroke="#0369A1" stroke-width="1.2"/>
    <line x1="28" y1="42" x2="40" y2="42" stroke="#0369A1" stroke-width="1.2"/>
    <line x1="28" y1="50" x2="36" y2="50" stroke="#0369A1" stroke-width="1.2"/>
    <line x1="28" y1="58" x2="40" y2="58" stroke="#0369A1" stroke-width="1.2"/>
  </svg>`,

  'OL3D-EQP-CAL-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="32" width="64" height="8" rx="1.5" fill="#CBD5E1" stroke="#475569" stroke-width="1.4"/>
    <polygon points="8,32 18,32 18,62 12,62 8,50" fill="#94A3B8" stroke="#475569" stroke-width="1.4"/>
    <polygon points="8,32 14,32 14,20 10,20" fill="#94A3B8" stroke="#475569" stroke-width="1.2"/>
    <polygon points="32,28 48,28 48,42 40,42 40,62 34,50" fill="#1E6BFF" fill-opacity="0.25" stroke="#1E6BFF" stroke-width="1.6"/>
    <line x1="24" y1="32" x2="24" y2="36" stroke="#334155" stroke-width="0.9"/>
    <line x1="28" y1="32" x2="28" y2="38" stroke="#334155" stroke-width="1"/>
    <line x1="32" y1="32" x2="32" y2="36" stroke="#334155" stroke-width="0.9"/>
    <line x1="52" y1="32" x2="52" y2="38" stroke="#334155" stroke-width="1"/>
    <line x1="56" y1="32" x2="56" y2="36" stroke="#334155" stroke-width="0.9"/>
    <line x1="60" y1="32" x2="60" y2="38" stroke="#334155" stroke-width="1"/>
  </svg>`,

  'OL3D-EQP-CYL-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,70 56,70 52,65 28,65" fill="#94A3B8" stroke="#475569" stroke-width="1.2"/>
    <rect x="32" y="14" width="16" height="52" rx="1.5" fill="#E0F2FE" fill-opacity="0.4" stroke="#0284C7" stroke-width="1.5"/>
    <rect x="33" y="38" width="14" height="27" fill="#38BDF8" fill-opacity="0.6"/>
    <path d="M33 38 Q40 40.5 47 38" stroke="#0284C7" stroke-width="1.4" fill="none"/>
    <ellipse cx="40" cy="14" rx="8" ry="2" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.2"/>
    <line x1="34" y1="22" x2="41" y2="22" stroke="#0369A1" stroke-width="1"/>
    <line x1="34" y1="28" x2="43" y2="28" stroke="#0369A1" stroke-width="1.2"/>
    <line x1="34" y1="34" x2="41" y2="34" stroke="#0369A1" stroke-width="1"/>
    <line x1="34" y1="46" x2="43" y2="46" stroke="#0369A1" stroke-width="1.2"/>
    <line x1="34" y1="54" x2="41" y2="54" stroke="#0369A1" stroke-width="1"/>
  </svg>`,

  'OL3D-EQP-DMM-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="12" width="40" height="56" rx="5" fill="#FACC15" stroke="#CA8A04" stroke-width="1.8"/>
    <rect x="24" y="16" width="32" height="48" rx="3" fill="#1E293B"/>
    <rect x="27" y="20" width="26" height="12" rx="1.5" fill="#042F2E" stroke="#14B8A6" stroke-width="0.8"/>
    <text x="50" y="29" fill="#2DD4BF" font-size="7.5" font-family="monospace" font-weight="bold" text-anchor="end">12.0 V</text>
    <circle cx="40" cy="44" r="8" fill="#334155" stroke="#94A3B8" stroke-width="1.2"/>
    <line x1="40" y1="44" x2="45" y2="39" stroke="#FACC15" stroke-width="1.8"/>
    <circle cx="30" cy="57" r="2.5" fill="#EF4444"/>
    <circle cx="40" cy="57" r="2.5" fill="#EF4444"/>
    <circle cx="50" cy="57" r="2.5" fill="#0F172A" stroke="#94A3B8" stroke-width="0.8"/>
  </svg>`,

  'OL3D-EQP-DSH-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 40 Q16 66 40 66 Q64 66 66 40 Z" fill="#F8FAFC" stroke="#64748B" stroke-width="1.8"/>
    <ellipse cx="40" cy="40" rx="26" ry="5.5" fill="#E2E8F0" stroke="#64748B" stroke-width="1.4"/>
    <ellipse cx="40" cy="40" rx="20" ry="3.8" fill="#FFFFFF"/>
    <path d="M35 30 Q33 22 36 16" stroke="#94A3B8" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M42 32 Q45 24 41 15" stroke="#94A3B8" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  </svg>`,

  'OL3D-EQP-DYN-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="12" r="3.8" stroke="#475569" stroke-width="1.8" fill="none"/>
    <rect x="31" y="16" width="18" height="42" rx="2.5" fill="#E0F2FE" fill-opacity="0.3" stroke="#475569" stroke-width="1.4"/>
    <path d="M40 20 L35 24 L45 28 L35 32 L45 36 L40 40" stroke="#D97706" stroke-width="1.6" fill="none"/>
    <rect x="33" y="40" width="14" height="3" rx="0.8" fill="#EF4444"/>
    <line x1="40" y1="43" x2="40" y2="64" stroke="#475569" stroke-width="2"/>
    <path d="M40 64 C40 70 48 70 47 64" stroke="#475569" stroke-width="2" fill="none"/>
    <line x1="43" y1="24" x2="47" y2="24" stroke="#0284C7" stroke-width="1"/>
    <line x1="43" y1="30" x2="48" y2="30" stroke="#0284C7" stroke-width="1.2"/>
    <line x1="43" y1="36" x2="47" y2="36" stroke="#0284C7" stroke-width="1"/>
  </svg>`,

  'OL3D-EQP-FLK-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <path d="M34 16 H46 V28 L60 62 Q62 66 57 66 H23 Q18 66 20 62 L34 28 Z" fill="#E0F2FE" fill-opacity="0.4" stroke="#0284C7" stroke-width="1.6"/>
    <path d="M26 48 H54 L59 62 Q60 65 56 65 H24 Q20 65 21 62 Z" fill="#38BDF8" fill-opacity="0.6"/>
    <ellipse cx="40" cy="16" rx="6" ry="1.8" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.3"/>
    <line x1="35" y1="38" x2="43" y2="38" stroke="#0369A1" stroke-width="1.2"/>
    <line x1="33" y1="46" x2="45" y2="46" stroke="#0369A1" stroke-width="1.2"/>
    <line x1="30" y1="54" x2="46" y2="54" stroke="#0369A1" stroke-width="1.2"/>
  </svg>`,

  'OL3D-EQP-GLV-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="16" width="44" height="50" rx="4" fill="#F1F5F9" stroke="#334155" stroke-width="1.8"/>
    <rect x="23" y="21" width="34" height="24" rx="2" fill="#FFFFFF" stroke="#64748B" stroke-width="1.2"/>
    <path d="M27 40 A13 13 0 0 1 53 40" stroke="#0B3A7D" stroke-width="1.4" fill="none"/>
    <line x1="40" y1="41" x2="40" y2="25" stroke="#EF4444" stroke-width="1.8"/>
    <text x="40" y="38" fill="#0B3A7D" font-size="8" font-weight="bold" text-anchor="middle">G</text>
    <circle cx="28" cy="56" r="3.2" fill="#0F172A"/>
    <circle cx="40" cy="56" r="3.2" fill="#EF4444"/>
    <circle cx="52" cy="56" r="3.2" fill="#EF4444"/>
  </svg>`,

  'OL3D-EQP-HYD-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="64" width="52" height="6" rx="1.5" fill="#0F172A" stroke="#334155" stroke-width="1.2"/>
    <rect x="20" y="56" width="40" height="7" rx="1.2" fill="#E0F2FE" fill-opacity="0.4" stroke="#0284C7" stroke-width="1.2"/>
    <rect x="21" y="57.5" width="38" height="4.5" fill="#38BDF8" fill-opacity="0.7"/>
    <rect x="22" y="20" width="8" height="38" fill="#E0F2FE" fill-opacity="0.4" stroke="#0284C7" stroke-width="1.2"/>
    <rect x="23" y="34" width="6" height="24" fill="#38BDF8" fill-opacity="0.7"/>
    <path d="M37 57 Q34 44 40 35 Q45 27 38 20" fill="none" stroke="#0284C7" stroke-width="7" stroke-linecap="round"/>
    <path d="M37 57 Q34 44 40 35" fill="none" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
    <rect x="50" y="20" width="8" height="38" fill="#E0F2FE" fill-opacity="0.4" stroke="#0284C7" stroke-width="1.2"/>
    <circle cx="54" cy="35" r="7.5" fill="#E0F2FE" fill-opacity="0.4" stroke="#0284C7" stroke-width="1.2"/>
    <circle cx="54" cy="35" r="6" fill="#38BDF8" fill-opacity="0.7"/>
    <rect x="51" y="34" width="6" height="24" fill="#38BDF8" fill-opacity="0.7"/>
    <line x1="18" y1="34" x2="62" y2="34" stroke="#0284C7" stroke-width="1.2" stroke-dasharray="2 1.5"/>
  </svg>`,

  'OL3D-EQP-LEV-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="64" width="40" height="7" rx="1.5" fill="#1E293B" stroke="#0F172A" stroke-width="1.2"/>
    <rect x="38" y="24" width="4" height="42" fill="#CBD5E1" stroke="#475569" stroke-width="1"/>
    <circle cx="40" cy="34" r="11" fill="#F8FAFC" stroke="#0B3A7D" stroke-width="1.2"/>
    <line x1="40" y1="24" x2="40" y2="44" stroke="#DC2626" stroke-width="1" stroke-dasharray="2 1"/>
    <line x1="30" y1="34" x2="50" y2="34" stroke="#0B3A7D" stroke-width="1"/>
    <rect x="8" y="32" width="64" height="4" rx="1" fill="#CBD5E1" stroke="#334155" stroke-width="1"/>
    <rect x="8" y="31" width="3" height="6" rx="0.8" fill="#F59E0B" stroke="#92400E" stroke-width="0.8"/>
    <rect x="69" y="31" width="3" height="6" rx="0.8" fill="#F59E0B" stroke="#92400E" stroke-width="0.8"/>
    <line x1="24" y1="36" x2="24" y2="46" stroke="#64748B" stroke-width="1"/>
    <rect x="21" y="46" width="6" height="8" rx="0.8" fill="#F59E0B" stroke="#92400E" stroke-width="0.8"/>
    <line x1="56" y1="36" x2="56" y2="46" stroke="#64748B" stroke-width="1"/>
    <rect x="53" y="46" width="6" height="8" rx="0.8" fill="#F59E0B" stroke="#92400E" stroke-width="0.8"/>
  </svg>`,

  'OL3D-EQP-MAG-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35" cy="32" r="18" fill="#E0F2FE" fill-opacity="0.4" stroke="#1E293B" stroke-width="3.5"/>
    <ellipse cx="32" cy="27" rx="12" ry="5" fill="#FFFFFF" fill-opacity="0.6" transform="rotate(-20 32 27)"/>
    <line x1="47" y1="44" x2="65" y2="62" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>
    <text x="35" y="36" fill="#0B3A7D" font-size="10" font-weight="bold" text-anchor="middle">5x</text>
  </svg>`,

  'OL3D-EQP-MIC-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="64" width="40" height="5.5" rx="1.5" fill="#1E293B"/>
    <path d="M28 64 V32 Q28 22 38 22 H46" stroke="#E2E8F0" stroke-width="6" fill="none" stroke-linecap="round"/>
    <line x1="48" y1="14" x2="42" y2="28" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>
    <rect x="30" y="44" width="26" height="3.5" rx="1" fill="#1E293B"/>
    <rect x="37" y="40.5" width="13" height="2" fill="#38BDF8"/>
    <line x1="42" y1="30" x2="42" y2="39" stroke="#EAB308" stroke-width="3"/>
    <line x1="47" y1="30" x2="50" y2="38" stroke="#3B82F6" stroke-width="3"/>
  </svg>`,

  'OL3D-EQP-OPT-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="64" width="30" height="5" rx="1.5" fill="#334155"/>
    <line x1="40" y1="48" x2="40" y2="64" stroke="#475569" stroke-width="3"/>
    <circle cx="40" cy="30" r="16" stroke="#1E293B" stroke-width="2.5" fill="none"/>
    <ellipse cx="40" cy="30" rx="7" ry="14" fill="#E0F2FE" fill-opacity="0.6" stroke="#0284C7" stroke-width="1.3"/>
    <path d="M37 20 Q40 26 40 38" stroke="#FFFFFF" stroke-width="1.5" fill="none"/>
  </svg>`,

  'OL3D-EQP-PRM-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <polygon points="40,16 18,58 62,58" fill="#E0F2FE" fill-opacity="0.45" stroke="#0284C7" stroke-width="1.8"/>
    <line x1="10" y1="44" x2="28" y2="36" stroke="#FFFFFF" stroke-width="2"/>
    <line x1="51" y1="36" x2="72" y2="38" stroke="#EF4444" stroke-width="1.6"/>
    <line x1="52" y1="38" x2="72" y2="42" stroke="#F59E0B" stroke-width="1.6"/>
    <line x1="53" y1="40" x2="72" y2="46" stroke="#22C55E" stroke-width="1.6"/>
    <line x1="54" y1="42" x2="72" y2="50" stroke="#3B82F6" stroke-width="1.6"/>
    <line x1="55" y1="44" x2="72" y2="54" stroke="#8B5CF6" stroke-width="1.6"/>
    <rect x="25" y="63" width="30" height="4.5" rx="1.5" fill="#334155"/>
  </svg>`,

  'OL3D-EQP-SEP-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <line x1="22" y1="12" x2="22" y2="68" stroke="#475569" stroke-width="3"/>
    <rect x="15" y="66" width="46" height="4.5" rx="1.5" fill="#334155"/>
    <path d="M35 16 H49 L54 30 L42 48 L30 30 Z" fill="#E0F2FE" fill-opacity="0.4" stroke="#0284C7" stroke-width="1.4"/>
    <polygon points="32.5,30 51.5,30 48,37 36,37" fill="#FBBF24" fill-opacity="0.8"/>
    <polygon points="36,37 48,37 42,47" fill="#38BDF8" fill-opacity="0.75"/>
    <line x1="42" y1="48" x2="42" y2="62" stroke="#0284C7" stroke-width="2.5"/>
    <rect x="36" y="52" width="12" height="3.5" rx="1" fill="#EF4444"/>
  </svg>`,

  'OL3D-EQP-SLB-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="26" fill="#F8FAFC" stroke="#0B3A7D" stroke-width="1.4"/>
    <line x1="40" y1="14" x2="40" y2="66" stroke="#94A3B8" stroke-width="1" stroke-dasharray="2 1.5"/>
    <line x1="14" y1="40" x2="66" y2="40" stroke="#64748B" stroke-width="1.2"/>
    <path d="M22 40 A18 18 0 0 1 58 40 Z" fill="#E0F2FE" fill-opacity="0.6" stroke="#0284C7" stroke-width="1.4"/>
    <line x1="21" y1="60" x2="40" y2="40" stroke="#EF4444" stroke-width="1.8"/>
    <line x1="40" y1="40" x2="53" y2="20" stroke="#22C55E" stroke-width="1.8"/>
  </svg>`,

  'OL3D-EQP-STD-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="63" width="48" height="5.5" rx="1.5" fill="#334155" stroke="#1E293B" stroke-width="1.3"/>
    <line x1="26" y1="14" x2="26" y2="63" stroke="#64748B" stroke-width="3"/>
    <rect x="22" y="24" width="9" height="7.5" rx="1.2" fill="#1E6BFF"/>
    <line x1="31" y1="28" x2="55" y2="28" stroke="#64748B" stroke-width="2.5"/>
    <circle cx="53" cy="32" r="3" stroke="#0284C7" stroke-width="1.5" fill="none"/>
  </svg>`,

  'OL3D-EQP-THM-0001': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="36" y="12" width="8" height="46" rx="4" fill="#E0F2FE" fill-opacity="0.4" stroke="#0284C7" stroke-width="1.4"/>
    <circle cx="40" cy="61" r="6.5" fill="#EF4444" stroke="#B91C1C" stroke-width="1.3"/>
    <line x1="40" y1="28" x2="40" y2="56" stroke="#EF4444" stroke-width="2.8"/>
    <line x1="39" y1="20" x2="43" y2="20" stroke="#0369A1" stroke-width="0.9"/>
    <line x1="39" y1="26" x2="43" y2="26" stroke="#0369A1" stroke-width="0.9"/>
    <line x1="39" y1="32" x2="43" y2="32" stroke="#0369A1" stroke-width="0.9"/>
    <line x1="39" y1="38" x2="43" y2="38" stroke="#0369A1" stroke-width="0.9"/>
  </svg>`,
};

const BASE_DIR = path.resolve(process.cwd(), 'public/libraries3DLab');
const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });

let updatedCount = 0;
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folder = path.join(BASE_DIR, entry.name);
  const files = fs.readdirSync(folder).filter((f) => f.endsWith('.html'));
  for (const f of files) {
    const filePath = path.join(folder, f);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find assetId
    let assetId = Object.keys(ICON_SVGS).find((id) => entry.name.startsWith(id));
    if (!assetId) {
      const m = content.match(/OL3D-EQP-[A-Z]+-\d+/);
      if (m && ICON_SVGS[m[0]]) {
        assetId = m[0];
      }
    }

    if (assetId && ICON_SVGS[assetId]) {
      const newSvg = ICON_SVGS[assetId];
      // Replace <template id="ol3d-module-icon"> content
      const regex = /<template\s+id=["']ol3d-module-icon["']>[\s\S]*?<\/template>/i;
      if (regex.test(content)) {
        const replacement = `<template id="ol3d-module-icon">\n    ${newSvg}\n  </template>`;
        content = content.replace(regex, replacement);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated icon in ${filePath} for ${assetId}`);
        updatedCount++;
      }
    }
  }
}

console.log(`Finished updating ${updatedCount} HTML files.`);
