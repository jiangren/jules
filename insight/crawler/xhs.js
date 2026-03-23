const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class XHSCrawler {
  constructor(config, broadcastStatus) {
    this.config = config;
    this.broadcastStatus = broadcastStatus || (() => {}); // 用于推送日志
    this.cookiePath = path.join(__dirname, '..', 'cookie.json');
    this.dataDir = path.join(__dirname, '..', this.config.dataDir || './data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  log(msg) {
    console.error(`[XHS] ${msg}`); // 使用 console.error 防止污染 MCP 的 stdio json-rpc 协议流
    this.broadcastStatus({ platform: '小红书', message: msg, time: new Date().toISOString() });
  }

  async loadCookies() {
    if (fs.existsSync(this.cookiePath)) {
      try {
        const content = fs.readFileSync(this.cookiePath, 'utf8');
        const cookiesMap = JSON.parse(content);
        return cookiesMap.xhs || [];
      } catch (e) {
        this.log('读取 cookie.json 失败：' + e.message);
      }
    }
    return [];
  }

  async saveCookies(cookies) {
    let cookiesMap = {};
    if (fs.existsSync(this.cookiePath)) {
      try {
        const content = fs.readFileSync(this.cookiePath, 'utf8');
        cookiesMap = JSON.parse(content);
      } catch (e) {
        // ignore
      }
    }
    cookiesMap.xhs = cookies;
    fs.writeFileSync(this.cookiePath, JSON.stringify(cookiesMap, null, 2), 'utf8');
    this.log('Cookie 已保存至本地');
  }

  async checkLogin(page) {
    this.log('检查是否已登录...');
    await page.goto('https://www.xiaohongshu.com/explore', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); // 等待页面加载

    // 通过检查是否有登录按钮判断是否登录状态
    // 这里使用一些常见的未登录标志，比如是否存在「登录」文字的按钮，或者是否存在扫码框
    const isLoginButtonExist = await page.locator('text="登录"').count() > 0 || await page.locator('.login-container').count() > 0;
    return !isLoginButtonExist;
  }

  async requireLogin() {
    this.log('未检测到有效的 Cookie，即将打开有头浏览器进行手动扫码登录');
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.xiaohongshu.com/', { waitUntil: 'domcontentloaded' });
    this.log('请在打开的浏览器中扫码或输入验证码登录...');
    this.log('等待检测登录成功状态 (等待 60 秒)...');

    try {
      // 简单逻辑：等待页面上出现代表登录成功的元素（比如头像、发布按钮等）
      // 这里可以监听页面的某些特征变化，这里为了简单起见，使用 waitForTimeout 和人工轮询
      let isLogged = false;
      for (let i = 0; i < 30; i++) {
        await page.waitForTimeout(2000);
        // 如果登录文字消失且出现发布按钮/头像
        const loginBtn = await page.locator('text="登录"').count();
        if (loginBtn === 0) {
            // 进一步确认有发布按钮或者其他登录后的标志
            const pubBtn = await page.locator('text="发布"').count();
            if(pubBtn > 0) {
              isLogged = true;
              break;
            }
        }
      }

      if (isLogged) {
        this.log('检测到登录成功！');
        // 保存 Cookie
        const cookies = await context.cookies();
        await this.saveCookies(cookies);
      } else {
        this.log('登录超时或未检测到登录成功标志。');
        throw new Error("登录超时");
      }
    } catch (e) {
      this.log('登录过程中出错: ' + e.message);
    } finally {
      await browser.close();
    }
  }

  async getContext() {
    let cookies = await this.loadCookies();
    let browser, context;

    if (cookies.length === 0) {
       await this.requireLogin();
       cookies = await this.loadCookies();
       if (cookies.length === 0) {
         throw new Error("未获取到有效的登录信息");
       }
    }

    browser = await chromium.launch({ headless: !this.config.showBrowser });
    context = await browser.newContext();
    await context.addCookies(cookies);

    const page = await context.newPage();
    const isLogged = await this.checkLogin(page);

    if (!isLogged) {
      this.log('Cookie 已过期，需要重新登录...');
      await browser.close();
      await this.requireLogin();
      cookies = await this.loadCookies();

      browser = await chromium.launch({ headless: !this.config.showBrowser });
      context = await browser.newContext();
      await context.addCookies(cookies);
      return { browser, context };
    } else {
      await page.close();
      return { browser, context };
    }
  }

  saveData(filename, data) {
    const timestamp = new Date().getTime();
    // 移除文件名中可能导致路径穿越的非法字符
    const safeFilename = filename.replace(/[^a-z0-9_\u4e00-\u9fa5]/gi, '_');
    const filePath = path.join(this.dataDir, `${safeFilename}_${timestamp}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    this.log(`数据已保存至 ${filePath}`);
    return filePath;
  }

  async searchNotes(keyword) {
    this.log(`准备搜索关键词: ${keyword}`);
    const { browser, context } = await this.getContext();
    const page = await context.newPage();

    try {
      this.log('正在打开搜索页面...');
      // 访问搜索链接
      await page.goto(`https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}&source=web_explore_suggest`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(5000); // 随机等待内容加载

      this.log('正在解析搜索结果...');
      const notes = await page.evaluate(() => {
        const items = document.querySelectorAll('.note-item');
        const results = [];
        items.forEach(item => {
          const titleEl = item.querySelector('.title');
          const authorEl = item.querySelector('.author .name');
          const linkEl = item.querySelector('a');
          if (titleEl && linkEl) {
            results.push({
              title: titleEl.innerText.trim(),
              author: authorEl ? authorEl.innerText.trim() : '',
              url: linkEl.href
            });
          }
        });
        return results;
      });

      this.log(`解析到 ${notes.length} 条笔记`);
      const filePath = this.saveData(`xhs_search_${keyword}`, notes);

      return { success: true, count: notes.length, notes, file: filePath };
    } catch (e) {
      this.log('搜索发生错误: ' + e.message);
      return { success: false, error: e.message };
    } finally {
      await browser.close();
    }
  }

  async getNoteDetail(url) {
    this.log(`准备抓取笔记内容: ${url}`);
    const { browser, context } = await this.getContext();
    const page = await context.newPage();

    try {
      this.log('正在打开笔记页面...');
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(5000); // 等待内容及评论加载

      this.log('正在提取笔记详细信息...');
      const detail = await page.evaluate(() => {
        const titleEl = document.querySelector('#detail-title');
        const contentEl = document.querySelector('#detail-desc');
        const authorEl = document.querySelector('.author-name');

        const images = [];
        document.querySelectorAll('.swiper-slide.zoom-in img').forEach(img => {
            if(img.src) images.push(img.src);
        });

        const comments = [];
        document.querySelectorAll('.comment-item').forEach(c => {
           const author = c.querySelector('.author-wrapper .name')?.innerText.trim() || '';
           const text = c.querySelector('.content')?.innerText.trim() || '';
           if(text) {
               comments.push({ author, text });
           }
        });

        return {
          title: titleEl ? titleEl.innerText.trim() : '',
          content: contentEl ? contentEl.innerText.trim() : '',
          author: authorEl ? authorEl.innerText.trim() : '',
          images,
          comments
        };
      });

      this.log(`提取成功，抓取到 ${detail.images.length} 张图片，${detail.comments.length} 条评论`);
      const docId = url.split('/').pop().split('?')[0]; // simple doc id extraction
      const filePath = this.saveData(`xhs_note_${docId}`, detail);

      return { success: true, detail, file: filePath };
    } catch (e) {
      this.log('抓取笔记详细信息出错: ' + e.message);
      return { success: false, error: e.message };
    } finally {
      await browser.close();
    }
  }

  async getUserInfo(url) {
    this.log(`准备抓取用户主页: ${url}`);
    const { browser, context } = await this.getContext();
    const page = await context.newPage();

    try {
      this.log('正在打开用户主页...');
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(5000);

      this.log('正在提取用户主页信息...');
      const userInfo = await page.evaluate(() => {
        const nameEl = document.querySelector('.user-name');
        const descEl = document.querySelector('.user-desc');
        const xhsIdEl = document.querySelector('.user-redId');

        const stats = {};
        document.querySelectorAll('.user-interactions .interaction-item').forEach(item => {
            const label = item.querySelector('.interaction-name')?.innerText.trim() || '';
            const count = item.querySelector('.interaction-count')?.innerText.trim() || '';
            if(label) stats[label] = count;
        });

        const notes = [];
        document.querySelectorAll('.note-item').forEach(item => {
          const titleEl = item.querySelector('.title');
          const linkEl = item.querySelector('a');
          if (titleEl && linkEl) {
            notes.push({
              title: titleEl.innerText.trim(),
              url: linkEl.href
            });
          }
        });

        return {
          name: nameEl ? nameEl.innerText.trim() : '',
          xhsId: xhsIdEl ? xhsIdEl.innerText.trim() : '',
          description: descEl ? descEl.innerText.trim() : '',
          stats,
          recentNotes: notes
        };
      });

      this.log(`提取成功，获取到 ${userInfo.recentNotes.length} 条最近笔记`);
      const userId = url.split('/').pop().split('?')[0];
      const filePath = this.saveData(`xhs_user_${userId}`, userInfo);

      return { success: true, userInfo, file: filePath };
    } catch (e) {
      this.log('抓取用户信息出错: ' + e.message);
      return { success: false, error: e.message };
    } finally {
      await browser.close();
    }
  }
}

module.exports = XHSCrawler;
