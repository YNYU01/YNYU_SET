"use strict";
(() => {
  // tool_plugin/CodeView/widget-src/code.tsx
  var { widget } = figma;
  var { useSyncedState, usePropertyMenu, AutoLayout, Text, Span, waitForTask } = widget;
  function Widget() {
    const [textContent, setTextContent] = useSyncedState("textContent", `function example() {
  // This is an example code
  const message = "Hello, World!";
  console.log(message);
  return message;
}`);
    const [spanContent, setSpanContent] = useSyncedState("spanContent", "");
    const [wordWrap, setWordWrap] = useSyncedState("wordWrap", false);
    const [width, setWidth] = useSyncedState("width", 400);
    const codeContent = spanContent || textContent;
    function parseSpanString(text) {
      if (!text) return [" "];
      const elements = [];
      const regex = /<Span fill="([^"]+)">([\s\S]*?)<\/Span>/g;
      let lastIndex = 0;
      let match;
      let key = 0;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          const plainText = text.substring(lastIndex, match.index);
          if (plainText) {
            elements.push(plainText);
          }
        }
        const color = match[1];
        let content = match[2];
        if (content.includes("<Span fill=")) {
          const nestedElements = parseSpanString(content);
          elements.push(/* @__PURE__ */ figma.widget.h(Span, { key: key++, fill: color }, nestedElements));
        } else {
          content = content.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
          elements.push(/* @__PURE__ */ figma.widget.h(Span, { key: key++, fill: color }, content));
        }
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < text.length) {
        const plainText = text.substring(lastIndex);
        if (plainText) {
          const decoded = plainText.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
          elements.push(decoded);
        }
      }
      return elements.length > 0 ? elements : [" "];
    }
    const codeLines = codeContent ? codeContent.split("\n") : [];
    const lineCount = codeLines.length || 1;
    const padding = 12;
    const fontSize = 16;
    const numberWidth = fontSize * (10 / 16) * codeLines.length.toString().length;
    usePropertyMenu(
      [
        {
          itemType: "action",
          propertyName: "openConfig",
          tooltip: "Open Config"
        },
        {
          itemType: "toggle",
          propertyName: "wordWrap",
          tooltip: "Toggle word wrap",
          isToggled: wordWrap
        }
      ],
      ({ propertyName }) => {
        if (propertyName === "openConfig") {
          waitForTask(
            new Promise((resolve) => {
              figma.showUI(__html__, { width: 300, height: 340, themeColors: true });
              figma.ui.postMessage({
                type: "init",
                data: { textContent }
              });
              figma.ui.onmessage = (msg) => {
                if (msg.type === "update") {
                  const { textContent: newText, spanContent: newSpan, width: newWidth } = msg.data;
                  setTextContent(newText || "");
                  setSpanContent(newSpan || "");
                  if (newWidth) setWidth(newWidth);
                } else if (msg.type === "close") {
                  figma.closePlugin();
                  resolve();
                }
              };
            })
          );
        } else if (propertyName === "wordWrap") {
          setWordWrap(!wordWrap);
        }
      }
    );
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "vertical",
        spacing: 0,
        padding: 0,
        width: wordWrap ? width : "hug-contents",
        height: "hug-contents",
        fill: "#1a1a1a",
        cornerRadius: 4
      },
      codeLines.length > 0 ? codeLines.map((line, index) => /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          key: index,
          direction: "horizontal",
          spacing: 0,
          padding: 0,
          width: wordWrap ? width : "hug-contents",
          height: "hug-contents"
        },
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            direction: "vertical",
            spacing: 0,
            padding: { top: index === 0 ? 8 : 0, bottom: index === codeLines.length - 1 ? 8 : 0, left: padding, right: padding },
            width: "hug-contents",
            height: "fill-parent",
            fill: "#252526"
          },
          /* @__PURE__ */ figma.widget.h(
            Text,
            {
              fontSize,
              fontFamily: "Roboto Mono",
              fill: "#858585",
              width: numberWidth,
              horizontalAlignText: "right"
            },
            index + 1
          )
        ),
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            direction: "vertical",
            spacing: 0,
            padding: { top: index === 0 ? 8 : 0, bottom: index === codeLines.length - 1 ? 8 : 0, left: padding, right: padding },
            width: wordWrap ? "fill-parent" : "hug-contents",
            height: "hug-contents",
            horizontalAlignItems: "start"
          },
          /* @__PURE__ */ figma.widget.h(
            Text,
            {
              fontSize,
              fontFamily: "Roboto Mono",
              fill: "#D4D4D4",
              width: wordWrap ? "fill-parent" : "hug-contents",
              horizontalAlignText: "left"
            },
            line.includes("<Span fill=") ? parseSpanString(line) : line || " "
          )
        )
      )) : /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          direction: "horizontal",
          spacing: 0,
          padding: 0,
          width: "fill-parent",
          height: "hug-contents"
        },
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            direction: "vertical",
            spacing: 0,
            padding: { top: 8, bottom: 8, left: padding, right: padding },
            width: "hug-contents",
            height: "fill-parent",
            fill: "#252526"
          },
          /* @__PURE__ */ figma.widget.h(
            Text,
            {
              fontSize,
              fontFamily: "Roboto Mono",
              fill: "#858585",
              width: "hug-contents",
              horizontalAlignText: "right"
            },
            "1"
          )
        ),
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            direction: "vertical",
            spacing: 0,
            padding: { top: 8, bottom: 8, left: padding, right: padding },
            width: "hug-contents",
            height: "hug-contents",
            fill: "#1E1E1E",
            horizontalAlignItems: "start"
          },
          /* @__PURE__ */ figma.widget.h(
            Text,
            {
              fontSize,
              fontFamily: "Roboto Mono",
              fill: "#858585",
              width: "hug-contents",
              horizontalAlignText: "left"
            }
          )
        )
      )
    );
  }
  widget.register(Widget);
})();
