import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './RollBallGame.module.less';

// 简单的 Web Audio API 合成器用于播放音效
let globalAudioContext = null;

const playSound = (type = 'coin') => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    // 全局只初始化一次 AudioContext，防止资源耗尽 (浏览器通常限制 6 个)
    if (!globalAudioContext) {
      globalAudioContext = new AudioContextClass();
    }
    const ctx = globalAudioContext;

    // 如果 Context 被挂起（通常是因为在用户交互前被创建），尝试恢复它
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1); // E6

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'bgm') {
      // 简易的背景音序器 (Arpeggio)
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      let now = ctx.currentTime;
      osc.type = 'triangle';

      // 循环播放音符，制造一种梦幻背景音
      for (let i = 0; i < 32; i++) {
        const note = notes[i % notes.length];
        // 音高设置
        osc.frequency.setValueAtTime(note, now + i * 0.25);
        // 音量包络，增加节奏感
        gainNode.gain.setValueAtTime(0, now + i * 0.25);
        gainNode.gain.linearRampToValueAtTime(0.1, now + i * 0.25 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.25 + 0.2);
      }

      osc.start(now);
      osc.stop(now + 32 * 0.25);

      // 返回停止函数用于外部取消播放
      return () => {
        try { osc.stop(); } catch(e){}
      };
    }
  } catch (e) {
    console.error('Audio play failed:', e);
  }
  return () => {};
};

const RollBallGame = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [score, setScore] = useState(0);

  const containerRef = useRef(null);

  // 游戏状态
  const gameStateRef = useRef({
    ball: { x: 50, y: 50, vx: 0, vy: 0, radius: 15 }, // vw/vh 和 像素
    target: { x: 20, y: 20, radius: 15 },
    boardSize: { width: 0, height: 0 },
    lastTime: performance.now(),
    tilt: { beta: 0, gamma: 0 }
  });

  const requestRef = useRef();

  // 初始化目标位置
  const randomizeTarget = useCallback(() => {
    gameStateRef.current.target = {
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 80 + 10,
      radius: 15
    };
  }, []);

  // 背景音乐循环机制
  useEffect(() => {
    if (!permissionGranted) return;

    // 播放背景音并每隔 8 秒（32 * 0.25）重启一次来达到循环播放
    let stopBGM = playSound('bgm');
    const intervalId = setInterval(() => {
      stopBGM = playSound('bgm');
    }, 8000);

    return () => {
      clearInterval(intervalId);
      if (stopBGM) stopBGM();
    };
  }, [permissionGranted]);

  useEffect(() => {
    // 检查是否需要专门请求权限 (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      setPermissionGranted(true);
    }

    // 初始化容器尺寸
    if (containerRef.current) {
      gameStateRef.current.boardSize = {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      };
    }

    randomizeTarget();
  }, [randomizeTarget]);

  const requestPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          setNeedsPermission(false);
          // 尝试初始化一下 AudioContext，解决部分浏览器必须由用户交互触发音频的问题
          playSound('init');
        } else {
          alert('需要陀螺仪权限才能进行平衡滚球游戏哦');
        }
      }
    } catch (error) {
      console.error('Request permission error:', error);
      alert('获取权限失败');
    }
  };

  // 处理设备倾斜
  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event) => {
      let { beta, gamma } = event;

      // 限制倾斜角度在 -90 到 90 之间
      if (beta > 90) beta = 90;
      if (beta < -90) beta = -90;
      if (gamma > 90) gamma = 90;
      if (gamma < -90) gamma = -90;

      gameStateRef.current.tilt = { beta: beta || 0, gamma: gamma || 0 };
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  // 物理引擎和渲染循环
  useEffect(() => {
    if (!permissionGranted) return;

    const ballElement = document.getElementById('roll-ball');
    const targetElement = document.getElementById('roll-target');

    const update = (time) => {
      const state = gameStateRef.current;
      const dt = (time - state.lastTime) / 1000; // 转换为秒
      state.lastTime = time;

      if (dt > 0.1) { // 忽略过大的时间差（如切换标签页）
        requestRef.current = requestAnimationFrame(update);
        return;
      }

      const { tilt, boardSize, ball, target } = state;

      // 摩擦力和重力系数
      const friction = 0.98;
      const gravity = 0.5;

      // 加速度由倾斜角度决定
      // beta 控制前后 (y轴), gamma 控制左右 (x轴)
      // 设备平放时，beta 和 gamma 接近 0
      const ax = (tilt.gamma / 90) * gravity * boardSize.width;
      // 修正物理引擎的倒置问题: 当手机向前倾斜 (beta > 0), 小球应该向上 (-y) 滚动
      const ay = -(tilt.beta / 90) * gravity * boardSize.height;

      // 更新速度
      ball.vx = (ball.vx + ax * dt) * friction;
      ball.vy = (ball.vy + ay * dt) * friction;

      // 更新位置 (转换为 px)
      let nextX = (ball.x / 100) * boardSize.width + ball.vx * dt;
      let nextY = (ball.y / 100) * boardSize.height + ball.vy * dt;

      // 边界碰撞检测 (带反弹)
      const bounce = -0.6;
      if (nextX < ball.radius) {
        nextX = ball.radius;
        ball.vx *= bounce;
      } else if (nextX > boardSize.width - ball.radius) {
        nextX = boardSize.width - ball.radius;
        ball.vx *= bounce;
      }

      if (nextY < ball.radius) {
        nextY = ball.radius;
        ball.vy *= bounce;
      } else if (nextY > boardSize.height - ball.radius) {
        nextY = boardSize.height - ball.radius;
        ball.vy *= bounce;
      }

      // 转回百分比保存
      ball.x = (nextX / boardSize.width) * 100;
      ball.y = (nextY / boardSize.height) * 100;

      // 目标碰撞检测
      const targetPxX = (target.x / 100) * boardSize.width;
      const targetPxY = (target.y / 100) * boardSize.height;
      const dx = nextX - targetPxX;
      const dy = nextY - targetPxY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball.radius + target.radius) {
        // 吃到目标
        playSound('coin');
        setScore(s => s + 1);
        randomizeTarget();

        // 可选：每次吃到目标给一点点反向速度，增加手感
        ball.vx *= -0.5;
        ball.vy *= -0.5;
      }

      // 更新 DOM
      // 为了避免和 CSS animation 中的 transform 冲突，直接修改 left/top
      if (ballElement) {
        ballElement.style.left = `${nextX}px`;
        ballElement.style.top = `${nextY}px`;
        // ballElement 本身没有 transform 动画，用 transform 加上 translate(-50%, -50%) 让中心点对齐也可以
        ballElement.style.transform = `translate(-50%, -50%)`;
      }
      if (targetElement) {
        targetElement.style.left = `${targetPxX}px`;
        targetElement.style.top = `${targetPxY}px`;
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [permissionGranted, randomizeTarget]);

  // 窗口大小变化时更新 boardSize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        gameStateRef.current.boardSize = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        };
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 供电脑调试使用的键盘或鼠标拖拽控制 (可选实现，这里给个简单的点击移动)
  const handleDebugClick = (e) => {
    if (containerRef.current && (!needsPermission || permissionGranted)) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const { boardSize, ball } = gameStateRef.current;

      // 给一个指向点击位置的速度
      const dx = x - (ball.x / 100 * boardSize.width);
      const dy = y - (ball.y / 100 * boardSize.height);

      ball.vx += dx * 2;
      ball.vy += dy * 2;
    }
  };

  return (
    <div className={styles.container} onClick={handleDebugClick}>
      {needsPermission && !permissionGranted && (
        <div className={styles.overlay}>
          <button className={styles.startButton} onClick={requestPermission}>
            开始游戏 (允许陀螺仪)
          </button>
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.score}>得分: {score}</div>
      </div>

      <div className={styles.gameArea} ref={containerRef}>
        <div
          id="roll-target"
          className={styles.target}
          style={{ width: '30px', height: '30px' }} // radius 15
        />
        <div
          id="roll-ball"
          className={styles.ball}
          style={{ width: '30px', height: '30px' }} // radius 15
        />
      </div>

      {!needsPermission && (
         <div className={styles.hint}>倾斜手机控制小球吃星星！(电脑端可点击屏幕给力)</div>
      )}
    </div>
  );
};

export default RollBallGame;