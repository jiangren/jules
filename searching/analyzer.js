const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Converts a local image file to a base64 string.
 * @param {string} filePath - Path to the image file.
 * @returns {string} - Base64 representation of the image.
 */
function encodeImage(filePath) {
  const image = fs.readFileSync(filePath);
  return Buffer.from(image).toString('base64');
}

/**
 * Sends a frame to the AI to analyze and suggest micro-animations.
 * @param {string} framePath - The path to the image frame.
 * @returns {Promise<string>} - The markdown formatted string returned by AI.
 */
async function analyzeFrame(framePath) {
  const base64Image = encodeImage(framePath);

  const prompt = `
你是一位专业的 UI/UX 设计师和熟练的 React Native 开发者。
现在请分析我提供的这张用户界面截图（这是一个视频关键帧）。

你的任务是：
1. 识别页面上可以添加“微动效”（Micro-animations）来提升用户体验的地方，**特别是按钮**。
2. 通过**文本描述**指明这个地方在哪里（例如：“屏幕下方绿色的‘提交’按钮”，“右上角的返回图标”）。因为无法直接返回裁剪图片，你需要让用户清晰地知道你指的是哪个元素。
3. 给出合适的动效效果建议（例如：点击缩放、颜色渐变、呼吸灯效果等）。
4. 提供使用 React Native **原生 \`Animated\` API** 实现该动效的代码片段。

请使用以下 Markdown 格式严格输出你的分析结果：

### 动效建议

**元素位置与描述：**
[在此描述元素的具体位置和外观]

**推荐动效：**
[描述动效效果及为什么要用这个效果]

**React Native 代码实现：**
\`\`\`javascript
// 这里写 RN 原生 Animated 代码
\`\`\`

如果有多个建议，请继续按照这个格式重复列出。如果当前帧没有合适的元素添加动效，请回复“没有找到合适的微动效添加点。”
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: \`data:image/jpeg;base64,\${base64Image}\`,
                detail: "high"
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(\`Error analyzing frame \${framePath}:\`, error);
    return \`**Error analyzing frame:** \${error.message}\`;
  }
}

module.exports = {
  analyzeFrame
};
