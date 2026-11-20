import { createWorker } from 'tesseract.js';
import { DocumentFieldKey, FIELD_DEFINITIONS, FieldConfig } from '../types';

export interface OcrDetectionResult {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  matchedFieldKey?: DocumentFieldKey;
  suggestedConfig?: Partial<FieldConfig>;
}

export interface OcrScanProgress {
  status: string;
  progress: number;
}

/**
 * Runs OCR over the template image to detect labels like "Customer Name", "Account No", "IFSC" etc.
 * and suggest bounding box coordinates.
 */
export async function scanTemplateForLabels(
  imageSource: string,
  onProgress?: (info: OcrScanProgress) => void
): Promise<{
  detections: OcrDetectionResult[];
  matchedSuggestions: Partial<Record<DocumentFieldKey, Partial<FieldConfig>>>;
}> {
  if (onProgress) {
    onProgress({ status: 'Initializing OCR Engine...', progress: 0.1 });
  }

  // Create Tesseract worker
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress({
          status: `Scanning document text: ${Math.round(m.progress * 100)}%`,
          progress: 0.2 + m.progress * 0.7,
        });
      }
    },
  });

  if (onProgress) {
    onProgress({ status: 'Processing template image...', progress: 0.2 });
  }

  const ret = await worker.recognize(imageSource);
  await worker.terminate();

  if (onProgress) {
    onProgress({ status: 'Analyzing detected text zones...', progress: 0.95 });
  }

  const detections: OcrDetectionResult[] = [];
  const matchedSuggestions: Partial<Record<DocumentFieldKey, Partial<FieldConfig>>> = {};

  const lines = ret.data.lines;

  for (const line of lines) {
    const rawText = line.text.trim();
    if (!rawText) continue;
    const lowerText = rawText.toLowerCase();

    // Check each field definition
    for (const def of FIELD_DEFINITIONS) {
      // Check if any keyword matches
      const isMatch = (def.ocrKeywords || []).some((kw: string) => lowerText.includes(kw));

      if (isMatch) {
        const detection: OcrDetectionResult = {
          text: rawText,
          confidence: line.confidence,
          bbox: line.bbox,
          matchedFieldKey: def.key,
        };

        // Form positioning heuristic:
        // Position value area ~20px to the right of the label
        // Or if label is wide, place beneath it
        const labelWidth = line.bbox.x1 - line.bbox.x0;
        const suggestedX = Math.round(line.bbox.x1 + 15);
        const suggestedY = Math.round(line.bbox.y0 + 2);
        const suggestedHeight = Math.max(30, Math.round(line.bbox.y1 - line.bbox.y0 + 8));

        detection.suggestedConfig = {
          x: suggestedX,
          y: suggestedY,
          width: 320,
          height: suggestedHeight,
        };

        // If not already matched with higher confidence
        if (!matchedSuggestions[def.key]) {
          matchedSuggestions[def.key] = {
            x: suggestedX,
            y: suggestedY,
            width: def.isMultiline ? 420 : 320,
            height: def.isMultiline ? 65 : suggestedHeight,
          };
        }

        detections.push(detection);
        break;
      }
    }
  }

  if (onProgress) {
    onProgress({ status: 'Done', progress: 1.0 });
  }

  return {
    detections,
    matchedSuggestions,
  };
}
