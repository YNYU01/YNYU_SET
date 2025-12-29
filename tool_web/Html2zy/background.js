/**
 * Html2zy Background Service Worker
 * 处理后台任务（当前阶段主要用于消息转发）
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('Html2zy 扩展已安装');
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'elementSelected') {
    // 保存选择的元素信息，以便 popup 重新打开时使用
    chrome.storage.local.set({
      lastSelectedElement: message.element,
      lastSelectedTimestamp: Date.now()
    });
    
    // 可以在这里添加通知或其他处理
    sendResponse({ success: true });
  } else if (message.type === 'captureTab') {
    // 使用 Chrome 原生 API 截取标签页
    // captureVisibleTab 的第一个参数是 windowId（可选），null 表示当前窗口
    // 第二个参数是选项，format 可以是 'png' 或 'jpeg'，quality 仅对 jpeg 有效
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, dataUrl: dataUrl });
      }
    });
    return true; // 保持消息通道开放以支持异步响应
  }
  return true;
});

