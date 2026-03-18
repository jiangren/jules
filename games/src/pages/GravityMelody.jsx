import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import styles from './GravityMelody.module.less';

// 音乐相关：C大调音阶频率
const scaleFrequencies = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  493.88, // B4
  523.25  // C5
];

// 避免重复创建 AudioContext
let audioCtx = null;

const playNote = (index) => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = scaleFrequencies[index % scaleFrequencies.length];

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // 简单的包络（Envelope）让声音更柔和
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.5);
};

const GravityMelody = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [score, setScore] = useState(0);

  const ballRef = useRef(null);
  const containerRef = useRef(null);
  const starsRef = useRef([]); // 保存星星的DOM节点和数据
  const [stars, setStars] = useState([]);

  // 小球物理状态
  const pos = useRef({ x: 50, y: 50 }); // 百分比
  const vel = useRef({ x: 0, y: 0 });
  const acc = useRef({ x: 0, y: 0 });

  const animationFrameId = useRef(null);
  const isRunning = useRef(false);

  // 初始化权限检查
  useEffect(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      setPermissionGranted(true);
    }

    // 初始化星星
    generateStars(5);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const generateStars = (count) => {
    const newStars = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: Math.random() * 80 + 10, // 10% - 90%
      y: Math.random() * 80 + 10,
      noteIndex: Math.floor(Math.random() * scaleFrequencies.length),
      collected: false
    }));
    setStars(prev => [...prev.filter(s => !s.collected), ...newStars]);
  };

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event) => {
      // event.beta (X轴, 前后倾斜, -180 ~ 180) -> 控制 y 方向
      // event.gamma (Y轴, 左右倾斜, -90 ~ 90) -> 控制 x 方向

      let beta = event.beta;
      let gamma = event.gamma;

      // 处理设备倒置或极限角度的情况
      if (beta === null || gamma === null) return;

      // 限制倾斜角度在合理范围内，让控制更稳定
      const maxTilt = 45;
      if (beta > maxTilt) beta = maxTilt;
      if (beta < -maxTilt) beta = -maxTilt;
      if (gamma > maxTilt) gamma = maxTilt;
      if (gamma < -maxTilt) gamma = -maxTilt;

      // 转换为加速度 (根据屏幕方向这里做了简单映射，可以进一步完善横竖屏判断)
      acc.current.x = gamma / maxTilt * 0.5; // 左右倾斜改变X
      acc.current.y = beta / maxTilt * 0.5;  // 前后倾斜改变Y
    };

    window.addEventListener('deviceorientation', handleOrientation);
    isRunning.current = true;
    gameLoop();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      isRunning.current = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [permissionGranted]);

  const gameLoop = () => {
    if (!isRunning.current) return;

    // 1. 更新速度
    vel.current.x += acc.current.x;
    vel.current.y += acc.current.y;

    // 添加摩擦力，让小球慢慢停下
    vel.current.x *= 0.95;
    vel.current.y *= 0.95;

    // 2. 更新位置
    pos.current.x += vel.current.x;
    pos.current.y += vel.current.y;

    // 3. 边界碰撞检测 (反弹)
    if (pos.current.x < 0) {
      pos.current.x = 0;
      vel.current.x *= -0.6; // 反弹损耗
    } else if (pos.current.x > 100) {
      pos.current.x = 100;
      vel.current.x *= -0.6;
    }

    if (pos.current.y < 0) {
      pos.current.y = 0;
      vel.current.y *= -0.6;
    } else if (pos.current.y > 100) {
      pos.current.y = 100;
      vel.current.y *= -0.6;
    }

    // 4. 更新DOM
    if (ballRef.current) {
      // 使用内联 left/top 而非 transform，避免和可能有的CSS动画冲突，虽然这里用 transform 性能更好
      // 但对于纯JS控制，直接修改 style 更直观。这里使用百分比单位。
      ballRef.current.style.left = `${pos.current.x}%`;
      ballRef.current.style.top = `${pos.current.y}%`;
    }

    // 5. 碰撞检测 (小球和星星)
    checkCollisions();

    animationFrameId.current = requestAnimationFrame(gameLoop);
  };

  const checkCollisions = () => {
    if (!containerRef.current || !ballRef.current) return;

    // 使用简单距离判断。为了准确，也可以用 getBoundingClientRect()
    // 这里因为星星和球都用百分比定位，可以在百分比坐标系估算距离。
    // 假设小球宽 10vw，星星宽 8vw，半径大约在 4-5%。
    const threshold = 6; // 碰撞距离阈值 (百分比)

    setStars(currentStars => {
      let collided = false;
      const newStars = currentStars.map((star, index) => {
        if (star.collected) return star;

        const dx = pos.current.x - star.x;
        const dy = pos.current.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < threshold) {
          collided = true;
          // 播放声音
          playNote(star.noteIndex);

          // 如果支持震动
          if (navigator.vibrate) {
             navigator.vibrate(50);
          }

          // 执行消失动画
          const starEl = starsRef.current[index];
          if (starEl) {
             gsap.to(starEl, {
                scale: 2,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out',
                xPercent: -50,
                yPercent: -50
             });
          }

          return { ...star, collected: true };
        }
        return star;
      });

      if (collided) {
        setScore(s => s + 1);
        // 如果星星不够了，补充星星
        const activeStars = newStars.filter(s => !s.collected).length;
        if (activeStars < 3) {
           setTimeout(() => generateStars(3), 500); // 延迟生成
        }
      }

      return collided ? newStars : currentStars;
    });
  };

  const requestPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          // 初始化 AudioContext（必须在用户交互中初始化）
          if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          }
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }

          setPermissionGranted(true);
          setNeedsPermission(false);
        } else {
          alert('需要传感器权限才能体验游戏！');
        }
      }
    } catch (error) {
      console.error(error);
      alert('获取权限失败');
    }
  };

  // 电脑端调试使用鼠标模拟倾斜
  const handleMouseMove = (e) => {
    if (needsPermission && !permissionGranted) return; // 需要权限时先点按钮
    if (isRunning.current && permissionGranted) {
       // 计算鼠标相对于屏幕中心的偏移作为倾斜
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 ~ 1
      const dy = (e.clientY - cy) / cy;

      acc.current.x = dx * 0.5;
      acc.current.y = dy * 0.5;
      return;
    }

    // 只有在没权限或者是电脑端才模拟
    if (!audioCtx) {
       audioCtx = new (window.AudioContext || window.webkitAudioContext)();
       if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    if (!isRunning.current) {
        isRunning.current = true;
        setPermissionGranted(true);
        gameLoop();
    }

    // 计算鼠标相对于屏幕中心的偏移作为倾斜
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 ~ 1
    const dy = (e.clientY - cy) / cy;

    acc.current.x = dx * 0.5;
    acc.current.y = dy * 0.5;
  };

  return (
    <div className={styles.container} onMouseMove={handleMouseMove} onTouchStart={() => {
        // 如果在没有交互前点屏幕，也初始化下AudioContext，兼容各种设备的播放策略
        if (!audioCtx) {
           audioCtx = new (window.AudioContext || window.webkitAudioContext)();
           if (audioCtx.state === 'suspended') audioCtx.resume();
        }
    }}>
      <Link to="/" className={styles.backButton}>返回</Link>

      <div className={styles.scoreBoard}>
        🎵 收集音符: {score}
      </div>

      {needsPermission && !permissionGranted && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>重力音符</h2>
            <p>倾斜手机控制小球收集音符</p>
            <button className={styles.startButton} onClick={requestPermission}>
              开始演奏
            </button>
          </div>
        </div>
      )}

      <div className={styles.gameArea} ref={containerRef}>
        <div
          className={styles.ball}
          ref={ballRef}
          style={{ left: '50%', top: '50%' }}
        />

        {stars.map((star, index) => (
          !star.collected || starsRef.current[index] /* 保留刚被收集的DOM用于动画，动画由GSAP负责 */ ? (
            <div
              key={star.id}
              className={`${styles.star} ${star.collected ? styles.collected : ''}`}
              ref={el => starsRef.current[index] = el}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`
              }}
            >
              ★
            </div>
          ) : null
        ))}
      </div>

      <div className={styles.hint}>倾斜手机滚动小球(或在电脑上移动鼠标)</div>
    </div>
  );
};

export default GravityMelody;
