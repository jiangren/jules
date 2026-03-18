// 延迟初始化的全局 AudioContext 实例
let audioCtx = null;

/**
 * 初始化并返回 AudioContext 实例。
 * 必须在用户交互（如点击按钮）时调用，以符合浏览器的自动播放策略。
 */
export const initAudioContext = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    } else {
      console.warn("Web Audio API is not supported in this browser");
      return null;
    }
  }

  // 某些浏览器（如 iOS Safari）在非交互状态下创建的 AudioContext 会处于 suspended 状态
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  return audioCtx;
};

/**
 * 播放一个合成音符
 * @param {number} frequency 频率（赫兹）
 * @param {string} type 波形类型（'sine', 'square', 'sawtooth', 'triangle'）
 */
export const playNote = (frequency = 440, type = 'sine') => {
  if (!audioCtx) {
    console.warn("AudioContext not initialized. Call initAudioContext() on user interaction first.");
    return;
  }

  // 确保处于 active 状态
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // 创建振荡器和增益节点
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // 配置波形和频率
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  // 设置音量包络线，实现淡入淡出，避免“咔哒”声
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

  // 连接节点
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // 播放并在一小段时间后停止
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.5);
};
