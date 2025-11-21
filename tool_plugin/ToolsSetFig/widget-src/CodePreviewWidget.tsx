/// <reference types="@figma/widget-typings" />

const { widget } = figma;
const {
  AutoLayout,
  Input,
  Rectangle,
  Text,
  usePropertyMenu,
  useSyncedState,
} = widget;

const FONT_FAMILY = 'Roboto Mono';
const FONT_STYLE = 'Regular';
const FONT_SIZE = 20;
const LINE_HEIGHT = 28;
const MIN_SCROLL_LINES = 20;
const LINE_NUMBER_WIDTH = 48;
const PADDING_HORIZONTAL = 24;
const DEFAULT_WIDTH = 660;
const MIN_WIDTH = 250;
const MAX_WIDTH = 888;

const DEFAULT_SNIPPET = [
  '// Code Preview',
  'function helloWorld() {',
  "  console.log('Hello YN+ ToolsSet');",
  '}',
].join('\n');

type CodePreviewState = {
  code: string;
  width: number;
  title: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function getLineHeight(lineCount: number) {
  const lines = Math.max(lineCount, 1);
  const scrollNeeded = lines > MIN_SCROLL_LINES;
  const viewportLines = scrollNeeded ? MIN_SCROLL_LINES : lines;
  const height = viewportLines * LINE_HEIGHT + 16;
  return {
    scrollNeeded,
    viewportHeight: height,
    lines,
  };
}

function CodePreviewWidget() {
  const [code, setCode] = useSyncedState<CodePreviewState['code']>('code', DEFAULT_SNIPPET);
  const [panelWidth, setPanelWidth] = useSyncedState<CodePreviewState['width']>('width', DEFAULT_WIDTH);
  const [title, setTitle] = useSyncedState<CodePreviewState['title']>('title', 'Code Preview');

  const normalizedWidth = clamp(Math.round(panelWidth), MIN_WIDTH, MAX_WIDTH);
  const titleValue = title?.trim() ?? '';
  const lines = code.split(/\r?\n/);
  const { scrollNeeded, viewportHeight, lines: safeLineCount } = getLineHeight(lines.length);
  const thumbHeight = scrollNeeded
    ? Math.max(viewportHeight * (MIN_SCROLL_LINES / safeLineCount), 24)
    : 0;

  usePropertyMenu(
    [
      {
        itemType: 'dropdown',
        tooltip: '面板宽度 / Width',
        propertyName: 'panelWidth',
        selectedOption: normalizedWidth.toString(),
        options: [
          { option: '360', label: '360px' },
          { option: '480', label: '480px' },
          { option: '660', label: '660px' },
          { option: '888', label: '888px' },
        ],
      },
      { itemType: 'separator' },
      {
        itemType: 'action',
        tooltip: '重置代码示例 / Reset snippet',
        propertyName: 'resetCode',
      },
      {
        itemType: 'action',
        tooltip: titleValue ? '隐藏标题 / Hide title' : '显示标题 / Show title',
        propertyName: 'toggleTitle',
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === 'panelWidth' && propertyValue) {
        setPanelWidth(Number(propertyValue));
        return;
      }
      if (propertyName === 'resetCode') {
        setCode(DEFAULT_SNIPPET);
        return;
      }
      if (propertyName === 'toggleTitle') {
        setTitle(prev => (prev ? '' : 'Code Preview'));
      }
    },
  );

  return (
    <AutoLayout
      name="YN Code Preview"
      direction="vertical"
      spacing={titleValue ? 8 : 0}
      width={normalizedWidth}
      minWidth={MIN_WIDTH}
      maxWidth={MAX_WIDTH}
    >
      {titleValue ? (
        <Text
          fontFamily="Inter"
          fontSize={16}
          fill="#b5bad4"
          letterSpacing={2}
        >
          {titleValue}
        </Text>
      ) : null}
      <AutoLayout
        direction="horizontal"
        spacing={0}
        cornerRadius={10}
        stroke="#434345"
        strokeWidth={1}
        fill="#232325"
        minWidth={MIN_WIDTH}
        maxWidth={MAX_WIDTH}
        width="fill-parent"
        padding={0}
      >
        <AutoLayout
          name="Line Numbers"
          width={LINE_NUMBER_WIDTH}
          minWidth={LINE_NUMBER_WIDTH}
          padding={{ top: 8, bottom: 8, right: 4 }}
          verticalAlignItems="START"
          spacing={0}
        >
          {lines.map((_, index) => (
            <AutoLayout
              key={`ln-${index}`}
              width="fill-parent"
              height={LINE_HEIGHT}
              verticalAlignItems="CENTER"
              horizontalAlignItems="END"
            >
              <Text
                fontFamily={FONT_FAMILY}
                fontSize={FONT_SIZE}
                fill="#737373"
              >
                {index + 1}
              </Text>
            </AutoLayout>
          ))}
        </AutoLayout>
        <AutoLayout
          name="Code Body"
          direction="vertical"
          width="fill-parent"
          padding={{ top: 8, bottom: 8, left: 12, right: PADDING_HORIZONTAL }}
          spacing={0}
          fill="#272729"
          stroke="#3c3c41"
          strokeWidth={1.6}
          strokeAlign="inside"
          height={viewportHeight}
          clipsContent
        >
          <Input
            value={code}
            placeholder="// 输入代码 / Paste snippet"
            onTextEditEnd={event => setCode(event.characters.replace(/\r\n/g, '\n'))}
            inputBehavior="multiline"
            width="fill-parent"
            fontFamily={FONT_FAMILY}
            fontSize={FONT_SIZE}
            fill="#e8eaee"
            lineHeight={{ value: LINE_HEIGHT, unit: 'PIXELS' }}
            paragraphSpacing={0}
            paragraphIndent={0}
            horizontalAlignText="LEFT"
          />
        </AutoLayout>
        {scrollNeeded ? (
          <AutoLayout
            width={12}
            height={viewportHeight}
            padding={{ top: 8, bottom: 8 }}
            horizontalAlignItems="CENTER"
            verticalAlignItems="START"
            spacing={0}
          >
            <Rectangle
              width={4}
              height="fill-parent"
              cornerRadius={6}
              fill="rgba(30,30,30,0.15)"
            />
            <Rectangle
              width={4}
              height={thumbHeight}
              cornerRadius={6}
              fill="#6970a0"
              opacity={0.42}
              positioning="absolute"
              x={4}
              y={8}
            />
          </AutoLayout>
        ) : null}
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(CodePreviewWidget);

