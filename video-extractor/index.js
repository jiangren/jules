#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const { extractFrames } = require('./extractor');

const program = new Command();

program
  .name('video-extractor')
  .description('Extract keyframes from a local video based on scene changes')
  .version('1.0.0')
  .requiredOption('-i, --input <path>', 'path to the local video file')
  .option('-o, --output <dir>', 'directory to save extracted frames', './frames')
  .option('-t, --threshold <number>', 'scene change detection threshold (0.0 to 1.0)', '0.4')
  .action(async (options) => {
    const inputPath = path.resolve(options.input);
    const outputDir = path.resolve(options.output);
    const threshold = parseFloat(options.threshold);

    if (isNaN(threshold) || threshold < 0 || threshold > 1) {
      console.error('Error: Threshold must be a valid number between 0.0 and 1.0');
      process.exit(1);
    }

    try {
      console.log(`Analyzing video: ${inputPath}`);
      console.log(`Output directory: ${outputDir}`);

      const frames = await extractFrames(inputPath, outputDir, threshold);

      if (frames.length === 0) {
        console.log('No key frames found in the video based on the given threshold.');
      } else {
        console.log(`\nSuccess! Extracted ${frames.length} keyframes to ${outputDir}`);
        console.log('You can now use these frames for AI analysis or other purposes.');
      }
    } catch (err) {
      console.error('\nFailed to extract frames.');
      process.exit(1);
    }
  });

program.parse(process.argv);
