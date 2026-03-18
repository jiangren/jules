import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './GravityGame.module.less';
import { initAudioContext, playNote } from '../audio';

// Constants
const BALL_SIZE = 50;
const NOTE_SIZE = 30;
const FRICTION = 0.95;
const SENSITIVITY = 0.5;
// C Major scale frequencies for notes
const NOTES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

const GravityGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  // Ref for ball DOM node to avoid react re-renders on animation frame
  const ballRef = useRef(null);
  // Ref for note DOM node to update its position without re-rendering
  const noteRef = useRef(null);

  // Game state references
  const gameState = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: 0,
    vy: 0,
    ax: 0, // from device gamma
    ay: 0, // from device beta
    noteX: -100, // hidden initially
    noteY: -100,
  });

  const requestRef = useRef();

  // Helper to spawn a new note
  const spawnNote = () => {
    const maxX = window.innerWidth - NOTE_SIZE * 2;
    const maxY = window.innerHeight - NOTE_SIZE * 2;

    // Ensure note is placed within visible bounds and away from edges
    const newX = Math.max(NOTE_SIZE, Math.random() * maxX);
    const newY = Math.max(NOTE_SIZE + 60, Math.random() * maxY); // +60 to avoid header

    gameState.current.noteX = newX;
    gameState.current.noteY = newY;

    if (noteRef.current) {
        noteRef.current.style.left = `${newX}px`;
        noteRef.current.style.top = `${newY}px`;
    }
  };

  // Main game loop
  const updateGame = () => {
    if (!isPlaying) return;

    const state = gameState.current;

    // Apply acceleration
    state.vx += state.ax;
    state.vy += state.ay;

    // Apply friction
    state.vx *= FRICTION;
    state.vy *= FRICTION;

    // Update position
    state.x += state.vx;
    state.y += state.vy;

    // Boundary collision detection (screen edges)
    const maxX = window.innerWidth;
    const maxY = window.innerHeight;
    const radius = BALL_SIZE / 2;

    if (state.x < radius) {
      state.x = radius;
      state.vx *= -0.8; // bounce
    } else if (state.x > maxX - radius) {
      state.x = maxX - radius;
      state.vx *= -0.8;
    }

    if (state.y < radius) {
      state.y = radius;
      state.vy *= -0.8;
    } else if (state.y > maxY - radius) {
      state.y = maxY - radius;
      state.vy *= -0.8;
    }

    // Apply new position via inline styles to bypass React render cycle for performance
    if (ballRef.current) {
      ballRef.current.style.left = `${state.x}px`;
      ballRef.current.style.top = `${state.y}px`;
    }

    // Note collision detection (simple circle-circle intersection)
    const noteRadius = NOTE_SIZE / 2;
    const dx = state.x - state.noteX;
    const dy = state.y - state.noteY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius + noteRadius) {
      // Collision detected!
      setScore(s => s + 10);

      // Play a random note from the scale
      const randomFreq = NOTES[Math.floor(Math.random() * NOTES.length)];
      playNote(randomFreq, 'sine');

      // Respawn note
      spawnNote();
    }

    // Loop
    requestRef.current = requestAnimationFrame(updateGame);
  };

  // Start game loop when playing state changes
  useEffect(() => {
    if (isPlaying) {
      // Spawn first note
      spawnNote();

      // Setup device orientation listener
      const handleOrientation = (event) => {
        // gamma: left-to-right tilt in degrees, where right is positive (-90 to 90)
        // beta: front-to-back tilt in degrees, where front is positive (-180 to 180)
        let { gamma, beta } = event;

        // Fix gamma issues around 90 degrees
        if (gamma > 90) gamma = 90;
        if (gamma < -90) gamma = -90;

        // Update acceleration based on tilt
        gameState.current.ax = gamma * SENSITIVITY * 0.1;
        gameState.current.ay = -beta * SENSITIVITY * 0.1; // Invert beta for natural gravity feel
      };

      window.addEventListener('deviceorientation', handleOrientation);
      requestRef.current = requestAnimationFrame(updateGame);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [isPlaying]);

  // Request Device Orientation permission and initialize AudioContext
  const handleStartGame = async () => {
    try {
      // 1. Initialize AudioContext (must be within user gesture)
      const audioCtx = initAudioContext();
      if (!audioCtx) {
        alert("抱歉，您的浏览器不支持音频。");
      } else {
         // 播放一个无声音符，确切激活音频
         playNote(0, 'sine');
      }

      // 2. Request DeviceOrientation permission for iOS 13+
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setIsPlaying(true);
        } else {
          alert("需要获取设备方向权限才能玩游戏哦！");
        }
      } else {
        // Non-iOS 13+ devices, directly start
        setIsPlaying(true);
      }
    } catch (error) {
      console.error(error);
      alert("启动游戏失败：" + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>
          返回首页
        </Link>
        <div className={styles.score}>得分: {score}</div>
      </div>

      {!isPlaying && (
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            倾斜手机控制小球吃到音符！<br />
            (请确保手机已开启屏幕旋转/锁定解除)
          </div>
          <button className={styles.startButton} onClick={handleStartGame}>
            开始游戏
          </button>
        </div>
      )}

      {isPlaying && (
        <>
          <div
            ref={ballRef}
            className={styles.ball}
            // Initial inline styles are managed by the ref in the game loop.
          />

          <div
            ref={noteRef}
            className={styles.note}
            // Initial inline styles are managed by the ref in the game loop.
          >
            🎵
          </div>
        </>
      )}
    </div>
  );
};

export default GravityGame;
