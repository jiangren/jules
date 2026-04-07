# 视频关键帧提取器 (Video Extractor)

这是一个基于 Node.js 的独立命令行工具 (CLI)。它的主要功能是通过场景变化检测算法（分析视频前后画面大面积的变化），从本地视频中快速抽取出具有代表性的关键帧图片。

这个工具不仅性能优异（底层使用 C++ 的 ffmpeg），同时也为未来接入各种 AI 分析大模型预留了灵活的本地化图片存储结构。

---

## 前提要求与依赖

在运行该项目之前，你需要满足以下环境要求：

### 1. Node.js
请确保你的系统中已经安装了 Node.js（推荐版本 >= 16）。
你可以在终端中运行 `node -v` 检查版本。

### 2. FFmpeg（重要）
本项目使用 `fluent-ffmpeg` 包，这意味着你的操作系统上必须已经全局安装了 `ffmpeg` 命令行工具，并且已配置在系统的环境变量中。

- **Windows**: [下载 FFmpeg Builds](https://www.gyan.dev/ffmpeg/builds/)，解压后将 `bin` 文件夹添加到环境变量 `Path` 中。
- **macOS**: `brew install ffmpeg`
- **Linux (Ubuntu/Debian)**: `sudo apt update && sudo apt install ffmpeg`

---

## 快速上手

### 1. 安装项目依赖
进入 `video-extractor` 目录并安装依赖包：

```bash
cd video-extractor
npm install
```

### 2. 运行提取程序

你可以使用 `node index.js` 命令来运行提取器。你可以通过命令行参数来灵活配置：

```bash
# 查看所有可用的命令参数
node index.js --help

# 基本用法：指定输入视频，其他使用默认参数
node index.js --input ./demo.mp4

# 高级用法：自定义输出目录和检测阈值
node index.js --input ./demo.mp4 --output ./my-frames --threshold 0.5
```

---

## 配置项详解

| 参数名称 | 短名 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `--input <path>` | `-i` | **(必填)** | 需要提取的本地视频文件的路径（支持绝对路径或相对路径）。 |
| `--output <dir>` | `-o` | `./frames` | 提取出的关键帧图片保存的本地目录。如果目录不存在，程序会自动创建。 |
| `--threshold <number>` | `-t` | `0.4` | 场景变化的检测阈值，范围为 `0.0` 到 `1.0`。<br/>**值越小**：越敏感，会提取出更多的帧；<br/>**值越大**：越严格，只有画面发生剧烈变化时才会提取帧。 |

## 未来扩展
目前该工具会将提取到的关键帧按序号（例如 `frame-0001.jpg`）自动保存至指定文件夹中。后续可以直接读取该文件夹内的图片，送入 AI 模型（如 OpenAI GPT-4o Vision 等）进行分析和内容理解。
