import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompassGame.module.less';
import { initAudioContext, playNote } from '../audio';

const CompassGame = () => {
  const navigate = useNavigate();
  const [hasPermission, setHasPermission] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetAngle, setTargetAngle] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isFound, setIsFound] = useState(false);
  const [message, setMessage] = useState('点击开始寻找宝藏！');

  const beepIntervalRef = useRef(null);
  const lastBeepTimeRef = useRef(0);

  // 初始化目标角度
  useEffect(() => {
    setTargetAngle(Math.floor(Math.random() * 360));
  }, []);

  const handleStart = async () => {
    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setHasPermission(true);
        } else {
          setMessage('需要设备方向权限才能进行游戏！');
          return;
        }
      } else {
        // 非 iOS 13+ 设备
        setHasPermission(true);
      }

      initAudioContext();
      setIsPlaying(true);
      setIsFound(false);
      setMessage('转动手机，根据声音提示寻找宝藏方向！\n声音越急促、音调越高说明越接近！');

      window.addEventListener('deviceorientation', handleOrientation, true);

    } catch (error) {
      console.error(error);
      setMessage('获取权限失败或设备不支持：' + error.message);
    }
  };

  const stopGame = () => {
    setIsPlaying(false);
    window.removeEventListener('deviceorientation', handleOrientation, true);
    if (beepIntervalRef.current) {
      cancelAnimationFrame(beepIntervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      stopGame();
    };
  }, []);

  const handleOrientation = (event) => {
    if (!isPlaying || isFound) return;

    // alpha 表示设备围绕 Z 轴的旋转角度 (0-360)
    let alpha = event.alpha;
    if (alpha === null) {
        // 如果无法获取到 alpha（比如在没有陀螺仪的设备上，或者电脑浏览器上），
        // 尝试用 webkitCompassHeading
        alpha = event.webkitCompassHeading || 0;
    }

    setCurrentAngle(alpha);
  };

  // 处理声音反馈和寻宝逻辑
  useEffect(() => {
    if (!isPlaying || isFound) return;

    // 计算当前角度与目标角度的最短差值
    let diff = Math.abs(currentAngle - targetAngle);
    if (diff > 180) {
      diff = 360 - diff;
    }

    if (diff <= 10) {
      // 找到宝藏！
      setIsFound(true);
      setMessage('🎉 恭喜你！找到宝藏啦！🎉');
      stopGame();

      // 震动反馈 (如果设备支持)
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 500]);
      }

      // 播放胜利音效 (简单的主和弦)
      playNote(523.25, 'triangle'); // C5
      setTimeout(() => playNote(659.25, 'triangle'), 150); // E5
      setTimeout(() => playNote(783.99, 'triangle'), 300); // G5
      setTimeout(() => playNote(1046.50, 'triangle'), 450); // C6

    } else {
      // 根据角度差计算提示音的频率和间隔
      // diff 范围大概是 11 ~ 180
      // 距离越近 (diff 越小)，interval 越短 (越急促)，frequency 越高
      const minInterval = 100; // 最小间隔 100ms
      const maxInterval = 1000; // 最大间隔 1000ms
      const minFreq = 220; // 远离时低音
      const maxFreq = 880; // 接近时高音

      // 归一化 diff (0 到 1 之间)
      const normalizedDiff = diff / 180;

      const interval = minInterval + normalizedDiff * (maxInterval - minInterval);
      const frequency = maxFreq - normalizedDiff * (maxFreq - minFreq);

      const now = performance.now();
      if (now - lastBeepTimeRef.current >= interval) {
        playNote(frequency, 'sine');
        lastBeepTimeRef.current = now;
      }
    }
  }, [currentAngle, targetAngle, isPlaying, isFound]);

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        返回首页
      </button>

      <h1 className={styles.title}>魔法指南针 🧭</h1>

      <div className={styles.messageBox}>
        {message}
      </div>

      {!isPlaying && !isFound && (
        <button className={styles.startButton} onClick={handleStart}>
          开始寻宝
        </button>
      )}

      {isPlaying && !isFound && (
        <div className={styles.compassArea}>
            <div className={styles.radarEffect}></div>
            <p>正在搜索宝藏信号...</p>
            {/* 为了调试方便，可以暂时显示角度，实际游戏中可以隐藏
            <p style={{fontSize: '12px', opacity: 0.5}}>当前: {Math.round(currentAngle)}° / 目标: {targetAngle}°</p>
            */}
        </div>
      )}

      {isFound && (
        <div className={styles.treasureArea}>
          <div className={styles.treasureChest}>🎁</div>
          <button className={styles.replayButton} onClick={() => {
              setTargetAngle(Math.floor(Math.random() * 360));
              handleStart();
          }}>
            再玩一次
          </button>
        </div>
      )}
    </div>
  );
};

export default CompassGame;