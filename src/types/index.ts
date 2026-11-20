export type DocumentFieldKey =
  | 'customerName'
  | 'accountHolderName'
  | 'customerId'
  | 'accountNumber'
  | 'address'
  | 'ifscCode'
  | 'branchName'
  | 'branchCode'
  | 'micrCode';

export interface FieldDefinition {
  key: DocumentFieldKey;
  label: string;
  labelGujarati: string;
  placeholder: string;
  placeholderGujarati: string;
  isMultiline?: boolean;
  sampleValue: string;
  sampleValueGujarati: string;
  ocrKeywords: string[];
}

export interface FieldConfig {
  key: DocumentFieldKey;
  x: number;             // X position in pixels on base canvas
  y: number;             // Y position in pixels on base canvas
  width: number;         // Width in pixels
  height: number;        // Height in pixels
  fontSize: number;      // Font size in pixels
  fontFamily: string;    // Font family name
  color: string;         // Hex color
  align: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;
  letterSpacing?: number;
  lineHeight?: number;
  showPrefix?: boolean;
  prefixText?: string;
  visible: boolean;
}

export type CustomerData = Record<DocumentFieldKey, string>;

export interface TemplateData {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  originalFileName: string;
  dataUrl: string;       // Rendered image data URL (PNG/JPEG) of the active template
  originalPdfBuffer?: ArrayBuffer; // Optional raw PDF bytes if uploaded as PDF
  width: number;         // Base width in px (e.g. 1240 for A4 @ 150dpi)
  height: number;        // Base height in px (e.g. 1754 for A4 @ 150dpi)
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
export type AppMode = 'generate' | 'design';

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    key: 'customerName',
    label: 'Customer Name',
    labelGujarati: 'ગ્રાહકનું નામ',
    placeholder: 'e.g. Rajeshkumar J. Patel',
    placeholderGujarati: 'દા.ત. રાજેશકુમાર જે. પટેલ',
    sampleValue: 'Rajeshkumar J. Patel',
    sampleValueGujarati: 'રાજેશકુમાર જે. પટેલ',
    ocrKeywords: ['customer name', 'name of customer', 'client name', 'mr', 'mrs', 'shri', 'applicant']
  },
  {
    key: 'accountHolderName',
    label: 'Account Holder Name',
    labelGujarati: 'ખાતાધારકનું નામ',
    placeholder: 'e.g. Rajeshkumar J. Patel',
    placeholderGujarati: 'દા.ત. રાજેશકુમાર જે. પટેલ',
    sampleValue: 'Rajeshkumar J. Patel & Anandi R. Patel',
    sampleValueGujarati: 'રાજેશકુમાર જે. પટેલ અને આનંદી આર. પટેલ',
    ocrKeywords: ['account holder', 'holder name', 'a/c holder', 'joint holder', 'name of account holder']
  },
  {
    key: 'customerId',
    label: 'Customer ID',
    labelGujarati: 'ગ્રાહક આઈડી',
    placeholder: 'e.g. CUST8923411',
    placeholderGujarati: 'દા.ત. CUST8923411',
    sampleValue: 'CUST-8492019',
    sampleValueGujarati: 'CUST-8492019',
    ocrKeywords: ['customer id', 'cust id', 'cif no', 'cif', 'cust no', 'client id']
  },
  {
    key: 'accountNumber',
    label: 'Account Number',
    labelGujarati: 'ખાતા નંબર',
    placeholder: 'e.g. 50100492817291',
    placeholderGujarati: 'દા.ત. 50100492817291',
    sampleValue: '918020048192038',
    sampleValueGujarati: '918020048192038',
    ocrKeywords: ['account no', 'account number', 'a/c no', 'a/c number', 'sb a/c', 'ca a/c', 'acc no']
  },
  {
    key: 'address',
    label: 'Address',
    labelGujarati: 'સરનામું',
    placeholder: 'e.g. 402, Surya Darshan Apts, Ashram Road, Ahmedabad - 380009',
    placeholderGujarati: 'દા.ત. ૪૦૨, સૂર્ય દર્શન એપાર્ટમેન્ટ, આશ્રમ રોડ, અમદાવાદ - ૩૮૦૦૦૯',
    isMultiline: true,
    sampleValue: 'Flat 402, Surya Darshan Apts,\nNear Income Tax Circle, Ashram Road,\nAhmedabad, Gujarat - 380009',
    sampleValueGujarati: 'ફ્લેટ ૪૦૨, સૂર્ય દર્શન એપાર્ટમેન્ટ,\nઈન્કમ ટેક્સ સર્કલ પાસે, આશ્રમ રોડ,\nઅમદાવાદ, ગુજરાત - ૩૮૦૦૦૯',
    ocrKeywords: ['address', 'residence address', 'communication address', 'residing at', 'street', 'city', 'pincode']
  },
  {
    key: 'ifscCode',
    label: 'IFSC Code',
    labelGujarati: 'આઈએફએસસી કોડ',
    placeholder: 'e.g. GSCB0001002',
    placeholderGujarati: 'દા.ત. GSCB0001002',
    sampleValue: 'GSCB0001048',
    sampleValueGujarati: 'GSCB0001048',
    ocrKeywords: ['ifsc', 'ifsc code', 'rtgs/neft ifsc', 'ifs code']
  },
  {
    key: 'branchName',
    label: 'Branch Name',
    labelGujarati: 'શાખાનું નામ',
    placeholder: 'e.g. Ashram Road Main Branch',
    placeholderGujarati: 'દા.ત. આશ્રમ રોડ મુખ્ય શાખા',
    sampleValue: 'Ashram Road Main Branch, Ahmedabad',
    sampleValueGujarati: 'આશ્રમ રોડ મુખ્ય શાખા, અમદાવાદ',
    ocrKeywords: ['branch name', 'branch', 'bank branch', 'branch office']
  },
  {
    key: 'branchCode',
    label: 'Branch Code',
    labelGujarati: 'શાખા કોડ',
    placeholder: 'e.g. 01048',
    placeholderGujarati: 'દા.ત. 01048',
    sampleValue: '01048',
    sampleValueGujarati: '01048',
    ocrKeywords: ['branch code', 'br code', 'sol id', 'branch id']
  },
  {
    key: 'micrCode',
    label: 'MICR Code',
    labelGujarati: 'એમઆઈસીઆર કોડ',
    placeholder: 'e.g. 380085002',
    placeholderGujarati: 'દા.ત. 380085002',
    sampleValue: '380085012',
    sampleValueGujarati: '380085012',
    ocrKeywords: ['micr', 'micr code', 'magnetic ink', 'clearing code']
  }
];

export const AVAILABLE_FONTS = [
  { name: 'Inter (Modern Clean)', value: 'Inter', category: 'English' },
  { name: 'Roboto (Standard UI)', value: 'Roboto', category: 'English' },
  { name: 'Courier Prime (Typewriter / Bank Mono)', value: '"Courier Prime", monospace', category: 'English' },
  { name: 'Times New Roman (Formal Serif)', value: '"Times New Roman", Times, serif', category: 'English' },
  { name: 'Arial (Standard Sans)', value: 'Arial, sans-serif', category: 'English' },
  { name: 'Noto Sans Gujarati (Official Clean)', value: '"Noto Sans Gujarati", sans-serif', category: 'Gujarati' },
  { name: 'Rasa (Formal Gujarati Serif)', value: '"Rasa", serif', category: 'Gujarati' },
];

export const DEFAULT_FIELD_CONFIGS: Record<DocumentFieldKey, FieldConfig> = {
  customerName: {
    key: 'customerName',
    x: 230,
    y: 388,
    width: 380,
    height: 32,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#0f172a',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  accountHolderName: {
    key: 'accountHolderName',
    x: 230,
    y: 432,
    width: 380,
    height: 32,
    fontSize: 15,
    fontFamily: 'Inter',
    color: '#0f172a',
    align: 'left',
    bold: false,
    italic: false,
    visible: true,
  },
  customerId: {
    key: 'customerId',
    x: 230,
    y: 476,
    width: 380,
    height: 30,
    fontSize: 15,
    fontFamily: '"Courier Prime", monospace',
    color: '#0f172a',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  accountNumber: {
    key: 'accountNumber',
    x: 230,
    y: 520,
    width: 380,
    height: 32,
    fontSize: 17,
    fontFamily: '"Courier Prime", monospace',
    color: '#0f172a',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  address: {
    key: 'address',
    x: 230,
    y: 566,
    width: 480,
    height: 75,
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#1e293b',
    align: 'left',
    bold: false,
    italic: false,
    visible: true,
    lineHeight: 1.4,
  },
  ifscCode: {
    key: 'ifscCode',
    x: 230,
    y: 654,
    width: 250,
    height: 30,
    fontSize: 15,
    fontFamily: '"Courier Prime", monospace',
    color: '#0f172a',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  branchName: {
    key: 'branchName',
    x: 230,
    y: 698,
    width: 380,
    height: 30,
    fontSize: 15,
    fontFamily: 'Inter',
    color: '#0f172a',
    align: 'left',
    bold: false,
    italic: false,
    visible: true,
  },
  branchCode: {
    key: 'branchCode',
    x: 230,
    y: 742,
    width: 200,
    height: 30,
    fontSize: 15,
    fontFamily: '"Courier Prime", monospace',
    color: '#0f172a',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
  micrCode: {
    key: 'micrCode',
    x: 230,
    y: 786,
    width: 220,
    height: 30,
    fontSize: 15,
    fontFamily: '"Courier Prime", monospace',
    color: '#0f172a',
    align: 'left',
    bold: true,
    italic: false,
    visible: true,
  },
};
