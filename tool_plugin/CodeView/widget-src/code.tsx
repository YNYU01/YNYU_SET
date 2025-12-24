const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, Span, waitForTask, Rectangle, Frame, Line } = widget

function Widget() {
  // textContent 存储纯文本（用于编辑）
  const [textContent, setTextContent] = useSyncedState('textContent', `function example() {
  // This is an example code
  const message = "Hello, World!";
  console.log(message);
  return message;
}`)
  // spanContentArray 存储按行组织的数组格式（用于渲染）
  // 格式: [{line: 0, indent: 0, spans: [{tagname, color, text}, ...]}, ...]
  type LineData = {
    line: number
    indent: number
    spans: Array<{tagname: string | null, color: string | null, text: string}>
  }
  const [spanContentArray, setSpanContentArray] = useSyncedState<LineData[]>('spanContentArray', [])
  const [wordWrap, setWordWrap] = useSyncedState('wordWrap', false)
  const [width, setWidth] = useSyncedState('width', 400)
  const [fontSize, setFontSize] = useSyncedState('fontSize', 16)
  const [pickLineY, setPickLineY] = useSyncedState('pickLineY', -1)
  const [lineNumber, setLineNumber] = useSyncedState('lineNumber', true)
  const [indentLine, setIndentLine] = useSyncedState('indentLine', true)
  const [indentRule, setIndentRule] = useSyncedState('indentRule', 2)
  // 如果没有数组数据，从 textContent 生成默认数据
  const codeLines: LineData[] = spanContentArray && spanContentArray.length > 0 
    ? spanContentArray 
    : (textContent ? textContent.split('\n').map((line: string, index: number) => ({
        line: index,
        indent: Math.floor((line.match(/^(\s*)/)?.[1]?.length || 0) / 2),
        spans: [{ tagname: null, color: null, text: line }]
      })) : [])

  // 根据缩进数创建竖线
  function addIndentLine(indent: number) {
    if (indent <= 0) {
      return null
    }
    
    // 为每个缩进级别添加一条竖线，让 AutoLayout 的 spacing 来排列它们
    return Array.from({ length: indent }, (_, i) => (
      <Rectangle
        key={i}
        name="@code:indentline"
        width={0.5}
        height="fill-parent"
        fill="#252525"
      />
    ))
  }
  
  // 从 spans 数组创建 JSX 元素
  function renderSpans(spans: Array<{tagname: string | null, color: string | null, text: string}>): (string | ReturnType<typeof Span>)[] {
    if (!spans || spans.length === 0) return [' ']
    
    let key = 0
    return spans.map(span => {
      if (span.tagname === 'span' && span.color) {
        return <Span key={key++} fill={span.color}>{span.text || ''}</Span>
      } else {
        return span.text || ''
      }
    })
  }
  
  const lineCount = codeLines.length || 1

  const padding = 12
  const lineHeight = fontSize * 1.5
  // 初始化 pickLineY，如果还没有设置过，使用默认值
  const initialPickLineY = pickLineY === -1 ? lineHeight * -1 - 1 : pickLineY
  /* 计算行号宽度, 根据当前字号动态计算 */
  const numberWidth = fontSize * (10/16) * codeLines.length.toString().length
  const indentWidth = fontSize * (10/16) - 0.5

  // Property menu for configuration
  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'openConfig',
        tooltip: 'Open Config',
        icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.2041 9.021C19.7148 9.021 20.187 9.29356 20.4424 9.73584L23.6465 15.2856C23.9015 15.7277 23.9016 16.2723 23.6465 16.7144L20.4424 22.2642C20.187 22.7064 19.7148 22.979 19.2041 22.979H12.7959C12.2852 22.979 11.813 22.7064 11.5576 22.2642L8.35352 16.7144C8.09842 16.2723 8.09846 15.7277 8.35352 15.2856L11.5576 9.73584C11.813 9.29356 12.2852 9.021 12.7959 9.021H19.2041Z" stroke="white" stroke-width="1.22526"/>
        <circle cx="16" cy="16" r="2" fill="white"/>
        </svg>`
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'toggle',
        propertyName: 'wordWrap',
        tooltip: 'Is word wrap',
        isToggled: wordWrap,
        icon: `
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" fill-rule="evenodd" 
        d="M6.5 6a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-1 0v-10a.5.5 0 0 1 .5-.5m3 4h5a.5.5 0 1 0 0-1h-5a.5.5 0 0 0 0 1m5 2h-5a.5.5 0 1 1 0-1h5a.5.5 0 1 1 0 1M9 13.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m9-7a.5.5 0 0 0-1 0v10a.5.5 0 0 0 1 0z" 
        clip-rule="evenodd">
        </path>
        </svg>`
      },
      {
        itemType: 'toggle',
        propertyName: 'lineNumber',
        tooltip: 'Is line number',
        isToggled: lineNumber,
        icon: `
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" 
        d="M8.5 13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.276.447L7 15.81V16h1.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .276-.447L8 14.19V14H6.5a.5.5 0 0 1 0-1zm9 3a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zm0-5a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1zM7.6 6.01a.5.5 0 0 1 .4.49v3a.5.5 0 0 1-1 0V7h-.5a.5.5 0 0 1 0-1h1zM17.5 6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1 0-1z">
        </path>
        </svg>`
      },
      {
        itemType: 'toggle',
        propertyName: 'indentLine',
        tooltip: 'Is indent line',
        isToggled: indentLine,
        icon: `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 9.52075H24" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M8 21.8965H24" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12.5454 13.646H22.4062" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12.5454 17.7712H22.4062" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M8.66211 13.1011L8.66211 18.8989" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="0.1 2.5"/>
        </svg>
        `
      },
    ],
    ({ propertyName }) => {
      if (propertyName === 'openConfig') {
        // Open UI for configuration using waitForTask
        waitForTask(
          new Promise<void>((resolve) => {
            figma.showUI(__html__, { width: 300, height: 340, themeColors: true })
            
            // Send initial data to UI，发送纯文本和字号
            figma.ui.postMessage({
              type: 'init',
              data: { textContent: textContent, fontSize: fontSize, width: width }
            })

            // Listen for messages from UI
            figma.ui.onmessage = (msg) => {
              if (msg.type === 'update') {
                const { textContent: newText, spanContentArray, width: newWidth, fontSize: newFontSize, indentRule: newIndentRule } = msg.data
                // 存储纯文本
                setTextContent(newText || '')
                // 直接存储按行组织的数组格式
                if (spanContentArray && Array.isArray(spanContentArray) && spanContentArray.length > 0) {
                  setSpanContentArray(spanContentArray)
                } else {
                  // 如果没有数组数据，从纯文本生成
                  setSpanContentArray(newText ? newText.split('\n').map((line: string, index: number) => ({
                    line: index,
                    indent: Math.floor((line.match(/^(\s*)/)?.[1]?.length || 0) / 2),
                    spans: [{ tagname: null, color: null, text: line }]
                  })) : [])
                }
                if (newWidth) setWidth(newWidth)
                if (newFontSize) setFontSize(newFontSize)
                if (newIndentRule) setIndentRule(newIndentRule)
                  setPickLineY(-1)
                // 不调用 resolve()，保持界面打开，允许继续编辑
              } else if (msg.type === 'close') {
                // 用户明确关闭界面时才调用 resolve()
                figma.closePlugin()
                resolve()
              }
            }
          })
        )
      } else if (propertyName === 'wordWrap') {
        setWordWrap(!wordWrap)
      } else if (propertyName === 'lineNumber') {
        setLineNumber(!lineNumber)
      } else if (propertyName === 'indentLine') {
        setIndentLine(!indentLine)
      }
    },
  )

  return (
    <AutoLayout
      name="@pre"
      direction="vertical"
      spacing={0}
      padding={0}
      width={wordWrap ? width : 'hug-contents'}
      height="hug-contents"
      fill="#1a1a1a"
      cornerRadius={4}
    >
      {/* pick line */}
      <Line
        name="@pickline:bottom"
        positioning='absolute'
        key='pickLine1'
        x={1}
        y={initialPickLineY}
        length={1000*numberWidth}
        stroke="#383838"
        strokeWidth={1}
        hidden={wordWrap}
      />
      <Line
        name="@pickline:top"
        positioning='absolute'
        key='pickLine2'
        x={1}
        y={initialPickLineY - fontSize - Math.floor(fontSize/5)}
        length={1000*numberWidth}
        stroke="#383838"
        strokeWidth={1}
        hidden={wordWrap}
      />
      {/* Each line: line number + code content */}
      {codeLines.length > 0 ? (
        codeLines.map((lineData, index) => {
          let isEmptyLine = false;
          if(lineData.indent > 0 && lineData.spans[0].text === ''){
            isEmptyLine = true;
            //console.log(lineData.indent,lineData.indent * indentWidth);
          }
          return (
          <AutoLayout
            name="@code:mix"
            key={index}
            direction="horizontal"
            spacing={0}
            padding={0}
            width={wordWrap ? width : 'fill-parent'}
            height="hug-contents"
            onClick={() => { 
              const newY = (index + 1) * ((lineHeight - fontSize)/2 + fontSize) + 8
              if(initialPickLineY === newY){
                setPickLineY(-1)
              }else{
                setPickLineY(newY)
                //console.log(newY)
              }
            }}
          >
            {/* Line number */}
            <AutoLayout
              hidden={!lineNumber}
              name="@code:linenum"
              direction="vertical"
              spacing={0}
              padding={{ top:index === 0 ? 8 : 0, bottom: index === codeLines.length - 1 ? 8 + (lineHeight - fontSize)/2 : (lineHeight - fontSize)/2, left: padding, right: padding }}
              width="hug-contents"
              height="fill-parent"
              fill={initialPickLineY === (index + 1) * ((lineHeight - fontSize)/2 + fontSize) + 8 ? "#383838" : "#252525"}
              >
              <Text
                fontSize={fontSize}
                lineHeight={fontSize}
                fontFamily="Roboto Mono"
                fill={initialPickLineY === (index + 1) * ((lineHeight - fontSize)/2 + fontSize) + 8 ? "#ffffff" : "#858585"}
                width={numberWidth}
                horizontalAlignText="right"
              >
                {index + 1}
              </Text>
            </AutoLayout>

            {/* Code content */}
            <AutoLayout
              name="@code:line"
              direction="vertical"
              spacing={0}
              padding={{ top:index === 0 ? 8 : 0, bottom: index === codeLines.length - 1 ? 8 + (lineHeight - fontSize)/2 : (lineHeight - fontSize)/2  , left: padding, right: padding }}
              width={
                lineData.indent > 0 && isEmptyLine
                  // 空行但有缩进时，给一固定像素宽度，避免被裁切
                  ? (lineData.indent + 1) * (indentWidth + 0.5) + 12
                  : wordWrap
                  ? 'fill-parent'
                  : 'hug-contents'
              }
              height="hug-contents"
              horizontalAlignItems="start"
              stroke="#383838"
              strokeWidth={wordWrap && initialPickLineY === (index + 1) * ((lineHeight - fontSize)/2 + fontSize) + 8 ? 1 : 0}
            >
              <AutoLayout
                name="@code:indentation"
                hidden={!indentLine}
                spacing={(indentWidth + 0.5)*indentRule}
                positioning='absolute'
                x={12}
                y={0}
                width="hug-contents"
                height={(lineHeight - fontSize)/2 + fontSize}
              >
                {addIndentLine(lineData.indent)}
              </AutoLayout>
              <Text
                fontSize={fontSize}
                lineHeight={fontSize}
                fontFamily="Roboto Mono"
                fill="#D4D4D4"
                width={wordWrap ? 'fill-parent' : 'hug-contents'}
                horizontalAlignText="left"
              >
                {renderSpans(lineData.spans)}
              </Text>
            </AutoLayout>
          </AutoLayout>
        )})
      ) : (
        <AutoLayout
          name="@code:mix"
          direction="horizontal"
          spacing={0}
          padding={0}
          width="fill-parent"
          height="hug-contents"
        >
          <AutoLayout
            name="@code:linenum"
            direction="vertical"
            spacing={0}
            padding={{ top: 8, bottom: 8, left: padding, right: padding }}
            width="hug-contents"
            height="fill-parent"
            fill="#252526"
          >
            <Text
              fontSize={fontSize}
              lineHeight={fontSize}
              fontFamily="Roboto Mono"
              fill="#858585"
              width="hug-contents"
              horizontalAlignText="right"
            >
              1
            </Text>
          </AutoLayout>
          <AutoLayout
            name="@code:line"
            direction="vertical"
            spacing={0}
            padding={{ top: 8, bottom: 8, left: padding, right: padding }}
            width="hug-contents"
            height="hug-contents"
            fill="#1E1E1E"
            horizontalAlignItems="start"
          >
            <Text
              fontSize={fontSize}
              lineHeight={fontSize}
              fontFamily="Roboto Mono"
              fill="#858585"
              width="hug-contents"
              horizontalAlignText="left"
            >
              {/* No code content. Use property menu to open config. */}
            </Text>
          </AutoLayout>
        </AutoLayout>
      )}
    </AutoLayout>
  )
}

widget.register(Widget)
