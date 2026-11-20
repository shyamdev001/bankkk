export type DocumentFieldKey =
  | 'customerName'
  | 'accountHolderName'
  | 'customerId'
  | 'accountNumber'
  | 'address'
  | 'ifscCode'
  | 'branchName'
  | 'branchCode'
  | 'micrCode'
  | 'branchAddress'
  | 'productDescription'
  | 'dateOfIssue'
  | 'ckycNo'
  | 'nominee'
  | 'nomineeName'
  | 'modeOfOperation';

export interface FieldDefinition {
  key: DocumentFieldKey;
  label: string;
  labelGujarati: string;
  placeholder: string;
  placeholderGujarati: string;
  isMultiline?: boolean;
  sampleValue: string;
  sampleValueGujarati: string;
  category: 'core' | 'branch' | 'additional';
  ocrKeywords?: string[];
}

export interface FieldConfig {
  key: DocumentFieldKey;
  x: number;             // X position on canvas
  y: number;             // Y position on canvas
  width: number;         // Width in px
  height: number;        // Height in px
  fontSize: number;      // Font size in px (uniform 14px)
  fontFamily: string;    // Font family name
  color: string;         // Hex color (#111827)
  align: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;
  letterSpacing?: number;
  lineHeight?: number;
  visible: boolean;
  showPrefix?: boolean;
  prefixText?: string;
}

export type CustomerData = Record<DocumentFieldKey, string>;

export interface TemplateData {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  originalFileName: string;
  dataUrl: string;       // Rendered image data URL
  originalPdfBuffer?: ArrayBuffer;
  width: number;         // Base width in px (1024)
  height: number;        // Base height in px (576)
  pageCount: number;
  activePage: number;
  updatedAt: number;
}

export interface SavedRecord {
  id: string;
  customerName: string;
  accountNumber: string;
  createdAt: number;
  data: CustomerData;
}

export type AppLanguage = 'en' | 'gu';

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  // --- Core Customer Fields ---
  {
    key: 'customerName',
    label: 'Customer Name',
    labelGujarati: 'ગ્રાહકનું નામ',
    placeholder: 'Mr. BHAVIN BHASKARBHAI PATEL',
    placeholderGujarati: 'શ્રી ભાવિન ભાસ્કરભાઈ પટેલ',
    sampleValue: 'Mr. BHAVIN BHASKARBHAI PATEL',
    sampleValueGujarati: 'શ્રી ભાવિન ભાસ્કરભાઈ પટેલ',
    category: 'core',
  },
  {
    key: 'accountNumber',
    label: 'Account Number',
    labelGujarati: 'ખાતા નંબર',
    placeholder: '306050055336',
    placeholderGujarati: '306050055336',
    sampleValue: '306050055336',
    sampleValueGujarati: '306050055336',
    category: 'core',
  },
  {
    key: 'customerId',
    label: 'Customer No (CIF)',
    labelGujarati: 'ગ્રાહક નંબર (CIF)',
    placeholder: '350003624381',
    placeholderGujarati: '350003624381',
    sampleValue: '350003624381',
    sampleValueGujarati: '350003624381',
    category: 'core',
  },
  {
    key: 'address',
    label: 'Address',
    labelGujarati: 'સરનામું',
    placeholder: 'CHORAWALI KHADKI, SALUN TALPAD,\n387001, GUJARAT',
    placeholderGujarati: 'ચોરાવાળી ખડકી, સાલુણ તળપદ,\n૩૮૭૦૦૧, ગુજરાત',
    isMultiline: true,
    sampleValue: 'CHORAWALI KHADKI, SALUN TALPAD,\n387001, GUJARAT',
    sampleValueGujarati: 'ચોરાવાળી ખડકી, સાલુણ તળપદ,\n૩૮૭૦૦૧, ગુજરાત',
    category: 'core',
  },

  // --- Branch & Banking Identifiers ---
  {
    key: 'branchName',
    label: 'Branch Name & Code',
    labelGujarati: 'શાખાનું નામ અને કોડ',
    placeholder: 'ANAND (002    )',
    placeholderGujarati: 'આણંદ (૦૦૨    )',
    sampleValue: 'ANAND (002    )',
    sampleValueGujarati: 'આણંદ (૦૦૨    )',
    category: 'branch',
  },
  {
    key: 'branchCode',
    label: 'Branch Code',
    labelGujarati: 'શાખા કોડ',
    placeholder: '002',
    placeholderGujarati: '002',
    sampleValue: '002',
    sampleValueGujarati: '002',
    category: 'branch',
  },
  {
    key: 'ifscCode',
    label: 'IFSC Code',
    labelGujarati: 'IFSC કોડ',
    placeholder: 'GSCB0KDC002',
    placeholderGujarati: 'GSCB0KDC002',
    sampleValue: 'GSCB0KDC002',
    sampleValueGujarati: 'GSCB0KDC002',
    category: 'branch',
  },
  {
    key: 'micrCode',
    label: 'MICR Code',
    labelGujarati: 'MICR કોડ',
    placeholder: '388801001',
    placeholderGujarati: '388801001',
    sampleValue: '388801001',
    sampleValueGujarati: '388801001',
    category: 'branch',
  },
  {
    key: 'branchAddress',
    label: 'Branch Address',
    labelGujarati: 'શાખાનું સરનામું',
    placeholder: 'Near UCO Bank, DN High School, Station Road, 388335',
    placeholderGujarati: 'યુકો બેંક પાસે, ડી.એન. હાઇસ્કૂલ, સ્ટેશન રોડ, ૩૮૮૩૩૫',
    sampleValue: 'Near UCO Bank, DN High School, Station Road, 388335',
    sampleValueGujarati: 'યુકો બેંક પાસે, ડી.એન. હાઇસ્કૂલ, સ્ટેશન રોડ, ૩૮૮૩૩૫',
    category: 'branch',
  },

  // --- Additional Passbook Details ---
  {
    key: 'productDescription',
    label: 'Product Description',
    labelGujarati: 'ખાતાનો પ્રકાર',
    placeholder: 'SB INDIVIDUAL',
    placeholderGujarati: 'SB INDIVIDUAL',
    sampleValue: 'SB INDIVIDUAL',
    sampleValueGujarati: 'SB INDIVIDUAL',
    category: 'additional',
  },
  {
    key: 'dateOfIssue',
    label: 'Date of Issue',
    labelGujarati: 'તારીખ',
    placeholder: '20/11/2026',
    placeholderGujarati: '20/11/2026',
    sampleValue: '20/11/2026',
    sampleValueGujarati: '20/11/2026',
    category: 'additional',
  },
  {
    key: 'ckycNo',
    label: 'CKYC No',
    labelGujarati: 'CKYC નંબર',
    placeholder: 'XXXXXX5557',
    placeholderGujarati: 'XXXXXX5557',
    sampleValue: 'XXXXXX5557',
    sampleValueGujarati: 'XXXXXX5557',
    category: 'additional',
  },
  {
    key: 'accountHolderName',
    label: 'Joint Holder Name',
    labelGujarati: 'સંયુક્ત ખાતાધારક',
    placeholder: '(Leave blank if single account)',
    placeholderGujarati: '(ખાલી રાખો જો એકલ ખાતું હોય)',
    sampleValue: '',
    sampleValueGujarati: '',
    category: 'additional',
  },
  {
    key: 'nominee',
    label: 'Nominee (Y/N)',
    labelGujarati: 'વારસદાર (Y/N)',
    placeholder: 'N',
    placeholderGujarati: 'N',
    sampleValue: 'N',
    sampleValueGujarati: 'N',
    category: 'additional',
  },
  {
    key: 'nomineeName',
    label: 'Nominee Name',
    labelGujarati: 'વારસદારનું નામ',
    placeholder: 'NOMINEE NOT AVAILABLE',
    placeholderGujarati: 'NOMINEE NOT AVAILABLE',
    sampleValue: 'NOMINEE NOT AVAILABLE',
    sampleValueGujarati: 'NOMINEE NOT AVAILABLE',
    category: 'additional',
  },
  {
    key: 'modeOfOperation',
    label: 'Mode of Operation',
    labelGujarati: 'સંચાલન પ્રકાર',
    placeholder: 'SELF',
    placeholderGujarati: 'SELF',
    sampleValue: 'SELF',
    sampleValueGujarati: 'SELF',
    category: 'additional',
  },
];

export const AVAILABLE_FONTS = [
  { name: 'Bank Official Sans (Exact Template Match)', value: 'Arial, "Segoe UI", Inter, Helvetica, sans-serif', category: 'English' },
  { name: 'Inter (Clean Modern)', value: 'Inter, Arial, sans-serif', category: 'English' },
  { name: 'Noto Sans Gujarati (Official Gujarati)', value: '"Noto Sans Gujarati", "Shruti", sans-serif', category: 'Gujarati' },
];

export const UNIFORM_FONT = 'Arial, "Segoe UI", Inter, Helvetica, sans-serif';
export const UNIFORM_COLOR = '#111827'; // Dark authentic passbook print color
export const UNIFORM_SIZE = 12; // Calibrated 12px matching exact passbook typography
export const FIELD_CONFIG_VERSION = 'v2026_11_20_unified_canvas_labels';

export interface TemplateLabelItem {
  id: string;
  text: string;
  x: number;
  y: number;
  width?: number;
}

/**
 * Standard pre-printed field labels rendered directly on the canvas alongside user values.
 * This ensures BOTH the field names ('Branch Name & Code :', 'Customer No :', etc.) and the user answers
 * share the 100% identical font family, weight, color, crispness, and rendering engine.
 */
export const KDCC_STANDARD_LABELS: TemplateLabelItem[] = [
  // Left column labels
  { id: 'lbl_branch', text: 'Branch Name & Code', x: 35, y: 175 },
  { id: 'colon_branch', text: ':', x: 240, y: 175 },
  { id: 'lbl_addr', text: 'Branch Address', x: 35, y: 194 },
  { id: 'colon_addr', text: ':', x: 240, y: 194 },
  { id: 'lbl_phone', text: 'Brphone', x: 35, y: 215 },
  { id: 'colon_phone', text: ':', x: 240, y: 215 },
  { id: 'lbl_prod', text: 'Product Description', x: 35, y: 234 },
  { id: 'colon_prod', text: ':', x: 240, y: 234 },
  { id: 'lbl_date', text: 'Date of Issue', x: 35, y: 253 },
  { id: 'colon_date', text: ':', x: 240, y: 253 },
  { id: 'lbl_cust', text: 'Customer No', x: 35, y: 274 },
  { id: 'colon_cust', text: ':', x: 240, y: 274 },
  { id: 'lbl_acc', text: 'Account No', x: 35, y: 293 },
  { id: 'colon_acc', text: ':', x: 240, y: 293 },
  { id: 'lbl_name', text: 'Name', x: 35, y: 313 },
  { id: 'colon_name', text: ':', x: 240, y: 313 },
  { id: 'lbl_nomreg', text: 'Nominee Reg. No.', x: 35, y: 333 },
  { id: 'colon_nomreg', text: ':', x: 240, y: 333 },
  { id: 'lbl_joint', text: 'JointHolder Name', x: 35, y: 352 },
  { id: 'colon_joint', text: ':', x: 240, y: 352 },
  { id: 'lbl_caddr', text: 'Address', x: 35, y: 396 },
  { id: 'colon_caddr', text: ':', x: 240, y: 396 },
  { id: 'lbl_nom', text: 'Nominee', x: 35, y: 438 },
  { id: 'colon_nom', text: ':', x: 240, y: 438 },
  { id: 'lbl_mode', text: 'Mode of Operation', x: 35, y: 457 },
  { id: 'colon_mode', text: ':', x: 240, y: 457 },

  // Right column labels
  { id: 'lbl_ifsc', text: 'IFSC CODE', x: 500, y: 175 },
  { id: 'colon_ifsc', text: ':', x: 595, y: 175 },
  { id: 'lbl_micr', text: 'MICR CODE', x: 710, y: 234 },
  { id: 'colon_micr', text: ':', x: 810, y: 234 },
  { id: 'lbl_ckyc', text: 'CKYC No', x: 710, y: 253 },
  { id: 'colon_ckyc', text: ':', x: 810, y: 253 },
  { id: 'lbl_nomname', text: 'Nominee Name', x: 430, y: 438 },
  { id: 'colon_nomname', text: ':', x: 565, y: 438 },
];

/**
 * Pixel-accurate coordinates matching the authentic KDCC Bank passbook slip (1024 x 576 px).
 * All fields have the EXACT SAME uniform font family (Arial Bold / Segoe UI Bold Sans-Serif),
 * authentic charcoal ribbon ink (#282d37), and precise vertical alignment matching the pre-printed labels.
 */
export const DEFAULT_FIELD_CONFIGS: Record<DocumentFieldKey, FieldConfig> = {
  branchName: {
    key: 'branchName',
    x: 255,
    y: 175,
    width: 230,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  branchCode: {
    key: 'branchCode',
    x: 350,
    y: 175,
    width: 80,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: false, // Combined inside branchName "PIPLAV (065  )"
  },
  ifscCode: {
    key: 'ifscCode',
    x: 610,
    y: 175,
    width: 170,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  branchAddress: {
    key: 'branchAddress',
    x: 255,
    y: 194,
    width: 500,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  productDescription: {
    key: 'productDescription',
    x: 255,
    y: 234,
    width: 250,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  micrCode: {
    key: 'micrCode',
    x: 825,
    y: 234,
    width: 150,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  dateOfIssue: {
    key: 'dateOfIssue',
    x: 255,
    y: 253,
    width: 200,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  ckycNo: {
    key: 'ckycNo',
    x: 825,
    y: 253,
    width: 150,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  customerId: {
    key: 'customerId',
    x: 255,
    y: 274,
    width: 300,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  accountNumber: {
    key: 'accountNumber',
    x: 255,
    y: 293,
    width: 300,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  customerName: {
    key: 'customerName',
    x: 255,
    y: 313,
    width: 450,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  accountHolderName: {
    key: 'accountHolderName',
    x: 255,
    y: 352,
    width: 450,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  address: {
    key: 'address',
    x: 255,
    y: 396,
    width: 450,
    height: 38,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
    lineHeight: 1.45,
  },
  nominee: {
    key: 'nominee',
    x: 255,
    y: 438,
    width: 40,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  nomineeName: {
    key: 'nomineeName',
    x: 580,
    y: 438,
    width: 320,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  modeOfOperation: {
    key: 'modeOfOperation',
    x: 255,
    y: 457,
    width: 200,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
};
