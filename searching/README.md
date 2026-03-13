# Searching 工程 (Video Micro-Animation Analyzer)

这个工具能够解析上传的一段视频，通过场景切换检测算法抽取出具有代表性的关键帧（每一帧图片）。之后，它会自动调用 AI (OpenAI GPT-4o) 解析视频里的每一张截图，分析在页面上的哪些地方（特别是按钮等交互元素）可以添加“微动效”（Micro-animations）来提高体验感。

最后，工具会自动生成一个完整的 Markdown 报告，包括：
1. 原图截图
2. 文本描述的建议添加动效的具体区域
3. 合适的动效效果建议
4. 基于 React Native **原生 `Animated` 库** 实现的动效代码片段。

---

## 依赖和前提要求

在运行该项目之前，你需要满足以下环境要求：

### 1. Node.js
确保你已经在系统中安装了 Node.js（推荐版本 >= 16）。
你可以在终端中运行 \`node -v\` 和 \`npm -v\` 检查安装。

### 2. FFmpeg（重要）
本项目使用 \`fluent-ffmpeg\` 提取视频帧，它依赖系统本身安装的 \`ffmpeg\` 命令行工具。请确保将其安装并添加至系统环境变量。

#### Windows 系统安装 FFmpeg：
1. 从 [Gyan FFmpeg Builds](https://www.gyan.dev/ffmpeg/builds/) 或者 [BtbN builds](https://github.com/BtbN/FFmpeg-Builds/releases) 下载最新的 release（通常为 \`.zip\` 格式，带有 \`essentials\` 或 \`full\` 标识）。
2. 解压缩文件到一个你喜欢的位置（例如：\`C:\\ffmpeg\`）。
3. 将解压缩出来的 \`bin\` 文件夹路径（例如：\`C:\\ffmpeg\\bin\`）添加到 Windows 的系统环境变量 \`Path\` 中。
4. 打开一个新的命令提示符（CMD）或 PowerShell，输入 \`ffmpeg -version\`，如果看到版本信息则说明安装成功。

#### macOS 系统安装 FFmpeg：
如果你使用了 [Homebrew](https://brew.sh/)，打开终端运行：
\`\`\`bash
brew install ffmpeg
\`\`\`
安装完成后，运行 \`ffmpeg -version\` 验证。

#### Linux (Ubuntu/Debian) 系统安装 FFmpeg：
在终端运行：
\`\`\`bash
sudo apt update
sudo apt install ffmpeg
\`\`\`
安装完成后，运行 \`ffmpeg -version\` 验证。

---

## 快速上手

### 1. 安装项目依赖
进入 \`searching\` 目录并运行：

\`\`\`bash
cd searching
npm install
\`\`\`

### 2. 配置环境变量
在 \`searching\` 目录下创建一个名为 \`.env\` 的文件，并将你的 OpenAI API Key 填入其中。这个 Key 用于调用大模型的视觉能力。

在 \`.env\` 文件中添加如下内容：

\`\`\`env
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`
*(注意：请将 `your_openai_api_key_here` 替换为你实际的 Key)*

### 3. 运行分析程序
准备好一个视频文件（例如 `demo.mp4`），在终端运行：

\`\`\`bash
node index.js /path/to/your/video.mp4
\`\`\`

### 4. 查看结果
程序运行过程中：
1. 工具会在当前目录下自动创建一个 \`frames\` 文件夹，提取的关键帧会以 \`.jpg\` 格式保存在里面。
2. 紧接着工具会依次调用 AI 分析每一帧图像。
3. 当全部分析完成后，根目录下会自动生成一个名为 \`report.md\` 的结果文件。

你现在可以使用任何 Markdown 阅读器（或 VSCode、GitHub 等）打开 \`report.md\` 文件，查看 AI 对每一张页面截图给出的详细动效建议和 RN 代码实现。
