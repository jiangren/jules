import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './LightCatcherGame.module.less';
import { initAudioContext, playNote } from '../audio';

const CATCHER_WIDTH = 80;
const PARTICLE_SIZE = 30;

// 音符频率 (日间高音，夜间低音)
const DAY_NOTES = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50]; // C5 to C6
const NIGHT_NOTES = [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00]; // A3 to A4

const LightCatcherGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isDayTime, setIsDayTime] = useState(true);

  // References for DOM elements to update without React re-renders
  const catcherRef = useRef(null);
  const particleRef = useRef(null);

  // Game state
  const gameState = useRef({
    catcherX: window.innerWidth / 2,
    particleX: -100,
    particleY: -100,
    particleSpeed: 3,
  });

  const requestRef = useRef();

  // Determine initial day/night state based on local time
  useEffect(() => {
    const hour = new Date().getHours();
    setIsDayTime(hour >= 6 && hour < 18);
  }, []);

  const toggleMode = () => {
    setIsDayTime(prev => !prev);
  };

  const spawnParticle = () => {
    const maxX = window.innerWidth - PARTICLE_SIZE * 2;
    // Spawn at random X, slightly above the top edge
    const newX = Math.max(PARTICLE_SIZE, Math.random() * maxX);
    const newY = -PARTICLE_SIZE;

    gameState.current.particleX = newX;
    gameState.current.particleY = newY;

    // Slightly increase speed as game progresses
    gameState.current.particleSpeed += 0.05;

    if (particleRef.current) {
      particleRef.current.style.left = `${newX}px`;
      particleRef.current.style.top = `${newY}px`;
      // Show particle after repositioning
      particleRef.current.style.display = 'block';
    }
  };

  const updateGame = () => {
    if (!isPlaying) return;

    const state = gameState.current;

    // Update particle position (falling)
    state.particleY += state.particleSpeed;

    // Render particle
    if (particleRef.current) {
      particleRef.current.style.top = `${state.particleY}px`;
    }

    // Render catcher
    if (catcherRef.current) {
      catcherRef.current.style.left = `${state.catcherX}px`;
    }

    // Collision Detection
    // Catcher bounds
    const catcherLeft = state.catcherX - CATCHER_WIDTH / 2;
    const catcherRight = state.catcherX + CATCHER_WIDTH / 2;
    const catcherTop = window.innerHeight - 20 - 40; // bottom 20px, height 40px
    const catcherBottom = window.innerHeight - 20;

    // Particle bounds
    const particleLeft = state.particleX;
    const particleRight = state.particleX + PARTICLE_SIZE;
    const particleTop = state.particleY;
    const particleBottom = state.particleY + PARTICLE_SIZE;

    // Check intersection
    const isColliding =
      particleBottom >= catcherTop &&
      particleTop <= catcherBottom &&
      particleRight >= catcherLeft &&
      particleLeft <= catcherRight;

    if (isColliding) {
      // Caught!
      setScore(s => s + 10);

      // Play note based on mode
      const notesArray = isDayTime ? DAY_NOTES : NIGHT_NOTES;
      const noteFreq = notesArray[Math.floor(Math.random() * notesArray.length)];
      // 'sine' for day (clear), 'triangle' for night (softer, hollow)
      playNote(noteFreq, isDayTime ? 'sine' : 'triangle');

      // Vibrate
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // Hide and respawn
      if (particleRef.current) {
        particleRef.current.style.display = 'none';
      }
      spawnParticle();
    } else if (state.particleY > window.innerHeight) {
      // Missed, flew off screen
      spawnParticle();
    }

    requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
    if (isPlaying) {
      spawnParticle();

      const handleOrientation = (event) => {
        let { gamma } = event; // -90 to 90 degrees left-to-right tilt

        // Cap gamma
        if (gamma > 90) gamma = 90;
        if (gamma < -90) gamma = -90;

        // Map tilt directly to screen position for snappier control
        // gamma 0 = middle screen
        // gamma -45 = left edge
        // gamma 45 = right edge
        const screenMiddle = window.innerWidth / 2;
        const offset = (gamma / 45) * screenMiddle;

        let newX = screenMiddle + offset;

        // Constrain to screen bounds
        if (newX < CATCHER_WIDTH / 2) newX = CATCHER_WIDTH / 2;
        if (newX > window.innerWidth - CATCHER_WIDTH / 2) newX = window.innerWidth - CATCHER_WIDTH / 2;

        gameState.current.catcherX = newX;
      };

      window.addEventListener('deviceorientation', handleOrientation);
      requestRef.current = requestAnimationFrame(updateGame);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [isPlaying, isDayTime]); // Re-bind if mode changes so game loop picks up new state

  const handleStartGame = async () => {
    try {
      // 1. Initialize Audio
      const audioCtx = initAudioContext();
      if (!audioCtx) {
        console.warn("Audio not supported.");
      } else {
        playNote(0, 'sine'); // Silent note to activate context
      }

      // 2. Request DeviceOrientation permission
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setIsPlaying(true);
        } else {
          alert("需要设备方向权限才能控制接收器！");
        }
      } else {
        setIsPlaying(true);
      }
    } catch (error) {
      console.error(error);
      alert("启动游戏失败：" + error.message);
    }
  };

  return (
    <div className={`${styles.container} ${isDayTime ? styles.dayMode : styles.nightMode}`}>
      {/* Environmental elements */}
      {isDayTime ? <div className={styles.sun}></div> : <div className={styles.moon}></div>}

      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>返回首页</Link>
        <button onClick={toggleMode} className={styles.toggleButton}>
          {isDayTime ? '🌙 切换黑夜' : '☀️ 切换白天'}
        </button>
        <div className={styles.score}>得分: {score}</div>
      </div>

      {!isPlaying && (
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            倾斜手机控制收集器！<br/>
            白天收集阳光，黑夜捕捉萤火虫。<br/>
            (请开启屏幕自动旋转)
          </div>
          <button className={styles.startButton} onClick={handleStartGame}>
            开始游戏
          </button>
        </div>
      )}

      {isPlaying && (
        <>
          {/* Catcher (Basket) */}
          <div
            ref={catcherRef}
            className={`${styles.catcher} ${isDayTime ? styles.dayCatcher : styles.nightCatcher}`}
            style={{ left: `${gameState.current.catcherX}px` }}
          />

          {/* Falling Particle (Sunbeam or Firefly) */}
          <div
            ref={particleRef}
            className={`${styles.particle} ${isDayTime ? styles.sunbeam : styles.firefly}`}
            style={{
              width: `${PARTICLE_SIZE}px`,
              height: `${PARTICLE_SIZE}px`,
              display: 'none'
            }}
          />
        </>
      )}
    </div>
  );
};

export default LightCatcherGame;
