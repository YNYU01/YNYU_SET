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
  var { useSyncedState, usePropertyMenu, AutoLayout, Text, waitForTask, Rectangle, Frame, Line, useEffect } = widget;
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
      lightnessRange: { min: 5, max: 10, isSpaceBetween: true, defaultLevel: 11 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
      cellFillColor: { lightnessOffset: 13, saturationMultiplier: 0.8 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 20, relativeTo: "headerFillColor" }
    },
    "Soft": {
      //柔和
      primaryTarget: "bgColor",
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 10, max: 80 },
      lightnessRange: { min: 6, max: 10, isSpaceBetween: true, defaultLevel: 13 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
      cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 10, relativeTo: "headerFillColor" }
    },
    "Fashion": {
      //时尚
      primaryTarget: "headerFillColor",
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 50, max: 90 },
      lightnessRange: { min: 9, max: 11, defaultLevel: 10 },
      bgColor: { lightnessOffset: 405, saturationMultiplier: 0.95 },
      headerFillColor: {},
      cellFillColor: { lightnessOffset: 10, saturationMultiplier: 1, opacity: 0.3 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 0.1, relativeTo: "headerFillColor" }
    },
    "Contrast": {
      //对比
      // primaryTarget 设为 null，表示主题色不直接赋予任何部位，所有部位都基于主题色计算衍生值
      primaryTarget: null,
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 50, max: 90 },
      lightnessRange: { min: 9, max: 15, defaultLevel: 12 },
      bgColor: { color: "white" },
      headerFillColor: { color: "black" },
      cellFillColor: { lightnessOffset: 0, saturationMultiplier: 1, opacity: 0.8 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { color: "black" }
    },
    "Vivid": {
      //鲜艳
      primaryTarget: "bgColor",
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 80, max: 100 },
      lightnessRange: { min: 1, max: 13, defaultLevel: 10 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
      cellFillColor: { lightnessOffset: 25, saturationMultiplier: 0.9 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 10, relativeTo: "bgColor" }
    },
    "Pastel": {
      //粉嫩
      primaryTarget: "bgColor",
      rgbOffset: { r: -10, g: -40, b: 20 },
      saturationRange: { min: 40, max: 100 },
      lightnessRange: { min: 12, max: 15, defaultLevel: 14 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
      cellFillColor: { lightnessOffset: 15, saturationMultiplier: 0.9 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 10, relativeTo: "bgColor" }
    },
    "Retro": {
      //复古
      primaryTarget: "bgColor",
      rgbOffset: { r: 40, g: 30, b: -20 },
      saturationRange: { min: 10, max: 70 },
      lightnessRange: { min: 1, max: 14, defaultLevel: 10 },
      bgColor: {},
      // 使用主题色
      headerFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5 },
      cellFillColor: { lightnessOffset: 30, saturationMultiplier: 0.5 },
      headerTextColor: { contrastThreshold: 50 },
      cellTextColor: { contrastThreshold: 50 },
      strokeColor: { lightnessOffset: 0, relativeTo: "bgColor" }
    },
    "Neon": {
      //霓虹
      primaryTarget: null,
      rgbOffset: { r: 0, g: 0, b: 0 },
      saturationRange: { min: 80, max: 100 },
      lightnessRange: { min: 5, max: 12, defaultLevel: 7 },
      bgColor: { color: "black" },
      headerFillColor: { lightnessOffset: 5, saturationMultiplier: 1 },
      cellFillColor: { lightnessOffset: 5, saturationMultiplier: 0.9 },
      headerTextColor: { color: "black" },
      cellTextColor: { color: "theme" },
      strokeColor: { color: "theme" }
    }
  };
  function calculateThemeColors(themeColorHex, levelColorHex, mappingConfig, colorMode = "color") {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const themeHsl = hexToHsl(themeColorHex);
    if (!themeHsl) {
      return {
        bgColor: "#2D2D2D",
        headerFillColor: "#3D3D3D",
        headerTextColor: "#FFFFFF",
        cellFillColor: "#2D2D2D",
        cellTextColor: "#D4D4D4",
        strokeColor: "#666666"
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
        strokeColor: "#666666"
      };
    }
    const levelR = Math.round(levelRgb.r * 255);
    const levelG = Math.round(levelRgb.g * 255);
    const levelB = Math.round(levelRgb.b * 255);
    const levelHsl = rgbToHsl(levelR, levelG, levelB);
    let lightness = levelHsl.l;
    if (mappingConfig.lightnessRange) {
      const { min: rangeMin, max: rangeMax, isSpaceBetween } = mappingConfig.lightnessRange;
      const currentLevel = Math.max(1, Math.min(15, Math.round(lightness / 100 * 14 + 1) || 1));
      let mappedLevel;
      if (isSpaceBetween) {
        if (currentLevel >= rangeMin && currentLevel <= rangeMax) {
          const distanceToMin = currentLevel - rangeMin;
          const distanceToMax = rangeMax - currentLevel;
          if (distanceToMin <= distanceToMax) {
            mappedLevel = Math.max(1, rangeMin - 1);
          } else {
            mappedLevel = Math.min(15, rangeMax + 1);
          }
        } else {
          mappedLevel = currentLevel;
        }
      } else {
        if (currentLevel < rangeMin) {
          mappedLevel = rangeMin;
        } else if (currentLevel > rangeMax) {
          mappedLevel = rangeMax;
        } else {
          mappedLevel = currentLevel;
        }
      }
      lightness = (mappedLevel - 1) / 14 * 100;
    }
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
      var _a2;
      const rgb = hslToRgb(actualHue, bgConfig.s, bgConfig.l);
      return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, (_a2 = mappingConfig.bgColor) == null ? void 0 : _a2.rgbOffset);
    })();
    const headerConfig = calculateColor("headerFillColor", mappingConfig.headerFillColor);
    const headerFillColor = headerConfig.isFixed ? headerConfig.fixedColor : (() => {
      var _a2;
      const rgb = hslToRgb(actualHue, headerConfig.s, headerConfig.l);
      return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, (_a2 = mappingConfig.headerFillColor) == null ? void 0 : _a2.rgbOffset);
    })();
    const cellConfig = calculateColor("cellFillColor", mappingConfig.cellFillColor);
    const cellFillColor = cellConfig.isFixed ? cellConfig.fixedColor : (() => {
      var _a2;
      const rgb = hslToRgb(actualHue, cellConfig.s, cellConfig.l);
      return applyRgbOffset(rgb.r, rgb.g, rgb.b, mappingConfig.rgbOffset, (_a2 = mappingConfig.cellFillColor) == null ? void 0 : _a2.rgbOffset);
    })();
    let headerTextColor;
    if (((_a = mappingConfig.headerTextColor) == null ? void 0 : _a.color) === "black") {
      headerTextColor = "#000000";
    } else if (((_b = mappingConfig.headerTextColor) == null ? void 0 : _b.color) === "white") {
      headerTextColor = "#FFFFFF";
    } else if (((_c = mappingConfig.headerTextColor) == null ? void 0 : _c.color) === "theme") {
      const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
      headerTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset);
    } else {
      const headerThreshold = ((_d = mappingConfig.headerTextColor) == null ? void 0 : _d.contrastThreshold) || 50;
      headerTextColor = headerConfig.l >= headerThreshold ? "#000000" : "#FFFFFF";
    }
    let cellTextColor;
    if (((_e = mappingConfig.cellTextColor) == null ? void 0 : _e.color) === "black") {
      cellTextColor = "#000000";
    } else if (((_f = mappingConfig.cellTextColor) == null ? void 0 : _f.color) === "white") {
      cellTextColor = "#FFFFFF";
    } else if (((_g = mappingConfig.cellTextColor) == null ? void 0 : _g.color) === "theme") {
      const themeRgb = hslToRgb(actualHue, primaryS, primaryL);
      cellTextColor = applyRgbOffset(themeRgb.r, themeRgb.g, themeRgb.b, mappingConfig.rgbOffset);
    } else {
      const cellThreshold = ((_h = mappingConfig.cellTextColor) == null ? void 0 : _h.contrastThreshold) || 50;
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
    return {
      bgColor,
      headerFillColor,
      headerTextColor,
      cellFillColor,
      cellTextColor,
      strokeColor
    };
  }
  function Widget() {
    var _a, _b;
    const [processedTableData, setProcessedTableData] = useSyncedState("processedTableData", []);
    const [tableText, setTableText] = useSyncedState("tableText", "A1	B1	C1\na2	b2	c2\na3	b3	c3\na4	b4	c4");
    const [fillStyle, setFillStyle] = useSyncedState("fillStyle", 2);
    const [strokeStyle, setStrokeStyle] = useSyncedState("strokeStyle", 4);
    const [isTableHeader, setIsTableHeader] = useSyncedState("isTableHeader", true);
    const [themeHue, setThemeHue] = useSyncedState("themeHue", "#ff8800");
    const [themeLevel, setThemeLevel] = useSyncedState("themeLevel", "#333333");
    const [themeStyle, setThemeStyle] = useSyncedState("themeStyle", "Fashion");
    const [colorMode, setColorMode] = useSyncedState("colorMode", "color");
    const currentMappingConfig = colorMappingPresets[themeStyle] || colorMappingPresets["Fashion"];
    const themeColors = calculateThemeColors(themeHue, themeLevel, currentMappingConfig, colorMode);
    const actualBgColor = themeColors.bgColor;
    const actualHeaderFillColor = themeColors.headerFillColor;
    const actualHeaderTextColor = themeColors.headerTextColor;
    const actualCellFillColor = themeColors.cellFillColor;
    const actualCellTextColor = themeColors.cellTextColor;
    const actualStrokeColor = themeColors.strokeColor;
    const [fontSize, setFontSize] = useSyncedState("fontSize", 12);
    const [isRowColumnSwapped, setIsRowColumnSwapped] = useSyncedState("isRowColumnSwapped", false);
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
    const levelOptions = (() => {
      let filtered;
      if (!currentMappingConfig.lightnessRange) {
        filtered = allLevelOptions.map((_a2) => {
          var _b2 = _a2, { level } = _b2, rest = __objRest(_b2, ["level"]);
          return rest;
        });
      } else {
        const { min, max, isSpaceBetween, defaultLevel } = currentMappingConfig.lightnessRange;
        if (isSpaceBetween) {
          filtered = allLevelOptions.filter((item) => item.level < min || item.level > max).map((_c) => {
            var _d = _c, { level } = _d, rest = __objRest(_d, ["level"]);
            return rest;
          });
        } else {
          filtered = allLevelOptions.filter((item) => item.level >= min && item.level <= max).map((_e) => {
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
          itemType: "separator"
        },
        {
          itemType: "action",
          propertyName: "isTableHeader",
          tooltip: "Table Header",
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
        var _a2;
        if (propertyName === "swapRowColumn") {
          if (processedTableData.length > 0) {
            const maxRows = Math.max(...processedTableData.map((col) => col.length));
            const rows = [];
            for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
              const row = [];
              for (let colIndex = 0; colIndex < processedTableData.length; colIndex++) {
                row.push(processedTableData[colIndex][rowIndex] || "");
              }
              rows.push(row);
            }
            const newColumns = rows;
            setProcessedTableData(newColumns);
            setIsRowColumnSwapped(!isRowColumnSwapped);
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
            const maxRowsForText = Math.max(...newColumns.map((col) => col.length));
            const textRows = [];
            for (let rowIndex = 0; rowIndex < maxRowsForText; rowIndex++) {
              const row = newColumns.map((col) => col[rowIndex] || "").join("	");
              textRows.push(row);
            }
            const newText = textRows.join("\n");
            setTableText(newText);
          }
        } else if (propertyName === "openConfig") {
          waitForTask(
            new Promise((resolve) => {
              var _a3;
              figma.showUI(__html__, { width: 300, height: 340, themeColors: true });
              const currentColCount = processedTableData.length;
              const currentRowCount = processedTableData.length > 0 ? ((_a3 = processedTableData[0]) == null ? void 0 : _a3.length) || 0 : 0;
              figma.ui.postMessage({
                type: "init",
                data: {
                  tableText,
                  rowCount: currentRowCount,
                  colCount: currentColCount,
                  fontSize,
                  themeColors
                }
              });
              figma.ui.onmessage = (msg) => {
                if (msg.type === "update") {
                  const {
                    tableText: newText,
                    processedTableData: newProcessedTableData,
                    fontSize: newFontSize
                  } = msg.data;
                  setTableText(newText || "");
                  if (newProcessedTableData !== void 0) {
                    setProcessedTableData(newProcessedTableData);
                  }
                  if (newFontSize !== void 0) setFontSize(newFontSize);
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
          if (((_a2 = newMappingConfig.lightnessRange) == null ? void 0 : _a2.defaultLevel) !== void 0) {
            const defaultLevel = newMappingConfig.lightnessRange.defaultLevel;
            const defaultOption = allLevelOptions.find((item) => item.level === defaultLevel);
            if (defaultOption) {
              setThemeLevel(defaultOption.option);
            }
          }
        } else if (propertyName === "colorMode") {
          const newMode = propertyValue;
          if (newMode === "color" || newMode === "monochrome") {
            setColorMode(newMode);
          }
        } else if (propertyName === "isTableHeader") {
          setIsTableHeader(!isTableHeader);
        }
      }
    );
    const actualColCount = processedTableData.length;
    const actualRowCount = processedTableData.length > 0 ? ((_a = processedTableData[0]) == null ? void 0 : _a.length) || 0 : 0;
    const strokeColorRgb = hexToRgb(actualStrokeColor) || { r: 0.4, g: 0.4, b: 0.4, a: 1 };
    if (processedTableData.length === 0 || actualRowCount === 0 || actualColCount === 0) {
      return /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          name: "@table",
          direction: "vertical",
          stroke: strokeStyle !== 4 ? strokeColorRgb : void 0,
          strokeWidth: strokeStyle !== 4 ? 1 : 0,
          strokeAlign: "center",
          spacing: 0,
          padding: 12,
          fill: hexToRgb(actualBgColor) || { r: 0.18, g: 0.18, b: 0.18, a: 1 },
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
    const bgRgb = hexToRgb(actualBgColor) || { r: 0.18, g: 0.18, b: 0.18, a: 1 };
    const headerFillRgb = hexToRgb(actualHeaderFillColor) || { r: 0.24, g: 0.24, b: 0.24, a: 1 };
    const cellFillRgbBase = hexToRgb(actualCellFillColor) || { r: 0.24, g: 0.24, b: 0.24, a: 1 };
    const cellFillOpacity = ((_b = currentMappingConfig.cellFillColor) == null ? void 0 : _b.opacity) !== void 0 ? currentMappingConfig.cellFillColor.opacity : 0.4;
    const cellFillRgb = __spreadProps(__spreadValues({}, cellFillRgbBase), { a: cellFillOpacity });
    const headerTextRgb = hexToRgb(actualHeaderTextColor) || { r: 1, g: 1, b: 1, a: 1 };
    const cellTextRgb = hexToRgb(actualCellTextColor) || { r: 0.83, g: 0.83, b: 0.83, a: 1 };
    const shouldFillByIndex = (rowIndex, colIndex, isHeader = false) => {
      if (isHeader) return true;
      if (fillStyle === 1) return true;
      if (fillStyle === 2) {
        const actualRowIndex = rowIndex + 1;
        return actualRowIndex % 2 === 0;
      }
      if (fillStyle === 3) {
        return colIndex % 2 === 0;
      }
      return false;
    };
    const strokeWidth = 1;
    const getStrokeWeights = () => {
      if (strokeStyle === 1) {
        return { top: strokeWidth, right: strokeWidth, bottom: strokeWidth, left: strokeWidth };
      } else if (strokeStyle === 2) {
        return { top: strokeWidth, right: 0, bottom: strokeWidth, left: 0 };
      } else if (strokeStyle === 3) {
        return { top: 0, right: strokeWidth, bottom: 0, left: strokeWidth };
      } else {
        return { top: 0, right: 0, bottom: 0, left: 0 };
      }
    };
    const strokeWeights = getStrokeWeights();
    const hasAnyStroke = strokeStyle !== 4;
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        name: "@table",
        direction: "horizontal",
        stroke: hasAnyStroke ? strokeColorRgb : void 0,
        strokeWidth: hasAnyStroke ? strokeWidth : 0,
        strokeAlign: "center",
        spacing: 0,
        padding: 0,
        fill: bgRgb,
        cornerRadius: 4,
        width: fontSize * 25
      },
      processedTableData.map((column, colIndex) => {
        const isHeaderColumn = isTableHeader && isRowColumnSwapped ? colIndex === 0 : false;
        const actualRowCount2 = column.length;
        return /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            key: `column-${colIndex}`,
            name: "@column",
            direction: "vertical",
            spacing: 0,
            padding: 0,
            width: "fill-parent"
          },
          isHeaderColumn ? (
            // 反行列模式：第一列的所有元素都是表头
            column.map((cellValue, rowIndex) => /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                key: `th-${rowIndex}`,
                name: "@th",
                direction: "vertical",
                spacing: 0,
                padding: 0,
                width: "fill-parent",
                fill: shouldFillByIndex(rowIndex, colIndex, true) ? headerFillRgb : void 0
              },
              strokeWeights.top > 0 && /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  name: "@stroke-top",
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
                  width: "fill-parent"
                },
                strokeWeights.left > 0 && /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    name: "@stroke-left",
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
                    width: "fill-parent"
                  },
                  /* @__PURE__ */ figma.widget.h(
                    Text,
                    {
                      fontSize,
                      fill: headerTextRgb,
                      width: "fill-parent",
                      horizontalAlignText: "center",
                      fontWeight: "bold"
                    },
                    cellValue || ""
                  )
                ),
                strokeWeights.right > 0 && /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    name: "@stroke-right",
                    width: 0,
                    height: "fill-parent",
                    stroke: strokeColorRgb,
                    strokeWidth: strokeWeights.right,
                    strokeAlign: "center"
                  }
                )
              ),
              strokeWeights.bottom > 0 && /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  name: "@stroke-bottom",
                  width: "fill-parent",
                  height: 0,
                  stroke: strokeColorRgb,
                  strokeWidth: strokeWeights.bottom,
                  strokeAlign: "center"
                }
              )
            ))
          ) : /* @__PURE__ */ figma.widget.h(figma.widget.Fragment, null, !isRowColumnSwapped && isTableHeader && /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              name: "@th",
              direction: "vertical",
              spacing: 0,
              padding: 0,
              width: "fill-parent",
              fill: shouldFillByIndex(0, colIndex, true) ? headerFillRgb : void 0
            },
            strokeWeights.top > 0 && /* @__PURE__ */ figma.widget.h(
              Rectangle,
              {
                name: "@stroke-top",
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
                width: "fill-parent"
              },
              strokeWeights.left > 0 && /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  name: "@stroke-left",
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
                  width: "fill-parent"
                },
                /* @__PURE__ */ figma.widget.h(
                  Text,
                  {
                    fontSize,
                    fill: headerTextRgb,
                    width: "fill-parent",
                    horizontalAlignText: "center",
                    fontWeight: "bold"
                  },
                  column[0] || ""
                )
              ),
              strokeWeights.right > 0 && /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  name: "@stroke-right",
                  width: 0,
                  height: "fill-parent",
                  stroke: strokeColorRgb,
                  strokeWidth: strokeWeights.right,
                  strokeAlign: "center"
                }
              )
            ),
            strokeWeights.bottom > 0 && /* @__PURE__ */ figma.widget.h(
              Rectangle,
              {
                name: "@stroke-bottom",
                width: "fill-parent",
                height: 0,
                stroke: strokeColorRgb,
                strokeWidth: strokeWeights.bottom,
                strokeAlign: "center"
              }
            )
          ), Array.from({ length: Math.max(0, actualRowCount2 - (isRowColumnSwapped ? 0 : isTableHeader ? 1 : 0)) }).map((_, rowIndex) => {
            const cellValue = column[isRowColumnSwapped ? rowIndex : isTableHeader ? rowIndex + 1 : rowIndex] || "";
            const shouldFillThisCell = shouldFillByIndex(rowIndex, colIndex, false);
            return /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                key: `td-${rowIndex}`,
                name: "@td",
                direction: "vertical",
                spacing: 0,
                padding: 0,
                width: "fill-parent",
                fill: shouldFillThisCell ? cellFillRgb : void 0
              },
              strokeWeights.top > 0 && /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  name: "@stroke-top",
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
                  width: "fill-parent"
                },
                strokeWeights.left > 0 && /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    name: "@stroke-left",
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
                    width: "fill-parent"
                  },
                  /* @__PURE__ */ figma.widget.h(
                    Text,
                    {
                      fontSize,
                      fill: cellTextRgb,
                      width: "fill-parent",
                      horizontalAlignText: "center",
                      fontWeight: "normal"
                    },
                    cellValue
                  )
                ),
                strokeWeights.right > 0 && /* @__PURE__ */ figma.widget.h(
                  Rectangle,
                  {
                    name: "@stroke-right",
                    width: 0,
                    height: "fill-parent",
                    stroke: strokeColorRgb,
                    strokeWidth: strokeWeights.right,
                    strokeAlign: "center"
                  }
                )
              ),
              strokeWeights.bottom > 0 && /* @__PURE__ */ figma.widget.h(
                Rectangle,
                {
                  name: "@stroke-bottom",
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
      })
    );
  }
  widget.register(Widget);
})();
