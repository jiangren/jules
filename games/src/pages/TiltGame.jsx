import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './TiltGame.module.less';
import { Link } from 'react-router-dom';

const BALL_SIZE = 30;
const TARGET_SIZE = 40;
const GAME_DURATION = 30; // seconds

const TiltGame = () => {
  const [isMobile, setIsMobile] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, END
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 }); // percentage

  const containerRef = useRef(null);
  const ballRef = useRef(null);
  const targetRef = useRef(null);
  const requestRef = useRef();

  // Physics state
  const posRef = useRef({ x: 50, y: 50 }); // percentage
  const velRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ gamma: 0, beta: 0 });

  useEffect(() => {
    // Check if user is in mobile H5 environment
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    // Check if permission is needed for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      setPermissionGranted(true);
    }
  }, []);

  const requestPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          setNeedsPermission(false);
        } else {
          alert('需要陀螺仪权限才能体验游戏哦');
        }
      }
    } catch (error) {
      console.error('Request permission error:', error);
      alert('获取权限失败');
    }
  };

  const spawnTarget = () => {
    // Ensure new target isn't too close to current ball position
    let newX, newY;
    do {
      newX = Math.random() * 80 + 10;
      newY = Math.random() * 80 + 10;
    } while (
      Math.abs(newX - posRef.current.x) < 15 &&
      Math.abs(newY - posRef.current.y) < 15
    );

    setTargetPos({ x: newX, y: newY });

    if (targetRef.current) {
      gsap.fromTo(targetRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  };

  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    posRef.current = { x: 50, y: 50 };
    velRef.current = { x: 0, y: 0 };
    spawnTarget();
  };

  // Timer logic
  useEffect(() => {
    let timer;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('END');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Device orientation listener
  useEffect(() => {
    if (!permissionGranted || gameState !== 'PLAYING') return;

    const handleOrientation = (event) => {
      // Gamma is the left-to-right tilt in degrees, where right is positive
      // Beta is the front-to-back tilt in degrees, where front is positive
      let gamma = event.gamma;
      let beta = event.beta;

      if (gamma === null || beta === null) return;

      // Clamp values
      if (gamma > 90) gamma = 90;
      if (gamma < -90) gamma = -90;
      if (beta > 90) beta = 90;
      if (beta < -90) beta = -90;

      tiltRef.current = { gamma, beta };
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permissionGranted, gameState]);

  // Game Loop
  const update = () => {
    if (gameState !== 'PLAYING') return;

    const { gamma, beta } = tiltRef.current;

    // Adjust velocity based on tilt (sensitivity multiplier)
    velRef.current.x += gamma * 0.005;
    velRef.current.y += beta * 0.005;

    // Apply friction
    velRef.current.x *= 0.95;
    velRef.current.y *= 0.95;

    // Update position
    posRef.current.x += velRef.current.x;
    posRef.current.y += velRef.current.y;

    // Boundary collision (bouncing effect)
    if (posRef.current.x < 0) {
      posRef.current.x = 0;
      velRef.current.x *= -0.5;
    } else if (posRef.current.x > 100) {
      posRef.current.x = 100;
      velRef.current.x *= -0.5;
    }

    if (posRef.current.y < 0) {
      posRef.current.y = 0;
      velRef.current.y *= -0.5;
    } else if (posRef.current.y > 100) {
      posRef.current.y = 100;
      velRef.current.y *= -0.5;
    }

    // Apply position to DOM
    if (ballRef.current) {
      // Using left/top with percentage translates to screen dimensions roughly
      ballRef.current.style.left = `calc(${posRef.current.x}% - ${BALL_SIZE/2}px)`;
      ballRef.current.style.top = `calc(${posRef.current.y}% - ${BALL_SIZE/2}px)`;
    }

    // Collision detection with target
    // We roughly check percentage distance.
    const dx = posRef.current.x - targetPos.x;
    const dy = posRef.current.y - targetPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If close enough, count as collected
    if (distance < 5) {
      setScore(s => s + 1);

      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      spawnTarget();
    }

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, targetPos]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.backButton}>返回</Link>
        <div className={styles.scoreBoard}>
          <div className={styles.score}>得分: {score}</div>
          <div className={styles.time}>时间: {timeLeft}s</div>
        </div>
      </div>

      <div
        className={styles.gameArea}
        ref={containerRef}
        onTouchMove={(e) => {
          // Prevent scrolling while playing
          e.preventDefault();
        }}
      >
        {!isMobile && (
          <div className={styles.overlay}>
            <h2>H5 专属游戏</h2>
            <p>为了获得最佳体验，请在手机浏览器（H5环境）中打开此游戏并使用重力感应。</p>
          </div>
        )}

        {isMobile && needsPermission && !permissionGranted && gameState === 'START' && (
          <div className={styles.overlay}>
            <button className={styles.button} onClick={requestPermission}>
              允许陀螺仪权限
            </button>
          </div>
        )}

        {isMobile && permissionGranted && gameState === 'START' && (
          <div className={styles.overlay}>
            <h2>重力收集</h2>
            <p>倾斜手机控制小球收集目标！</p>
            <button className={styles.button} onClick={startGame}>
              开始游戏
            </button>
          </div>
        )}

        {gameState === 'END' && (
          <div className={styles.overlay}>
            <h2>时间到!</h2>
            <p>最终得分: {score}</p>
            <button className={styles.button} onClick={startGame}>
              再玩一次
            </button>
          </div>
        )}

        {/* The Ball */}
        <div
          ref={ballRef}
          className={styles.ball}
          style={{
            width: BALL_SIZE,
            height: BALL_SIZE,
            left: `calc(50% - ${BALL_SIZE/2}px)`,
            top: `calc(50% - ${BALL_SIZE/2}px)`,
          }}
        />

        {/* The Target */}
        {gameState === 'PLAYING' && (
          <div
            ref={targetRef}
            className={styles.target}
            style={{
              width: TARGET_SIZE,
              height: TARGET_SIZE,
              left: `calc(${targetPos.x}% - ${TARGET_SIZE/2}px)`,
              top: `calc(${targetPos.y}% - ${TARGET_SIZE/2}px)`,
            }}
          >
            <div className={styles.targetInner} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TiltGame;