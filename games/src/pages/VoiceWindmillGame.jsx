import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './VoiceWindmillGame.module.less';
import { initAudioContext, playNote } from '../audio';

// 简单的五声音阶：C4, D4, E4, G4, A4, C5
const PENTATONIC_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

const VoiceWindmillGame = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const rotationRef = useRef(0);
  const speedRef = useRef(0); // 当前旋转速度
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

  // 音乐播放和UI更新相关的 ref
  const lastNoteTimeRef = useRef(0);
  const noteIndexRef = useRef(0);
  const windmillRef = useRef(null);
  const volumeBarRef = useRef(null);

  const startListening = async () => {
    try {
      // 必须在用户交互时初始化 AudioContext
      audioContextRef.current = initAudioContext();
      if (!audioContextRef.current) {
        throw new Error('您的浏览器不支持 Web Audio API');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioCtx = audioContextRef.current;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const microphone = audioCtx.createMediaStreamSource(stream);
      microphone.connect(analyser);

      analyserRef.current = analyser;
      microphoneRef.current = microphone;

      setIsListening(true);
      setError('');

      updateLoop();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('无法访问麦克风。请确保您已授予权限并且设备有麦克风。');
    }
  };

  const stopListening = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
    }
    // 停止并释放音频流
    if (microphoneRef.current && microphoneRef.current.mediaStream) {
      microphoneRef.current.mediaStream.getTracks().forEach(track => track.stop());
    }
    setIsListening(false);

    // 重置速度和音量条
    speedRef.current = 0;
    if (volumeBarRef.current) {
      volumeBarRef.current.style.width = '0%';
    }
  };

  const updateLoop = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // 计算音量 (平均值)
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const averageVolume = sum / dataArray.length;

    // 将音量映射到 0-100 范围，这里假设 max average 可能是 100 左右
    const normalizedVolume = Math.min(100, Math.max(0, (averageVolume / 100) * 100));

    // 直接操作 DOM 更新音量条，避免 React 重新渲染
    if (volumeBarRef.current) {
      volumeBarRef.current.style.width = `${normalizedVolume}%`;
    }

    // 根据音量计算目标速度
    const threshold = 5;
    let targetSpeed = 0;
    if (normalizedVolume > threshold) {
      targetSpeed = (normalizedVolume - threshold) * 0.25; // 调整系数以控制最高速度
    }

    // 应用平滑加速/减速（物理惯性和摩擦力）
    // 如果目标速度大于当前速度（吹气），则加速相对较快；如果是停止吹气，则施加摩擦力缓慢减速
    if (targetSpeed > speedRef.current) {
      speedRef.current += (targetSpeed - speedRef.current) * 0.1; // 加速度
    } else {
      speedRef.current *= 0.98; // 摩擦力系数，越接近1减速越慢
    }

    // 防止浮点数导致永远不完全停止
    if (speedRef.current < 0.05) {
      speedRef.current = 0;
    }

    // 旋转风车
    rotationRef.current = (rotationRef.current + speedRef.current) % 360;

    if (windmillRef.current) {
      windmillRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
    }

    // 播放音乐逻辑
    // 根据当前真实速度 speedRef.current 决定播放频率
    if (speedRef.current > 1) { // 只有达到一定速度才播放
      const now = performance.now();
      // 速度范围大概是 0 到 20。我们让音符间隔在 100ms 到 500ms 之间
      const noteInterval = Math.max(100, 500 - speedRef.current * 20);

      if (now - lastNoteTimeRef.current > noteInterval) {
        // 播放下一个音符
        const freq = PENTATONIC_SCALE[noteIndexRef.current % PENTATONIC_SCALE.length];
        playNote(freq, 'sine');
        noteIndexRef.current += 1;
        lastNoteTimeRef.current = now;
      }
    }

    animationRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    return () => {
      // 组件卸载时清理
      stopListening();
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>声控音乐风车</h1>

      <div className={styles.instructions}>
        对着麦克风吹气或发出声音！<br />
        声音越大，风车转得越快，音乐也越欢快！
      </div>

      <div className={styles.windmillContainer}>
        <div
          className={styles.bladesWrapper}
          ref={windmillRef}
          style={{ transform: `rotate(${rotationRef.current}deg)` }}
        >
          <div className={`${styles.blade} ${styles.blade1}`}></div>
          <div className={`${styles.blade} ${styles.blade2}`}></div>
          <div className={`${styles.blade} ${styles.blade3}`}></div>
          <div className={`${styles.blade} ${styles.blade4}`}></div>
          <div className={styles.centerDot}></div>
        </div>
        <div className={styles.post}></div>
      </div>

      <div className={styles.controls}>
        {!isListening ? (
          <button className={styles.startButton} onClick={startListening}>
            启动风车 (允许麦克风)
          </button>
        ) : (
          <button className={styles.startButton} onClick={stopListening} style={{ backgroundColor: '#ff6b6b' }}>
            停止风车
          </button>
        )}
      </div>

      {isListening && (
        <div className={styles.volumeMeter}>
          <div
            className={styles.volumeBar}
            ref={volumeBarRef}
            style={{ width: '0%' }}
          ></div>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      <Link to="/" className={styles.backLink}>返回主页</Link>
    </div>
  );
};

export default VoiceWindmillGame;