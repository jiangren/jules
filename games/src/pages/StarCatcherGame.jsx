import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StarCatcherGame.module.less';
import { initAudioContext, playNote } from '../audio';

// 游戏配置
const MAX_LEVELS = 5;
const AUTO_CATCH_DURATION = 500; // ms

// 《小星星》简易乐谱 (C大调频率)
const TWINKLE_SONG = [
  261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, // Do Do Sol Sol La La Sol
  349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63  // Fa Fa Mi Mi Re Re Do
];

// 每个音符对应的星星抓捕声（取 C 大调前 5 个音）
const CATCH_NOTES = [261.63, 293.66, 329.63, 349.23, 392.00];

// 获取随机坐标 (-180 到 180 用于 X, -90 到 90 用于 Y)
const getRandomPosition = () => {
  return {
    x: (Math.random() - 0.5) * 160, // 缩小范围，避免太偏
    y: (Math.random() - 0.5) * 80,
  };
};

const StarCatcherGame = () => {
  const navigate = useNavigate();

  // 游戏状态
  const [gameState, setGameState] = useState('START'); // START, PLAYING, WON
  const [level, setLevel] = useState(1);
  const [starsCaught, setStarsCaught] = useState(0);
  const [message, setMessage] = useState('寻找夜空中的星星');

  // 配置项
  const [isAutoCatch, setIsAutoCatch] = useState(true);

  // 渲染相关
  const [starStyle, setStarStyle] = useState({});
  const [boxStyle, setBoxStyle] = useState({});
  const [isMatching, setIsMatching] = useState(false);

  // Refs 存储物理状态（避免频繁重渲染）
  const physRef = useRef({
    pitch: 0, // Y轴旋转 (上下看)
    yaw: 0,   // X轴旋转 (左右看)
    scale: 1, // 当前星星的缩放比例 (由 z 轴加速度控制)
    targetPitch: 0,
    targetYaw: 0,
    velocityZ: 0, // 模拟 Z 轴速度
  });

  // 判定相关 Refs
  const matchTimerRef = useRef(null);
  const reqFrameRef = useRef(null);

  // 初始化目标星星
  const initNextStar = useCallback(() => {
    const newPos = getRandomPosition();
    physRef.current.targetYaw = newPos.x;
    physRef.current.targetPitch = newPos.y;
    // 随机初始大小 (需要玩家前后移动来调整)
    physRef.current.scale = Math.random() > 0.5 ? 0.3 : 2.5;
  }, []);

  const startGame = async () => {
    try {
      // 1. 初始化 AudioContext
      const audioCtx = initAudioContext();
      if (!audioCtx) {
        alert("抱歉，您的浏览器不支持音频。");
      } else {
         playNote(0, 'sine'); // 激活音频
      }

      // 2. 请求权限 (iOS 13+)
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const orientationState = await DeviceOrientationEvent.requestPermission();
        if (orientationState !== 'granted') {
          alert("需要设备方向权限才能玩游戏哦！");
          return;
        }
      }

      // Start game
      setGameState('PLAYING');
      setLevel(1);
      setStarsCaught(0);
      setMessage('关卡 1: 转动手机找到星星');
      initNextStar();

    } catch (error) {
      console.error(error);
      alert("启动游戏失败：" + error.message);
    }
  };

  // 设备方向处理 (负责全景旋转)
  const handleOrientation = useCallback((event) => {
    if (gameState !== 'PLAYING') return;

    // alpha: Z轴旋转 (0-360) (罗盘)
    // beta: X轴旋转 (-180 - 180) (前后倾斜)
    // gamma: Y轴旋转 (-90 - 90) (左右倾斜)

    // 注意：这里的全景映射比较简略，为了跨平台稳定性，我们主要取横屏或竖屏下的相对偏角。
    // 为了简单起见，这里假设竖屏握持。
    let pitch = event.beta; // 上下倾斜
    let yaw = event.alpha;  // 左右转动

    if (yaw === null) {
        yaw = event.webkitCompassHeading || 0;
    }

    // 简单平滑处理或映射
    // 以初始状态为基准，或者直接用原始值（在 360 度空间里映射）
    // 为了防止 360 度跨越的问题，简单做个偏移
    if (yaw > 180) yaw -= 360;

    physRef.current.pitch = pitch;
    physRef.current.yaw = yaw;
  }, [gameState]);

  // 设备运动处理 (负责推拉缩放)
  const handleMotion = useCallback((event) => {
    if (gameState !== 'PLAYING') return;

    // 获取去掉重力后的加速度
    let accZ = 0;
    if (event.acceleration) {
      accZ = event.acceleration.z || 0;
    } else if (event.accelerationIncludingGravity) {
      // 退化处理
      accZ = (event.accelerationIncludingGravity.z || 0) - 9.81;
    }

    // 简单的物理引擎：加速度改变速度，速度改变缩放比例
    // 添加死区和低通滤波避免微小抖动
    if (Math.abs(accZ) > 0.5) {
      physRef.current.velocityZ += accZ * 0.05;
    }

    // 阻尼摩擦力
    physRef.current.velocityZ *= 0.85;

    // 更新缩放
    physRef.current.scale += physRef.current.velocityZ * 0.1;

    // 限制缩放范围
    if (physRef.current.scale < 0.2) physRef.current.scale = 0.2;
    if (physRef.current.scale > 3.0) physRef.current.scale = 3.0;

  }, [gameState]);

  // 处理捕捉成功
  const handleCatch = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    // 播放音效
    const note = CATCH_NOTES[(level - 1) % CATCH_NOTES.length];
    playNote(note, 'triangle');

    // 震动
    if (navigator.vibrate) navigator.vibrate(50);

    const nextLevel = level + 1;
    if (nextLevel > MAX_LEVELS) {
      // 胜利
      setGameState('WON');
      setMessage('🎉 通关啦！');
      playWinSong();
    } else {
      // 下一关
      setLevel(nextLevel);
      setStarsCaught(starsCaught + 1);
      setMessage(`关卡 ${nextLevel}: 难度增加！请更精准地对齐`);
      initNextStar();
      setIsMatching(false);
    }
  }, [gameState, level, starsCaught, initNextStar]);

  // 播放胜利之歌
  const playWinSong = () => {
    TWINKLE_SONG.forEach((noteFreq, index) => {
      setTimeout(() => {
        playNote(noteFreq, 'sine');
      }, index * 400); // 400ms 每个音符
    });
  };

  // 游戏主循环 (更新 UI 并判定)
  const gameLoop = useCallback(() => {
    if (gameState !== 'PLAYING') return;

    const { pitch, yaw, targetPitch, targetYaw, scale } = physRef.current;

    // 计算星星在屏幕上的相对位置
    // 这里使用一个简单的投影映射：将角度差映射到视口百分比
    let diffYaw = targetYaw - yaw;
    let diffPitch = targetPitch - pitch;

    // 处理环绕问题 (例如 170 度到 -170 度的跨越)
    if (diffYaw > 180) diffYaw -= 360;
    if (diffYaw < -180) diffYaw += 360;

    // 将角度差放大，使其在屏幕上移动。假设视场角 (FOV) 约 60 度。
    const fov = 60;
    const xPos = 50 + (diffYaw / fov) * 50;  // vw (50% 是中心)
    const yPos = 50 + (diffPitch / fov) * 50; // vh (50% 是中心)

    // 应用内联样式
    setStarStyle({
      left: `${xPos}vw`,
      top: `${yPos}vh`,
      transform: `translate(-50%, -50%) scale(${scale})`,
    });

    // 判定逻辑
    // 关卡难度决定了允许的位置偏差和缩放偏差
    const posTolerance = Math.max(2, 10 - level * 1.5); // 位置误差容忍度 (vw/vh)
    const scaleTolerance = Math.max(0.1, 0.5 - level * 0.08); // 缩放误差容忍度

    const distance = Math.sqrt(Math.pow(50 - xPos, 2) + Math.pow(50 - yPos, 2));
    const targetScale = 1.0; // 理想缩放大小是 1
    const scaleDiff = Math.abs(scale - targetScale);

    const isPosMatch = distance < posTolerance;
    // 关卡 1 时只要求位置，不严格要求大小
    const isScaleMatch = level === 1 ? true : (scaleDiff < scaleTolerance);

    const currentMatching = isPosMatch && isScaleMatch;

    if (currentMatching !== isMatching) {
      setIsMatching(currentMatching);
      if (currentMatching && isAutoCatch) {
        // 开始自动捕捉计时
        matchTimerRef.current = setTimeout(() => {
          handleCatch();
        }, AUTO_CATCH_DURATION);
      } else {
        // 中断计时
        if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
      }
    }

    reqFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, level, isMatching, isAutoCatch, handleCatch]);

  // 手动点击捕捉
  const handleManualCatch = () => {
    if (gameState === 'PLAYING' && isMatching) {
      handleCatch();
    }
  };

  // 绑定事件和循环
  useEffect(() => {
    if (gameState === 'PLAYING') {
      window.addEventListener('deviceorientation', handleOrientation);
      window.addEventListener('devicemotion', handleMotion);
      reqFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
      if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
      if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
    };
  }, [gameState, handleOrientation, handleMotion, gameLoop]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          返回首页
        </button>
        <div className={styles.scoreInfo}>
          {gameState === 'PLAYING' && `关卡: ${level} / ${MAX_LEVELS}`}
        </div>
      </div>

      <div className={styles.messageBox}>{message}</div>

      {gameState === 'START' && (
        <div className={styles.overlay}>
          <div className={styles.startInfo}>
            <h2>全景捕星星</h2>
            <p>像拿着望远镜一样转动手机寻找星星。<br/>向前/向后推拉手机可以改变星星大小。<br/>将星星套入屏幕中央的抓捕框中！</p>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={isAutoCatch}
                onChange={(e) => setIsAutoCatch(e.target.checked)}
              />
              对齐后自动捕捉
            </label>
          </div>
          <button className={styles.startButton} onClick={startGame}>
            开始游戏
          </button>
        </div>
      )}

      {(gameState === 'PLAYING' || gameState === 'WON') && (
        <div className={styles.gameArea} onClick={!isAutoCatch ? handleManualCatch : undefined}>
          {/* 背景小星星 */}
          <div className={styles.starsBackground}></div>

          {/* 目标星星 */}
          {gameState === 'PLAYING' && (
            <div
              className={`${styles.targetStar} ${isMatching ? styles.matchingStar : ''}`}
              style={starStyle}
            >
              ⭐
            </div>
          )}

          {/* 中央抓捕框 */}
          {gameState === 'PLAYING' && (
             <div className={`${styles.catchBox} ${isMatching ? styles.matchingBox : ''}`}></div>
          )}

          {!isAutoCatch && gameState === 'PLAYING' && (
             <div className={styles.hintText}>
               {isMatching ? "点击屏幕捕捉！" : "请对准星星..."}
             </div>
          )}
        </div>
      )}

      {gameState === 'WON' && (
        <div className={styles.winOverlay}>
           <h2>🌟 完美通关 🌟</h2>
           <p>你已经成为了捕星大师！</p>
           <button className={styles.startButton} onClick={startGame}>再玩一次</button>
        </div>
      )}
    </div>
  );
};

export default StarCatcherGame;