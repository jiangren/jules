---
name: Extract Video Keyframes
description: 使用 FFmpeg 从视频中提取基于场景变化的去重关键帧图像（支持特定区域裁剪）。
---

# Extract Video Keyframes Skill

## 🎯 技能目标 (Objective)
当用户需要从视频文件（如手机录屏、网页录屏）中自动提取页面切换的关键帧、过滤掉过渡动画、并裁剪出特定核心区域时，使用此技能。

## 🛠️ 环境预置与自动检查 (Prerequisites & Auto Setup)
运行此技能对应的脚本前，你需要主动完成以下检查和初始化操作：
1. **优先校验全局 FFmpeg**：在使用此技能的第一时间，**请必须使用 `run_command` 工具执行 `which ffmpeg` 或 `command -v ffmpeg` 来校验系统中是否已安装 FFmpeg**。如果未安装（返回为空或提示 not found），请务必中止后续流程，并立刻提示用户：“**未检测到 ffmpeg，请您在终端中执行 `brew install ffmpeg` 进行安装**”，等待用户回复确认安装完毕后再继续后面的操作。
2. **自动检查并安装 npm 依赖（核心步骤）**：
   在执行实际提取命令前，**请务必使用 `run_command` 工具主动检查并安装依赖**。你可以直接执行以下命令，当发现 `fluent-ffmpeg` 或 `commander` 未安装时自动执行 `npm install`：
   ```bash
   cd /Users/hzjiangren/increase/github/jules/video-extractor/.agents/skills/extract_video_keyframes/scripts
   if [ ! -d "node_modules/fluent-ffmpeg" ] || [ ! -d "node_modules/commander" ]; then npm install; fi
   ```

## 📝 使用指南 (Usage Instructions)

1. **核心脚本位置**
   因技能已经整体打包，实际运行的脚本位置在本 `SKILL.md` 所在同级目录里的 `scripts/` 文件夹下。
   - 入口文件：`scripts/index.js`
   - 核心逻辑：`scripts/extractor.js`

2. **如何执行提取命令**
   （请确保已经完成了上述的 npm 依赖安装步骤）
   你需要使用 `run_command` 工具来调用本技能中自带的脚本：
   ```bash
   node /Users/hzjiangren/increase/github/jules/video-extractor/.agents/skills/extract_video_keyframes/scripts/index.js --input <视频绝对路径> --output <图片输出目录> --threshold <0.0~1.0的阈值> [--crop <裁剪参数>]
   ```
   *示例*：`node /Users/hzjiangren/increase/github/jules/video-extractor/.agents/skills/extract_video_keyframes/scripts/index.js --input ./yyy.mp4 --output ./my-frames --threshold 0.015 --crop "1170:1605:0:300"`

3. **如何调整裁剪 (Crop) 区域**
   现在脚本已经支持直接将裁切参数传给 `--crop` (或 `-c`) 来动态调整。**如果不传 `--crop` 参数，则默认整屏截图**。
   裁剪参数的格式均为 `w:h:x:y` (宽:高:X坐标:Y坐标)。
   常见的业务场景和参数配置：
   - 全屏截图（默认）：不加 `--crop` 选项
   - 提取居中的长条按钮：`--crop "1000:200:(iw-1000)/2:ih-300"`
   - 去除 iOS 的顶部刘海和底部 Home 条：`--crop "1170:1605:0:300"`

## 📊 输出结果分析 (Output Analysis)
提取完成后，脚本会在指定的 `--output` 文件夹里生成按顺序排列的高清 `.png` 图片（如 `frame-0001.png`）。如果你需要进一步验证，可利用其他图片审阅功能检查生成的图像。
