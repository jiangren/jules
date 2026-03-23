const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} = require("@modelcontextprotocol/sdk/types.js");
const fs = require('fs');
const path = require('path');
const XHSCrawler = require('./crawler/xhs.js');

// 导入配置
const configPath = path.join(__dirname, 'config.json');
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const { broadcastLog, serverPort, autoOpenWeb } = require('./server.js');

// 初始化 Crawler，并将其与 WebSocket 广播方法绑定
const xhsCrawler = new XHSCrawler(config, (logMsg) => {
  if (typeof logMsg === 'string') {
    broadcastLog({ platform: '小红书', message: logMsg, time: new Date().toISOString() });
  } else {
    broadcastLog(logMsg);
  }
});

let webOpened = false;
async function ensureWebOpened() {
  if (autoOpenWeb && !webOpened) {
    webOpened = true;
    try {
      const open = (await import('open')).default;
      await open(`http://localhost:${serverPort}`);
    } catch (e) {
      // 忽略打开失败的情况
    }
  }
}

const mcpServer = new Server(
  {
    name: "insight-crawler",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_xiaohongshu",
        description: "搜索小红书笔记",
        inputSchema: {
          type: "object",
          properties: {
            keyword: {
              type: "string",
              description: "搜索关键词",
            },
          },
          required: ["keyword"],
        },
      },
      {
        name: "get_xiaohongshu_note",
        description: "获取小红书单篇笔记详情及评论",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "笔记的 URL",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "get_xiaohongshu_user",
        description: "获取小红书用户主页信息",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "用户主页的 URL",
            },
          },
          required: ["url"],
        },
      },
    ],
  };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    await ensureWebOpened();
    switch (request.params.name) {
      case "search_xiaohongshu": {
        const { keyword } = request.params.arguments;
        if (!keyword) {
          throw new McpError(ErrorCode.InvalidParams, "Keyword is required");
        }
        broadcastLog({ platform: 'MCP', message: `收到请求：搜索关键词 ${keyword}`, time: new Date().toISOString() });
        const result = await xhsCrawler.searchNotes(keyword);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_xiaohongshu_note": {
        const { url } = request.params.arguments;
        if (!url) {
          throw new McpError(ErrorCode.InvalidParams, "URL is required");
        }
        broadcastLog({ platform: 'MCP', message: `收到请求：抓取笔记 ${url}`, time: new Date().toISOString() });
        const result = await xhsCrawler.getNoteDetail(url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_xiaohongshu_user": {
        const { url } = request.params.arguments;
        if (!url) {
          throw new McpError(ErrorCode.InvalidParams, "URL is required");
        }
        broadcastLog({ platform: 'MCP', message: `收到请求：抓取用户主页 ${url}`, time: new Date().toISOString() });
        const result = await xhsCrawler.getUserInfo(url);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动 MCP 服务器
async function startMcpServer() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

startMcpServer().catch((error) => {
  console.error("MCP Server Error:", error);
});
