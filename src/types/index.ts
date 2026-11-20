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
  fontSize: number;      // Font size in px
  fontFamily: string;    // Font family name
  color: string;         // Hex color
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
    placeholder: 'PETLAD (5     )',
    placeholderGujarati: 'પેટલાદ (૫     )',
    sampleValue: 'PETLAD (5     )',
    sampleValueGujarati: 'પેટલાદ (૫     )',
    category: 'branch',
  },
  {
    key: 'branchCode',
    label: 'Branch Code',
    labelGujarati: 'શાખા કોડ',
    placeholder: '006',
    placeholderGujarati: '006',
    sampleValue: '006',
    sampleValueGujarati: '006',
    category: 'branch',
  },
  {
    key: 'ifscCode',
    label: 'IFSC Code',
    labelGujarati: 'IFSC કોડ',
    placeholder: 'GSCB0KDC006',
    placeholderGujarati: 'GSCB0KDC006',
    sampleValue: 'GSCB0KDC006',
    sampleValueGujarati: 'GSCB0KDC006',
    category: 'branch',
  },
  {
    key: 'micrCode',
    label: 'MICR Code',
    labelGujarati: 'MICR કોડ',
    placeholder: '388801051',
    placeholderGujarati: '388801051',
    sampleValue: '388801051',
    sampleValueGujarati: '388801051',
    category: 'branch',
  },
  {
    key: 'branchAddress',
    label: 'Branch Address',
    labelGujarati: 'શાખાનું સરનામું',
    placeholder: 'Nr. N. K. High School',
    placeholderGujarati: 'એન. કે. હાઇસ્કૂલ પાસે',
    sampleValue: 'Nr. N. K. High School',
    sampleValueGujarati: 'એન. કે. હાઇસ્કૂલ પાસે',
    category: 'branch',
  },

  // --- Additional Passbook Details ---
  {
    key: 'productDescription',
    label: 'Product Description',
    labelGujarati: 'ખાતાનો પ્રકાર',
    placeholder: 'SB INDIVIDUAL',
    placeholderGujarati: 'બચત ખાતું (વ્યક્તિગત)',
    sampleValue: 'SB INDIVIDUAL',
    sampleValueGujarati: 'SB INDIVIDUAL',
    category: 'additional',
  },
  {
    key: 'dateOfIssue',
    label: 'Date of Issue',
    labelGujarati: 'તારીખ',
    placeholder: '20/11/2026',
    placeholderGujarati: '૨૦/૧૧/૨૦૨૬',
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
    placeholderGujarati: 'વારસદાર ઉપલબ્ધ નથી',
    sampleValue: 'NOMINEE NOT AVAILABLE',
    sampleValueGujarati: 'NOMINEE NOT AVAILABLE',
    category: 'additional',
  },
  {
    key: 'modeOfOperation',
    label: 'Mode of Operation',
    labelGujarati: 'સંચાલન પ્રકાર',
    placeholder: 'SELF',
    placeholderGujarati: 'સ્વયં (SELF)',
    sampleValue: 'SELF',
    sampleValueGujarati: 'SELF',
    category: 'additional',
  },
];

export const AVAILABLE_FONTS = [
  { name: 'Bank Passbook Monospace (Default)', value: '"Courier Prime", "Courier New", Consolas, monospace', category: 'English' },
  { name: 'Inter (Clean Modern)', value: 'Inter, sans-serif', category: 'English' },
  { name: 'Roboto (Standard)', value: 'Roboto, sans-serif', category: 'English' },
  { name: 'Noto Sans Gujarati (Clean Official)', value: '"Noto Sans Gujarati", sans-serif', category: 'Gujarati' },
  { name: 'Rasa (Formal Gujarati)', value: '"Rasa", serif', category: 'Gujarati' },
];

/**
 * Pixel-accurate coordinates matching the authentic KDCC Bank passbook slip (1024 x 576 px)
 */
export const DEFAULT_FIELD_CONFIGS: Record<DocumentFieldKey, FieldConfig> = {
  branchName: {
    key: 'branchName',
    x: 245,
    y: 173,
    width: 250,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  branchCode: {
    key: 'branchCode',
    x: 350,
    y: 173,
    width: 80,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: false, // Combined inside branchName "PETLAD (5     )"
  },
  ifscCode: {
    key: 'ifscCode',
    x: 605,
    y: 173,
    width: 170,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  branchAddress: {
    key: 'branchAddress',
    x: 245,
    y: 193,
    width: 450,
    height: 19,
    fontSize: 14,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: false,
    italic: false,
    visible: true,
  },
  productDescription: {
    key: 'productDescription',
    x: 245,
    y: 232,
    width: 250,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  micrCode: {
    key: 'micrCode',
    x: 812,
    y: 232,
    width: 150,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  dateOfIssue: {
    key: 'dateOfIssue',
    x: 245,
    y: 252,
    width: 200,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  ckycNo: {
    key: 'ckycNo',
    x: 812,
    y: 252,
    width: 150,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  customerId: {
    key: 'customerId',
    x: 245,
    y: 271,
    width: 300,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  accountNumber: {
    key: 'accountNumber',
    x: 245,
    y: 290,
    width: 300,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  customerName: {
    key: 'customerName',
    x: 245,
    y: 310,
    width: 450,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  accountHolderName: {
    key: 'accountHolderName',
    x: 245,
    y: 350,
    width: 450,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: false,
    italic: false,
    visible: true,
  },
  address: {
    key: 'address',
    x: 245,
    y: 396,
    width: 450,
    height: 38,
    fontSize: 13.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
    lineHeight: 1.38,
  },
  nominee: {
    key: 'nominee',
    x: 245,
    y: 435,
    width: 40,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  nomineeName: {
    key: 'nomineeName',
    x: 570,
    y: 435,
    width: 320,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  modeOfOperation: {
    key: 'modeOfOperation',
    x: 245,
    y: 455,
    width: 200,
    height: 19,
    fontSize: 14.5,
    fontFamily: '"Courier Prime", "Courier New", Consolas, monospace',
    color: '#111827',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
};
