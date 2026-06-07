const { widget } = figma
const { useSyncedState, usePropertyMenu,useWidgetNodeId, AutoLayout, Text, waitForTask, Rectangle, Frame, Line, useEffect, Input } = widget

import pako from "../../../node_modules/pako";
function Widget(){
  const widgetId = useWidgetNodeId();
      
  let [vieBoxW,vieBoxH] = [512,512];
  let setBoxW = 130;
  let textColor = "#202020";
  let [mainColor1,mainColor2,mainColor3] = new Array(3).fill("#ACACAC");
  let [color1,color2,color3,color4,color5,color6,color7,color8,color9,color10] = new Array(10).fill("#C7C7C7");

  let mainColors = [mainColor1,mainColor2,mainColor3];
  let colors = [color1,color2,color3,color4,color5,color6,color7,color8,color9,color10];

  let btnNormalColor = {
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
            };
  let btnHoverColor = {
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
            };

  usePropertyMenu(
    [{
        itemType: 'action',
        propertyName: 'openConfig',
        tooltip: 'Open Config',
        icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.2041 9.021C19.7148 9.021 20.187 9.29356 20.4424 9.73584L23.6465 15.2856C23.9015 15.7277 23.9016 16.2723 23.6465 16.7144L20.4424 22.2642C20.187 22.7064 19.7148 22.979 19.2041 22.979H12.7959C12.2852 22.979 11.813 22.7064 11.5576 22.2642L8.35352 16.7144C8.09842 16.2723 8.09846 15.7277 8.35352 15.2856L11.5576 9.73584C11.813 9.29356 12.2852 9.021 12.7959 9.021H19.2041Z" stroke="white" stroke-width="1.22526"/>
        <circle cx="16" cy="16" r="2" fill="white"/>
        </svg>`
      },
      
    ],
    ({ propertyName }) => {
      if (propertyName === 'openConfig') {
        // Open UI for configuration using waitForTask
        waitForTask(
          new Promise<void>((resolve) => {
            figma.showUI(__html__, { width: 300, height: 340, themeColors: true })
           
          })
        )
      }
    },
  )
  async function addSlice(widgetNode : WidgetNode){
    let cut = figma.createSlice();
    cut.resize(vieBoxW,vieBoxH);
    cut.name = "@color-card-slice";
    cut.x = widgetNode.x;
    cut.y = widgetNode.y;
    let parent = widgetNode.parent as FrameNode | PageNode | null;
    if (!parent) {
      cut.remove();
      return;
    }
    let index = parent.children.indexOf(widgetNode) + 1 || parent.children.length || 0;
    parent?.insertChild(index, cut);
    waitForTask(
      new Promise<void>(async (resolve) => {
        try {
          let pixel = await cut.exportAsync({ format: "PNG" ,constraint: { type: "SCALE", value: 1 }})
          console.log(pixel)
          console.log(decode512x512PNG(pixel))
          //figma.ui.postMessage({ type: "getPixels", data: pixel });
        } catch (e) {
          console.error('Error exporting slice:', e)
        } finally {
          //cut.remove();
          resolve();
        }          
      })
    ) 
    
  }
 
  
  /**
 * 专为512x512 PNG设计的极简解码器
 * @param {Uint8Array} pngData PNG文件的原始二进制数据
 * @returns {Uint8Array} RGBA格式的像素数据（长度=512*512*4）
 */
function decode512x512PNG(pngData) {
    // 1. 验证PNG签名 (8字节)
    const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    for (let i = 0; i < 8; i++) {
        if (pngData[i] !== sig[i]) throw new Error("无效的PNG文件");
    }

    // 2. 定位并验证IHDR块 (必须是第一个数据块)
    let offset = 8;
    while (offset < pngData.length) {
        const length = readUInt32(pngData, offset);
        offset += 4;
        
        const type = String.fromCharCode(
            pngData[offset], pngData[offset+1], 
            pngData[offset+2], pngData[offset+3]
        );
        offset += 4;
        
        if (type === "IHDR") {
            const width = readUInt32(pngData, offset);
            const height = readUInt32(pngData, offset + 4);
            const bitDepth = pngData[offset + 8];
            const colorType = pngData[offset + 9];
            
            // 严格验证512x512 RGBA PNG (32位)
            if (width !== 512 || height !== 512) {
                throw new Error("仅支持512x512尺寸");
            }
            if (colorType !== 6 || bitDepth !== 8) {
                throw new Error("仅支持32位RGBA格式");
            }
            break;
        }
        offset += length + 4; // 跳过数据和CRC
    }

    // 3. 合并所有IDAT块数据
    offset = 8;
    let idatData = [];
    while (offset < pngData.length) {
        const length = readUInt32(pngData, offset);
        offset += 4;
        
        const type = String.fromCharCode(
            pngData[offset], pngData[offset+1], 
            pngData[offset+2], pngData[offset+3]
        );
        offset += 4;
        
        if (type === "IDAT") {
            for (let i = 0; i < length; i++) {
                idatData.push(pngData[offset + i]);
            }
        } else if (type === "IEND") {
            break;
        }
        offset += length + 4; // 跳过CRC
    }

    // 4. 解压IDAT数据 (需要pako库处理zlib)
    const inflated = pako.inflate(new Uint8Array(idatData));
    
    // 5. 处理PNG过滤器并生成RGBA
    const rgba = new Uint8Array(512 * 512 * 4);
    const bytesPerRow = 512 * 4; // 每行RGBA数据长度
    const stride = bytesPerRow + 1; // 加1字节过滤器类型
    
    for (let y = 0; y < 512; y++) {
        const filterType = inflated[y * stride];
        const row = inflated.subarray(y * stride + 1, y * stride + 1 + bytesPerRow);
        const prevRow = y === 0 ? null : inflated.subarray((y-1) * stride + 1, (y-1) * stride + 1 + bytesPerRow);
        
        // 应用PNG过滤器逆过程
        for (let x = 0; x < bytesPerRow; x++) {
            let rawByte;
            switch (filterType) {
                case 0: // 无过滤
                    rawByte = row[x];
                    break;
                case 1: // 左侧像素
                    rawByte = (row[x] + (x >= 4 ? row[x - 4] : 0)) & 0xFF;
                    break;
                case 2: // 上方像素
                    rawByte = (row[x] + (prevRow ? prevRow[x] : 0)) & 0xFF;
                    break;
                case 3: // 平均值
                    rawByte = (row[x] + Math.floor((x >= 4 ? row[x - 4] : 0) + (prevRow ? prevRow[x] : 0)) / 2) & 0xFF;
                    break;
                case 4: // Paeth预测
                    const a = x >= 4 ? row[x - 4] : 0;
                    const b = prevRow ? prevRow[x] : 0;
                    const c = prevRow && x >= 4 ? prevRow[x - 4] : 0;
                    const p = a + b - c;
                    const pa = Math.abs(p - a);
                    const pb = Math.abs(p - b);
                    const pc = Math.abs(p - c);
                    rawByte = (row[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xFF;
                    break;
                default:
                    throw new Error(`未知过滤器类型: ${filterType}`);
            }
            rgba[y * bytesPerRow + x] = rawByte;
        }
    }
    
    return rgba;
}


// 辅助函数：大端读取32位整数
function readUInt32(data, offset) {
    return (data[offset] << 24) |
           (data[offset + 1] << 16) |
           (data[offset + 2] << 8) |
           data[offset + 3];
}


  return (
    <AutoLayout
      name="allBox"
      direction="horizontal"
      spacing={0}
      padding={0}
      width= {vieBoxW + setBoxW}
      height= {vieBoxH}
      stroke="#E0E0E0"
      strokeWidth={4}
      strokeAlign={"outside"}
      effect={{
        type: "drop-shadow",
        color: { r: 0, g: 0, b: 0, a: 0.6 },
        offset: { x: 0, y: 2 },
        blur: 10,
        showShadowBehindNode: false,
      }}
    >
      <Frame
        width={vieBoxW}
        height={vieBoxH}
        strokeWidth={10}
        strokeAlign={"outside"}
      >
        <Frame
        width={vieBoxW}
        height={vieBoxH}
        strokeWidth={1}
        strokeAlign={"inside"}
        fill={"#ffffff10"}
        effect={{
          type: "background-blur",
          blur: 40,
        }}
      >
      </Frame>
      </Frame>
      <AutoLayout
        name="cardBox"
        direction="vertical"
        spacing={0}
        padding={0}
        minWidth={setBoxW}
        width= "fill-parent"
        height= "fill-parent"
        fill = "#D9D9D9"
      >
        <AutoLayout
          name="colorCard"
          direction="vertical"
          spacing={10}
          padding={10}
          width= "fill-parent"
          height= "fill-parent"
        >
          <AutoLayout
            name="mainColor-box"
            direction="horizontal"
            spacing="auto"
            padding={{left: 0, top: 10 , right: 0, bottom: 0}}
            width="fill-parent"
            height="hug-contents"
          >
            <AutoLayout
              name="mainColor"
              direction="vertical"
              spacing={10}
              padding={0}
              minWidth={86}
              width="fill-parent"
              height="hug-contents"
              horizontalAlignItems="center"
            >
             {mainColors.map((color, index) => (
                <Rectangle
                  key={index}
                  name={`mainColor_${index}`}
                  width={70}
                  height={70}
                  fill={color}
                  effect={{
                      type: "inner-shadow",
                      color: { r: 0, g: 0, b: 0, a: 0.2 },
                      offset: { x: 1, y: 1 },
                      blur: 0,
                    }}
                />
              ))}
            </AutoLayout>
            <AutoLayout
              name="mainColor-title"
              direction="horizontal"
              spacing={10}
              padding={0}
              width="hug-contents"
              height="hug-contents"
              verticalAlignItems="center"
              rotation={-90}
            >
              <Rectangle
                width={4}
                height={4}
                fill={textColor}
              ></Rectangle>
              <Text
                fontSize={12}
                fill={textColor}
              >
                MAIN
              </Text>
              <Text
                fontSize={12}
                fill={textColor}
              >
                ∥∥∥∥∥
              </Text>
            </AutoLayout>
          </AutoLayout>
          <AutoLayout
            name="otherColor-box"
            direction="horizontal"
            spacing="auto"
            padding={0}
            width="fill-parent"
            height="fill-parent"
          >
            <AutoLayout
              name="otherColor-center"
              direction="horizontal"
              padding={{horizontal: 8, vertical: 0}}
              minWidth={86}
              width="fill-parent"
              height="fill-parent"
              horizontalAlignItems="center"
            >
              <AutoLayout
                name="otherColor"
                direction="horizontal"
                wrap={true}
                spacing={6}
                padding={10}
                minWidth={86}
                width="fill-parent"
                height="fill-parent"
                horizontalAlignItems="center"
                fill="#E9E9E9"
              >
                {colors.map((color, index) => (
                  <Rectangle
                    key={index}
                    name={`otherColor_${index}`}
                    width={30}
                    height={30}
                    fill={color}
                    effect={{
                      type: "inner-shadow",
                      color: { r: 0, g: 0, b: 0, a: 0.2 },
                      offset: { x: 1, y: 1 },
                      blur: 0,
                    }}
                  />
                ))}
              </AutoLayout>
            </AutoLayout>
            <AutoLayout
                name="otherColor-title"
                direction="horizontal"
                spacing={10}
                padding={0}
                width="hug-contents"
                height="hug-contents"
                verticalAlignItems="center"
                rotation={-90}
              >
                <Rectangle
                  width={4}
                  height={4}
                  fill={textColor}
                ></Rectangle>
                <Text
                  fontSize={12}
                  fill={textColor}
                >
                  OTHER
                </Text>
                <Text
                  fontSize={12}
                  fill={textColor}
                >
                  ∥∥∥∥∥
                </Text>
              </AutoLayout>
          </AutoLayout>
          
        </AutoLayout>
        <AutoLayout
          name="btnBox"
          spacing={4}
          padding={{left: 18, top: 0, right: 36, bottom: 18}}
          direction="vertical"
          width="fill-parent"
          height="hug-contents"
          verticalAlignItems="end"
        > 
          <AutoLayout
            name="btn_export"
            spacing={0}
            padding={{horizontal: 8, vertical: 0}}
            width="fill-parent"
            height="hug-contents"
            horizontalAlignItems="end"
            onClick={() => console.log("export")}
            fill={btnNormalColor}
            hoverStyle={{
              fill: btnHoverColor
            }}
          >
            <Text
              fontSize={10}
              fill={textColor}
            >
              {'>>>'} EXPORT
            </Text>
          </AutoLayout>
          <AutoLayout
            name="btn_start"
            spacing={0}
            padding={{horizontal: 8, vertical: 0}}
            width="fill-parent"
            height="hug-contents"
            horizontalAlignItems="end"
            onClick={async () => 
              {
                console.log("start")
                const widgetNode = await figma.getNodeByIdAsync(widgetId) as WidgetNode
                if (widgetNode) {
                  addSlice(widgetNode)
                }
              //let cut = figma.createSlice();
              //cut.resize(vieBoxW,vieBoxH);
              }
            }
            fill={btnNormalColor}
            hoverStyle={{
              fill: btnHoverColor
            }}
          >
            <Text
              fontSize={10}
              fill={textColor}
            >
              {'>>>'} START
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>

    </AutoLayout>
  )
}

widget.register(Widget)
