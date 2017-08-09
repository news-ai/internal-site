import { generateConstants } from 'constants/generateConstants';
import { commonTypes } from 'constants/AppConstants';

export const schemaConstant = generateConstants(commonTypes, 'SCHEMA');
