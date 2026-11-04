export type LayerType = 'text' | 'patch' | 'sticker' | 'brush_stroke';

export interface BaseLayer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  rotation: number; // degrees
  opacity: number; // 0 to 1
  locked?: boolean;
  hidden?: boolean;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string; // 'Impact', 'Comic Neue', 'Anton', etc.
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  backgroundColor: string; // empty string or transparent
  backgroundPadding: number;
  backgroundBorderRadius: number;
  align: 'left' | 'center' | 'right';
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export interface PatchLayer extends BaseLayer {
  type: 'patch';
  width: number;
  height: number;
  shape: 'rect' | 'rounded' | 'ellipse';
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  blur: number; // px blur to blend seamless with jpeg compression artifacts
}

export interface StickerLayer extends BaseLayer {
  type: 'sticker';
  stickerType: 'stamp' | 'badge' | 'emoji' | 'redaction' | 'speech_bubble';
  content: string; // text or emoji
  badgeColor?: string;
  width: number;
  height: number;
}

export interface BrushPoint {
  x: number;
  y: number;
}

export interface BrushStrokeLayer extends BaseLayer {
  type: 'brush_stroke';
  points: BrushPoint[];
  color: string;
  size: number;
}

export type EditorLayer = TextLayer | PatchLayer | StickerLayer | BrushStrokeLayer;

export type ToolMode = 'select' | 'text' | 'patch' | 'brush' | 'eyedropper';

export interface CanvasState {
  imageSrc: string | null;
  imageWidth: number;
  imageHeight: number;
  layers: EditorLayer[];
  selectedLayerId: string | null;
  filterMode: 'none' | 'meme_boost' | 'deep_fried' | 'photocopy' | 'vintage';
}

export interface MemeTemplate {
  id: string;
  title: string;
  subtitle: string;
  category: 'Indo Meme' | 'Classic' | 'News / Chat' | 'Borders';
  aspectRatio: string;
  previewColor: string;
  initialLayers: Partial<EditorLayer>[];
  generateBaseCanvas: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}
