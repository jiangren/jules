const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const getVideoDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });
};

/**
 * Extracts keyframes from a video file based on scene change detection.
 * @param {string} videoPath - Path to the input video file.
 * @param {string} outputDir - Directory to save the extracted frames.
 * @param {number} threshold - Scene change detection threshold (default: 0.4).
 * @param {string} cropParam - Optional crop parameters like "1170:1605:0:300".
 * @param {number} ignoreLast - Optional seconds to ignore at the end of the video.
 * @returns {Promise<string[]>} - An array of file paths for the extracted frames.
 */
async function extractFrames(videoPath, outputDir, threshold = 0.4, cropParam = null, ignoreLast = 0) {
  let targetDuration = null;
  if (ignoreLast > 0) {
    try {
      const duration = await getVideoDuration(videoPath);
      targetDuration = Math.max(0, duration - ignoreLast);
      console.log(`Video duration: ${duration}s, target extraction duration: ${targetDuration}s (ignoring last ${ignoreLast}s)`);
    } catch (err) {
      console.warn('Warning: could not get duration for ignore-last:', err.message);
    }
  }

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPattern = path.join(outputDir, 'frame-%04d.png');

    console.log(`Starting frame extraction with threshold: ${threshold}`);

    // Clean up existing files in the output directory
    fs.readdirSync(outputDir).forEach(file => {
      const filePath = path.join(outputDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });

    // Dynamically build the video filter (-vf)
    // If cropParam is provided, prepend it to the filter string
    const filterParts = [];
    if (cropParam) {
      filterParts.push(`crop=${cropParam}`);
    }
    filterParts.push(`select=gt(scene\\,${threshold})`);
    const vfString = filterParts.join(',');

    // Apply crop filter (if any) and scene detection. Output as high-quality PNG.
    let command = ffmpeg(videoPath);
    if (targetDuration !== null) {
      command = command.setDuration(targetDuration);
    }
    
    command
      .outputOptions([
        '-vf', vfString,
        '-vsync', 'vfr',
        '-q:v', '2'
      ])
      .output(outputPattern)
      .on('start', (commandLine) => {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
      })
      .on('end', () => {
        console.log('Frame extraction finished successfully.');

        // Read the output directory to get the list of generated files
        fs.readdir(outputDir, (err, files) => {
          if (err) {
            reject(err);
          } else {
            const framePaths = files
              .filter(file => file.endsWith('.png'))
              .map(file => path.join(outputDir, file));
            resolve(framePaths.sort()); // Ensure they are sorted
          }
        });
      })
      .on('error', (err) => {
        console.error('An error occurred during frame extraction:', err.message);
        reject(err);
      })
      .run();
  });
}

module.exports = {
  extractFrames
};
