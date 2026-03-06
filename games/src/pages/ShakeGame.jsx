import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './ShakeGame.module.less';

const SHAKE_THRESHOLD = 15; // 摇动阈值

// 辅助函数：生成范围内的随机数
const random = (min, max) => Math.random() * (max - min) + min;

// 辅助函数：生成随机颜色
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// 辅助函数：生成随机形状 (圆形，正方形，三角形)
const getRandomShapeClass = () => {
  const shapes = [styles.circle, styles.square, styles.triangle];
  return shapes[Math.floor(Math.random() * shapes.length)];
};

const ShakeGame = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [elements, setElements] = useState([]);

  const containerRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const lastAccRef = useRef({ x: 0, y: 0, z: 0 });
  const isAnimatingRef = useRef(false);

  // 初始化随机元素
  useEffect(() => {
    const numElements = Math.floor(random(5, 11)); // 5-10个元素
    const newElements = Array.from({ length: numElements }).map((_, id) => ({
      id,
      shapeClass: getRandomShapeClass(),
      color: getRandomColor(),
      x: random(10, 80), // 百分比
      y: random(10, 80), // 百分比
      scale: random(0.5, 1.5),
      rotation: random(0, 360)
    }));
    setElements(newElements);

    // 检查是否需要专门请求权限 (iOS 13+)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      // 非 iOS 13+ 或不支持的设备，默认认为已授权（或直接监听）
      setPermissionGranted(true);
    }
  }, []);

  // 监听摇动事件
  useEffect(() => {
    if (!permissionGranted) return;

    const handleMotion = (event) => {
      const currentAcc = event.accelerationIncludingGravity;
      if (!currentAcc) return;

      const currentTime = new Date().getTime();
      const diffTime = currentTime - lastUpdateRef.current;

      if (diffTime > 100) { // 节流，每 100ms 检查一次
        if (lastAccRef.current.x !== null) {
          const deltaX = currentAcc.x - lastAccRef.current.x;
          const deltaY = currentAcc.y - lastAccRef.current.y;
          const deltaZ = currentAcc.z - lastAccRef.current.z;

          const speed = Math.abs(deltaX + deltaY + deltaZ) / diffTime * 10000;

          if (speed > SHAKE_THRESHOLD && !isAnimatingRef.current) {
            triggerShakeAnimation();
          }
        }

        lastAccRef.current = {
          x: currentAcc.x,
          y: currentAcc.y,
          z: currentAcc.z
        };
        lastUpdateRef.current = currentTime;
      }
    };

    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [permissionGranted]);

  const requestPermission = async () => {
    try {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          setNeedsPermission(false);
        } else {
          alert('需要加速度计权限才能体验摇一摇功能哦');
        }
      }
    } catch (error) {
      console.error('Request permission error:', error);
      alert('获取权限失败');
    }
  };

  const triggerShakeAnimation = () => {
    isAnimatingRef.current = true;

    // 强制重新生成新的位置、颜色、缩放
    const updatedElements = elements.map(el => ({
      ...el,
      color: getRandomColor(),
      targetX: random(5, 85),
      targetY: random(5, 85),
      targetScale: random(0.3, 2),
      targetRotation: el.rotation + random(180, 720)
    }));

    setElements(updatedElements);

    const q = gsap.utils.selector(containerRef.current);
    const targets = q(`.${styles.shapeItem}`);

    // 使用 GSAP 执行形变和位移动画
    gsap.to(targets, {
      duration: 0.8,
      ease: 'back.out(1.7)',
      x: (index) => `${updatedElements[index].targetX}vw`,
      y: (index) => `${updatedElements[index].targetY}vh`,
      scale: (index) => updatedElements[index].targetScale,
      rotation: (index) => updatedElements[index].targetRotation,
      backgroundColor: (index) => updatedElements[index].color,
      // 如果是三角形，其颜色是由 border-bottom-color 决定的，所以使用特殊逻辑
      borderBottomColor: (index) => updatedElements[index].color,
      stagger: 0.05,
      onComplete: () => {
        isAnimatingRef.current = false;
        // 尝试触发手机震动
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
    });
  };

  // 供电脑调试使用的点击触发
  const handleDebugClick = () => {
    if (!isAnimatingRef.current) {
      triggerShakeAnimation();
    }
  };

  return (
    <div className={styles.container} onClick={handleDebugClick}>
      {needsPermission && !permissionGranted && (
        <div className={styles.overlay}>
          <button className={styles.startButton} onClick={requestPermission}>
            开始游戏 (允许摇一摇)
          </button>
        </div>
      )}

      <div className={styles.gameArea} ref={containerRef}>
        {elements.map((el) => (
          <div
            key={el.id}
            className={`${styles.shapeItem} ${el.shapeClass}`}
            style={{
              // 初始状态用内联样式直接定位到百分比
              // 因为后续由 gsap 接管 transform，所以初始使用 absolute left/top 或让 gsap 设置初始值。
              // 这里我们直接用绝对定位的 top/left 设置初始位置，然后让 GSAP 动画改变相对的 x, y 或直接接管。
              position: 'absolute',
              left: 0,
              top: 0,
              // 使用 transform 初始化位置和状态，避免重新渲染导致跳动
              transform: `translate(${el.x}vw, ${el.y}vh) scale(${el.scale}) rotate(${el.rotation}deg)`,
              backgroundColor: el.shapeClass !== styles.triangle ? el.color : 'transparent',
              borderBottomColor: el.shapeClass === styles.triangle ? el.color : 'transparent',
            }}
          />
        ))}
      </div>

      {!needsPermission && (
         <div className={styles.hint}>摇动手机(或点击屏幕)体验形变和震动</div>
      )}
    </div>
  );
};

export default ShakeGame;