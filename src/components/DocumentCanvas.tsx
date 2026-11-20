import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Rect as KonvaRect,
  Group as KonvaGroup,
  Transformer as KonvaTransformer,
  Line as KonvaLine,
} from 'react-konva';
import Konva from 'konva';
import {
  AppMode,
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
  mode: AppMode;
  selectedFieldKey: DocumentFieldKey | null;
  onSelectField: (key: DocumentFieldKey | null) => void;
  onUpdateFieldConfig: (key: DocumentFieldKey, updates: Partial<FieldConfig>) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid?: boolean;
}

interface EditableFieldBoxProps {
  fieldKey: DocumentFieldKey;
  config: FieldConfig;
  value: string;
  isDesignMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<FieldConfig>) => void;
}

const EditableFieldBox: React.FC<EditableFieldBoxProps> = ({
  fieldKey,
  config,
  value,
  isDesignMode,
  isSelected,
  onSelect,
  onChange,
}) => {
  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && isDesignMode && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, isDesignMode]);

  const definition = useMemo(
    () => FIELD_DEFINITIONS.find((d) => d.key === fieldKey),
    [fieldKey]
  );

  if (!config.visible) return null;

  // In design mode, if value is empty, show label/sample text so the user can see where it is
  const displayText = value.trim()
    ? config.showPrefix && config.prefixText
      ? `${config.prefixText} ${value}`
      : value
    : isDesignMode
    ? `[${definition?.label || fieldKey}]`
    : '';

  // Text style properties
  const fontStyle = [config.italic ? 'italic' : '', config.bold ? 'bold' : '']
    .filter(Boolean)
    .join(' ') || 'normal';

  const cleanFontFamily = config.fontFamily.replace(/['"]/g, '').split(',')[0].trim();

  return (
    <>
      <KonvaGroup
        ref={groupRef}
        x={config.x}
        y={config.y}
        draggable={isDesignMode}
        onClick={(e) => {
          if (isDesignMode) {
            e.cancelBubble = true;
            onSelect();
          }
        }}
        onTap={(e) => {
          if (isDesignMode) {
            e.cancelBubble = true;
            onSelect();
          }
        }}
        onDragEnd={(e) => {
          if (isDesignMode) {
            onChange({
              x: Math.round(e.target.x()),
              y: Math.round(e.target.y()),
            });
          }
        }}
        onTransformEnd={() => {
          if (!groupRef.current) return;
          const node = groupRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale on group and apply directly to width/height
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: Math.round(node.x()),
            y: Math.round(node.y()),
            width: Math.max(50, Math.round(config.width * scaleX)),
            height: Math.max(20, Math.round(config.height * scaleY)),
          });
        }}
      >
        {/* Background highlight box for Designer Mode */}
        {isDesignMode && (
          <KonvaRect
            x={0}
            y={0}
            width={config.width}
            height={config.height}
            fill={isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(241, 245, 249, 0.45)'}
            stroke={isSelected ? '#2563eb' : '#94a3b8'}
            strokeWidth={isSelected ? 1.5 : 1}
            dash={isSelected ? undefined : [4, 4]}
            cornerRadius={3}
          />
        )}

        {/* Small field label tag in Designer Mode */}
        {isDesignMode && (
          <KonvaGroup x={0} y={-16}>
            <KonvaRect
              x={0}
              y={0}
              width={Math.min(config.width, 140)}
              height={15}
              fill={isSelected ? '#2563eb' : '#475569'}
              cornerRadius={[3, 3, 0, 0]}
            />
            <KonvaText
              x={4}
              y={2}
              text={definition?.label || fieldKey}
              fontSize={10}
              fontFamily="Inter, sans-serif"
              fill="#ffffff"
              fontStyle="bold"
            />
          </KonvaGroup>
        )}

        {/* Text Element (with Gujarati and English font support) */}
        <KonvaText
          x={0}
          y={0}
          width={config.width}
          text={displayText}
          fontSize={config.fontSize}
          fontFamily={cleanFontFamily}
          fontStyle={fontStyle}
          fill={isDesignMode && !value.trim() ? '#94a3b8' : config.color || '#000000'}
          align={config.align}
          lineHeight={config.lineHeight || 1.35}
          wrap="word"
          padding={2}
        />
      </KonvaGroup>

      {/* Transformer for resizing in Designer Mode */}
      {isDesignMode && isSelected && (
        <KonvaTransformer
          ref={transformerRef}
          rotateEnabled={false}
          enabledAnchors={['middle-left', 'middle-right', 'bottom-center']}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
          anchorSize={8}
          anchorCornerRadius={2}
          anchorStroke="#2563eb"
          anchorFill="#ffffff"
          borderStroke="#2563eb"
          borderStrokeWidth={1.5}
        />
      )}
    </>
  );
};

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  template,
  fields,
  customerData,
  mode,
  selectedFieldKey,
  onSelectField,
  onUpdateFieldConfig,
  zoom,
  onZoomChange,
  showGrid = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const isDesignMode = mode === 'design';

  // Load template image safely
  useEffect(() => {
    if (!template.dataUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = template.dataUrl;
    img.onload = () => {
      setTemplateImg(img);
    };
  }, [template.dataUrl]);

  // Stage dimensions based on base template dimensions
  const stageWidth = template.width || 1240;
  const stageHeight = template.height || 1754;

  // Grid lines generation (50px spacing)
  const gridLines = useMemo(() => {
    if (!showGrid) return null;
    const lines = [];
    const step = 50;
    // Vertical lines
    for (let x = step; x < stageWidth; x += step) {
      lines.push(
        <KonvaLine
          key={`v-${x}`}
          points={[x, 0, x, stageHeight]}
          stroke="#e2e8f0"
          strokeWidth={x % 200 === 0 ? 1 : 0.5}
          dash={x % 200 === 0 ? undefined : [2, 2]}
        />
      );
    }
    // Horizontal lines
    for (let y = step; y < stageHeight; y += step) {
      lines.push(
        <KonvaLine
          key={`h-${y}`}
          points={[0, y, stageWidth, y]}
          stroke="#e2e8f0"
          strokeWidth={y % 200 === 0 ? 1 : 0.5}
          dash={y % 200 === 0 ? undefined : [2, 2]}
        />
      );
    }
    return lines;
  }, [showGrid, stageWidth, stageHeight]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-start overflow-auto p-4 md:p-8 bg-slate-900 select-none"
      onClick={(e) => {
        // Deselect when clicking background container
        if (e.target === containerRef.current) {
          onSelectField(null);
        }
      }}
    >
      {/* Scaled Canvas Container with drop shadow and document paper look */}
      <div
        className="transition-transform duration-150 origin-top shadow-2xl rounded-sm border border-slate-700 bg-white"
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
          onMouseDown={(e) => {
            // Deselect if clicked empty area of stage
            if (e.target === e.target.getStage()) {
              onSelectField(null);
            }
          }}
        >
          {/* Layer 1: Template Background & Optional Grid */}
          <Layer>
            {/* White paper background */}
            <KonvaRect
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              fill="#ffffff"
            />

            {/* Template image */}
            {templateImg && (
              <KonvaImage
                image={templateImg}
                x={0}
                y={0}
                width={stageWidth}
                height={stageHeight}
              />
            )}

            {/* Grid overlay in design mode */}
            {gridLines}
          </Layer>

          {/* Layer 2: All Configurable Fields */}
          <Layer>
            {Object.keys(fields).map((k) => {
              const key = k as DocumentFieldKey;
              return (
                <EditableFieldBox
                  key={key}
                  fieldKey={key}
                  config={fields[key]}
                  value={customerData[key] || ''}
                  isDesignMode={isDesignMode}
                  isSelected={selectedFieldKey === key}
                  onSelect={() => onSelectField(key)}
                  onChange={(updates) => onUpdateFieldConfig(key, updates)}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
