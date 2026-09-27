import { MockInfrastructureAsset } from '../types/disaster';
import { MOCK_INFRASTRUCTURE_LIST } from './mockInfrastructure';

export const MOCK_SHELTERS_LIST: MockInfrastructureAsset[] = MOCK_INFRASTRUCTURE_LIST.filter(
  (asset) => asset.type === 'shelter'
);
