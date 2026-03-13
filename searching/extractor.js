const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

/**
 * Extracts keyframes from a video file based on scene change detection.
 * @param {string} videoPath - Path to the input video file.
 * @param {string} outputDir - Directory to save the extracted frames.
 * @returns {Promise<string[]>} - An array of file paths for the extracted frames.
 */
function extractFrames(videoPath, outputDir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPattern = path.join(outputDir, 'frame-%04d.jpg');

    // Use select filter to pick frames where scene change score is > 0.4.
    // The vsync 0 is to output exactly the selected frames.
    ffmpeg(videoPath)
      .outputOptions([
        '-vf select=\'gt(scene,0.4)\'',
        '-vsync vfr'
      ])
      .output(outputPattern)
      .on('start', (commandLine) => {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
      })
      .on('end', () => {
        console.log('Frame extraction finished.');

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
        console.error('An error occurred during frame extraction: ' + err.message);
        reject(err);
      })
      .run();
  });
}

module.exports = {
  extractFrames
};
