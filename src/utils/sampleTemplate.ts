import { TemplateData } from '../types';

/**
 * Generates an official, high-resolution bank certificate template (A4 standard: 1240 x 1754 px @ 150 DPI).
 * Contains bilingual English/Gujarati headers, security borders, watermark, and blank fields.
 */
export function generateDefaultBankTemplate(): TemplateData {
  const width = 1240;
  const height = 1754;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#1e3a8a" />
        <stop offset="50%" stop-color="#1e40af" />
        <stop offset="100%" stop-color="#1e3a8a" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d97706" />
        <stop offset="50%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#b45309" />
      </linearGradient>
      <pattern id="guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 0,20 Q 10,0 20,20 T 40,20" fill="none" stroke="#e2e8f0" stroke-width="0.75" opacity="0.4" />
        <path d="M 0,20 Q 10,40 20,20 T 40,20" fill="none" stroke="#e2e8f0" stroke-width="0.75" opacity="0.4" />
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="#fcfcfd" />

    <!-- Security Pattern Background -->
    <rect x="50" y="50" width="${width - 100}" height="${height - 100}" fill="url(#guilloche)" />

    <!-- Outer Decorative Border -->
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="none" stroke="#1e3a8a" stroke-width="3" rx="8" />
    <rect x="48" y="48" width="${width - 96}" height="${height - 96}" fill="none" stroke="#d97706" stroke-width="1.5" rx="6" />

    <!-- Corner Ornaments -->
    <path d="M 40,75 L 75,40 M 40,85 L 85,40" stroke="#1e3a8a" stroke-width="1.5" />
    <path d="M ${width - 40},75 L ${width - 75},40 M ${width - 40},85 L ${width - 85},40" stroke="#1e3a8a" stroke-width="1.5" />
    <path d="M 40,${height - 75} L 75,${height - 40} M 40,${height - 85} L 85,${height - 40}" stroke="#1e3a8a" stroke-width="1.5" />
    <path d="M ${width - 40},${height - 75} L ${width - 75},${height - 40} M ${width - 40},${height - 85} L ${width - 85},${height - 40}" stroke="#1e3a8a" stroke-width="1.5" />

    <!-- Top Bank Emblem and Branding Header -->
    <g transform="translate(70, 70)">
      <!-- Bank Emblem Icon -->
      <circle cx="50" cy="50" r="42" fill="url(#goldGrad)" opacity="0.9" />
      <circle cx="50" cy="50" r="37" fill="#ffffff" />
      <polygon points="50,22 62,38 72,52 64,52 64,72 36,72 36,52 28,52 38,38" fill="#1e3a8a" />
      <circle cx="50" cy="44" r="5" fill="#f59e0b" />

      <!-- Bank Name in Gujarati -->
      <text x="110" y="38" font-family="'Noto Sans Gujarati', 'Shruti', 'Arial', sans-serif" font-size="24" font-weight="700" fill="#1e3a8a">
        સૌરાષ્ટ્ર ગ્રામીણ સહકારી બેંક લિમિટેડ
      </text>

      <!-- Bank Name in English -->
      <text x="110" y="65" font-family="'Inter', 'Arial', sans-serif" font-size="21" font-weight="800" letter-spacing="1" fill="#0f172a">
        SAURASHTRA GRAMIN COOPERATIVE BANK LTD.
      </text>

      <text x="110" y="85" font-family="'Inter', 'Arial', sans-serif" font-size="12" font-weight="500" fill="#64748b">
        (Scheduled Bank | Reg. No: GUJ/CO-OP/8912/1976 | RBI License: CO-OP/AHM-041)
      </text>

      <!-- ISO Badge -->
      <rect x="${width - 320}" y="20" width="160" height="42" rx="4" fill="#eff6ff" stroke="#93c5fd" stroke-width="1" />
      <text x="${width - 240}" y="38" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#1e40af" text-anchor="middle">
        ISO 9001:2015 CERTIFIED
      </text>
      <text x="${width - 240}" y="52" font-family="'Inter', sans-serif" font-size="9" fill="#3b82f6" text-anchor="middle">
        VERIFIED BANKING RECORD
      </text>
    </g>

    <!-- Header Divider Line -->
    <line x1="70" y1="185" x2="${width - 70}" y2="185" stroke="#1e3a8a" stroke-width="3" />
    <line x1="70" y1="190" x2="${width - 70}" y2="190" stroke="#f59e0b" stroke-width="1" />

    <!-- Document Title Box -->
    <g transform="translate(220, 208)">
      <rect x="0" y="0" width="${width - 440}" height="70" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="${(width - 440) / 2}" y="30" font-family="'Inter', sans-serif" font-size="17" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="1.5">
        ACCOUNT DETAILS &amp; MANDATE VERIFICATION CERTIFICATE
      </text>
      <text x="${(width - 440) / 2}" y="55" font-family="'Noto Sans Gujarati', sans-serif" font-size="15" font-weight="600" fill="#1e40af" text-anchor="middle">
        ખાતાની વિગત અને સત્તાવાર ચકાસણી પ્રમાણપત્ર
      </text>
    </g>

    <!-- Ref and Date Meta -->
    <text x="80" y="315" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#475569">Ref No: SGCB/VERIF/2026-27/</text>
    <line x1="280" y1="316" x2="430" y2="316" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 3" />
    <text x="300" y="312" font-family="'Courier Prime', monospace" font-size="13" font-weight="700" fill="#0f172a">774921</text>

    <text x="${width - 320}" y="315" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#475569">Issue Date / તારીખ:</text>
    <line x1="${width - 170}" y1="316" x2="${width - 80}" y2="316" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 3" />
    <text x="${width - 165}" y="312" font-family="'Courier Prime', monospace" font-size="13" font-weight="700" fill="#0f172a">20-11-2026</text>

    <!-- Introductory Paragraph -->
    <text x="80" y="348" font-family="'Inter', sans-serif" font-size="13" fill="#334155">
      TO WHOMSOEVER IT MAY CONCERN / જેને લાગુ પડતું હોય તેમને:
    </text>

    <!-- Pre-printed Table Form Boundaries -->
    <!-- Column 1: Labels | Column 2: Blank Value Area -->
    <g transform="translate(80, 365)">
      <!-- Outer Table Box -->
      <rect x="0" y="0" width="${width - 160}" height="455" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5" rx="6" />

      <!-- Row 1: Customer Name -->
      <rect x="0" y="0" width="${width - 160}" height="44" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="27" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">1. Customer Name / ગ્રાહકનું નામ:</text>
      <line x1="330" y1="0" x2="330" y2="44" stroke="#e2e8f0" stroke-width="1" />

      <!-- Row 2: Account Holder Name -->
      <rect x="0" y="44" width="${width - 160}" height="44" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="71" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">2. A/C Holder Name / ખાતાધારકનું નામ:</text>
      <line x1="330" y1="44" x2="330" y2="88" stroke="#e2e8f0" stroke-width="1" />

      <!-- Row 3: Customer ID (CIF) -->
      <rect x="0" y="88" width="${width - 160}" height="44" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="115" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">3. Customer ID (CIF) / ગ્રાહક આઈડી:</text>
      <line x1="330" y1="88" x2="330" y2="132" stroke="#e2e8f0" stroke-width="1" />

      <!-- Row 4: Account Number -->
      <rect x="0" y="132" width="${width - 160}" height="44" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="159" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">4. Account Number / ખાતા નંબર:</text>
      <line x1="330" y1="132" x2="330" y2="176" stroke="#e2e8f0" stroke-width="1" />

      <!-- Row 5: Address (Multiline) -->
      <rect x="0" y="176" width="${width - 160}" height="88" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="208" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">5. Registered Address / સરનામું:</text>
      <line x1="330" y1="176" x2="330" y2="264" stroke="#e2e8f0" stroke-width="1" />

      <!-- Row 6: IFSC Code -->
      <rect x="0" y="264" width="${width - 160}" height="44" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="291" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">6. RTGS/NEFT IFSC Code:</text>
      <line x1="330" y1="264" x2="330" y2="308" stroke="#e2e8f0" stroke-width="1" />

      <!-- Row 7: Branch Name -->
      <rect x="0" y="308" width="${width - 160}" height="44" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="335" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">7. Branch Name / શાખાનું નામ:</text>
      <line x1="330" y1="308" x2="330" y2="352" stroke="#e2e8f0" stroke-width="1" />

      <!-- Row 8: Branch Code -->
      <rect x="0" y="352" width="${width - 160}" height="44" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="379" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">8. Branch Code / શાખા કોડ:</text>
      <line x1="330" y1="352" x2="330" y2="396" stroke="#e2e8f0" stroke-width="1" />

      <!-- Row 9: MICR Code -->
      <rect x="0" y="396" width="${width - 160}" height="44" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
      <text x="16" y="423" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="#1e293b">9. 9-Digit MICR Code:</text>
      <line x1="330" y1="396" x2="330" y2="440" stroke="#e2e8f0" stroke-width="1" />
    </g>

    <!-- Watermark in Center Background -->
    <g transform="translate(${width / 2}, 980)" opacity="0.06">
      <circle cx="0" cy="0" r="140" fill="#1e3a8a" />
      <text x="0" y="15" font-family="'Inter', sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">
        VERIFIED
      </text>
    </g>

    <!-- Official Declaration Text -->
    <g transform="translate(80, 850)">
      <rect x="0" y="0" width="${width - 160}" height="100" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
      <text x="20" y="26" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155">
        DECLARATION &amp; CERTIFICATION / ઘોષણા અને પ્રમાણીકરણ:
      </text>
      <text x="20" y="48" font-family="'Inter', sans-serif" font-size="11.5" fill="#475569">
        This is to certify that the account details stated above are true and correspond with the Bank's verified ledger.
      </text>
      <text x="20" y="66" font-family="'Noto Sans Gujarati', sans-serif" font-size="11.5" fill="#475569">
        આથી પ્રમાણિત કરવામાં આવે છે કે ઉપરોક્ત ખાતાની વિગતો બેંકના સત્તાવાર રેકોર્ડ મુજબ સંપૂર્ણપણે સત્ય છે.
      </text>
      <text x="20" y="86" font-family="'Inter', sans-serif" font-size="10.5" font-style="italic" fill="#64748b">
        This computer-generated certificate is authorized under bank digital authentication guidelines.
      </text>
    </g>

    <!-- Signatures and Stamp Block -->
    <g transform="translate(80, 990)">
      <!-- Left: Prepared by -->
      <g transform="translate(40, 0)">
        <line x1="0" y1="65" x2="220" y2="65" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2 2" />
        <text x="110" y="85" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">
          Verified &amp; Prepared By
        </text>
        <text x="110" y="102" font-family="'Noto Sans Gujarati', sans-serif" font-size="11" fill="#64748b" text-anchor="middle">
          તપાસનાર અધિકારીની સહી
        </text>
      </g>

      <!-- Center: Official Bank Round Seal Box -->
      <g transform="translate(${width / 2 - 130}, -20)">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 4" />
        <text x="50" y="46" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#94a3b8" text-anchor="middle">
          AFFIX OFFICIAL
        </text>
        <text x="50" y="60" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#94a3b8" text-anchor="middle">
          BRANCH SEAL
        </text>
      </g>

      <!-- Right: Branch Manager / Authorized Signatory -->
      <g transform="translate(${width - 430}, 0)">
        <!-- Digital Signature Simulation / Box -->
        <rect x="0" y="-10" width="230" height="70" rx="4" fill="#fafafa" stroke="#e2e8f0" stroke-width="1" />
        <text x="115" y="24" font-family="'Courier Prime', monospace" font-size="11" font-weight="700" fill="#0284c7" text-anchor="middle">
          [DIGITALLY SIGNED]
        </text>
        <text x="115" y="42" font-family="'Inter', sans-serif" font-size="10" fill="#64748b" text-anchor="middle">
          Chief Branch Manager
        </text>
        <line x1="10" y1="52" x2="220" y2="52" stroke="#cbd5e1" stroke-width="1" />
        <text x="115" y="85" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#334155" text-anchor="middle">
          Authorized Signatory / સહી
        </text>
        <text x="115" y="102" font-family="'Inter', sans-serif" font-size="10" fill="#64748b" text-anchor="middle">
          Code: MGR-89144 (Branch Ops)
        </text>
      </g>
    </g>

    <!-- Bottom Footer Bar -->
    <g transform="translate(40, ${height - 75})">
      <line x1="0" y1="0" x2="${width - 80}" y2="0" stroke="#cbd5e1" stroke-width="1" />
      <text x="20" y="20" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">
        Head Office: Gramin Bank Bhavan, Near Ring Road, Rajkot - 360005, Gujarat | Helpline: 1800-233-8912 | www.sgcbank.example.org
      </text>
      <text x="${width - 100}" y="20" font-family="'Courier Prime', monospace" font-size="10" fill="#94a3b8" text-anchor="end">
        DOC-ID: SGCB-V2-8921-2026
      </text>
    </g>
  </svg>
  `;

  // Encode SVG to safe data URL
  const encodedSvg = encodeURIComponent(svg.trim());
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;

  return {
    id: 'primary_template',
    name: 'Official Bank Verification Certificate (Pre-installed Template)',
    type: 'image',
    originalFileName: 'bank_verification_certificate.svg',
    dataUrl,
    width,
    height,
    pageCount: 1,
    activePage: 1,
    updatedAt: Date.now(),
  };
}
