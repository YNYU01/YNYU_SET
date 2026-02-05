/** 原子节点共有字段 */
interface Base {
  id: string;
  type: baseType;
  name: string;
  width: number;
  height: number;
  classes?: string[];
  styles?: Record<string, string | number>;//{}
}

type styleBlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';
type styleBlend = Record<'blend-mode',styleBlendMode>;
type styleFilterType = 'blur' | 'brightness' | 'contrast'|'saturate' | 'hue-rotate' | 'opacity' | 'drop-shadow';
type styleFilterValue = object | number;//int or float
type styleFilter = Record<styleFilterType, styleFilterValue>;



interface setStyleFilter {
  blur(radius: number): void;
  brightness(value: number): void;
  contrast(value: number): void;
  saturate(value: number): void;
  hueRotate(value: number): void;
  opacity(value: number): void;
  dropShadow(offsetX: number, offsetY: number, radius: number, color: string): void;
}

type baseType = 'TEXT' | 'IMAGE' | 'PATH';

/** 文本原子 */
interface ZY_TextNode extends Base {
  content: string; // 纯文本或富文本描述
}

/** 图片原子 */
interface ZY_ImageNode extends Base {
  content: string; // 资源路径（assets/xxx.png）或 base64/data URL
}

/** 路径原子 */
interface ZY_PathNode extends Base {
  content: string; // 路径数据（如 SVG path d、或自定义 path 描述）
}

// ============ 布局（use：结构树，引用原子或嵌套布局） ============

type ZY_LayoutType = 'group' | 'frame' | 'clip' | 'union' | 'component';

/** 布局节点：描述层级与引用，不重复存样式/内容，通过 id 引用原子 */
interface ZY_Layout {
  type: ZY_LayoutType;
  classes?: string[];
  styles?: Record<string, string | number>;
  /** 子节点：原子引用（如 { ref: 'textnode', id: 'xxx' }）或嵌套的 layout */
  content: ZY_LayoutContent[];
}

/** 布局中的一项：要么引用原子，要么是嵌套布局节点 */
type ZY_LayoutContent =
  | { ref: 'textnode'; id: string }
  | { ref: 'imagenode'; id: string }
  | { ref: 'pathnode'; id: string }
  | ZY_Layout;

// ============ .zy 节点数据根结构（node_data.json 核心形状） ============

interface ZY_LayoutNode {
  textnodes: ZY_TextNode[];
  imagenodes: ZY_ImageNode[];
  pathnodes: ZY_PathNode[];
  layout: ZY_Layout;
}
