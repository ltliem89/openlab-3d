import { MICROSCOPE_SPECIMENS } from '../src/data/microscopeSpecimenCatalog';

console.log('Specimens count:', MICROSCOPE_SPECIMENS.length);
MICROSCOPE_SPECIMENS.forEach((s, i) => {
  console.log(`${i+1}. [${s.id}] ${s.nameVi} (${s.nameEn}) - Subject: ${s.subject}, Category: ${s.category}`);
});
