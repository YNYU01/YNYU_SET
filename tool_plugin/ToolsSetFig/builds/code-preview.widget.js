// tool_plugin/ToolsSetFig/widget-src/CodePreviewWidget.tsx
var { widget } = figma;
var {
  AutoLayout,
  Input,
  Rectangle,
  Text,
  usePropertyMenu,
  useSyncedState
} = widget;
var FONT_FAMILY = "Roboto Mono";
var FONT_SIZE = 20;
var LINE_HEIGHT = 28;
var MIN_SCROLL_LINES = 20;
var LINE_NUMBER_WIDTH = 48;
var PADDING_HORIZONTAL = 24;
var DEFAULT_WIDTH = 660;
var MIN_WIDTH = 250;
var MAX_WIDTH = 888;
var DEFAULT_SNIPPET = [
  "// Code Preview",
  "function helloWorld() {",
  "  console.log('Hello YN+ ToolsSet');",
  "}"
].join("\n");
var clamp = (value, min, max) => Math.min(Math.max(value, min), max);
function getLineHeight(lineCount) {
  const lines = Math.max(lineCount, 1);
  const scrollNeeded = lines > MIN_SCROLL_LINES;
  const viewportLines = scrollNeeded ? MIN_SCROLL_LINES : lines;
  const height = viewportLines * LINE_HEIGHT + 16;
  return {
    scrollNeeded,
    viewportHeight: height,
    lines
  };
}
function CodePreviewWidget() {
  var _a;
  const [code, setCode] = useSyncedState("code", DEFAULT_SNIPPET);
  const [panelWidth, setPanelWidth] = useSyncedState("width", DEFAULT_WIDTH);
  const [title, setTitle] = useSyncedState("title", "Code Preview");
  const normalizedWidth = clamp(Math.round(panelWidth), MIN_WIDTH, MAX_WIDTH);
  const titleValue = (_a = title == null ? void 0 : title.trim()) != null ? _a : "";
  const lines = code.split(/\r?\n/);
  const { scrollNeeded, viewportHeight, lines: safeLineCount } = getLineHeight(lines.length);
  const thumbHeight = scrollNeeded ? Math.max(viewportHeight * (MIN_SCROLL_LINES / safeLineCount), 24) : 0;
  usePropertyMenu(
    [
      {
        itemType: "dropdown",
        tooltip: "\u9762\u677F\u5BBD\u5EA6 / Width",
        propertyName: "panelWidth",
        selectedOption: normalizedWidth.toString(),
        options: [
          { option: "360", label: "360px" },
          { option: "480", label: "480px" },
          { option: "660", label: "660px" },
          { option: "888", label: "888px" }
        ]
      },
      { itemType: "separator" },
      {
        itemType: "action",
        tooltip: "\u91CD\u7F6E\u4EE3\u7801\u793A\u4F8B / Reset snippet",
        propertyName: "resetCode"
      },
      {
        itemType: "action",
        tooltip: titleValue ? "\u9690\u85CF\u6807\u9898 / Hide title" : "\u663E\u793A\u6807\u9898 / Show title",
        propertyName: "toggleTitle"
      }
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "panelWidth" && propertyValue) {
        setPanelWidth(Number(propertyValue));
        return;
      }
      if (propertyName === "resetCode") {
        setCode(DEFAULT_SNIPPET);
        return;
      }
      if (propertyName === "toggleTitle") {
        setTitle((prev) => prev ? "" : "Code Preview");
      }
    }
  );
  return /* @__PURE__ */ figma.widget.h(
    AutoLayout,
    {
      name: "YN Code Preview",
      direction: "vertical",
      spacing: titleValue ? 8 : 0,
      width: normalizedWidth,
      minWidth: MIN_WIDTH,
      maxWidth: MAX_WIDTH
    },
    titleValue ? /* @__PURE__ */ figma.widget.h(
      Text,
      {
        fontFamily: "Inter",
        fontSize: 16,
        fill: "#b5bad4",
        letterSpacing: 2
      },
      titleValue
    ) : null,
    /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "horizontal",
        spacing: 0,
        cornerRadius: 10,
        stroke: "#434345",
        strokeWidth: 1,
        fill: "#232325",
        minWidth: MIN_WIDTH,
        maxWidth: MAX_WIDTH,
        width: "fill-parent",
        padding: 0
      },
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "Line Numbers",
          width: LINE_NUMBER_WIDTH,
          minWidth: LINE_NUMBER_WIDTH,
          padding: { top: 8, bottom: 8, right: 4 },
          verticalAlignItems: "START",
          spacing: 0
        },
        lines.map((_, index) => /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            key: `ln-${index}`,
            width: "fill-parent",
            height: LINE_HEIGHT,
            verticalAlignItems: "CENTER",
            horizontalAlignItems: "END"
          },
          /* @__PURE__ */ figma.widget.h(
            Text,
            {
              fontFamily: FONT_FAMILY,
              fontSize: FONT_SIZE,
              fill: "#737373"
            },
            index + 1
          )
        ))
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "Code Body",
          direction: "vertical",
          width: "fill-parent",
          padding: { top: 8, bottom: 8, left: 12, right: PADDING_HORIZONTAL },
          spacing: 0,
          fill: "#272729",
          stroke: "#3c3c41",
          strokeWidth: 1.6,
          strokeAlign: "inside",
          height: viewportHeight,
          clipsContent: true
        },
        /* @__PURE__ */ figma.widget.h(
          Input,
          {
            value: code,
            placeholder: "// \u8F93\u5165\u4EE3\u7801 / Paste snippet",
            onTextEditEnd: (event) => setCode(event.characters.replace(/\r\n/g, "\n")),
            inputBehavior: "multiline",
            width: "fill-parent",
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE,
            fill: "#e8eaee",
            lineHeight: { value: LINE_HEIGHT, unit: "PIXELS" },
            paragraphSpacing: 0,
            paragraphIndent: 0,
            horizontalAlignText: "LEFT"
          }
        )
      ),
      scrollNeeded ? /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          width: 12,
          height: viewportHeight,
          padding: { top: 8, bottom: 8 },
          horizontalAlignItems: "CENTER",
          verticalAlignItems: "START",
          spacing: 0
        },
        /* @__PURE__ */ figma.widget.h(
          Rectangle,
          {
            width: 4,
            height: "fill-parent",
            cornerRadius: 6,
            fill: "rgba(30,30,30,0.15)"
          }
        ),
        /* @__PURE__ */ figma.widget.h(
          Rectangle,
          {
            width: 4,
            height: thumbHeight,
            cornerRadius: 6,
            fill: "#6970a0",
            opacity: 0.42,
            positioning: "absolute",
            x: 4,
            y: 8
          }
        )
      ) : null
    )
  );
}
widget.register(CodePreviewWidget);
