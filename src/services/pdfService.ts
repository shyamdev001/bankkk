import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { PDFDocument } from 'pdf-lib';
import { CustomerData, DocumentFieldKey, FieldConfig, TemplateData, KDCC_STANDARD_LABELS } from '../types';

// Configure PDF.js worker using Vite asset URL
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Loads an uploaded PDF file and renders all or selected pages into data URLs
 */
export async function processPdfFile(file: File): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}> {
  const arrayBuffer = await file.arrayBuffer();
  // Pass a cloned slice so Web Worker transfer cannot detach the original ArrayBuffer
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;

  // Render the first page at crisp resolution (scale 2.0 = ~150-200 DPI)
  const page = await pdf.getPage(1);
  const unscaledViewport = page.getViewport({ scale: 1 });
  
  // Target base width around 1240px (A4 width at 150 DPI)
  const targetScale = Math.max(1.5, Math.min(3.0, 1240 / unscaledViewport.width));
  const viewport = page.getViewport({ scale: targetScale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create 2D canvas context for PDF rendering');
  }

  // White background for transparent PDF pages
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  const dataUrl = canvas.toDataURL('image/png', 0.95);

  return {
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    pageCount,
    arrayBuffer,
  };
}

/**
 * Renders a specific page from an existing PDF buffer
 */
export async function renderPdfPageFromBuffer(
  arrayBuffer: ArrayBuffer,
  pageNumber: number,
  targetWidth = 1240
): Promise<{ dataUrl: string; width: number; height: number }> {
  // Pass a cloned slice so Web Worker transfer cannot detach the original ArrayBuffer
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: ctx,
    viewport: viewport,
  }).promise;

  return {
    dataUrl: canvas.toDataURL('image/png', 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}

/**
 * Loads an uploaded image file (PNG, JPG, WebP) and measures its natural dimensions
 */
export async function processImageFile(file: File): Promise<{
  dataUrl: string;
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        resolve({
          dataUrl,
          width: img.naturalWidth || 1240,
          height: img.naturalHeight || 1754,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to wrap text according to maxWidth on a 2D canvas context
 */
function getWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const resultLines: string[] = [];
  const paragraphs = text.split('\n');

  for (const para of paragraphs) {
    if (para.trim() === '') {
      resultLines.push('');
      continue;
    }

    const words = para.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine.length > 0 ? `${currentLine} ${words[i]}` : words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine.length > 0) {
        resultLines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      resultLines.push(currentLine);
    }
  }

  return resultLines;
}

/**
 * High-fidelity offscreen canvas generator for rendering template + all styled fields.
 * Gujarati ligatures and matras are rendered accurately using the browser's native text engine.
 */
export async function renderDocumentToCanvas(
  template: TemplateData,
  fields: Record<DocumentFieldKey, FieldConfig>,
  values: CustomerData,
  exportScale = 1.0 // Use 1.5 or 2.0 for ultra-high-res 300 DPI print export
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(template.width * exportScale);
  canvas.height = Math.round(template.height * exportScale);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get 2D canvas context');
  }

  // Smooth rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw Template Background Image
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve();
    };
    img.onerror = () => {
      // Fallback: white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      resolve();
    };
    img.src = template.dataUrl;
  });

  // 2. Draw Pre-printed Field Labels (exact match with values)
  const labelFontSize = Math.round(12 * exportScale);
  const commonFontFamily = 'Arial, "Segoe UI", Inter, Helvetica, sans-serif';
  ctx.font = `bold ${labelFontSize}px ${commonFontFamily}`;
  ctx.fillStyle = '#111827';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  for (const item of KDCC_STANDARD_LABELS) {
    ctx.fillText(item.text, item.x * exportScale, item.y * exportScale);
  }

  // 3. Draw Editable Fields
  for (const key of Object.keys(fields) as DocumentFieldKey[]) {
    const config = fields[key];
    if (!config || !config.visible) continue;

    const rawValue = values[key] ?? '';
    const displayText = rawValue;

    if (!displayText.trim()) continue;

    const scaledX = config.x * exportScale;
    const scaledY = config.y * exportScale;
    const scaledWidth = config.width * exportScale;
    const baseFontSize = config.fontSize || 12;
    const scaledFontSize = Math.round(baseFontSize * exportScale);

    // Exact match with pre-printed bank slip sans-serif bold typography
    const fontFamily = config.fontFamily || 'Arial, "Segoe UI", Inter, Helvetica, sans-serif';
    ctx.font = `${config.bold ? 'bold ' : ''}${scaledFontSize}px ${fontFamily}`;
    ctx.fillStyle = config.color || '#282d37';
    ctx.textBaseline = 'top';

    // Alignment and X anchor calculation
    let drawX = scaledX;
    if (config.align === 'center') {
      ctx.textAlign = 'center';
      drawX = scaledX + scaledWidth / 2;
    } else if (config.align === 'right') {
      ctx.textAlign = 'right';
      drawX = scaledX + scaledWidth;
    } else {
      ctx.textAlign = 'left';
      drawX = scaledX;
    }

    const lineHeightMultiplier = config.lineHeight || 1.35;
    const lineSpacing = scaledFontSize * lineHeightMultiplier;

    // Handle wrapping for all fields
    const lines = getWrappedLines(ctx, displayText, scaledWidth);

    for (let i = 0; i < lines.length; i++) {
      const lineY = scaledY + i * lineSpacing;
      ctx.fillText(lines[i], drawX, lineY);
    }
  }

  return canvas;
}

/**
 * Generates and triggers download of a crisp, printable PDF document
 */
export async function downloadDocumentAsPdf(
  template: TemplateData,
  fields: Record<DocumentFieldKey, FieldConfig>,
  values: CustomerData,
  fileName = 'smartdoc-generated.pdf'
): Promise<void> {
  // Render at high-DPI (2x scale for sharp vector-like text printing)
  const canvas = await renderDocumentToCanvas(template, fields, values, 2.0);
  const imgDataUrl = canvas.toDataURL('image/png', 0.95);

  // Convert base64 dataUrl to uint8 array
  const base64Data = imgDataUrl.split(',')[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create PDF using pdf-lib
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(bytes);

  // Match standard page dimension in points (1 px @ 72 dpi = 1 pt)
  // template.width and template.height scaled to 72 pt/in (assuming 150 base dpi -> 72 / 150 = 0.48)
  const ptWidth = (template.width * 72) / 150;
  const ptHeight = (template.height * 72) / 150;

  const page = pdfDoc.addPage([ptWidth, ptHeight]);
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: ptWidth,
    height: ptHeight,
  });

  pdfDoc.setTitle(`SmartDoc - ${values.customerName || 'Document'}`);
  pdfDoc.setAuthor('SmartDoc Studio');
  pdfDoc.setSubject('Banking Document Verification');
  pdfDoc.setCreationDate(new Date());

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Downloads document as high-resolution PNG or JPEG image
 */
export async function downloadDocumentAsImage(
  template: TemplateData,
  fields: Record<DocumentFieldKey, FieldConfig>,
  values: CustomerData,
  format: 'png' | 'jpeg' = 'png',
  fileName = 'smartdoc-generated'
): Promise<void> {
  const canvas = await renderDocumentToCanvas(template, fields, values, 2.0);
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${fileName}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Direct print support using hidden iframe or popup window
 */
export async function printDocument(
  template: TemplateData,
  fields: Record<DocumentFieldKey, FieldConfig>,
  values: CustomerData
): Promise<void> {
  const canvas = await renderDocumentToCanvas(template, fields, values, 2.0);
  const dataUrl = canvas.toDataURL('image/png', 0.95);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the document.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Document - SmartDoc Studio</title>
        <style>
          @page {
            size: auto;
            margin: 0mm;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
          }
          img {
            max-width: 100vw;
            max-height: 100vh;
            width: 100%;
            height: auto;
            display: block;
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" onload="window.focus(); window.print(); window.close();" />
      </body>
    </html>
  `);
  printWindow.document.close();
}
