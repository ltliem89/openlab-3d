import fs from 'fs';
import path from 'path';

const archiveDir = path.resolve(process.cwd(), 'docs/archive_reports');
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

// List of root markdown files to archive
const rootFiles = [
  'ASSEMBLY_ACCEPTANCE_REPORT.md',
  'BAO_CAO_HOAN_THIEN_MO_PHONG_KINH_HIEN_VI_3D_VA_ANH_CHUP.md',
  'BAO_CAO_RA_SOAT_CHUC_NANG_THUC_TE_THIET_BI_OPENLAB3D.md',
  'BAO_CAO_RA_SOAT_LOI_NGUYEN_LY_HOAT_DONG_OPENLAB3D.md',
  'BAO_CAO_RA_SOAT_TOAN_DIEN_THANH_PHAN_MO_PHONG_THIET_BI_VA_MOI_TRUONG.md',
  'CAUSAL_INTERACTION_ARCHITECTURE.md',
  'DEEP_REFACTOR_PLAN.md',
  'EQUIPMENT_MODULE_STANDARD.md',
  'IMPLEMENTATION_CHANGELOG.md',
  'MICROSCOPE_AUDIT_REPORT.md',
  'OPENLAB3D_IMPROVEMENT_LOG.md',
  'OPENLAB_3D_ARCHITECTURE_OVERVIEW.md',
  'ROOT_CAUSE_ANALYSIS.md',
  'SCIENTIFIC_INTERACTION_TEST_REPORT.md'
];

for (const file of rootFiles) {
  const src = path.resolve(process.cwd(), file);
  const dest = path.resolve(archiveDir, file);
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Moved: ${file} -> docs/archive_reports/${file}`);
  }
}

// Also move older duplicates in docs/ into docs/archive_reports/
const docsDir = path.resolve(process.cwd(), 'docs');
const docsFiles = [
  'BAO_CAO_RA_SOAT_CHUC_NANG_THUC_TE_THIET_BI_OPENLAB3D.md',
  'BAO_CAO_RA_SOAT_LOI_NGUYEN_LY_HOAT_DONG_OPENLAB3D.md',
  'CAUSAL_INTERACTION_ARCHITECTURE.md',
  'DEEP_REFACTOR_PLAN.md',
  'IMPLEMENTATION_CHANGELOG.md',
  'ROOT_CAUSE_ANALYSIS.md',
  'SCIENTIFIC_INTERACTION_TEST_REPORT.md',
  'NGHIEN_CUU_QUANG_HOC_TUONG_TAC_DOC_LAP.md',
  'NGHIEN_CUU_VAT_LY_CAM_NAM_MO_PHONG_THUC_TE.md'
];

for (const file of docsFiles) {
  const src = path.resolve(docsDir, file);
  const dest = path.resolve(archiveDir, file);
  if (fs.existsSync(src) && src !== dest) {
    if (fs.existsSync(dest)) {
      fs.unlinkSync(src);
      console.log(`Cleaned duplicate from docs: ${file}`);
    } else {
      fs.renameSync(src, dest);
      console.log(`Moved from docs: ${file} -> docs/archive_reports/${file}`);
    }
  }
}

console.log('Archival and cleanup completed successfully.');
