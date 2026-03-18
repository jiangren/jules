import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CatchGame.module.less';

const CatchGame = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const containerRef = useRef(null);
  const basketRef = useRef(null);
  const basketPos = useRef(50); // 篮子位置 0-100%
  const items = useRef([]); // 掉落物数组
  const requestRef = useRef();
  const timerRef = useRef();
  const lastTimeRef = useRef(0);

  // 监听设备方向
  useEffect(() => {
    const handleOrientation = (event) => {
      let gamma = event.gamma; // 左右倾斜角度, -90 到 90
      if (gamma === null) return;

      // 限制倾斜角度在 -45 到 45 之间，以避免旋转过度
      if (gamma > 45) gamma = 45;
      if (gamma < -45) gamma = -45;

      // 映射到 0-100% 范围，gamma 为 0 时为 50%
      let pos = 50 + (gamma / 45) * 50;
      basketPos.current = pos;

      if (basketRef.current) {
        basketRef.current.style.left = `${pos}%`;
      }
    };

    if (isPlaying) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isPlaying]);

  // 游戏循环
  useEffect(() => {
    if (!isPlaying) return;

    const createItem = () => {
      return {
        id: Math.random().toString(36).substring(2, 9),
        x: Math.random() * 90 + 5, // 5% 到 95% 之间
        y: -10, // 从屏幕上方 10px 处开始
        speed: Math.random() * 3 + 2, // 下落速度 2-5 像素/帧
        type: Math.random() > 0.2 ? 'apple' : 'bomb', // 80% 几率苹果，20% 炸弹
      };
    };

    const updateGame = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;

      // 每过大约 800ms 添加一个新物品
      if (time - lastTimeRef.current > 800) {
        items.current.push(createItem());
        lastTimeRef.current = time;
      }

      const container = containerRef.current;
      if (!container) return;

      const containerHeight = container.clientHeight;
      const basketRect = basketRef.current?.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      let currentScore = score;
      let scoreChanged = false;

      // 更新所有物品的位置
      items.current = items.current.filter((item) => {
        item.y += item.speed;

        // 获取该物品的 DOM
        const itemEl = document.getElementById(item.id);
        if (itemEl && basketRect) {
          itemEl.style.top = `${item.y}px`;

          const itemRect = itemEl.getBoundingClientRect();

          // 碰撞检测：判断是否碰到篮筐 (粗略)
          if (
            itemRect.bottom >= basketRect.top &&
            itemRect.top <= basketRect.bottom &&
            itemRect.right >= basketRect.left &&
            itemRect.left <= basketRect.right
          ) {
            // 撞到篮子了！
            if (item.type === 'apple') {
              setScore((prev) => prev + 10);
            } else if (item.type === 'bomb') {
              setScore((prev) => Math.max(0, prev - 20));
            }
            return false; // 移除物品
          }
        }

        // 飞出屏幕底部，移除物品
        if (item.y > containerHeight) {
          return false;
        }

        return true;
      });

      // 更新物品的 DOM 渲染（直接操作 DOM 提高性能）
      items.current.forEach((item) => {
        let el = document.getElementById(item.id);
        if (!el) {
          el = document.createElement('div');
          el.id = item.id;
          el.className = `${styles.item} ${item.type === 'apple' ? styles.apple : styles.bomb}`;
          el.style.left = `${item.x}%`;
          container.appendChild(el);
        }
        el.style.top = `${item.y}px`;
      });

      // 清理已经在 items 数组中不存在的 DOM
      const childNodes = Array.from(container.childNodes);
      childNodes.forEach(child => {
        if (child.id !== 'basket' && !items.current.find(i => i.id === child.id)) {
          container.removeChild(child);
        }
      });

      requestRef.current = requestAnimationFrame(updateGame);
    };

    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  // 倒计时
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    // 检查是否需要请求设备权限 (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            initGame();
          } else {
            alert('需要重力感应权限才能进行游戏！');
          }
        })
        .catch(console.error);
    } else {
      // 非 iOS 13+ 设备
      initGame();
    }
  };

  const initGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    items.current = [];

    if (containerRef.current) {
      // 清理已有的 item DOM
      const childNodes = Array.from(containerRef.current.childNodes);
      childNodes.forEach(child => {
        if (child.id !== 'basket') {
          containerRef.current.removeChild(child);
        }
      });
    }

    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    cancelAnimationFrame(requestRef.current);
    clearInterval(timerRef.current);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.score}>得分: {score}</div>
        <div className={styles.time}>时间: {timeLeft}s</div>
      </div>

      <div className={styles.gameArea} ref={containerRef}>
        <div id="basket" className={styles.basket} ref={basketRef}>
          🧺
        </div>
      </div>

      {(!isPlaying && !gameOver) && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>🍎 重力接球 💣</h2>
            <p>左右倾斜手机来控制篮子，接住苹果获得 10 分，接到炸弹扣除 20 分！你有 30 秒时间挑战！</p>
            <button className={styles.startBtn} onClick={startGame}>开始游戏</button>
            <button className={styles.backBtn} onClick={() => navigate('/')}>返回主页</button>
          </div>
        </div>
      )}

      {gameOver && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>游戏结束</h2>
            <p>你的最终得分是: <span className={styles.finalScore}>{score}</span></p>
            <button className={styles.startBtn} onClick={startGame}>再玩一次</button>
            <button className={styles.backBtn} onClick={() => navigate('/')}>返回主页</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatchGame;
