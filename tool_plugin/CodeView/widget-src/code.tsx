const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, Span, waitForTask } = widget

function Widget() {
  // textContent 存储纯文本（用于编辑）
  const [textContent, setTextContent] = useSyncedState('textContent', `function example() {
  // This is an example code
  const message = "Hello, World!";
  console.log(message);
  return message;
}`)
  // spanContent 存储 Span 格式（用于渲染），不持久化，每次更新时重新生成
  const [spanContent, setSpanContent] = useSyncedState('spanContent', '')
  const [wordWrap, setWordWrap] = useSyncedState('wordWrap', false)
  const [width, setWidth] = useSyncedState('width', 400)
  
  // 使用 spanContent 进行渲染，如果没有则使用 textContent
  const codeContent = spanContent || textContent

  // 解析 Span 格式字符串为 JSX 元素
  // 格式: <Span fill="#xxx">text</Span>
  function parseSpanString(text: string): (string | ReturnType<typeof Span>)[] {
    if (!text) return [' ']
    
    const elements: (string | ReturnType<typeof Span>)[] = []
    // 使用 [\s\S] 代替 . 以匹配包括换行符在内的所有字符
    const regex = /<Span fill="([^"]+)">([\s\S]*?)<\/Span>/g
    let lastIndex = 0
    let match
    let key = 0
    
    while ((match = regex.exec(text)) !== null) {
      // 处理匹配前的普通文本
      if (match.index > lastIndex) {
        const plainText = text.substring(lastIndex, match.index)
        if (plainText) {
          elements.push(plainText)
        }
      }
      
      // 提取颜色和文本内容
      const color = match[1]
      let content = match[2]
      
      // 处理嵌套的 Span（递归）
      if (content.includes('<Span fill=')) {
        const nestedElements = parseSpanString(content)
        elements.push(<Span key={key++} fill={color}>{nestedElements}</Span>)
      } else {
        // 转义 HTML 实体
        content = content
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
        elements.push(<Span key={key++} fill={color}>{content}</Span>)
      }
      
      lastIndex = regex.lastIndex
    }
    
    // 处理最后剩余的普通文本
    if (lastIndex < text.length) {
      const plainText = text.substring(lastIndex)
      if (plainText) {
        // 转义 HTML 实体
        const decoded = plainText
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
        elements.push(decoded)
      }
    }
    
    return elements.length > 0 ? elements : [' ']
  }
  
  // Split code into lines
  const codeLines = codeContent ? codeContent.split('\n') : []
  const lineCount = codeLines.length || 1

  const padding = 12
  const fontSize = 16
  /* 计算行号宽度, 16px字体, 10px行高, 12px内边距 */
  const numberWidth = fontSize * (10/16) * codeLines.length.toString().length
  // Property menu for configuration
  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'openConfig',
        tooltip: 'Open Config',
      },
      {
        itemType: 'toggle',
        propertyName: 'wordWrap',
        tooltip: 'Toggle word wrap',
        isToggled: wordWrap,
      },
    ],
    ({ propertyName }) => {
      if (propertyName === 'openConfig') {
        // Open UI for configuration using waitForTask
        waitForTask(
          new Promise<void>((resolve) => {
            figma.showUI(__html__, { width: 300, height: 340, themeColors: true })
            
            // Send initial data to UI，发送纯文本
            figma.ui.postMessage({
              type: 'init',
              data: { textContent: textContent}
            })

            // Listen for messages from UI
            figma.ui.onmessage = (msg) => {
              if (msg.type === 'update') {
                const { textContent: newText, spanContent: newSpan, width: newWidth } = msg.data
                // 存储纯文本
                setTextContent(newText || '')
                // 存储 Span 格式（用于渲染）
                setSpanContent(newSpan || '')
                if (newWidth) setWidth(newWidth)
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
      }
    },
  )

  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      padding={0}
      width={wordWrap ? width : 'hug-contents'}
      height="hug-contents"
      fill="#1a1a1a"
      cornerRadius={4}
    >
      {/* Each line: line number + code content */}
      {codeLines.length > 0 ? (
        codeLines.map((line, index) => (
          <AutoLayout
            key={index}
            direction="horizontal"
            spacing={0}
            padding={0}
            width={wordWrap ? width : 'hug-contents'}
            height="hug-contents"
          >
            {/* Line number */}
            <AutoLayout
              direction="vertical"
              spacing={0}
              padding={{ top:index === 0 ? 8 : 0, bottom: index === codeLines.length - 1 ? 8 : 0, left: padding, right: padding }}
              width="hug-contents"
              height="fill-parent"
              fill="#252526"
            >
              <Text
                fontSize={fontSize}
                fontFamily="Roboto Mono"
                fill="#858585"
                width={numberWidth}
                horizontalAlignText="right"
              >
                {index + 1}
              </Text>
            </AutoLayout>

            {/* Code content */}
            <AutoLayout
              direction="vertical"
              spacing={0}
              padding={{ top:index === 0 ? 8 : 0, bottom: index === codeLines.length - 1 ? 8 : 0, left: padding, right: padding }}
              width={wordWrap ? 'fill-parent' : 'hug-contents'}
              height="hug-contents"
              horizontalAlignItems="start"
            >
              <Text
                fontSize={fontSize}
                fontFamily="Roboto Mono"
                fill="#D4D4D4"
                width={wordWrap ? 'fill-parent' : 'hug-contents'}
                horizontalAlignText="left"
              >
                {line.includes('<Span fill=') ? parseSpanString(line) : (line || ' ')}
              </Text>
            </AutoLayout>
          </AutoLayout>
        ))
      ) : (
        <AutoLayout
          direction="horizontal"
          spacing={0}
          padding={0}
          width="fill-parent"
          height="hug-contents"
        >
          <AutoLayout
            direction="vertical"
            spacing={0}
            padding={{ top: 8, bottom: 8, left: padding, right: padding }}
            width="hug-contents"
            height="fill-parent"
            fill="#252526"
          >
            <Text
              fontSize={fontSize}
              fontFamily="Roboto Mono"
              fill="#858585"
              width="hug-contents"
              horizontalAlignText="right"
            >
              1
            </Text>
          </AutoLayout>
          <AutoLayout
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
