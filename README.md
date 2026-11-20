# SmartDoc Studio 📄⚡

> **Browser-Based Single Fixed Template Document & Certificate Generator**
> Built with **React 18**, **Vite**, **TypeScript**, **Tailwind CSS**, **Konva.js**, **PDF.js**, **pdf-lib**, **Tesseract.js**, and **IndexedDB**.

---

## 🌟 Overview

**SmartDoc Studio** is an official banking document and certificate generator designed for high efficiency and total data privacy. 

Traditional template workflows require setting up fields every time or relying on expensive backend cloud processing. SmartDoc Studio operates on a **Single Fixed Template** model:
1. **Upload Once**: Upload your authorized blank bank document, certificate, or mandate form (in PDF or Image format).
2. **Configure Once**: Visually drag-and-drop, resize, and style the 9 bank fields. Positions, typography, and the template itself are permanently saved in your browser's **IndexedDB**.
3. **Reuse Forever**: Whenever a new customer walks in, fill in the customer information form on the left, see the live document preview update in real time on the right, and instantly download a high-resolution 300 DPI PDF or PNG.

---

## 🚀 Key Features

- **Split-Screen Interface**:
  - **Left Panel**: Customer Information Form with quick fill, sample data (English & Gujarati), and history manager.
  - **Right Panel**: Real-time live document preview canvas with zoom (30% - 200%), fit-to-screen, and alignment grid.
- **Fixed Template Persistence (IndexedDB)**:
  - Supports blank **PDF** (`.pdf`) and **Image** (`.png`, `.jpg`, `.jpeg`, `.webp`) templates.
  - If a multi-page PDF is uploaded, you can select which page to use as the fixed template.
  - Built-in pre-installed official bank certificate template (*Saurashtra Gramin Cooperative Bank Ltd.*) ready out of the box!
- **9 Standard Banking Fields**:
  1. `Customer Name` (ગ્રાહકનું નામ)
  2. `Account Holder Name` (ખાતાધારકનું નામ)
  3. `Customer ID` (ગ્રાહક આઈડી / CIF)
  4. `Account Number` (ખાતા નંબર)
  5. `Address` (નોંધાયેલ સરનામું - multiline support)
  6. `IFSC Code` (આઈએફએસસી કોડ)
  7. `Branch Name` (શાખાનું નામ)
  8. `Branch Code` (શાખા કોડ)
  9. `MICR Code` (એમઆઈસીઆર કોડ)
- **Bilingual English & Gujarati Typography**:
  - English fonts: *Inter*, *Roboto*, *Courier Prime (Bank Typewriter)*, *Times New Roman*, *Arial*.
  - Gujarati fonts: *Noto Sans Gujarati (Clean Official)*, *Rasa (Formal Serif)*.
  - Per-field typography styling: Font family, font size (8px - 48px), bold, italic, text color with bank color presets, text alignment (Left, Center, Right), line height, and custom prefixes.
- **Visual Drag & Drop Designer**:
  - Powered by **Konva.js** (`react-konva`).
  - Drag bounding boxes, resize with transform handles, and view pixel-accurate X, Y coordinates.
- **AI/OCR Auto-Detect (Tesseract.js)**:
  - Integrated browser-based **Tesseract OCR** engine runs inside a Web Worker.
  - Scans your uploaded template for printed labels like *"Customer Name"*, *"Account No"*, *"IFSC"*, *"Branch"*, etc.
  - Suggests and auto-positions input coordinates in one click!
- **High-Fidelity Document Generation**:
  - **PDF Export (`pdf-lib`)**: Generates crisp, official 300 DPI vector-sharp PDF files with embedded high-resolution render. Gujarati characters and complex ligatures render with 100% fidelity without font corruption.
  - **PNG Image Export**: High-resolution PNG download.
  - **Direct Print**: In-browser print dialog with zero margins.
- **Customer History & Backup**:
  - Save customer records directly to IndexedDB.
  - Export and import full workspace backups (JSON) containing template, field positions, and records.

---

## 🔒 100% Browser-Based & Zero-Cost

- **Zero Backend**: Operates 100% inside client-side browser memory, Web Workers, and IndexedDB.
- **Zero Paid APIs**: No external paid OCR or cloud storage APIs.
- **Complete Privacy**: Banking data never leaves the client device.
- **Ready for Render FREE Static Site Hosting**: Compatible with Render Free static web hosting.

---

## 🛠️ Tech Stack

| Library / Tool | Role |
| :--- | :--- |
| **React 18 & TypeScript** | Component architecture, state management & strict type safety |
| **Vite 6** | Ultra-fast development server and optimized rollup production build |
| **Tailwind CSS** | Sleek modern banking interface styling |
| **Konva.js & react-konva** | Interactive drag-and-drop canvas, transformers, and live previews |
| **PDF.js (`pdfjs-dist`)** | Parsing and high-resolution rasterization of uploaded PDF templates |
| **pdf-lib** | High-fidelity printable PDF generation and metadata embedding |
| **Tesseract.js** | Client-side OCR worker for label detection on blank templates |
| **idb** | Promised-based wrapper for robust IndexedDB storage |
| **Lucide React** | Clean iconography |

---

## 📦 Project Structure

```
d:\THE SOLAR COOP\Bankkk
├── public/
│   ├── _redirects          # SPA routing redirect rule for Render Static Sites
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── CustomerForm.tsx        # Left sidebar in Generate mode (9 fields + actions)
│   │   ├── DocumentCanvas.tsx      # Konva interactive canvas & preview engine
│   │   ├── FieldDesigner.tsx       # Left sidebar in Design mode (styling & coords)
│   │   ├── Header.tsx              # Top bar (mode switch, language, backup, upload)
│   │   ├── OcrModal.tsx            # Tesseract OCR scanner dialog
│   │   ├── SavedRecordsModal.tsx   # History records drawer & search
│   │   └── TemplateUploaderModal.tsx # Upload PDF or Image modal
│   ├── services/
│   │   ├── db.ts                   # IndexedDB storage layer (idb)
│   │   ├── ocrService.ts           # Tesseract.js OCR label recognition
│   │   └── pdfService.ts           # PDF.js rasterizer & pdf-lib exporter
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces, definitions & defaults
│   ├── utils/
│   │   └── sampleTemplate.ts       # Pre-installed high-res bank certificate template
│   ├── App.tsx                     # Main application coordinator
│   ├── index.css                   # Tailwind styles and custom scrollbars
│   ├── main.tsx                    # React DOM entrypoint
│   └── vite-env.d.ts               # Vite client and asset declarations
├── index.html                      # HTML root with Google Fonts (Noto Sans Gujarati, Rasa, Inter)
├── package.json                    # Project dependencies and build scripts
├── postcss.config.js               # PostCSS config
├── tailwind.config.js              # Tailwind theme configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite bundler & manual chunk optimization
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
Output files will be generated in `dist/`.

---

## 🌐 Deploying to Render (FREE Static Site)

This project is tailored specifically for **Render Free Static Site** hosting:

1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial SmartDoc Studio release"
   git remote add origin https://github.com/<your-username>/smartdoc-studio.git
   git branch -M main
   git push -u origin main
   ```
2. Log in to your [Render Dashboard](https://dashboard.render.com/).
3. Click **"New +"** and select **"Static Site"**.
4. Connect your GitHub repository.
5. Configure the build settings:
   - **Name**: `smartdoc-studio`
   - **Branch**: `main`
   - **Root Directory**: leave blank (or `./`)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
6. Click **"Create Static Site"**.
7. Render will automatically build the static assets. The included `public/_redirects` ensures all routes and reloads work seamlessly without 404 errors!

---

## 📄 License
MIT License. Built for bank operations, certificates, and secure browser-based document generation.
