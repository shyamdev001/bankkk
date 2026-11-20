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
  { name: 'Bank Passbook Monospace (Default)', value: '"Courier Prime", "Courier New", Consolas, monospace', category: 'English' },
  { name: 'Inter (Clean Modern)', value: 'Inter, sans-serif', category: 'English' },
  { name: 'Noto Sans Gujarati (Clean Official)', value: '"Noto Sans Gujarati", sans-serif', category: 'Gujarati' },
];

const UNIFORM_FONT = '"Courier Prime", "Courier New", Consolas, monospace';
const UNIFORM_COLOR = '#111827';
const UNIFORM_SIZE = 14;

/**
 * Pixel-accurate coordinates matching the authentic KDCC Bank passbook slip (1024 x 576 px).
 * All fields have the EXACT SAME uniform font family, font size (14px), font weight (bold), and color.
 */
export const DEFAULT_FIELD_CONFIGS: Record<DocumentFieldKey, FieldConfig> = {
  branchName: {
    key: 'branchName',
    x: 265,
    y: 172,
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
  branchCode: {
    key: 'branchCode',
    x: 350,
    y: 172,
    width: 80,
    height: 18,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: false, // Combined inside branchName "ANAND (002    )"
  },
  ifscCode: {
    key: 'ifscCode',
    x: 618,
    y: 172,
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
    x: 265,
    y: 192,
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
    x: 265,
    y: 231,
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
    x: 830,
    y: 231,
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
    x: 265,
    y: 250,
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
    x: 830,
    y: 250,
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
    x: 265,
    y: 270,
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
    x: 265,
    y: 289,
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
    x: 265,
    y: 308,
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
    x: 265,
    y: 348,
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
    x: 265,
    y: 395,
    width: 450,
    height: 38,
    fontSize: UNIFORM_SIZE,
    fontFamily: UNIFORM_FONT,
    color: UNIFORM_COLOR,
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
    lineHeight: 1.35,
  },
  nominee: {
    key: 'nominee',
    x: 265,
    y: 434,
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
    x: 584,
    y: 434,
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
    x: 265,
    y: 454,
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
