---
description: 使用 video-extractor 快速从视频中提取关键帧
---

# Extract Video Keyframes (Slash Command)

此 workflow 会自动调用 `video-extractor` 提取视频截图。

## 执行步骤
1. 确认用户当前工作上下文中是否指定了**待提取的视频路径** (例如 `yyy.mp4`)。如果没有找到，请询问用户视频文件的绝对路径或相对路径。
2. 根据用户的输入，解析以下可选参数，如果没有指定，则使用默认值：
   - `--output`: 默认为 `./my-frames`
   - `--threshold`: 默认为 `0.015`
   - `--crop`: 默认为空 (即不裁剪，全屏截图)
3. 在后台运行如下命令（请将尖括号内的变量替换为实际路径和参数，如果有 `--crop` 才加上 `-c` 选项）：
```bash
// turbo
node /Users/hzjiangren/increase/github/jules/video-extractor/.agents/skills/extract_video_keyframes/scripts/index.js --input <video_path> --output <output_dir> --threshold <threshold>
```
4. 如果用户提供了裁剪参数，那么执行命令应该包含 `-c`：
```bash
// turbo
node /Users/hzjiangren/increase/github/jules/video-extractor/.agents/skills/extract_video_keyframes/scripts/index.js --input <video_path> --output <output_dir> --threshold <threshold> -c <crop>
```
5. 命令执行完成后，反馈给用户最终生成的图片数量及存放位置。
