import { TemplateData } from '../types';
import { KDCC_BLANK_TEMPLATE_DATA_URL } from './kdccBlankBase64';

/**
 * Returns the authentic KDCC Bank passbook / statement front-page template
 * derived directly from the user's authorized bank template image.
 * Dimensions: 1024 x 576 px.
 */
export function generateDefaultBankTemplate(): TemplateData {
  return {
    id: 'primary_template',
    name: 'KDCC Bank Passbook & Account Statement Slip (Official Template)',
    type: 'image',
    originalFileName: 'kdcc_passbook_template.jpg',
    dataUrl: KDCC_BLANK_TEMPLATE_DATA_URL,
    width: 1024,
    height: 576,
    pageCount: 1,
    activePage: 1,
    updatedAt: Date.now(),
  };
}
