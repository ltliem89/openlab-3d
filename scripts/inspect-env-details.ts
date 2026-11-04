import { 
  DEFAULT_LAB_ROOM_CONFIG, 
  INITIAL_ENVIRONMENT_VARIABLES, 
  EQUIPMENT_GROUPS_G01_G10, 
  PHYSICS_FIDELITY_SPECS,
  METROLOGY_VALIDATION_BENCHMARK,
  BUILTIN_ENVIRONMENT_AWARE_MODULES
} from '../src/three-runtime/LabEnvironmentEngine';
import fs from 'fs';

const envDetails = {
  roomConfig: DEFAULT_LAB_ROOM_CONFIG,
  envVars: INITIAL_ENVIRONMENT_VARIABLES,
  groups: EQUIPMENT_GROUPS_G01_G10,
  physicsFidelity: PHYSICS_FIDELITY_SPECS,
  metrologyBenchmarks: METROLOGY_VALIDATION_BENCHMARK,
  envAwareModules: BUILTIN_ENVIRONMENT_AWARE_MODULES
};

fs.writeFileSync('./scripts/env_details.json', JSON.stringify(envDetails, null, 2), 'utf-8');
console.log('Saved env_details.json successfully!');
