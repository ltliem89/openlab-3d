import fs from 'fs';
import path from 'path';

const files = [
  'OPENLAB_3D_ARCHITECTURE_OVERVIEW.md',
  'CAUSAL_INTERACTION_ARCHITECTURE.md',
  'EQUIPMENT_MODULE_STANDARD.md',
  'ASSEMBLY_ACCEPTANCE_REPORT.md',
  'MICROSCOPE_AUDIT_REPORT.md',
  'ROOT_CAUSE_ANALYSIS.md',
  'DEEP_REFACTOR_PLAN.md',
  'BAO_CAO_RA_SOAT_LOI_NGUYEN_LY_HOAT_DONG_OPENLAB3D.md',
  'BAO_CAO_RA_SOAT_CHUC_NANG_THUC_TE_THIET_BI_OPENLAB3D.md',
  'SCIENTIFIC_INTERACTION_TEST_REPORT.md',
  'IMPLEMENTATION_CHANGELOG.md',
  'OPENLAB3D_IMPROVEMENT_LOG.md',
  'BAO_CAO_HOAN_THIEN_MO_PHONG_KINH_HIEN_VI_3D_VA_ANH_CHUP.md',
  'docs/NGHIEN_CUU_QUANG_HOC_TUONG_TAC_DOC_LAP.md',
  'docs/NGHIEN_CUU_VAT_LY_CAM_NAM_MO_PHONG_THUC_TE.md'
];

for (const rel of files) {
  const p = path.resolve(process.cwd(), rel);
  if (!fs.existsSync(p)) {
    console.log(`[NOT FOUND] ${rel}`);
    continue;
  }
  const content = fs.readFileSync(p, 'utf8');
  const lines = content.split('\n');
  const headers = lines.filter(l => l.startsWith('#')).slice(0, 10);
  console.log(`\n======================================================`);
  console.log(`FILE: ${rel} | Lines: ${lines.length} | Size: ${content.length} bytes`);
  console.log(`======================================================`);
  console.log(headers.join('\n'));
}
