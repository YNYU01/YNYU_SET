"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };

  // tool_plugin/TableView/widget-src/code.tsx
  var { widget } = figma;
  var { useSyncedState, usePropertyMenu, AutoLayout, Text, waitForTask, Rectangle, Frame, Line, useEffect, Input } = widget;
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
      a: 1
    } : null;
  }
  function hslToRgb(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p2, q2, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
        if (t < 1 / 2) return q2;
        if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
        return p2;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  }
  function rgbToHsl(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const r = Math.round(rgb.r * 255);
    const g = Math.round(rgb.g * 255);
    const b = Math.round(rgb.b * 255);
    return rgbToHsl(r, g, b);
  }
  var colorMappingPresets = {
    "Normal": {
      //普通
      primaryTarget: "bgColor",
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 10, max: 90 },
      lightnessRange: { level: [1, 2, 3, 4, 11, 12, 13, 14, 15], defaultLevel: 13 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
      cellFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 20, relativeTo: "headerFillColor" },
      indexTextColor: {
        normal: { contrastThreshold: 50 }
      },
      // 样式配置
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 1
    },
    "Soft": {
      //柔和
      primaryTarget: "bgColor",
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 10, max: 80 },
      lightnessRange: { level: [1, 2, 3, 4, 5, 11, 12, 13, 14, 15], defaultLevel: 14 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
      cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
      headerTextColor: { lightnessOffset: 30, relativeTo: "headerFillColor" },
      cellTextColor: { lightnessOffset: 30, relativeTo: "headerFillColor" },
      strokeColor: { lightnessOffset: 10, relativeTo: "headerFillColor" },
      indexTextColor: {
        normal: { lightnessOffset: 30, relativeTo: "headerFillColor" }
      },
      indexStrokeColor: {
        pick: { lightnessOffset: 40, relativeTo: "headerFillColor" }
      },
      indexBgColor: {
        pick: { lightnessOffset: 40, relativeTo: "headerFillColor" }
      },
      // 样式配置
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 1
    },
    "Fashion": {
      //时尚
      primaryTarget: "headerFillColor",
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 50, max: 90 },
      lightnessRange: { level: [9, 10, 11], defaultLevel: 10 },
      bgColor: { lightnessOffset: 405, saturationMultiplier: 0.95 },
      headerFillColor: {},
      cellFillColor: { lightnessOffset: 10, saturationMultiplier: 1, opacity: 0.3 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 0.1, relativeTo: "headerFillColor" },
      // 样式配置
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 4
    },
    "Contrast": {
      //对比
      // primaryTarget 设为 null，表示主题色不直接赋予任何部位，所有部位都基于主题色计算衍生值
      primaryTarget: null,
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 50, max: 90 },
      lightnessRange: { level: [9, 10, 11, 12, 13, 14, 15], defaultLevel: 12 },
      bgColor: { color: "white" },
      headerFillColor: { color: "black" },
      cellFillColor: { lightnessOffset: 0, saturationMultiplier: 1, opacity: 0.8 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { color: "black" },
      indexBgColor: {
        pick: { lightnessOffset: 20, relativeTo: "cellFillColor" }
      },
      indexStrokeColor: {
        pick: { lightnessOffset: 20, relativeTo: "cellFillColor" }
      },
      indexTextColor: {
        pick: { color: "black" }
      },
      // 样式配置
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 1
    },
    "Vivid": {
      //鲜艳
      primaryTarget: "bgColor",
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 80, max: 100 },
      lightnessRange: { level: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], defaultLevel: 10 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
      cellFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 10, relativeTo: "bgColor" },
      // 样式配置
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 1
    },
    "Pastel": {
      //粉嫩
      primaryTarget: "bgColor",
      rgbOffset: { r: -10, g: -40, b: 20 },
      saturationRange: { min: 40, max: 100 },
      lightnessRange: { level: [12, 13, 14, 15], defaultLevel: 14 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
      cellFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 10, relativeTo: "bgColor" },
      // 样式配置
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 1
    },
    "Retro": {
      //复古
      primaryTarget: "bgColor",
      rgbOffset: { r: 40, g: 30, b: -20 },
      saturationRange: { min: 10, max: 70 },
      lightnessRange: { level: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], defaultLevel: 10 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5 },
      cellFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 0, relativeTo: "bgColor" },
      indexBgColor: {
        pick: { lightnessOffset: 60, relativeTo: "bgColor" }
      },
      // 样式配置
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 4
    },
    "Neon": {
      //霓虹
      primaryTarget: null,
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 80, max: 100 },
      lightnessRange: { level: [5, 6, 7, 8, 9, 10, 11, 12], defaultLevel: 7 },
      bgColor: { color: "black" },
      headerFillColor: { lightnessOffset: 5, saturationMultiplier: 1 },
      cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
      headerTextColor: { color: "black" },
      cellTextColor: { color: "theme" },
      strokeColor: { color: "theme" },
      indexBgColor: {
        pick: { color: "white" }
      },
      // 样式配置
      hasHeader: true,
      fillStyle: 2,
      strokeStyle: 2
    }
  };
  function calculateThemeColors(themeColorHex, levelColorHex, mappingConfig, colorMode = "color") {
    const themeHsl = hexToHsl(themeColorHex);
    if (!themeHsl) {
      return {
        bgColor: "#2D2D2D",
        headerFillColor: "#3D3D3D",
        headerTextColor: "#FFFFFF",
        cellFillColor: "#2D2D2D",
        cellTextColor: "#D4D4D4",
        strokeColor: "#666666",
        indexBgColor: { normal: "transparent", pick: "#D4D4D4" },
        indexStrokeColor: { normal: "#666666", pick: "#666666" },
        indexTextColor: { normal: "#666666", pick: "#2E2E2E" }
      };
    }
    const levelRgb = hexToRgb(levelColorHex);
    if (!levelRgb) {
      return {
        bgColor: "#2D2D2D",
        headerFillColor: "#3D3D3D",
        headerTextColor: "#FFFFFF",
        cellFillColor: "#2D2D2D",
        cellTextColor: "#D4D4D4",
        strokeColor: "#666666",
        indexBgColor: { normal: "transparent", pick: "#D4D4D4" },
        indexStrokeColor: { normal: "#666666", pick: "#666666" },
        indexTextColor: { normal: "#666666", pick: "#2E2E2E" }
      };
    }
    const levelR = Math.round(levelRgb.r * 255);
    const levelG = Math.round(levelRgb.g * 255);
    const levelB = Math.round(levelRgb.b * 255);
    const levelHsl = rgbToHsl(levelR, levelG, levelB);
    let lightness = levelHsl.l;
    const isGray = themeHsl.s < 5;
    const actualHue = themeHsl.h;
    const hasRetroOffset = mappingConfig.rgbOffset && (mappingConfig.rgbOffset.r !== void 0 && mappingConfig.rgbOffset.r !== 0 || mappingConfig.rgbOffset.g !== void 0 && mappingConfig.rgbOffset.g !== 0 || mappingConfig.rgbOffset.b !== void 0 && mappingConfig.rgbOffset.b !== 0);
    let baseSaturation = isGray ? 0 : themeHsl.s;
    if (mappingConfig.saturationRange) {
      const { min, max } = mappingConfig.saturationRange;
      baseSaturation = Math.max(min, Math.min(max, baseSaturation));
    } else {
      baseSaturation = isGray ? 0 : Math.max(10, Math.min(90, baseSaturation));
    }
    if (colorMode === "monochrome") {
      if (hasRetroOffset) {
        baseSaturation = Math.min(10, baseSaturation);
      } else {
        baseSaturation = 0;
      }
    }
    let primaryL = lightness;
    let primaryS = baseSaturation;
    const calculateColor = (target, config) => {
      if ((config == null ? void 0 : config.color) === "black") {
        return { l: 0, s: 0, isFixed: true, fixedColor: "#000000" };
      }
      if ((config == null ? void 0 : config.color) === "white") {
        return { l: 100, s: 0, isFixed: true, fixedColor: "#FFFFFF" };
      }
      if (mappingConfig.primaryTarget === target) {
        return { l: primaryL, s: primaryS };
      }
      const configL = (config == null ? void 0 : config.lightnessOffset) || 0;
      const configS = (config == null ? void 0 : config.saturationOffset) || 0;
      const configSMul = (config == null ? void 0 : config.saturationMultiplier) || 1;
      let targetL = primaryL + configL;
      let targetS = (primaryS + configS) * configSMul;
      targetL = Math.max(0, Math.min(100, targetL));
      targetS = Math.max(0, Math.min(100, targetS));
      if (isGray) targetS = 0;
      if (colorMode === "monochrome") {
        if (hasRetroOffset) {
          targetS = Math.min(10, targetS);
        } else {
          targetS = 0;
        }
      }
      return { l: targetL, s: targetS };
    };
    const applyRgbOffset = (r, g, b, globalOffset, localOffset) => {
      let finalR = r;
      let finalG = g;
      let finalB = b;
      const hasRetroOffset2 = globalOffset && (globalOffset.r !== void 0 && globalOffset.r !== 0 || globalOffset.g !== void 0 && globalOffset.g !== 0 || globalOffset.b !== void 0 && globalOffset.b !== 0);
      if (isGray && !hasRetroOffset2) {
        return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
      }
      if (globalOffset) {
        finalR += globalOffset.r || 0;
        finalG += globalOffset.g || 0;
        finalB += globalOffset.b || 0;
      }
      if (localOffset) {
        finalR += localOffset.r || 0;
        finalG += localOffset.g || 0;
        finalB += localOffset.b || 0;
      }
      finalR = Math.max(0, Math.min(255, Math.round(finalR)));
      finalG = Math.max(0, Math.min(255, Math.round(finalG)));
      finalB = Math.max(0, Math.min(255, Math.round(finalB)));
      return rgbToHex(finalR, finalG, finalB);
    };
    const bgConfig = calculateColor("bgColor", mappingConfig.bgColor);
    const bgColor = bgConfig.isFixed ? bgConfig.fixedColor : (() => {
      var _a;
      const rgb = hslToRgb(actualHue, bgConfig.s, bgConfig.l);
      return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, (_a = mappingConfig.bgColor) == null ? void 0 : _a.rgbOffset);
    })();
    const headerConfig = calculateColor("headerFillColor", mappingConfig.headerFillColor);
    const headerFillColor = headerConfig.isFixed ? headerConfig.fixedColor : (() => {
      var _a;
      const rgb = hslToRgb(actualHue, headerConfig.s, headerConfig.l);
      return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, (_a = mappingConfig.headerFillColor) == null ? void 0 : _a.rgbOffset);
    })();
    const cellConfig = calculateColor("cellFillColor", mappingConfig.cellFillColor);
    const cellFillColor = cellConfig.isFixed ? cellConfig.fixedColor : (() => {
      var _a;
      const rgb = hslToRgb(actualHue, cellConfig.s, cellConfig.l);
      return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, (_a = mappingConfig.cellFillColor) == null ? void 0 : _a.rgbOffset);
    })();
    let headerTextColor;
    const headerTextConfig = mappingConfig.headerTextColor;
    if ((headerTextConfig == null ? void 0 : headerTextConfig.color) === "black") {
      headerTextColor = "#000000";
    } else if ((headerTextConfig == null ? void 0 : headerTextConfig.color) === "white") {
      headerTextColor = "#FFFFFF";
    } else if ((headerTextConfig == null ? void 0 : headerTextConfig.color) === "theme") {
      const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
      headerTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, headerTextConfig == null ? void 0 : headerTextConfig.rgbOffset);
    } else if ((headerTextConfig == null ? void 0 : headerTextConfig.relativeTo) || (headerTextConfig == null ? void 0 : headerTextConfig.lightnessOffset) !== void 0) {
      let headerTextL;
      let headerTextS;
      if (headerTextConfig.relativeTo) {
        let baseL;
        let baseS;
        if (headerTextConfig.relativeTo === "bgColor") {
          baseL = bgConfig.l;
          baseS = bgConfig.s;
        } else if (headerTextConfig.relativeTo === "headerFillColor") {
          baseL = headerConfig.l;
          baseS = headerConfig.s;
        } else {
          baseL = cellConfig.l;
          baseS = cellConfig.s;
        }
        const offset = headerTextConfig.lightnessOffset || 15;
        if (lightness < 50) {
          headerTextL = Math.min(100, baseL + offset);
        } else {
          headerTextL = Math.max(0, baseL - offset);
        }
        headerTextS = baseS;
      } else {
        const offset = (headerTextConfig == null ? void 0 : headerTextConfig.lightnessOffset) || 15;
        if (lightness < 50) {
          headerTextL = Math.min(100, headerConfig.l + offset);
        } else {
          headerTextL = Math.max(0, headerConfig.l - offset);
        }
        headerTextS = headerConfig.s;
      }
      if (colorMode === "monochrome") {
        if (hasRetroOffset) {
          headerTextS = Math.min(10, headerTextS);
        } else {
          headerTextS = 0;
        }
      }
      const headerTextRgb = hslToRgb(actualHue, headerTextS, headerTextL);
      headerTextColor = applyRgbOffset(headerTextRgb.r, headerTextRgb.g, headerTextRgb.b, mappingConfig.rgbOffset, headerTextConfig == null ? void 0 : headerTextConfig.rgbOffset);
    } else {
      const headerThreshold = (headerTextConfig == null ? void 0 : headerTextConfig.contrastThreshold) || 50;
      headerTextColor = headerConfig.l >= headerThreshold ? "#000000" : "#FFFFFF";
    }
    let cellTextColor;
    const cellTextConfig = mappingConfig.cellTextColor;
    if ((cellTextConfig == null ? void 0 : cellTextConfig.color) === "black") {
      cellTextColor = "#000000";
    } else if ((cellTextConfig == null ? void 0 : cellTextConfig.color) === "white") {
      cellTextColor = "#FFFFFF";
    } else if ((cellTextConfig == null ? void 0 : cellTextConfig.color) === "theme") {
      const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
      cellTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, cellTextConfig == null ? void 0 : cellTextConfig.rgbOffset);
    } else if ((cellTextConfig == null ? void 0 : cellTextConfig.relativeTo) || (cellTextConfig == null ? void 0 : cellTextConfig.lightnessOffset) !== void 0) {
      let cellTextL;
      let cellTextS;
      if (cellTextConfig.relativeTo) {
        let baseL;
        let baseS;
        if (cellTextConfig.relativeTo === "bgColor") {
          baseL = bgConfig.l;
          baseS = bgConfig.s;
        } else if (cellTextConfig.relativeTo === "headerFillColor") {
          baseL = headerConfig.l;
          baseS = headerConfig.s;
        } else {
          baseL = cellConfig.l;
          baseS = cellConfig.s;
        }
        const offset = cellTextConfig.lightnessOffset || 15;
        if (lightness < 50) {
          cellTextL = Math.min(100, baseL + offset);
        } else {
          cellTextL = Math.max(0, baseL - offset);
        }
        cellTextS = baseS;
      } else {
        const offset = (cellTextConfig == null ? void 0 : cellTextConfig.lightnessOffset) || 15;
        if (lightness < 50) {
          cellTextL = Math.min(100, cellConfig.l + offset);
        } else {
          cellTextL = Math.max(0, cellConfig.l - offset);
        }
        cellTextS = cellConfig.s;
      }
      if (colorMode === "monochrome") {
        if (hasRetroOffset) {
          cellTextS = Math.min(10, cellTextS);
        } else {
          cellTextS = 0;
        }
      }
      const cellTextRgb = hslToRgb(actualHue, cellTextS, cellTextL);
      cellTextColor = applyRgbOffset(cellTextRgb.r, cellTextRgb.g, cellTextRgb.b, mappingConfig.rgbOffset, cellTextConfig == null ? void 0 : cellTextConfig.rgbOffset);
    } else {
      const cellThreshold = (cellTextConfig == null ? void 0 : cellTextConfig.contrastThreshold) || 50;
      cellTextColor = cellConfig.l >= cellThreshold ? "#000000" : "#FFFFFF";
    }
    const strokeConfig = mappingConfig.strokeColor;
    let strokeColor;
    if ((strokeConfig == null ? void 0 : strokeConfig.color) === "black") {
      strokeColor = "#000000";
    } else if ((strokeConfig == null ? void 0 : strokeConfig.color) === "white") {
      strokeColor = "#FFFFFF";
    } else if ((strokeConfig == null ? void 0 : strokeConfig.color) === "theme") {
      const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
      strokeColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, strokeConfig == null ? void 0 : strokeConfig.rgbOffset);
    } else {
      let strokeL;
      let strokeS;
      if (strokeConfig == null ? void 0 : strokeConfig.relativeTo) {
        let baseL;
        let baseS;
        if (strokeConfig.relativeTo === "bgColor") {
          baseL = bgConfig.l;
          baseS = bgConfig.s;
        } else if (strokeConfig.relativeTo === "headerFillColor") {
          baseL = headerConfig.l;
          baseS = headerConfig.s;
        } else {
          baseL = cellConfig.l;
          baseS = cellConfig.s;
        }
        const offset = strokeConfig.lightnessOffset || 15;
        if (lightness < 50) {
          strokeL = Math.min(100, baseL + offset);
        } else {
          strokeL = Math.max(0, baseL - offset);
        }
        strokeS = baseS;
      } else {
        const offset = (strokeConfig == null ? void 0 : strokeConfig.lightnessOffset) || 15;
        if (lightness < 50) {
          strokeL = Math.min(100, headerConfig.l + offset);
        } else {
          strokeL = Math.max(0, headerConfig.l - offset);
        }
        strokeS = headerConfig.s;
      }
      if (colorMode === "monochrome") {
        if (hasRetroOffset) {
          strokeS = Math.min(10, strokeS);
        } else {
          strokeS = 0;
        }
      }
      const strokeRgb = hslToRgb(actualHue, strokeS, strokeL);
      strokeColor = applyRgbOffset(strokeRgb.r, strokeRgb.g, strokeRgb.b, mappingConfig.rgbOffset, strokeConfig == null ? void 0 : strokeConfig.rgbOffset);
    }
    const calculateIndexColor = (config, defaultColor) => {
      if (!config) {
        return defaultColor;
      }
      if (config.color === "black") {
        return "#000000";
      } else if (config.color === "white") {
        return "#FFFFFF";
      } else if (config.color === "theme") {
        const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
        return applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, config.rgbOffset);
      } else {
        let indexL;
        let indexS;
        if (config.relativeTo) {
          let baseL;
          let baseS;
          if (config.relativeTo === "bgColor") {
            baseL = bgConfig.l;
            baseS = bgConfig.s;
          } else if (config.relativeTo === "headerFillColor") {
            baseL = headerConfig.l;
            baseS = headerConfig.s;
          } else {
            baseL = cellConfig.l;
            baseS = cellConfig.s;
          }
          const offset = config.lightnessOffset || 15;
          if (lightness < 50) {
            indexL = Math.min(100, baseL + offset);
          } else {
            indexL = Math.max(0, baseL - offset);
          }
          indexS = baseS;
        } else {
          const offset = config.lightnessOffset || 15;
          if (lightness < 50) {
            indexL = Math.min(100, headerConfig.l + offset);
          } else {
            indexL = Math.max(0, headerConfig.l - offset);
          }
          indexS = headerConfig.s;
        }
        if (colorMode === "monochrome") {
          if (hasRetroOffset) {
            indexS = Math.min(10, indexS);
          } else {
            indexS = 0;
          }
        }
        const indexRgb = hslToRgb(actualHue, indexS, indexL);
        return applyRgbOffset(indexRgb.r, indexRgb.g, indexRgb.b, mappingConfig.rgbOffset, config.rgbOffset);
      }
    };
    const indexBgConfig = mappingConfig.indexBgColor;
    let indexBgColor;
    if (indexBgConfig && indexBgConfig.colors) {
      indexBgColor = {
        normal: indexBgConfig.colors[0] || "transparent",
        pick: indexBgConfig.colors[1] || "transparent"
      };
    } else {
      indexBgColor = {
        normal: calculateIndexColor(indexBgConfig == null ? void 0 : indexBgConfig.normal, "transparent"),
        pick: calculateIndexColor(indexBgConfig == null ? void 0 : indexBgConfig.pick, cellTextColor)
      };
    }
    const indexStrokeConfig = mappingConfig.indexStrokeColor;
    let indexStrokeColor;
    if (indexStrokeConfig && indexStrokeConfig.colors) {
      indexStrokeColor = {
        normal: indexStrokeConfig.colors[0] || strokeColor,
        pick: indexStrokeConfig.colors[1] || strokeColor
      };
    } else {
      const normalStrokeColor = calculateIndexColor(indexStrokeConfig == null ? void 0 : indexStrokeConfig.normal, strokeColor);
      const pickConfig = indexStrokeConfig == null ? void 0 : indexStrokeConfig.pick;
      let pickStrokeColor;
      if (pickConfig && (pickConfig.color || pickConfig.lightnessOffset !== void 0 || pickConfig.relativeTo)) {
        pickStrokeColor = calculateIndexColor(pickConfig, strokeColor);
      } else {
        pickStrokeColor = indexBgColor.pick;
      }
      indexStrokeColor = {
        normal: normalStrokeColor,
        pick: pickStrokeColor
      };
    }
    const indexTextConfig = mappingConfig.indexTextColor;
    let indexTextColor;
    if (indexTextConfig && indexTextConfig.colors) {
      indexTextColor = {
        normal: indexTextConfig.colors[0] || strokeColor,
        pick: indexTextConfig.colors[1] || bgColor
      };
    } else {
      let normalColor;
      const normalConfig = indexTextConfig == null ? void 0 : indexTextConfig.normal;
      if ((normalConfig == null ? void 0 : normalConfig.color) === "black") {
        normalColor = "#000000";
      } else if ((normalConfig == null ? void 0 : normalConfig.color) === "white") {
        normalColor = "#FFFFFF";
      } else if ((normalConfig == null ? void 0 : normalConfig.color) === "theme") {
        const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
        normalColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, normalConfig == null ? void 0 : normalConfig.rgbOffset);
      } else if ((normalConfig == null ? void 0 : normalConfig.contrastThreshold) !== void 0) {
        const normalBgColor = indexBgColor.normal;
        let normalBgL;
        if (normalBgColor === "transparent" || !normalBgColor) {
          normalBgL = bgConfig.l;
        } else {
          const normalBgRgb = hexToRgb(normalBgColor);
          if (normalBgRgb) {
            const r = Math.round(normalBgRgb.r * 255);
            const g = Math.round(normalBgRgb.g * 255);
            const b = Math.round(normalBgRgb.b * 255);
            const normalBgHsl = rgbToHsl(r, g, b);
            normalBgL = normalBgHsl.l;
          } else {
            normalBgL = bgConfig.l;
          }
        }
        const threshold = normalConfig.contrastThreshold;
        normalColor = normalBgL >= threshold ? "#000000" : "#FFFFFF";
      } else {
        normalColor = calculateIndexColor(normalConfig, strokeColor);
      }
      let pickColor;
      const pickConfig = indexTextConfig == null ? void 0 : indexTextConfig.pick;
      if ((pickConfig == null ? void 0 : pickConfig.color) === "black") {
        pickColor = "#000000";
      } else if ((pickConfig == null ? void 0 : pickConfig.color) === "white") {
        pickColor = "#FFFFFF";
      } else if ((pickConfig == null ? void 0 : pickConfig.color) === "theme") {
        const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
        pickColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset, pickConfig == null ? void 0 : pickConfig.rgbOffset);
      } else if ((pickConfig == null ? void 0 : pickConfig.contrastThreshold) !== void 0) {
        const pickBgColor = indexBgColor.pick;
        let pickBgL;
        if (pickBgColor === "transparent" || !pickBgColor) {
          pickBgL = bgConfig.l;
        } else {
          const pickBgRgb = hexToRgb(pickBgColor);
          if (pickBgRgb) {
            const r = Math.round(pickBgRgb.r * 255);
            const g = Math.round(pickBgRgb.g * 255);
            const b = Math.round(pickBgRgb.b * 255);
            const pickBgHsl = rgbToHsl(r, g, b);
            pickBgL = pickBgHsl.l;
          } else {
            pickBgL = bgConfig.l;
          }
        }
        const threshold = pickConfig.contrastThreshold;
        pickColor = pickBgL >= threshold ? "#000000" : "#FFFFFF";
      } else {
        pickColor = calculateIndexColor(pickConfig, bgColor);
      }
      indexTextColor = {
        normal: normalColor,
        pick: pickColor
      };
    }
    return {
      bgColor,
      headerFillColor,
      headerTextColor,
      cellFillColor,
      cellTextColor,
      strokeColor,
      indexBgColor,
      indexStrokeColor,
      indexTextColor
    };
  }
  var TableRenderer = class {
    constructor(config, callbacks) {
      this.themeColors = null;
      this.config = config;
      this.onPickRow = callbacks == null ? void 0 : callbacks.onPickRow;
      this.onPickCol = callbacks == null ? void 0 : callbacks.onPickCol;
      this.onSetRowHeight = callbacks == null ? void 0 : callbacks.onSetRowHeight;
      this.onSetColWidth = callbacks == null ? void 0 : callbacks.onSetColWidth;
      this.calculateThemeColors();
    }
    // 获取当前配置
    getConfig() {
      return __spreadValues({}, this.config);
    }
    // 更新配置（部分更新）
    updateConfig(partial) {
      this.config = __spreadValues(__spreadValues({}, this.config), partial);
      if (partial.theme) {
        this.calculateThemeColors();
      }
    }
    // 切换单色模式（只改颜色）
    toggleColorMode() {
      const newMode = this.config.theme.colorMode === "color" ? "monochrome" : "color";
      this.updateConfig({
        theme: __spreadProps(__spreadValues({}, this.config.theme), { colorMode: newMode })
      });
    }
    // 切换行列（只改数据数组）
    swapRowColumn() {
      const newData = this.transposeData(this.config.data);
      this.updateConfig({
        data: newData,
        isRowColumnSwapped: !this.config.isRowColumnSwapped
      });
    }
    // 显隐行列数（只改布尔）
    toggleRowColHeaders() {
      this.updateConfig({
        showRowColHeaders: !this.config.showRowColHeaders
      });
    }
    // 切换表头（只改布尔）
    toggleTableHeader() {
      this.updateConfig({
        theme: __spreadProps(__spreadValues({}, this.config.theme), { hasHeader: !this.config.theme.hasHeader })
      });
    }
    // 设置填充样式
    setFillStyle(style) {
      this.updateConfig({
        theme: __spreadProps(__spreadValues({}, this.config.theme), { fillStyle: style })
      });
    }
    // 设置描边样式
    setStrokeStyle(style) {
      this.updateConfig({
        theme: __spreadProps(__spreadValues({}, this.config.theme), { strokeStyle: style })
      });
    }
    // 选择行
    pickRow(rowIndex) {
      const newPickedRowIndex = this.config.pickedRowIndex === rowIndex ? -1 : rowIndex;
      this.updateConfig({
        pickedRowIndex: newPickedRowIndex,
        pickedColIndex: -1
        // 选中行时，取消列选中
      });
    }
    // 选择列
    pickCol(colIndex) {
      const newPickedColIndex = this.config.pickedColIndex === colIndex ? -1 : colIndex;
      this.updateConfig({
        pickedColIndex: newPickedColIndex,
        pickedRowIndex: -1
        // 选中列时，取消行选中
      });
    }
    // 计算主题色（内部方法）
    calculateThemeColors() {
      const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets["Fashion"];
      this.themeColors = calculateThemeColors(
        this.config.theme.hue,
        this.config.theme.level,
        currentMappingConfig,
        this.config.theme.colorMode
      );
    }
    // 获取主题色（公开方法）
    getThemeColors() {
      if (!this.themeColors) {
        this.calculateThemeColors();
      }
      return this.themeColors;
    }
    // 转置数据（辅助方法）
    transposeData(data) {
      if (data.length === 0) return [];
      const maxCols = Math.max(...data.map((col) => col.length));
      const transposed = [];
      for (let i = 0; i < maxCols; i++) {
        transposed.push(data.map((col) => col[i] || ""));
      }
      return transposed;
    }
    // ============================================================================
    // 渲染辅助方法
    // ============================================================================
    // 获取最小行高（根据字号和 padding 计算）
    getMinRowHeight() {
      return this.config.fontSize + 16;
    }
    // 获取最小列宽（根据字号和 padding 计算）
    getMinColWidth() {
      return this.config.fontSize + 16;
    }
    // 获取默认行高（根据字号计算，包含 padding）
    getDefaultRowHeight() {
      return this.getMinRowHeight();
    }
    // 获取列宽配置（如果配置中没有，返回默认值 'fill'）
    getColWidth(colIndex) {
      const width = this.config.colWidths[colIndex];
      if (width === void 0) return "fill";
      if (typeof width === "number") {
        return Math.max(width, this.getMinColWidth());
      }
      return width;
    }
    // 获取行高配置（如果配置中没有，返回默认值）
    getRowHeight(rowIndex) {
      const height = this.config.rowHeights[rowIndex];
      if (height === void 0) {
        return this.getDefaultRowHeight();
      }
      return Math.max(height, this.getMinRowHeight());
    }
    // 将数字转换为 Excel 列号格式（A-Z, AA-ZZ, ...）
    numberToColumnLetter(num) {
      let result = "";
      while (num > 0) {
        num--;
        result = String.fromCharCode(65 + num % 26) + result;
        num = Math.floor(num / 26);
      }
      return result;
    }
    // 计算首列宽度：根据字号和最大行数的位数
    calculateRowHeaderWidth(actualRowCount) {
      const maxRowNumber = actualRowCount;
      const maxRowNumberDigits = maxRowNumber.toString().length;
      return this.config.fontSize * maxRowNumberDigits + 8 + 2 + this.config.fontSize;
    }
    // 计算行号单元格的填充色（选中时使用区分色）
    getRowHeaderFillColor(rowIndex) {
      var _a, _b;
      const themeColors = this.getThemeColors();
      const isPicked = this.config.pickedRowIndex === rowIndex && this.config.pickedRowIndex !== -1;
      const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets["Fashion"];
      const indexConfig = currentMappingConfig.indexBgColor;
      const color = isPicked ? themeColors.indexBgColor.pick : themeColors.indexBgColor.normal;
      const opacity = (_b = (_a = indexConfig == null ? void 0 : indexConfig.opacity) == null ? void 0 : _a[isPicked ? 1 : 0]) != null ? _b : 1;
      if (color === "transparent" || !color) {
        return void 0;
      }
      const rgb = hexToRgb(color);
      if (!rgb) return void 0;
      return __spreadProps(__spreadValues({}, rgb), { a: opacity });
    }
    // 计算列号单元格的填充色（选中时使用区分色）
    getColHeaderFillColor(colIndex) {
      var _a, _b;
      const themeColors = this.getThemeColors();
      const isPicked = this.config.pickedColIndex === colIndex && this.config.pickedColIndex !== -1;
      const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets["Fashion"];
      const indexConfig = currentMappingConfig.indexBgColor;
      const color = isPicked ? themeColors.indexBgColor.pick : themeColors.indexBgColor.normal;
      const opacity = (_b = (_a = indexConfig == null ? void 0 : indexConfig.opacity) == null ? void 0 : _a[isPicked ? 1 : 0]) != null ? _b : 1;
      if (color === "transparent" || !color) {
        return void 0;
      }
      const rgb = hexToRgb(color);
      if (!rgb) return void 0;
      return __spreadProps(__spreadValues({}, rgb), { a: opacity });
    }
    // 计算行号/列号单元格的描边色
    getIndexStrokeColor(isPicked) {
      var _a, _b;
      const themeColors = this.getThemeColors();
      const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets["Fashion"];
      const indexConfig = currentMappingConfig.indexStrokeColor;
      const color = isPicked ? themeColors.indexStrokeColor.pick : themeColors.indexStrokeColor.normal;
      const opacity = (_b = (_a = indexConfig == null ? void 0 : indexConfig.opacity) == null ? void 0 : _a[isPicked ? 1 : 0]) != null ? _b : 1;
      const strokeColorRgb = hexToRgb(themeColors.strokeColor) || { r: 0.4, g: 0.4, b: 0.4, a: 1 };
      const rgb = hexToRgb(color) || strokeColorRgb;
      return __spreadProps(__spreadValues({}, rgb), { a: opacity });
    }
    // 计算行号/列号单元格的文字颜色
    getIndexTextColor(isPicked) {
      var _a, _b;
      const themeColors = this.getThemeColors();
      const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets["Fashion"];
      const indexConfig = currentMappingConfig.indexTextColor;
      const color = isPicked ? themeColors.indexTextColor.pick : themeColors.indexTextColor.normal;
      const opacity = (_b = (_a = indexConfig == null ? void 0 : indexConfig.opacity) == null ? void 0 : _a[isPicked ? 1 : 0]) != null ? _b : 1;
      const rgb = hexToRgb(color) || { r: 0.83, g: 0.83, b: 0.83, a: 1 };
      return __spreadProps(__spreadValues({}, rgb), { a: opacity });
    }
    // 判断是否显示填充
    shouldFillByIndex(rowIndex, colIndex, isHeader = false) {
      if (isHeader) return true;
      const fillStyle = this.config.theme.fillStyle;
      if (fillStyle === 1) return true;
      if (fillStyle === 2) {
        const actualRowIndex = rowIndex + 1;
        return actualRowIndex % 2 === 0;
      }
      if (fillStyle === 3) {
        return colIndex % 2 === 0;
      }
      return false;
    }
    // 计算各边的描边宽度
    getStrokeWeights() {
      const strokeStyle = this.config.theme.strokeStyle;
      const strokeWidth = 1;
      if (strokeStyle === 1) {
        return { top: strokeWidth, right: strokeWidth, bottom: strokeWidth, left: strokeWidth };
      } else if (strokeStyle === 2) {
        return { top: strokeWidth, right: 0, bottom: strokeWidth, left: 0 };
      } else if (strokeStyle === 3) {
        return { top: 0, right: strokeWidth, bottom: 0, left: strokeWidth };
      } else {
        return { top: 0, right: 0, bottom: 0, left: 0 };
      }
    }
    // 渲染行列号单元格的辅助函数（@tn，不填充，固定描边）
    renderRowColHeaderCell(cellValue, rowIndex, colIndex, isRowHeader, key, cellHeight, cellWidth) {
      var _a, _b;
      const rowHeight = isRowHeader && rowIndex >= 0 ? this.getRowHeight(rowIndex) : void 0;
      const colWidth = !isRowHeader && colIndex >= 0 ? this.getColWidth(colIndex) : void 0;
      const finalHeight = cellHeight || (isRowHeader && rowIndex >= 0 ? rowHeight : void 0);
      let finalWidth;
      if (cellWidth) {
        finalWidth = cellWidth;
      } else if (colWidth === "fill") {
        finalWidth = "fill-parent";
      } else if (colWidth !== void 0 && typeof colWidth === "number") {
        finalWidth = colWidth;
      } else {
        finalWidth = isRowHeader ? void 0 : "fill-parent";
      }
      const isPicked = isRowHeader && rowIndex >= 0 && this.config.pickedRowIndex === rowIndex && this.config.pickedRowIndex !== -1 || !isRowHeader && colIndex >= 0 && this.config.pickedColIndex === colIndex && this.config.pickedColIndex !== -1;
      const fillColor = isRowHeader && rowIndex >= 0 ? this.getRowHeaderFillColor(rowIndex) : !isRowHeader && colIndex >= 0 ? this.getColHeaderFillColor(colIndex) : void 0;
      const strokeColor = this.getIndexStrokeColor(isPicked);
      const textColorWithOpacity = this.getIndexTextColor(isPicked);
      let currentValue = "";
      if (isRowHeader && rowIndex >= 0) {
        const currentHeight = this.getRowHeight(rowIndex);
        currentValue = currentHeight ? currentHeight.toString() : "";
      } else if (!isRowHeader && colIndex >= 0) {
        const currentWidth = this.getColWidth(colIndex);
        if (currentWidth === "fill") {
          currentValue = "fill";
        } else if (typeof currentWidth === "number") {
          currentValue = currentWidth.toString();
        } else {
          currentValue = "";
        }
      }
      return /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          key,
          name: "@tn",
          direction: "vertical",
          horizontalAlignItems: "center",
          verticalAlignItems: "center",
          width: finalWidth,
          height: finalHeight,
          padding: 4,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: 1,
          strokeAlign: "center",
          onClick: isRowHeader && rowIndex >= 0 || !isRowHeader && colIndex >= 0 ? (e) => {
            if (isPicked) {
              if (typeof finalHeight === "number") {
                const clickRatio = e.offsetY / finalHeight;
                if (clickRatio > 0.5) {
                  return;
                }
              } else if (e.offsetY > 20) {
                return;
              }
            }
            if (isRowHeader && rowIndex >= 0) {
              if (this.onPickRow) {
                const newPickedRowIndex = this.config.pickedRowIndex === rowIndex ? -1 : rowIndex;
                this.onPickRow(newPickedRowIndex);
              }
            } else if (!isRowHeader && colIndex >= 0) {
              if (this.onPickCol) {
                const newPickedColIndex = this.config.pickedColIndex === colIndex ? -1 : colIndex;
                this.onPickCol(newPickedColIndex);
              }
            }
          } : void 0
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            fontSize: this.config.fontSize * 0.8,
            fill: textColorWithOpacity,
            width: "fill-parent",
            horizontalAlignText: "center",
            verticalAlignText: "center",
            fontWeight: "normal"
          },
          cellValue || ""
        ),
        isRowHeader && rowIndex >= 0 || !isRowHeader && colIndex >= 0 ? /* @__PURE__ */ figma.widget.h(
          Input,
          {
            value: currentValue,
            placeholder: isRowHeader ? "H" : "W",
            inputFrameProps: {
              hidden: !isPicked,
              horizontalAlignItems: "center",
              fill: (_a = this.themeColors) == null ? void 0 : _a.strokeColor,
              cornerRadius: 2,
              padding: 1
            },
            onTextEditEnd: (e) => {
              const newValue = e.characters.trim();
              if (isRowHeader && rowIndex >= 0) {
                if (this.onSetRowHeight) {
                  const height = parseFloat(newValue);
                  if (!isNaN(height) && height > 0) {
                    const minHeight = this.getMinRowHeight();
                    this.onSetRowHeight(rowIndex, Math.max(height, minHeight));
                  }
                }
              } else if (!isRowHeader && colIndex >= 0) {
                if (this.onSetColWidth) {
                  if (newValue.toLowerCase() === "fill") {
                    this.onSetColWidth(colIndex, "fill");
                  } else {
                    const width = parseFloat(newValue);
                    if (!isNaN(width) && width > 0) {
                      const minWidth = this.getMinColWidth();
                      this.onSetColWidth(colIndex, Math.max(width, minWidth));
                    }
                  }
                }
              }
            },
            width: "fill-parent",
            horizontalAlignText: "center",
            fontSize: this.config.fontSize * 0.6,
            fill: (_b = this.themeColors) == null ? void 0 : _b.headerTextColor
          }
        ) : null
      );
    }
    // 渲染表格
    render() {
      var _a, _b;
      const { data } = this.config;
      const actualColCount = data.length;
      const actualRowCount = data.length > 0 ? ((_a = data[0]) == null ? void 0 : _a.length) || 0 : 0;
      if (actualColCount === 0 || actualRowCount === 0) {
        const themeColors2 = this.getThemeColors();
        const strokeColorRgb2 = hexToRgb(themeColors2.strokeColor) || { r: 0.4, g: 0.4, b: 0.4, a: 1 };
        return /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            name: "@table",
            direction: "vertical",
            stroke: this.config.theme.strokeStyle !== 4 ? strokeColorRgb2 : void 0,
            strokeWidth: this.config.theme.strokeStyle !== 4 ? 1 : 0,
            strokeAlign: "center",
            spacing: 0,
            padding: 12,
            fill: hexToRgb(themeColors2.bgColor) || { r: 0.18, g: 0.18, b: 0.18, a: 1 },
            cornerRadius: 4
          },
          /* @__PURE__ */ figma.widget.h(
            Text,
            {
              fontSize: 14,
              fill: "#858585",
              horizontalAlignText: "center",
              fontWeight: "normal"
            },
            "No table data. Use property menu to open config."
          )
        );
      }
      const themeColors = this.getThemeColors();
      const currentMappingConfig = colorMappingPresets[this.config.theme.style] || colorMappingPresets["Fashion"];
      const strokeColorRgb = hexToRgb(themeColors.strokeColor) || { r: 0.4, g: 0.4, b: 0.4, a: 1 };
      const bgRgb = hexToRgb(themeColors.bgColor) || { r: 0.18, g: 0.18, b: 0.18, a: 1 };
      const headerFillRgb = hexToRgb(themeColors.headerFillColor) || { r: 0.24, g: 0.24, b: 0.24, a: 1 };
      const cellFillRgbBase = hexToRgb(themeColors.cellFillColor) || { r: 0.24, g: 0.24, b: 0.24, a: 1 };
      const cellFillOpacity = ((_b = currentMappingConfig.cellFillColor) == null ? void 0 : _b.opacity) !== void 0 ? currentMappingConfig.cellFillColor.opacity : 0.4;
      const cellFillRgb = __spreadProps(__spreadValues({}, cellFillRgbBase), { a: cellFillOpacity });
      const headerTextRgb = hexToRgb(themeColors.headerTextColor) || { r: 1, g: 1, b: 1, a: 1 };
      const cellTextRgb = hexToRgb(themeColors.cellTextColor) || { r: 0.83, g: 0.83, b: 0.83, a: 1 };
      const strokeWeights = this.getStrokeWeights();
      const strokeWidth = 1;
      const hasAnyStroke = this.config.theme.strokeStyle !== 4;
      const colHeaderHeight = this.config.fontSize * 2;
      const allColWidths = actualColCount > 0 ? Array.from({ length: actualColCount }, (_, i) => this.getColWidth(i)) : [];
      const allAreNumbers = allColWidths.length > 0 && allColWidths.every((w) => w !== "fill");
      const allAreFill = allColWidths.length > 0 && allColWidths.every((w) => w === "fill");
      const fillCount = allColWidths.filter((w) => w === "fill").length;
      const calculateActualColWidths = () => {
        if (actualColCount === 0) return [];
        const actualWidths = [];
        let fixedWidthSum = 0;
        let fillCount2 = 0;
        allColWidths.forEach((width) => {
          if (typeof width === "number") {
            fixedWidthSum += width;
            actualWidths.push(width);
          } else {
            fillCount2++;
            actualWidths.push(0);
          }
        });
        if (fillCount2 > 0) {
          const rowHeaderWidth2 = this.config.showRowColHeaders ? this.calculateRowHeaderWidth(actualRowCount) : 0;
          let fillWidth;
          if (allAreFill) {
            fillWidth = this.config.tableWidth / fillCount2;
          } else if (allAreNumbers) {
            fillWidth = this.config.fontSize * 8;
          } else {
            const baseWidth = allAreFill ? this.config.tableWidth : this.config.fontSize * 25;
            const minColWidth = this.getMinColWidth();
            fillWidth = Math.max(minColWidth, (baseWidth - fixedWidthSum) / fillCount2);
          }
          allColWidths.forEach((width, index) => {
            if (width === "fill") {
              actualWidths[index] = fillWidth;
            }
          });
        }
        return actualWidths;
      };
      const actualColWidths = calculateActualColWidths();
      const rowHeaderWidth = this.config.showRowColHeaders ? this.calculateRowHeaderWidth(actualRowCount) : 0;
      let tableFinalWidth;
      if (fillCount > 0) {
        tableFinalWidth = this.config.tableWidth + rowHeaderWidth;
      } else {
        const dataColsWidthSum = actualColWidths.reduce((acc, width) => acc + width, 0);
        tableFinalWidth = rowHeaderWidth + dataColsWidthSum;
      }
      const tableHasStroke = hasAnyStroke || this.config.showRowColHeaders;
      return /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "@table",
          direction: "horizontal",
          stroke: tableHasStroke ? strokeColorRgb : void 0,
          strokeWidth: tableHasStroke ? strokeWidth : 0,
          strokeAlign: "center",
          spacing: 0,
          padding: 0,
          fill: bgRgb,
          cornerRadius: 4,
          width: tableFinalWidth
        },
        (() => {
          const rowHeaderWidth2 = this.calculateRowHeaderWidth(actualRowCount);
          return /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              key: "row-header-column",
              name: "@row-header-column",
              hidden: !this.config.showRowColHeaders,
              overflow: "visible",
              direction: "vertical",
              spacing: 0,
              padding: 0,
              width: rowHeaderWidth2
            },
            this.renderRowColHeaderCell("", -1, -1, false, "row-col-corner", colHeaderHeight, rowHeaderWidth2),
            Array.from({ length: actualRowCount }).map((_, rowIndex) => {
              const rowNumber = rowIndex + 1;
              return this.renderRowColHeaderCell(
                rowNumber.toString(),
                rowIndex,
                -1,
                true,
                `row-header-${rowIndex}`,
                void 0,
                rowHeaderWidth2
              );
            })
          );
        })(),
        data.map((column, colIndex) => {
          const isHeaderColumn = this.config.theme.hasHeader && this.config.isRowColumnSwapped ? colIndex === 0 : false;
          const actualRowCount2 = column.length;
          const colWidth = this.getColWidth(colIndex);
          const columnWidth = colWidth === "fill" ? "fill-parent" : colWidth;
          return /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              key: `column-${colIndex}`,
              name: "@column",
              overflow: "visible",
              direction: "vertical",
              spacing: 0,
              padding: 0,
              width: columnWidth
            },
            /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                name: "@col-header-wrapper",
                hidden: !this.config.showRowColHeaders,
                direction: "vertical",
                width: "fill-parent",
                spacing: 0,
                padding: 0
              },
              this.renderRowColHeaderCell(
                this.numberToColumnLetter(colIndex + 1),
                -1,
                colIndex,
                false,
                `col-header-${colIndex}`,
                colHeaderHeight
              )
            ),
            isHeaderColumn ? (
              // 反行列模式：第一列的所有元素都是表头
              column.map((cellValue, rowIndex) => {
                const finalHeight = this.getRowHeight(rowIndex);
                return /* @__PURE__ */ figma.widget.h(
                  AutoLayout,
                  {
                    key: `th-${rowIndex}`,
                    name: "@th",
                    direction: "vertical",
                    spacing: 0,
                    padding: 0,
                    width: "fill-parent",
                    height: finalHeight,
                    fill: this.shouldFillByIndex(rowIndex, colIndex, true) ? headerFillRgb : void 0
                  },
                  /* @__PURE__ */ figma.widget.h(
                    Rectangle,
                    {
                      name: "@stroke-top",
                      hidden: strokeWeights.top === 0,
                      width: "fill-parent",
                      height: 0,
                      stroke: strokeColorRgb,
                      strokeWidth: strokeWeights.top,
                      strokeAlign: "center"
                    }
                  ),
                  /* @__PURE__ */ figma.widget.h(
                    AutoLayout,
                    {
                      name: "@th-content",
                      direction: "horizontal",
                      spacing: 0,
                      padding: 0,
                      width: "fill-parent",
                      height: "fill-parent"
                    },
                    /* @__PURE__ */ figma.widget.h(
                      Rectangle,
                      {
                        name: "@stroke-left",
                        hidden: strokeWeights.left === 0,
                        width: 0,
                        height: "fill-parent",
                        stroke: strokeColorRgb,
                        strokeWidth: strokeWeights.left,
                        strokeAlign: "center"
                      }
                    ),
                    /* @__PURE__ */ figma.widget.h(
                      AutoLayout,
                      {
                        name: "@th-text",
                        direction: "vertical",
                        spacing: 0,
                        width: "fill-parent",
                        height: "fill-parent",
                        verticalAlignItems: "center"
                      },
                      /* @__PURE__ */ figma.widget.h(
                        Text,
                        {
                          fontSize: this.config.fontSize,
                          fill: headerTextRgb,
                          width: "fill-parent",
                          horizontalAlignText: "center",
                          fontWeight: "bold"
                        },
                        cellValue || ""
                      )
                    ),
                    /* @__PURE__ */ figma.widget.h(
                      Rectangle,
                      {
                        name: "@stroke-right",
                        hidden: strokeWeights.right === 0,
                        width: 0,
                        height: "fill-parent",
                        stroke: strokeColorRgb,
                        strokeWidth: strokeWeights.right,
                        strokeAlign: "center"
                      }
                    )
                  ),
                  /* @__PURE__ */ figma.widget.h(
                    Rectangle,
                    {
                      name: "@stroke-bottom",
                      hidden: strokeWeights.bottom === 0,
                      width: "fill-parent",
                      height: 0,
                      stroke: strokeColorRgb,
                      strokeWidth: strokeWeights.bottom,
                      strokeAlign: "center"
                    }
                  )
                );
              })
            ) : /* @__PURE__ */ figma.widget.h(figma.widget.Fragment, null, !this.config.isRowColumnSwapped && this.config.theme.hasHeader && (() => {
              const finalHeight = this.getRowHeight(0);
              return /* @__PURE__ */ figma.widget.h(
                AutoLayout,
                {
                  name: "@th",
                  direction: "vertical",
                  spacing: 0,
                  padding: 0,
                  width: "fill-parent",
                  height: finalHeight,
                  fill: this.shouldFillByIndex(0, colIndex, true) ? headerFillRgb : void 0
                },
                /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    name: "@stroke-top",
                    hidden: strokeWeights.top === 0,
                    width: "fill-parent",
                    height: 0,
                    stroke: strokeColorRgb,
                    strokeWidth: strokeWeights.top,
                    strokeAlign: "center"
                  }
                ),
                /* @__PURE__ */ figma.widget.h(
                  AutoLayout,
                  {
                    name: "@th-content",
                    direction: "horizontal",
                    spacing: 0,
                    padding: 0,
                    width: "fill-parent",
                    height: "fill-parent"
                  },
                  /* @__PURE__ */ figma.widget.h(
                    Rectangle,
                    {
                      name: "@stroke-left",
                      hidden: strokeWeights.left === 0,
                      width: 0,
                      height: "fill-parent",
                      stroke: strokeColorRgb,
                      strokeWidth: strokeWeights.left,
                      strokeAlign: "center"
                    }
                  ),
                  /* @__PURE__ */ figma.widget.h(
                    AutoLayout,
                    {
                      name: "@th-text",
                      direction: "vertical",
                      spacing: 0,
                      padding: 8,
                      width: "fill-parent",
                      height: "fill-parent",
                      verticalAlignItems: "center"
                    },
                    /* @__PURE__ */ figma.widget.h(
                      Text,
                      {
                        fontSize: this.config.fontSize,
                        fill: headerTextRgb,
                        width: "fill-parent",
                        horizontalAlignText: "center",
                        fontWeight: "bold"
                      },
                      column[0] || ""
                    )
                  ),
                  /* @__PURE__ */ figma.widget.h(
                    Rectangle,
                    {
                      name: "@stroke-right",
                      hidden: strokeWeights.right === 0,
                      width: 0,
                      height: "fill-parent",
                      stroke: strokeColorRgb,
                      strokeWidth: strokeWeights.right,
                      strokeAlign: "center"
                    }
                  )
                ),
                /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    name: "@stroke-bottom",
                    hidden: strokeWeights.bottom === 0,
                    width: "fill-parent",
                    height: 0,
                    stroke: strokeColorRgb,
                    strokeWidth: strokeWeights.bottom,
                    strokeAlign: "center"
                  }
                )
              );
            })(), Array.from({ length: Math.max(0, actualRowCount2 - (this.config.isRowColumnSwapped ? 0 : this.config.theme.hasHeader ? 1 : 0)) }).map((_, rowIndex) => {
              const cellValue = column[this.config.isRowColumnSwapped ? rowIndex : this.config.theme.hasHeader ? rowIndex + 1 : rowIndex] || "";
              const shouldFillThisCell = this.shouldFillByIndex(rowIndex, colIndex, false);
              const actualRowIndex = this.config.isRowColumnSwapped ? rowIndex : this.config.theme.hasHeader ? rowIndex + 1 : rowIndex;
              const finalHeight = this.getRowHeight(actualRowIndex);
              return /* @__PURE__ */ figma.widget.h(
                AutoLayout,
                {
                  key: `td-${rowIndex}`,
                  name: "@td",
                  direction: "vertical",
                  spacing: 0,
                  padding: 0,
                  width: "fill-parent",
                  height: finalHeight,
                  fill: shouldFillThisCell ? cellFillRgb : void 0
                },
                /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    name: "@stroke-top",
                    hidden: strokeWeights.top === 0,
                    width: "fill-parent",
                    height: 0,
                    stroke: strokeColorRgb,
                    strokeWidth: strokeWeights.top,
                    strokeAlign: "center"
                  }
                ),
                /* @__PURE__ */ figma.widget.h(
                  AutoLayout,
                  {
                    name: "@td-content",
                    direction: "horizontal",
                    spacing: 0,
                    padding: 0,
                    width: "fill-parent",
                    height: "fill-parent"
                  },
                  /* @__PURE__ */ figma.widget.h(
                    Rectangle,
                    {
                      name: "@stroke-left",
                      hidden: strokeWeights.left === 0,
                      width: 0,
                      height: "fill-parent",
                      stroke: strokeColorRgb,
                      strokeWidth: strokeWeights.left,
                      strokeAlign: "center"
                    }
                  ),
                  /* @__PURE__ */ figma.widget.h(
                    AutoLayout,
                    {
                      name: "@td-text",
                      direction: "vertical",
                      spacing: 0,
                      padding: 8,
                      width: "fill-parent",
                      height: "fill-parent",
                      verticalAlignItems: "center"
                    },
                    /* @__PURE__ */ figma.widget.h(
                      Text,
                      {
                        fontSize: this.config.fontSize,
                        fill: cellTextRgb,
                        width: "fill-parent",
                        horizontalAlignText: "center",
                        fontWeight: "normal"
                      },
                      cellValue
                    )
                  ),
                  /* @__PURE__ */ figma.widget.h(
                    Rectangle,
                    {
                      name: "@stroke-right",
                      hidden: strokeWeights.right === 0,
                      width: 0,
                      height: "fill-parent",
                      stroke: strokeColorRgb,
                      strokeWidth: strokeWeights.right,
                      strokeAlign: "center"
                    }
                  )
                ),
                /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    name: "@stroke-bottom",
                    hidden: strokeWeights.bottom === 0,
                    width: "fill-parent",
                    height: 0,
                    stroke: strokeColorRgb,
                    strokeWidth: strokeWeights.bottom,
                    strokeAlign: "center"
                  }
                )
              );
            }))
          );
        }),
        this.config.showRowColHeaders && (() => {
          const isHidden = this.config.pickedRowIndex === -1;
          if (isHidden) {
            return /* @__PURE__ */ figma.widget.h(
              Rectangle,
              {
                name: "@ROW_PICK",
                hidden: true,
                positioning: "absolute",
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                stroke: this.getIndexStrokeColor(true),
                strokeWidth,
                strokeAlign: "center"
              }
            );
          }
          let pickY = colHeaderHeight;
          for (let i = 0; i < this.config.pickedRowIndex; i++) {
            const rowH = this.getRowHeight(i);
            if (rowH !== void 0) {
              pickY += rowH;
            }
          }
          const rowHeaderWidth2 = this.config.showRowColHeaders ? this.calculateRowHeaderWidth(actualRowCount) : 0;
          const pickWidth = rowHeaderWidth2 + actualColWidths.reduce((acc, width) => {
            return acc + width;
          }, 0);
          const pickHeight = this.getRowHeight(this.config.pickedRowIndex) || this.getDefaultRowHeight();
          return /* @__PURE__ */ figma.widget.h(
            Rectangle,
            {
              name: "@ROW_PICK",
              hidden: false,
              positioning: "absolute",
              x: 0,
              y: pickY,
              width: pickWidth,
              height: pickHeight,
              stroke: this.getIndexStrokeColor(true),
              strokeWidth,
              strokeAlign: "center"
            }
          );
        })(),
        this.config.showRowColHeaders && (() => {
          const isColHidden = this.config.pickedColIndex === -1;
          if (isColHidden) {
            return /* @__PURE__ */ figma.widget.h(
              Rectangle,
              {
                name: "@COL_PICK",
                hidden: true,
                positioning: "absolute",
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                stroke: this.getIndexStrokeColor(true),
                strokeWidth,
                strokeAlign: "center"
              }
            );
          }
          const rowHeaderWidth2 = this.calculateRowHeaderWidth(actualRowCount);
          let pickX = rowHeaderWidth2;
          for (let i = 0; i < this.config.pickedColIndex; i++) {
            pickX += actualColWidths[i] || 0;
          }
          const pickedColWidth = actualColWidths[this.config.pickedColIndex];
          const defaultColWidth = this.config.fontSize * 8;
          const pickWidth = pickedColWidth !== void 0 && pickedColWidth > 0 ? pickedColWidth : defaultColWidth;
          let pickHeight = colHeaderHeight;
          for (let i = 0; i < actualRowCount; i++) {
            const rowH = this.getRowHeight(i);
            if (rowH !== void 0) {
              pickHeight += rowH;
            }
          }
          return /* @__PURE__ */ figma.widget.h(
            Rectangle,
            {
              name: "@COL_PICK",
              hidden: false,
              positioning: "absolute",
              x: pickX,
              y: 0,
              width: pickWidth,
              height: pickHeight,
              stroke: this.getIndexStrokeColor(true),
              strokeWidth,
              strokeAlign: "center"
            }
          );
        })()
      );
    }
  };
  function Widget() {
    const exampleTableText = "A1	B1	C1\na2	b2	c2\na3	b3	c3\na4	b4	c4";
    const [processedTableData, setProcessedTableData] = useSyncedState("processedTableData", []);
    const [tableText, setTableText] = useSyncedState("tableText", exampleTableText);
    const [fillStyle, setFillStyle] = useSyncedState("fillStyle", 2);
    const [strokeStyle, setStrokeStyle] = useSyncedState("strokeStyle", 4);
    const [isTableHeader, setIsTableHeader] = useSyncedState("isTableHeader", true);
    const [showRowColHeaders, setShowRowColHeaders] = useSyncedState("showRowColHeaders", false);
    const [pickedRowIndex, setPickedRowIndex] = useSyncedState("pickedRowIndex", -1);
    const [pickedColIndex, setPickedColIndex] = useSyncedState("pickedColIndex", -1);
    const [rowHeights, setRowHeights] = useSyncedState("rowHeights", {});
    const [colWidths, setColWidths] = useSyncedState("colWidths", {});
    const [tableWidth, setTableWidth] = useSyncedState("tableWidth", 300);
    const [themeHue, setThemeHue] = useSyncedState("themeHue", "#F19101");
    const [themeLevel, setThemeLevel] = useSyncedState("themeLevel", "#999999");
    const [themeStyle, setThemeStyle] = useSyncedState("themeStyle", "Fashion");
    const [colorMode, setColorMode] = useSyncedState("colorMode", "color");
    const [fontSize, setFontSize] = useSyncedState("fontSize", 12);
    const [isRowColumnSwapped, setIsRowColumnSwapped] = useSyncedState("isRowColumnSwapped", false);
    const config = {
      data: processedTableData.length === 0 && tableText ? parseTableTextToColumns(tableText) : processedTableData,
      isRowColumnSwapped,
      fontSize,
      rowHeights,
      colWidths,
      tableWidth,
      theme: {
        hue: themeHue,
        level: themeLevel,
        style: themeStyle,
        colorMode,
        hasHeader: isTableHeader,
        fillStyle,
        strokeStyle
      },
      showRowColHeaders,
      pickedRowIndex,
      pickedColIndex
    };
    const renderer = new TableRenderer(config, {
      onPickRow: (rowIndex) => {
        setPickedRowIndex(rowIndex);
        if (rowIndex !== -1) {
          setPickedColIndex(-1);
        }
      },
      onPickCol: (colIndex) => {
        setPickedColIndex(colIndex);
        if (colIndex !== -1) {
          setPickedRowIndex(-1);
        }
      },
      onSetRowHeight: (rowIndex, height) => {
        setRowHeights(__spreadProps(__spreadValues({}, rowHeights), { [rowIndex]: height }));
      },
      onSetColWidth: (colIndex, width) => {
        const newColWidths = __spreadProps(__spreadValues({}, colWidths), { [colIndex]: width });
        setColWidths(newColWidths);
      }
    });
    const currentMappingConfig = colorMappingPresets[themeStyle] || colorMappingPresets["Fashion"];
    const allLevelOptions = [
      { option: "#000000", tooltip: "Level 1", level: 1 },
      { option: "#111111", tooltip: "Level 2", level: 2 },
      { option: "#222222", tooltip: "Level 3", level: 3 },
      { option: "#333333", tooltip: "Level 4", level: 4 },
      { option: "#444444", tooltip: "Level 5", level: 5 },
      { option: "#555555", tooltip: "Level 6", level: 6 },
      { option: "#666666", tooltip: "Level 7", level: 7 },
      { option: "#777777", tooltip: "Level 8", level: 8 },
      { option: "#888888", tooltip: "Level 9", level: 9 },
      { option: "#999999", tooltip: "Level 10", level: 10 },
      { option: "#aaaaaa", tooltip: "Level 11", level: 11 },
      { option: "#bbbbbb", tooltip: "Level 12", level: 12 },
      { option: "#cccccc", tooltip: "Level 13", level: 13 },
      { option: "#dddddd", tooltip: "Level 14", level: 14 },
      { option: "#eeeeee", tooltip: "Level 15", level: 15 }
    ];
    const hueOptions = [
      { option: "#E32322", tooltip: "Red" },
      // 红
      { option: "#E8621F", tooltip: "Orange-Red" },
      // 橙红
      { option: "#F19101", tooltip: "Orange" },
      // 橙
      { option: "#FDC60B", tooltip: "Yellow-Orange" },
      // 黄橙
      { option: "#F4E500", tooltip: "Yellow" },
      // 黄
      { option: "#8CBF26", tooltip: "Green-Yellow" },
      // 绿黄
      { option: "#228822", tooltip: "Green" },
      // 绿
      { option: "#008E5B", tooltip: "Cyan-Green" },
      // 青绿
      { option: "#00ffff", tooltip: "Cyan" },
      // 青
      { option: "#0696BB", tooltip: "Blue-Green" },
      // 蓝绿
      { option: "#2671B2", tooltip: "Blue" },
      // 蓝
      { option: "#444E99", tooltip: "Purple-Blue" },
      // 紫蓝
      { option: "#6D3889", tooltip: "Purple" },
      // 紫
      { option: "#C4037D", tooltip: "Red-Purple" }
      // 红紫
    ];
    const levelOptions = (() => {
      let filtered;
      if (!currentMappingConfig.lightnessRange) {
        filtered = allLevelOptions.map((_a) => {
          var _b = _a, { level } = _b, rest = __objRest(_b, ["level"]);
          return rest;
        });
      } else {
        const { level: validLevels, defaultLevel } = currentMappingConfig.lightnessRange;
        if (validLevels === void 0 || validLevels.length === 0) {
          filtered = allLevelOptions.map((_c) => {
            var _d = _c, { level } = _d, rest = __objRest(_d, ["level"]);
            return rest;
          });
        } else {
          filtered = allLevelOptions.filter((item) => validLevels.includes(item.level)).map((_e) => {
            var _f = _e, { level } = _f, rest = __objRest(_f, ["level"]);
            return rest;
          });
        }
        if (defaultLevel !== void 0) {
          const recommendedOption = allLevelOptions.find((item) => item.level === defaultLevel);
          if (recommendedOption) {
            const _g = recommendedOption, { level } = _g, rest = __objRest(_g, ["level"]);
            const exists = filtered.some((item) => item.option === rest.option);
            if (!exists) {
              filtered.push(rest);
            }
          }
        }
      }
      return filtered;
    })();
    const themeStyleOptions = [
      { label: "Normal", option: "Normal" },
      { label: "Soft", option: "Soft" },
      { label: "Fashion", option: "Fashion" },
      { label: "Contrast", option: "Contrast" },
      { label: "Vivid", option: "Vivid" },
      { label: "Pastel", option: "Pastel" },
      { label: "Retro", option: "Retro" },
      { label: "Neon", option: "Neon" }
    ];
    const colorModeOptions = [
      { label: "Colored", option: "color" },
      { label: "Monochrome", option: "monochrome" }
    ];
    let iconColor = "white";
    let iconColorPick = "#3AC989";
    usePropertyMenu(
      [
        {
          itemType: "action",
          propertyName: "openConfig",
          tooltip: "Open Config",
          icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path stroke="${iconColor}" d="M19.2041 9.021C19.7148 9.021 20.187 9.29356 20.4424 9.73584L23.6465 15.2856C23.9015 15.7277 23.9016 16.2723 23.6465 16.7144L20.4424 22.2642C20.187 22.7064 19.7148 22.979 19.2041 22.979H12.7959C12.2852 22.979 11.813 22.7064 11.5576 22.2642L8.35352 16.7144C8.09842 16.2723 8.09846 15.7277 8.35352 15.2856L11.5576 9.73584C11.813 9.29356 12.2852 9.021 12.7959 9.021H19.2041Z" stroke-width="1.22526"/>
        <circle fill="${iconColor}" cx="16" cy="16" r="2"/>
        </svg>`
        },
        {
          itemType: "separator"
        },
        {
          itemType: "action",
          propertyName: "swapRowColumn",
          tooltip: "Row Column Swap",
          icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect stroke="${isRowColumnSwapped ? iconColor : iconColorPick}" 
          x="9" y="9" width="14" height="6" rx="0.81684" stroke-width="1.22526"/>
          <rect stroke="${isRowColumnSwapped ? iconColorPick : iconColor}" 
          fill="${isRowColumnSwapped ? iconColorPick : iconColor}" 
          fill-opacity="${isRowColumnSwapped ? 0.5 : 0}" 
          x="15" y="9" width="14" height="6" rx="0.81684" transform="rotate(90 15 9)" stroke-width="1.22526"/>
          <rect stroke="${isRowColumnSwapped ? iconColor : iconColorPick}" 
          stroke-opacity="${isRowColumnSwapped ? 0 : 1}" 
          fill="${isRowColumnSwapped ? iconColor : iconColorPick}" 
          fill-opacity="${isRowColumnSwapped ? 0 : 0.5}" 
          x="9" y="9" width="14" height="6" rx="0.81684" stroke-width="1.22526"/>
          <path stroke="${iconColor}" d="M23 18V19C23 21.2091 21.2091 23 19 23H18" stroke-width="1.23"/>
        </svg>
        `
        },
        {
          itemType: "action",
          propertyName: "showRowColHeaders",
          tooltip: "Index Headers(to set Row-height/Column-width)",
          icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect stroke="${showRowColHeaders ? iconColorPick : iconColor}" x="9" y="9" width="14" height="3" rx="0.81684" stroke-width="1.22526"/>
        <rect stroke="${showRowColHeaders ? iconColorPick : iconColor}" x="12" y="9" width="14" height="3" rx="0.81684" transform="rotate(90 12 9)" stroke-width="1.22526"/>
        <rect stroke="${iconColor}" x="23" y="12" width="11" height="11" rx="0.81684" transform="rotate(90 23 12)" stroke-width="1.22526"/>
        </svg>
        `
        },
        {
          itemType: "separator"
        },
        {
          itemType: "action",
          propertyName: "isTableHeader",
          tooltip: "Is Table Header",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${isTableHeader ? iconColorPick : iconColor}" d="M18 16L17.9893 16.2041C17.887 17.2128 17.0357 18 16 18H4C2.96435 18 2.113 17.2128 2.01074 16.2041L2 16V4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16ZM3 16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V7H3V16Z"/>
        </svg>
        `
        },
        {
          itemType: "separator"
        },
        {
          itemType: "action",
          propertyName: "fillStyle1",
          tooltip: "All Fill",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect fill="${fillStyle === 1 ? iconColorPick : iconColor}" x="2" y="2" width="16" height="16" rx="2"/>
        </svg>
        `
        },
        {
          itemType: "action",
          propertyName: "fillStyle2",
          tooltip: "Row Space",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${fillStyle === 2 ? iconColorPick : iconColor}" d="M18 16L17.9893 16.2041C17.887 17.2128 17.0357 18 16 18H4C2.96435 18 2.113 17.2128 2.01074 16.2041L2 16V4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V16ZM3 14V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V14H3ZM3 10H17V7H3V10Z"/>
        </svg>`
        },
        {
          itemType: "action",
          propertyName: "fillStyle3",
          tooltip: "Column Space",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${fillStyle === 3 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C3.86182 18 3.72697 17.9857 3.59668 17.959C3.46664 17.9324 3.34118 17.8933 3.22168 17.8428C2.50378 17.5392 2 16.8285 2 16V4C2 3.17153 2.50378 2.46081 3.22168 2.15723C3.34118 2.10669 3.46664 2.06765 3.59668 2.04102C3.72697 2.01433 3.86182 2 4 2H16ZM13.7832 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H13.7832V17ZM6.34766 17H9.43555V3H6.34766V17Z"/>
        </svg>`
        },
        {
          itemType: "action",
          propertyName: "fillStyle4",
          tooltip: "No Fill",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${fillStyle === 4 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H16ZM4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H4Z"/>
        </svg>`
        },
        {
          itemType: "separator"
        },
        {
          itemType: "action",
          propertyName: "strokeStyle1",
          tooltip: "All Strokes",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${strokeStyle === 1 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16L17.9893 16.2041C17.887 17.2128 17.0357 18 16 18H4C2.96435 18 2.113 17.2128 2.01074 16.2041L2 16V4C2 2.89543 2.89543 2 4 2H16ZM10.5 17H16C16.5523 17 17 16.5523 17 16V13H10.5V17ZM3 16C3 16.5523 3.44772 17 4 17H9.5V13H3V16ZM10.5 12H17V8H10.5V12ZM3 12H9.5V8H3V12ZM10.5 7H17V4C17 3.44772 16.5523 3 16 3H10.5V7ZM4 3C3.44772 3 3 3.44772 3 4V7H9.5V3H4Z"/>
        </svg>`
        },
        {
          itemType: "action",
          propertyName: "strokeStyle2",
          tooltip: "Row Strokes",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${strokeStyle === 2 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16L17.9893 16.2041C17.887 17.2128 17.0357 18 16 18H4C2.96435 18 2.113 17.2128 2.01074 16.2041L2 16V4C2 2.89543 2.89543 2 4 2H16ZM3 13V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V13H3ZM3 12H17V8H3V12ZM4 3C3.44772 3 3 3.44772 3 4V7H17V4C17 3.44772 16.5523 3 16 3H4Z"/>
        </svg>`
        },
        {
          itemType: "action",
          propertyName: "strokeStyle3",
          tooltip: "Column Strokes",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${strokeStyle === 3 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H16ZM4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H9.5V3H4ZM10.5 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H10.5V17Z"/>
        </svg>`
        },
        {
          itemType: "action",
          propertyName: "strokeStyle4",
          tooltip: "No Strokes",
          icon: `
        <svg width="32" height="32" viewBox="-6 -6 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="${strokeStyle === 4 ? iconColorPick : iconColor}" d="M16 2C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2H16ZM4 3C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H4Z"/>
        </svg>`
        },
        {
          itemType: "separator"
        },
        {
          itemType: "color-selector",
          propertyName: "themeHue",
          tooltip: "Theme Hue",
          options: hueOptions,
          selectedOption: themeHue
        },
        {
          itemType: "color-selector",
          propertyName: "themeLevel",
          tooltip: "Theme Level",
          options: levelOptions,
          selectedOption: themeLevel
        },
        {
          itemType: "dropdown",
          propertyName: "themeStyle",
          tooltip: "Theme Style",
          options: themeStyleOptions,
          selectedOption: themeStyle
        },
        {
          itemType: "dropdown",
          propertyName: "colorMode",
          tooltip: "Color Mode",
          options: colorModeOptions,
          selectedOption: colorMode
        }
      ],
      ({ propertyName, propertyValue }) => {
        var _a;
        if (propertyName === "swapRowColumn") {
          renderer.swapRowColumn();
          const newConfig = renderer.getConfig();
          setProcessedTableData(newConfig.data);
          setIsRowColumnSwapped(newConfig.isRowColumnSwapped);
          if (fillStyle === 2) {
            setFillStyle(3);
          } else if (fillStyle === 3) {
            setFillStyle(2);
          }
          if (strokeStyle === 2) {
            setStrokeStyle(3);
          } else if (strokeStyle === 3) {
            setStrokeStyle(2);
          }
        } else if (propertyName === "openConfig") {
          const themeColors = renderer.getThemeColors();
          waitForTask(
            new Promise((resolve) => {
              var _a2;
              figma.showUI(__html__, { width: 300, height: 340, themeColors: true });
              let actualProcessedTableData = processedTableData;
              if (actualProcessedTableData.length === 0 && tableText) {
                actualProcessedTableData = parseTableTextToColumns(tableText);
                if (actualProcessedTableData.length > 0) {
                  setProcessedTableData(actualProcessedTableData);
                }
              }
              const currentColCount = actualProcessedTableData.length;
              const currentRowCount = actualProcessedTableData.length > 0 ? ((_a2 = actualProcessedTableData[0]) == null ? void 0 : _a2.length) || 0 : 0;
              figma.ui.postMessage({
                type: "init",
                data: {
                  tableText,
                  exampleTableText,
                  rowCount: currentRowCount,
                  colCount: currentColCount,
                  fontSize,
                  tableWidth,
                  themeColors,
                  isRowColumnSwapped
                }
              });
              figma.ui.onmessage = (msg) => {
                if (msg.type === "update") {
                  const {
                    tableText: newText,
                    processedTableData: newProcessedTableData,
                    fontSize: newFontSize,
                    tableWidth: newTableWidth
                  } = msg.data;
                  setTableText(newText || "");
                  if (newProcessedTableData !== void 0) {
                    setProcessedTableData(newProcessedTableData);
                  }
                  if (newFontSize !== void 0) setFontSize(newFontSize);
                  if (newTableWidth !== void 0) setTableWidth(newTableWidth);
                } else if (msg.type === "close") {
                  figma.closePlugin();
                  resolve();
                }
              };
            })
          );
        } else if (propertyName === "fillStyle1") {
          setFillStyle(1);
        } else if (propertyName === "fillStyle2") {
          setFillStyle(2);
        } else if (propertyName === "fillStyle3") {
          setFillStyle(3);
        } else if (propertyName === "fillStyle4") {
          setFillStyle(4);
        } else if (propertyName === "strokeStyle1") {
          setStrokeStyle(1);
        } else if (propertyName === "strokeStyle2") {
          setStrokeStyle(2);
        } else if (propertyName === "strokeStyle3") {
          setStrokeStyle(3);
        } else if (propertyName === "strokeStyle4") {
          setStrokeStyle(4);
        } else if (propertyName === "themeHue") {
          const newHue = propertyValue;
          setThemeHue(newHue);
        } else if (propertyName === "themeLevel") {
          const newLevel = propertyValue;
          setThemeLevel(newLevel);
        } else if (propertyName === "themeStyle") {
          const newStyle = propertyValue;
          setThemeStyle(newStyle);
          const newMappingConfig = colorMappingPresets[newStyle] || colorMappingPresets["Fashion"];
          if (((_a = newMappingConfig.lightnessRange) == null ? void 0 : _a.defaultLevel) !== void 0) {
            const defaultLevel = newMappingConfig.lightnessRange.defaultLevel;
            const defaultOption = allLevelOptions.find((item) => item.level === defaultLevel);
            if (defaultOption) {
              setThemeLevel(defaultOption.option);
            }
          }
          if (newMappingConfig.hasHeader !== void 0) {
            setIsTableHeader(newMappingConfig.hasHeader);
          }
          if (newMappingConfig.fillStyle !== void 0) {
            setFillStyle(newMappingConfig.fillStyle);
          }
          if (newMappingConfig.strokeStyle !== void 0) {
            setStrokeStyle(newMappingConfig.strokeStyle);
          }
        } else if (propertyName === "colorMode") {
          const newMode = propertyValue;
          if (newMode === "color" || newMode === "monochrome") {
            setColorMode(newMode);
          }
        } else if (propertyName === "isTableHeader") {
          setIsTableHeader(!isTableHeader);
        } else if (propertyName === "showRowColHeaders") {
          setShowRowColHeaders(!showRowColHeaders);
        }
      }
    );
    return renderer.render();
  }
  function parseTableTextToColumns(text) {
    if (!text || !text.trim()) return [];
    const lines = text.trim().split("\n");
    const rows = [];
    lines.forEach((line) => {
      const cells = line.split("	");
      rows.push(cells);
    });
    if (rows.length === 0) return [];
    const maxCols = Math.max(...rows.map((row) => row.length));
    const columns = [];
    for (let i = 0; i < maxCols; i++) {
      columns.push(rows.map((row) => row[i] || ""));
    }
    return columns;
  }
  widget.register(Widget);
})();
