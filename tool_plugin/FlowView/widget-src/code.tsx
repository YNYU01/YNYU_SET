const { widget } = figma
const { useEffect, useSyncedState, usePropertyMenu, waitForTask, Text, AutoLayout, Rectangle, Frame, SVG } = widget

// ============================================================================
// 类型定义
// ============================================================================

// 连接方向
type ConnectionDirection = 'top' | 'right' | 'bottom' | 'left'

// 节点连接信息（存储在单个widget中）
type NodeConnections = {
  parentNodeId: string | null  // 父节点ID（in连接）
  parentDirection: ConnectionDirection | null  // 父节点连接方向
  children: Array<{  // 子节点列表（out连接）
    nodeId: string
    direction: ConnectionDirection
  }>
  label?: string  // 节点标签
  currentNodeId?: string  // 当前节点ID（通过onClick获取）
}

// ============================================================================
// 工具函数
// ============================================================================

// 根据方向计算新节点位置
function calculateNewNodePosition(
  currentX: number,
  currentY: number,
  currentWidth: number,
  currentHeight: number,
  direction: ConnectionDirection,
  spacing: number = 150
): { x: number; y: number } {
  switch (direction) {
    case 'top':
      return { x: currentX, y: currentY - currentHeight - spacing }
    case 'right':
      return { x: currentX + currentWidth + spacing, y: currentY }
    case 'bottom':
      return { x: currentX, y: currentY + currentHeight + spacing }
    case 'left':
      return { x: currentX - spacing, y: currentY }
  }
}

// 计算连接点位置（相对于节点中心）
function getConnectionPointPosition(
  width: number,
  height: number,
  direction: ConnectionDirection,
  pointSize: number
): { x: number; y: number } {
  const halfSize = pointSize / 2
  switch (direction) {
    case 'top':
      return { x: width / 2 - halfSize, y: -halfSize }
    case 'right':
      return { x: width - halfSize, y: height / 2 - halfSize }
    case 'bottom':
      return { x: width / 2 - halfSize, y: height - halfSize }
    case 'left':
      return { x: -halfSize, y: height / 2 - halfSize }
  }
}

// 计算连接点的绝对位置
function getConnectionPointAbsolute(
  nodeBounds: { x: number; y: number; width: number; height: number },
  direction: ConnectionDirection
): { x: number; y: number } {
  switch (direction) {
    case 'top':
      return { x: nodeBounds.x + nodeBounds.width / 2, y: nodeBounds.y }
    case 'right':
      return { x: nodeBounds.x + nodeBounds.width, y: nodeBounds.y + nodeBounds.height / 2 }
    case 'bottom':
      return { x: nodeBounds.x + nodeBounds.width / 2, y: nodeBounds.y + nodeBounds.height }
    case 'left':
      return { x: nodeBounds.x, y: nodeBounds.y + nodeBounds.height / 2 }
  }
}

// 计算贝塞尔曲线控制点（参考 ListEase 的实现）
function calculateControlPoints(
  start: { x: number; y: number },
  end: { x: number; y: number },
  fromDir: ConnectionDirection,
  toDir: ConnectionDirection
): { control1: { x: number; y: number }, control2: { x: number; y: number } } {
  const deltaX = end.x - start.x
  const deltaY = end.y - start.y
  const lineLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  
  // 根据连线长度计算系数
  const maxLength = 400
  const normalizedLength = Math.min(1, Math.max(0, lineLength / maxLength))
  const coefficient = 0.375 + normalizedLength * 2.125
  
  const baseOffset = 80
  let horizontalOffset = baseOffset * coefficient
  horizontalOffset = Math.min(300, Math.max(10, horizontalOffset))
  
  let control1: { x: number; y: number }
  let control2: { x: number; y: number }
  
  // 根据方向计算控制点
  const isEndLeftOfStart = end.x < start.x
  
  // 根据起点方向计算第一个控制点
  switch (fromDir) {
    case 'top':
      control1 = { x: start.x, y: start.y - horizontalOffset }
      break
    case 'right':
      control1 = { x: start.x + horizontalOffset, y: start.y }
      break
    case 'bottom':
      control1 = { x: start.x, y: start.y + horizontalOffset }
      break
    case 'left':
      control1 = { x: start.x - horizontalOffset, y: start.y }
      break
  }
  
  // 根据终点方向计算第二个控制点
  switch (toDir) {
    case 'top':
      control2 = { x: end.x, y: end.y - horizontalOffset }
      break
    case 'right':
      control2 = { x: end.x + horizontalOffset, y: end.y }
      break
    case 'bottom':
      control2 = { x: end.x, y: end.y + horizontalOffset }
      break
    case 'left':
      control2 = { x: end.x - horizontalOffset, y: end.y }
      break
  }
  
  return { control1, control2 }
}

// 获取当前widget的位置和尺寸
async function getWidgetBounds(nodeId: string): Promise<{ x: number; y: number; width: number; height: number } | null> {
  try {
    const node = await figma.getNodeByIdAsync(nodeId) as WidgetNode
    if (node && 'x' in node && 'y' in node && 'width' in node && 'height' in node) {
      return {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height
      }
    }
  } catch (e) {
    console.error('Error getting widget bounds:', e)
  }
  return null
}

// ============================================================================
// 主组件
// ============================================================================

function Widget() {
  // 节点连接信息（不依赖 useWidgetId，只在 onClick 时获取 ID）
  const [connections, setConnections] = useSyncedState<NodeConnections>('connections', {
    parentNodeId: null,
    parentDirection: null,
    children: [],
    label: 'Node',
    currentNodeId: undefined
  })
  
  const [nodeWidth, setNodeWidth] = useSyncedState<number>('nodeWidth', 120)
  const [nodeHeight, setNodeHeight] = useSyncedState<number>('nodeHeight', 80)
  const [connectionPointSize, setConnectionPointSize] = useSyncedState<number>('connectionPointSize', 12)
  
  // 当前节点位置信息
  const [currentBounds, setCurrentBounds] = useSyncedState<{ x: number; y: number; width: number; height: number } | null>('currentBounds', null)
  
  // 子节点位置信息（用于绘制输出连接线）
  const [childrenBounds, setChildrenBounds] = useSyncedState<Record<string, { x: number; y: number; width: number; height: number }>>('childrenBounds', {})

  // 刷新当前widget ID和连接信息（只在onClick时调用）
  const refreshWidgetId = async () => {
    try {
      // 通过选中对象获取当前widget ID
      const selection = figma.currentPage.selection
      if (selection.length === 1 && selection[0].type === 'WIDGET') {
        const currentNodeId = selection[0].id
        
        // 如果ID变化了，更新并读取pluginData
        if (currentNodeId !== connections.currentNodeId) {
          try {
            const node = await figma.getNodeByIdAsync(currentNodeId) as WidgetNode
            if (node && node.type === 'WIDGET') {
              const savedParentNodeId = node.getPluginData('parentNodeId') || null
              const savedParentDirection = (node.getPluginData('parentDirection') || null) as ConnectionDirection | null
              
              // 更新连接信息（只更新当前节点ID和父节点信息）
              setConnections((prevConnections) => ({
                ...prevConnections,
                currentNodeId,
                parentNodeId: savedParentNodeId,
                parentDirection: savedParentDirection,
                label: prevConnections.label || `Node ${currentNodeId.slice(-6)}`
              }))
            }
          } catch (nodeError) {
            console.error('Error reading node data:', nodeError)
          }
        }
      }
    } catch (e) {
      console.error('Error refreshing widget ID:', e)
    }
  }

  // 初始化：只在被选中时读取pluginData（使用标志防止无限循环）
  useEffect(() => {
    let hasInitialized = false
    let initCount = 0
    
    const initOnce = async () => {
      if (hasInitialized || initCount > 3) return
      initCount++
      
      try {
        await refreshWidgetId()
        hasInitialized = true
      } catch (e) {
        console.error('Error in initial refresh:', e)
      }
    }
    
    initOnce()
  })

  // 更新节点位置信息（使用定时器，避免每次渲染都执行）
  useEffect(() => {
    let isMounted = true
    let updateCount = 0
    
    const updateBounds = async () => {
      if (!isMounted || updateCount > 100) return // 防止无限更新
      updateCount++
      
      try {
        const currentNodeId = connections.currentNodeId
        if (!currentNodeId) return
        
        // 获取当前节点位置
        try {
          const bounds = await getWidgetBounds(currentNodeId)
          if (bounds && isMounted) {
            setCurrentBounds(bounds)
          }
        } catch (boundsError) {
          console.error('Error getting current bounds:', boundsError)
        }
        
        // 获取所有子节点的位置信息（用于绘制输出连接线）
        if (connections.children.length > 0) {
          const childrenBoundsData: Record<string, { x: number; y: number; width: number; height: number }> = {}
          for (const child of connections.children) {
            try {
              const childBounds = await getWidgetBounds(child.nodeId)
              if (childBounds) {
                childrenBoundsData[child.nodeId] = childBounds
              }
            } catch (childError) {
              // 子节点可能已被删除，忽略错误
              console.warn('Error getting child bounds:', child.nodeId, childError)
            }
          }
          if (isMounted) {
            setChildrenBounds(childrenBoundsData)
          }
        }
      } catch (e) {
        console.error('Error updating bounds:', e)
      }
    }
    
    // 延迟首次更新，避免立即触发
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        updateBounds()
      }
    }, 100)
    
    // 定期更新位置（当节点移动时），但间隔更长
    const intervalId = setInterval(() => {
      if (isMounted) {
        updateBounds()
      }
    }, 1000) // 改为1秒，减少频率
    
    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  })

  // UI消息处理（只在有UI时设置，且只在打开UI时设置，避免多个widget冲突）
  // 注意：不要在这里设置 figma.ui.onmessage，应该在打开UI时才设置

  // 克隆当前widget（只在onClick时触发，通过选中对象获取ID）
  async function cloneWidget(direction: ConnectionDirection) {
    try {
      // 通过选中对象获取当前widget ID（点击连接点时widget会被选中）
      const selection = figma.currentPage.selection
      console.log('selection', selection)
      if (selection.length !== 1 || selection[0].type !== 'WIDGET') {
        return
      }

      const sourceNode = selection[0] as WidgetNode
      const sourceNodeId = sourceNode.id

      // 获取当前widget的位置和尺寸（已知大小和方向，快速创建）
      let bounds: { x: number; y: number; width: number; height: number } | null = null
      try {
        bounds = await getWidgetBounds(sourceNodeId)
        if (!bounds) {
          // 如果获取不到，使用已知的nodeWidth和nodeHeight
          if ('x' in sourceNode && 'y' in sourceNode) {
            bounds = {
              x: sourceNode.x,
              y: sourceNode.y,
              width: nodeWidth,
              height: nodeHeight
            }
          } else {
            return
          }
        }
      } catch (boundsError) {
        console.error('Error getting bounds, using defaults:', boundsError)
        if ('x' in sourceNode && 'y' in sourceNode) {
          bounds = {
            x: sourceNode.x,
            y: sourceNode.y,
            width: nodeWidth,
            height: nodeHeight
          }
        } else {
          return
        }
      }

      // 计算新节点位置（简单快速）
      const newPosition = calculateNewNodePosition(
        bounds.x,
        bounds.y,
        bounds.width,
        bounds.height,
        direction
      )

      // 克隆widget（只克隆，不修改）
      let clonedNode: WidgetNode
      try {
        clonedNode = sourceNode.clone()
        clonedNode.x = newPosition.x
        clonedNode.y = newPosition.y
      } catch (cloneError) {
        console.error('Error cloning node:', cloneError)
        return
      }

      // 确定连接方向（父节点->子节点）
      const oppositeDirection: Record<ConnectionDirection, ConnectionDirection> = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }

      // 在新克隆的节点上设置父节点信息（只记录ID，不获取/修改其他）
      try {
        clonedNode.setPluginData('parentNodeId', sourceNodeId)
        clonedNode.setPluginData('parentDirection', oppositeDirection[direction])
      } catch (pluginDataError) {
        console.error('Error setting plugin data:', pluginDataError)
      }

      // 选中新克隆的widget（让它自动刷新自己的id）
      try {
        figma.currentPage.selection = [clonedNode]
      } catch (selectionError) {
        console.error('Error selecting cloned node:', selectionError)
      }

      // 更新源节点的子节点列表（只记录子节点ID）
      const newChildId = clonedNode.id
      setConnections((prevConnections) => {
        // 检查是否已存在
        const exists = prevConnections.children.some(child => child.nodeId === newChildId)
        if (!exists) {
          return {
            ...prevConnections,
            children: [...prevConnections.children, { nodeId: newChildId, direction }]
          }
        }
        return prevConnections
      })

      // 更新当前节点ID（如果还没有设置）
      setConnections((prevConnections) => {
        if (!prevConnections.currentNodeId) {
          return {
            ...prevConnections,
            currentNodeId: sourceNodeId
          }
        }
        return prevConnections
      })
    } catch (error) {
      console.error('Error cloning widget:', error)
    }
  }

  // 渲染连接点（只有out点，点击即创建子节点）
  function renderConnectionPoint(direction: ConnectionDirection) {
    try {
      const position = getConnectionPointPosition(nodeWidth, nodeHeight, direction, connectionPointSize)
      const size = connectionPointSize
      
      return (
        <Rectangle
          key={`conn-point-${direction}`}
          name={`@conn-point-${direction}`}
          positioning="absolute"
          x={position.x}
          y={position.y}
          width={size}
          height={size}
          fill={{ r: 0.2, g: 0.6, b: 1, a: 1 }}
          cornerRadius={size / 2}
          onClick={() => {
            try {
              console.log('cloneWidget', direction)
              cloneWidget(direction)
            } catch (e) {
              console.error('Error in cloneWidget onClick:', e)
            }
          }}
        />
      )
    } catch (e) {
      console.error('Error rendering connection point:', e)
      return null
    }
  }

  // 渲染输出连接线（每个widget负责渲染自己的输出连接线）
  function renderOutConnections() {
    if (!currentBounds || connections.children.length === 0) {
      return null
    }

    // 按方向分组子节点，用于优化同边多条连接线的朝向
    const childrenByDirection: Record<ConnectionDirection, Array<{ nodeId: string; direction: ConnectionDirection }>> = {
      top: [],
      right: [],
      bottom: [],
      left: []
    }

    connections.children.forEach(child => {
      childrenByDirection[child.direction].push(child)
    })

    // 渲染每个方向的连接线
    const connectionElements: ReturnType<typeof Frame>[] = []

    // 遍历四个方向
    const directions: ConnectionDirection[] = ['top', 'right', 'bottom', 'left']
    directions.forEach((dir) => {
      const children = childrenByDirection[dir]
      if (children.length === 0) return

      const oppositeDirection: Record<ConnectionDirection, ConnectionDirection> = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }

      // 计算起点（当前节点的连接点）
      const start = getConnectionPointAbsolute(currentBounds, dir)

      // 对同一边的多条连接线，根据子节点位置进行排序和偏移
      children.forEach((child: { nodeId: string; direction: ConnectionDirection }, index: number) => {
        const childBounds = childrenBounds[child.nodeId]
        if (!childBounds) return

        // 确定子节点的输入方向
        const childInDirection = oppositeDirection[child.direction]

        // 计算终点（子节点的连接点）
        const end = getConnectionPointAbsolute(childBounds, childInDirection)

        // 对于同一边的多条连接线，计算偏移量以避免重叠
        // 根据在同一边的索引位置，调整控制点的偏移
        const sameDirectionCount = children.length
        const offsetIndex = index - (sameDirectionCount - 1) / 2 // 从 -n/2 到 n/2
        const offsetAmount = offsetIndex * 30 // 每条线偏移30px

        // 计算控制点，考虑偏移
        let { control1, control2 } = calculateControlPoints(start, end, dir, childInDirection)

        // 应用偏移（根据方向调整）
        switch (dir) {
          case 'top':
          case 'bottom':
            control1 = { ...control1, x: control1.x + offsetAmount }
            break
          case 'left':
          case 'right':
            control1 = { ...control1, y: control1.y + offsetAmount }
            break
        }

        // 计算相对于当前widget的位置
        const relativeStart = {
          x: start.x - currentBounds.x,
          y: start.y - currentBounds.y
        }
        const relativeEnd = {
          x: end.x - currentBounds.x,
          y: end.y - currentBounds.y
        }
        const relativeControl1 = {
          x: control1.x - currentBounds.x,
          y: control1.y - currentBounds.y
        }
        const relativeControl2 = {
          x: control2.x - currentBounds.x,
          y: control2.y - currentBounds.y
        }

        // 计算SVG视图框（包含所有点，并添加边距）
        const padding = 20
        const minX = Math.min(relativeStart.x, relativeEnd.x, relativeControl1.x, relativeControl2.x) - padding
        const maxX = Math.max(relativeStart.x, relativeEnd.x, relativeControl1.x, relativeControl2.x) + padding
        const minY = Math.min(relativeStart.y, relativeEnd.y, relativeControl1.y, relativeControl2.y) - padding
        const maxY = Math.max(relativeStart.y, relativeEnd.y, relativeControl1.y, relativeControl2.y) + padding
        
        const svgWidth = maxX - minX
        const svgHeight = maxY - minY
        
        // 调整坐标使其相对于SVG视图框
        const adjustedStart = {
          x: relativeStart.x - minX,
          y: relativeStart.y - minY
        }
        const adjustedEnd = {
          x: relativeEnd.x - minX,
          y: relativeEnd.y - minY
        }
        const adjustedControl1 = {
          x: relativeControl1.x - minX,
          y: relativeControl1.y - minY
        }
        const adjustedControl2 = {
          x: relativeControl2.x - minX,
          y: relativeControl2.y - minY
        }

        // 生成贝塞尔曲线路径字符串
        const pathData = `M${adjustedStart.x},${adjustedStart.y} C${adjustedControl1.x},${adjustedControl1.y} ${adjustedControl2.x},${adjustedControl2.y} ${adjustedEnd.x},${adjustedEnd.y}`

        // 生成SVG字符串（使用唯一ID避免冲突）
        const markerId = `arrowhead-${child.nodeId}`
        const svgString = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
          <path d="${pathData}" stroke="#4A90E2" stroke-width="2" fill="none" marker-end="url(#${markerId})"/>
          <defs>
            <marker id="${markerId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#4A90E2" />
            </marker>
          </defs>
        </svg>`

        connectionElements.push(
          <Frame
            key={`out-conn-${child.nodeId}`}
            name={`@out-connection-line-${child.nodeId}`}
            positioning="absolute"
            x={minX}
            y={minY}
            width={svgWidth}
            height={svgHeight}
            overflow="visible"
          >
            <SVG
              name={`@out-connection-svg-${child.nodeId}`}
              src={svgString}
              width={svgWidth}
              height={svgHeight}
            />
          </Frame>
        )
      })
    })

    return connectionElements.length > 0 ? connectionElements : null
  }

  // UI菜单（打开连接管理器）
  usePropertyMenu(
    [
      {
        itemType: 'action',
        propertyName: 'openConnectionManager',
        tooltip: 'Open Connection Manager'
      }
    ],
    ({ propertyName }) => {
      if (propertyName === 'openConnectionManager') {
        try {
          waitForTask(
            new Promise<void>((resolve) => {
              try {
                figma.showUI(__html__, { width: 320, height: 500 })
                
                // 设置UI消息处理器
                figma.ui.onmessage = (msg: any) => {
                  try {
                    if (msg.type === 'connectNodes' || msg.type === 'disconnectNode') {
                      // 预留位置：后续实现连接/断开逻辑
                      // 暂时不做任何操作
                    }
                  } catch (e) {
                    console.error('Error handling UI message:', e)
                  }
                }
                
                if (figma.ui && connections.currentNodeId) {
                  figma.ui.postMessage({
                    type: 'nodeInfo',
                    data: {
                      nodeId: connections.currentNodeId,
                      parentNodeId: connections.parentNodeId,
                      parentDirection: connections.parentDirection,
                      children: connections.children,
                      label: connections.label
                    }
                  })
                }
              } catch (e) {
                console.error('Error showing UI:', e)
                resolve()
              }
            })
          )
        } catch (e) {
          console.error('Error in usePropertyMenu handler:', e)
        }
      }
    }
  )

  return (
    <AutoLayout
      name="@flow-node-wrapper"
      direction="vertical"
      width={nodeWidth}
      height={nodeHeight}
      overflow="visible"
    >
      {/* 输出连接线（在节点上方，由源widget渲染） */}
      {renderOutConnections()}
      
      {/* 节点主体 */}
      <AutoLayout
        name="@flow-node"
        direction="vertical"
        width={nodeWidth}
        height={nodeHeight}
        padding={8}
        fill={{ r: 0.95, g: 0.95, b: 0.95, a: 1 }}
        stroke={{ r: 0.3, g: 0.3, b: 0.3, a: 1 }}
        strokeWidth={2}
        cornerRadius={8}
        overflow="visible"
        positioning="absolute"
        x={0}
        y={0}
        onClick={() => {
          // 点击节点时刷新ID和连接信息
          refreshWidgetId()
        }}
      >
        {/* 节点内容 */}
        <AutoLayout
          name="@node-content"
          direction="vertical"
          width="fill-parent"
          height="fill-parent"
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <Text
            fontSize={14}
            fill={{ r: 0.2, g: 0.2, b: 0.2, a: 1 }}
            width="fill-parent"
            horizontalAlignText="center"
          >
            {connections.label || (connections.currentNodeId ? `Node ${connections.currentNodeId.slice(-6)}` : 'Node')}
          </Text>
          {connections.parentNodeId && (
            <Text
              fontSize={10}
              fill={{ r: 0.5, g: 0.5, b: 0.5, a: 1 }}
              width="fill-parent"
              horizontalAlignText="center"
            >
              Parent: {connections.parentNodeId.slice(-6)}
            </Text>
          )}
          {connections.children.length > 0 && (
            <Text
              fontSize={10}
              fill={{ r: 0.5, g: 0.5, b: 0.5, a: 1 }}
              width="fill-parent"
              horizontalAlignText="center"
            >
              Children: {connections.children.length}
            </Text>
          )}
        </AutoLayout>
        
        {/* 四个连接点（点击创建子节点） */}
        {renderConnectionPoint('top')}
        {renderConnectionPoint('right')}
        {renderConnectionPoint('bottom')}
        {renderConnectionPoint('left')}
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(Widget)
