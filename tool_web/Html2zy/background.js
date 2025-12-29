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
  }
  return true;
});

