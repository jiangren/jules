const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

/**
 * Extracts keyframes from a video file based on scene change detection.
 * @param {string} videoPath - Path to the input video file.
 * @param {string} outputDir - Directory to save the extracted frames.
 * @param {number} threshold - Scene change detection threshold (default: 0.4).
 * @returns {Promise<string[]>} - An array of file paths for the extracted frames.
 */
function extractFrames(videoPath, outputDir, threshold = 0.4) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPattern = path.join(outputDir, 'frame-%04d.jpg');

    console.log(`Starting frame extraction with threshold: ${threshold}`);

    // Clean up existing files in the output directory
    fs.readdirSync(outputDir).forEach(file => {
      const filePath = path.join(outputDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });

    // Use select filter to pick frames where scene change score is > threshold.
    // The vsync 0 is to output exactly the selected frames.
    ffmpeg(videoPath)
      .outputOptions([
        '-vf', `select='gt(scene,${threshold})'`,
        '-vsync', 'vfr'
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
              .filter(file => file.endsWith('.jpg'))
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
