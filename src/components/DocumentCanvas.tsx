import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Rect as KonvaRect,
  Group as KonvaGroup,
} from 'react-konva';
import {
  CustomerData,
  DocumentFieldKey,
  FIELD_DEFINITIONS,
  FieldConfig,
  TemplateData,
} from '../types';

interface DocumentCanvasProps {
  template: TemplateData;
  fields: Record<DocumentFieldKey, FieldConfig>;
  customerData: CustomerData;
  selectedFieldKey: DocumentFieldKey;
  onSelectField: (key: DocumentFieldKey) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  template,
  fields,
  customerData,
  selectedFieldKey,
  onSelectField,
  zoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!template.dataUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = template.dataUrl;
    img.onload = () => {
      setTemplateImg(img);
    };
  }, [template.dataUrl]);

  const stageWidth = template.width || 1024;
  const stageHeight = template.height || 576;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-auto p-4 md:p-8 bg-slate-100 select-none"
    >
      {/* Paper Container with Real Soft Shadow */}
      <div
        className="transition-transform duration-100 origin-center shadow-lg rounded-sm border border-slate-300 bg-white"
        style={{
          width: `${stageWidth * zoom}px`,
          height: `${stageHeight * zoom}px`,
        }}
      >
        <Stage
          width={stageWidth * zoom}
          height={stageHeight * zoom}
          scaleX={zoom}
          scaleY={zoom}
        >
          {/* Layer 1: Template Background */}
          <Layer>
            <KonvaRect
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              fill="#ffffff"
            />
            {templateImg && (
              <KonvaImage
                image={templateImg}
                x={0}
                y={0}
                width={stageWidth}
                height={stageHeight}
              />
            )}
          </Layer>

          {/* Layer 2: Editable Values */}
          <Layer>
            {Object.keys(fields).map((k) => {
              const key = k as DocumentFieldKey;
              const config = fields[key];
              if (!config || !config.visible) return null;

              const val = customerData[key] || '';
              if (!val.trim()) return null;

              const isSelected = selectedFieldKey === key;
              const cleanFontFamily = config.fontFamily.replace(/['"]/g, '').split(',')[0].trim();
              const fontStyle = config.bold ? 'bold' : 'normal';

              return (
                <KonvaGroup
                  key={key}
                  x={config.x}
                  y={config.y}
                  onClick={() => onSelectField(key)}
                  onTap={() => onSelectField(key)}
                >
                  {/* Subtle active highlight box when field is focused in form */}
                  {isSelected && (
                    <KonvaRect
                      x={-2}
                      y={-1}
                      width={config.width + 4}
                      height={config.height + 2}
                      fill="rgba(59, 130, 246, 0.08)"
                      stroke="#2563eb"
                      strokeWidth={1}
                      dash={[3, 3]}
                      cornerRadius={2}
                    />
                  )}

                  <KonvaText
                    x={0}
                    y={0}
                    width={config.width}
                    text={val}
                    fontSize={config.fontSize}
                    fontFamily={cleanFontFamily}
                    fontStyle={fontStyle}
                    fill={config.color || '#111827'}
                    align={config.align}
                    lineHeight={config.lineHeight || 1.35}
                    wrap="word"
                    padding={0}
                  />
                </KonvaGroup>
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
