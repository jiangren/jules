const { chromium } = require('playwright');
const WebSocket = require('ws');

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ recordVideo: { dir: '/home/jules/verification/video' } });
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:3001");
    await page.waitForTimeout(1000);

    // 等待 WebSocket 连接并发出几条日志以触发界面更新
    const ws = new WebSocket('ws://localhost:3001');
    ws.on('open', () => {
        // 这里只是为了演示界面，我们可以直接使用内部方法发消息
    });

    // 此时可以直接访问 DOM，界面应该已经显示 "WebSocket 已连接，等待抓取任务..."
    await page.waitForSelector('.log-item', { timeout: 10000 });

    // 检查是否有系统日志
    const text = await page.locator('.log-item').first().innerText();
    console.log("Found log item: ", text);

    await page.waitForTimeout(1000);

    // 截屏保存
    await page.screenshot({ path: "/home/jules/verification/verification.png" });
    await page.waitForTimeout(1000);

  } catch(e) {
    console.log("Error during verification:", e);
    await page.screenshot({ path: "/home/jules/verification/error.png" });
  } finally {
    await context.close();
    await browser.close();
    console.log("Verification finished.");
  }
}

verify().catch(console.error);
