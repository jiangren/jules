const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// 导入配置
const configPath = path.join(__dirname, 'config.json');
let config = { webPort: 3001, autoOpenWeb: true };
if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    config = { ...config, ...JSON.parse(raw) };
  } catch(e) {}
}

const app = express();
app.use(cors());

// 设置静态目录，指向即将构建的 React 前端产物
const frontendPath = path.join(__dirname, 'frontend/dist');
app.use(express.static(frontendPath));

// 修复 Express 5+ 中 catch-all 的写法
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 用于保存所有连接的 WebSocket 客户端
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'log', platform: '系统', message: 'WebSocket 已连接，等待抓取任务...', time: new Date().toISOString() }));

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// 广播日志消息的方法
function broadcastLog(logItem) {
  const message = JSON.stringify({ type: 'log', ...logItem });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

server.listen(config.webPort, () => {
    // console.log 用 stdio 通信的 MCP server 中，尽量只向 stderr 输出或关闭日志
    // 我们可以把这部分逻辑静默，或输出到 stderr
});

module.exports = {
  broadcastLog,
  serverPort: config.webPort,
  autoOpenWeb: config.autoOpenWeb
};