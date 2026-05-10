"use strict";
(() => {
  // tool_plugin/ColorCard/widget-src/code.tsx
  var { widget } = figma;
  var { useSyncedState, usePropertyMenu, AutoLayout, Text, waitForTask, Rectangle, Frame, Line, useEffect, Input } = widget;
  function Widget() {
    let [vieBoxW, vieBoxH] = [512, 512];
    let setBoxW = 130;
    let textColor = "#202020";
    let [mainColor1, mainColor2, mainColor3] = new Array(3).fill("#ACACAC");
    let [color1, color2, color3, color4, color5, color6, color7, color8, color9, color10] = new Array(10).fill("#C7C7C7");
    let mainColors = [mainColor1, mainColor2, mainColor3];
    let colors = [color1, color2, color3, color4, color5, color6, color7, color8, color9, color10];
    usePropertyMenu(
      [],
      ({ propertyName }) => {
      }
    );
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        name: "allBox",
        direction: "horizontal",
        spacing: 0,
        padding: 0,
        width: vieBoxW + setBoxW,
        height: vieBoxH,
        stroke: "#E0E0E0",
        strokeWidth: 4,
        strokeAlign: "outside",
        cornerRadius: 20,
        effect: {
          type: "drop-shadow",
          color: { r: 0, g: 0, b: 0, a: 0.6 },
          offset: { x: 0, y: 2 },
          blur: 10,
          showShadowBehindNode: false
        }
      },
      /* @__PURE__ */ figma.widget.h(
        Frame,
        {
          width: vieBoxW,
          height: vieBoxH,
          stroke: "#D9D9D9",
          strokeWidth: 10,
          strokeAlign: "outside",
          cornerRadius: 20
        },
        /* @__PURE__ */ figma.widget.h(
          Frame,
          {
            width: vieBoxW,
            height: vieBoxH,
            stroke: "#8f8f8f",
            strokeWidth: 1,
            strokeAlign: "inside",
            cornerRadius: 20,
            fill: "#ffffff10",
            effect: {
              type: "background-blur",
              blur: 40
            }
          }
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "cardBox",
          direction: "vertical",
          spacing: 0,
          padding: 0,
          minWidth: setBoxW,
          width: "fill-parent",
          height: "fill-parent",
          fill: "#D9D9D9"
        },
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            name: "colorCard",
            direction: "vertical",
            spacing: 10,
            padding: 10,
            width: "fill-parent",
            height: "fill-parent"
          },
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              name: "mainColor-box",
              direction: "horizontal",
              spacing: "auto",
              padding: { left: 0, top: 10, right: 0, bottom: 0 },
              width: "fill-parent",
              height: "hug-contents"
            },
            /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                name: "mainColor",
                direction: "vertical",
                spacing: 10,
                padding: 0,
                minWidth: 86,
                width: "fill-parent",
                height: "hug-contents",
                horizontalAlignItems: "center"
              },
              mainColors.map((color, index) => /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  key: index,
                  name: `mainColor_${index}`,
                  cornerRadius: 10,
                  width: 70,
                  height: 70,
                  fill: color
                }
              ))
            ),
            /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                name: "mainColor-title",
                direction: "horizontal",
                spacing: 10,
                padding: 0,
                width: "hug-contents",
                height: "hug-contents",
                verticalAlignItems: "center",
                rotation: -90
              },
              /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  width: 4,
                  height: 4,
                  fill: textColor
                }
              ),
              /* @__PURE__ */ figma.widget.h(
                Text,
                {
                  fontSize: 12,
                  fill: textColor
                },
                "MAIN"
              ),
              /* @__PURE__ */ figma.widget.h(
                Text,
                {
                  fontSize: 12,
                  fill: textColor
                },
                "\u2225\u2225\u2225\u2225\u2225"
              )
            )
          ),
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              name: "otherColor-box",
              direction: "horizontal",
              spacing: "auto",
              padding: 0,
              width: "fill-parent",
              height: "fill-parent"
            },
            /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                name: "otherColor-center",
                direction: "horizontal",
                padding: { horizontal: 8, vertical: 0 },
                minWidth: 86,
                width: "fill-parent",
                height: "fill-parent",
                horizontalAlignItems: "center"
              },
              /* @__PURE__ */ figma.widget.h(
                AutoLayout,
                {
                  name: "otherColor",
                  direction: "horizontal",
                  wrap: true,
                  spacing: 6,
                  padding: 10,
                  minWidth: 86,
                  width: "fill-parent",
                  height: "fill-parent",
                  horizontalAlignItems: "center",
                  fill: "#E9E9E9",
                  cornerRadius: 10
                },
                colors.map((color, index) => /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    key: index,
                    name: `otherColor_${index}`,
                    cornerRadius: 4,
                    width: 30,
                    height: 30,
                    fill: color
                  }
                ))
              )
            ),
            /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                name: "otherColor-title",
                direction: "horizontal",
                spacing: 10,
                padding: 0,
                width: "hug-contents",
                height: "hug-contents",
                verticalAlignItems: "center",
                rotation: -90
              },
              /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  width: 4,
                  height: 4,
                  fill: textColor
                }
              ),
              /* @__PURE__ */ figma.widget.h(
                Text,
                {
                  fontSize: 12,
                  fill: textColor
                },
                "OTHER"
              ),
              /* @__PURE__ */ figma.widget.h(
                Text,
                {
                  fontSize: 12,
                  fill: textColor
                },
                "\u2225\u2225\u2225\u2225\u2225"
              )
            )
          )
        ),
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            name: "btnBox",
            spacing: 4,
            padding: { left: 18, top: 0, right: 36, bottom: 18 },
            direction: "vertical",
            width: "fill-parent",
            height: "hug-contents",
            verticalAlignItems: "end"
          },
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              name: "btn_export",
              spacing: 0,
              padding: { horizontal: 8, vertical: 0 },
              width: "fill-parent",
              height: "hug-contents",
              horizontalAlignItems: "end",
              fill: {
                type: "gradient-linear",
                gradientHandlePositions: [
                  { x: 0, y: 0.5 },
                  { x: 1, y: 1 },
                  { x: 0, y: 0 }
                ],
                gradientStops: [
                  { position: 0, color: { r: 0.8, g: 0.8, b: 0.8, a: 1 } },
                  { position: 1, color: { r: 0.69, g: 0.69, b: 0.69, a: 1 } }
                ]
              },
              cornerRadius: 4
            },
            /* @__PURE__ */ figma.widget.h(
              Text,
              {
                fontSize: 10,
                fill: textColor
              },
              ">>>",
              " EXPORT"
            )
          ),
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              name: "btn_start",
              spacing: 0,
              padding: { horizontal: 8, vertical: 0 },
              width: "fill-parent",
              height: "hug-contents",
              horizontalAlignItems: "end",
              cornerRadius: 4,
              fill: {
                type: "gradient-linear",
                gradientHandlePositions: [
                  { x: 0, y: 0.5 },
                  { x: 1, y: 1 },
                  { x: 0, y: 0 }
                ],
                gradientStops: [
                  { position: 0, color: { r: 0.8, g: 0.8, b: 0.8, a: 1 } },
                  { position: 1, color: { r: 0.28, g: 0.83, b: 0.64, a: 1 } }
                ]
              }
            },
            /* @__PURE__ */ figma.widget.h(
              Text,
              {
                fontSize: 10,
                fill: textColor
              },
              ">>>",
              " START"
            )
          )
        )
      )
    );
  }
  widget.register(Widget);
})();
