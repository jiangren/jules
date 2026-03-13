require('dotenv').config();
const { extractFrames } = require('./extractor');
const { analyzeFrame } = require('./analyzer');
const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  const videoPath = args[0];

  if (!videoPath) {
    console.error('Usage: node index.js <path-to-video-file>');
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set. Please check your .env file.');
    process.exit(1);
  }

  const outputDir = path.join(__dirname, 'frames');
  const reportPath = path.join(__dirname, 'report.md');

  try {
    console.log(\`Start processing video: \${videoPath}\`);
    console.log('Extracting key frames...');

    // 1. Extract frames from the video
    const frames = await extractFrames(videoPath, outputDir);

    if (frames.length === 0) {
      console.log('No key frames found in the video.');
      return;
    }

    console.log(\`Extracted \${frames.length} frames. Starting AI analysis...\`);

    // 2. Initialize the markdown report
    let markdownReport = \`# Video Micro-Animation Analysis Report\\n\\n\`;
    markdownReport += \`**Video Source:** \${path.basename(videoPath)}\\n\\n\`;
    markdownReport += \`---\\n\\n\`;

    // 3. Analyze each frame and append to report
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const frameName = path.basename(frame);
      console.log(\`Analyzing frame \${i + 1}/\${frames.length}: \${frameName}\`);

      const analysisResult = await analyzeFrame(frame);

      // We need relative path for Markdown preview compatibility if pushed to git
      const relativeFramePath = path.relative(__dirname, frame);

      markdownReport += \`## Frame \${i + 1}: \${frameName}\\n\\n\`;
      markdownReport += \`![\${frameName}](./\${relativeFramePath})\\n\\n\`;
      markdownReport += \`\${analysisResult}\\n\\n\`;
      markdownReport += \`---\\n\\n\`;
    }

    // 4. Save the report to a markdown file
    fs.writeFileSync(reportPath, markdownReport, 'utf8');
    console.log(\`\\nAnalysis complete! Report saved to \${reportPath}\`);

  } catch (err) {
    console.error('An error occurred during execution:', err);
  }
}

main();
