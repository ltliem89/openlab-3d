import fs from 'fs';
import path from 'path';

// Polyfill DOMParser và Canvas cho Node.js CLI
if (typeof globalThis.window === 'undefined') {
  (globalThis as any).window = globalThis;
}
if (typeof globalThis.document === 'undefined') {
  (globalThis as any).document = {
    createElement: () => ({
      width: 512,
      height: 256,
      getContext: () => ({
        fillStyle: '', strokeStyle: '', lineWidth: 1, font: '', textAlign: '',
        fillRect() {}, fillText() {}, beginPath() {}, arc() {}, stroke() {}, fill() {}, moveTo() {}, lineTo() {},
      }),
    }),
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
          if (sel === 'script[type="application/json"]') return this.getElementById('ol3d-module-manifest');
          if (sel === 'title') {
            const tm = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
            return tm ? { textContent: tm[1] } : null;
          }
          if (sel === 'svg') {
            const sm = html.match(/<svg[\s\S]*?<\/svg>/i);
            return sm ? { outerHTML: sm[0] } : null;
          }
          return null;
        },
        querySelectorAll(sel: string) {
          if (sel === 'script[src]') return [];
          if (sel === 'script') {
            const sm = html.match(/<script[\s\S]*?<\/script>/gi) || [];
            return sm.map((s) => ({ textContent: s.replace(/<script[^>]*>/, '').replace(/<\/script>/, '') }));
          }
          if (sel === 'svg') {
            const svgs = html.match(/<svg[\s\S]*?<\/svg>/gi) || [];
            return svgs.map((s) => ({ outerHTML: s }));
          }
          return [];
        },
      };
    }
  };
}

import { htmlEquipmentModuleRegistry } from '../src/three-runtime/HtmlEquipmentModuleRegistry';

const BASE_DIR = path.resolve(process.cwd(), 'public/libraries3DLab');
const entries = fs.readdirSync(BASE_DIR, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folder = path.join(BASE_DIR, entry.name);
  const files = fs.readdirSync(folder).filter((f) => f.endsWith('.html'));
  for (const f of files) {
    const filePath = path.join(folder, f);
    const content = fs.readFileSync(filePath, 'utf-8');
    const pkg = htmlEquipmentModuleRegistry.parseHtmlModule(content);
    console.log(`[${pkg.asset.assetId.padEnd(20)}] ${pkg.asset.name.vi.padEnd(45)} | arch: ${pkg.asset.geometry.proceduralArchetype.padEnd(25)} | ctrl: ${pkg.moduleControls?.stateKey || 'none'}`);
  }
}
