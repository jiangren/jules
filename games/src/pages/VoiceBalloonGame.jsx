import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './VoiceBalloonGame.module.less';
import { initAudioContext, playNote } from '../audio';

const MAX_BALLOON_SCALE = 5; // 气球最大缩放倍数
const GROW_SPEED = 0.05; // 气球充气速度
const DEFLATE_SPEED = 0.02; // 气球漏气速度

const VoiceBalloonGame = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [score, setScore] = useState(0);
  const [needsPermission, setNeedsPermission] = useState(true);

  const containerRef = useRef(null);
  const balloonRef = useRef(null);

  const scaleRef = useRef(1);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const requestRef = useRef();

  // 清理音频流和上下文
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (microphoneRef.current) {
        microphoneRef.current.mediaStream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
         // Do not close global shared audio context aggressively
      }
    };
  }, []);

  const requestPermission = async () => {
    try {
      // 初始化全局音频上下文以符合自动播放策略
      initAudioContext();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 创建局部音频处理节点（不需要关闭全局Context，只断开节点）
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const actx = new AudioContextClass();
      audioContextRef.current = actx;

      const analyser = actx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const microphone = actx.createMediaStreamSource(stream);
      microphone.connect(analyser);
      microphoneRef.current = microphone;

      setPermissionGranted(true);
      setNeedsPermission(false);

      // 开始检测音量
      startDetection();

    } catch (err) {
      console.error('获取麦克风权限失败:', err);
      alert('需要麦克风权限才能玩声控吹气球哦！');
    }
  };

  const startDetection = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const update = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // 计算平均音量
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const averageVolume = sum / dataArray.length;

      // 如果音量超过阈值，气球变大
      if (averageVolume > 30) {
        // 音量越大，长得越快
        const growth = (averageVolume - 30) / 100 * GROW_SPEED;
        scaleRef.current += growth;
      } else {
        // 没吹气时慢慢变小，但不小于1
        if (scaleRef.current > 1) {
          scaleRef.current -= DEFLATE_SPEED;
        }
      }

      // 达到爆炸极限
      if (scaleRef.current >= MAX_BALLOON_SCALE) {
        explodeBalloon();
        return; // 暂停更新，等待重新生成
      }

      // 更新DOM
      if (balloonRef.current) {
        gsap.set(balloonRef.current, {
          scale: scaleRef.current,
        });
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
  };

  const explodeBalloon = () => {
    // 增加分数
    setScore(s => s + 1);

    // 播放音符
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const freq = frequencies[score % frequencies.length];
    playNote(freq, 'triangle');

    // 震动
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // 爆炸动画
    if (balloonRef.current) {
      gsap.to(balloonRef.current, {
        scale: MAX_BALLOON_SCALE * 1.5,
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          // 重置气球
          scaleRef.current = 1;
          gsap.set(balloonRef.current, { scale: 1, opacity: 1 });
          // 继续检测
          startDetection();
        }
      });
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {needsPermission && !permissionGranted && (
        <div className={styles.overlay}>
          <button className={styles.startButton} onClick={requestPermission}>
            开始游戏 (允许麦克风)
          </button>
        </div>
      )}

      <div className={styles.hint}>
        对着手机吹气或大声喊叫，<br />把气球吹爆吧！
      </div>

      <div className={styles.scoreBoard}>
        爆炸次数: {score}
      </div>

      <div className={styles.balloonWrapper}>
        <div ref={balloonRef} className={styles.balloon}></div>
      </div>
    </div>
  );
};

export default VoiceBalloonGame;
