import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './OrientationGame.module.less';

// 辅助函数：生成范围内随机数
const random = (min, max) => Math.random() * (max - min) + min;

const BALL_SIZE = 40; // 小球大小
const FOOD_SIZE = 20; // 食物大小

const OrientationGame = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [score, setScore] = useState(0);

  const containerRef = useRef(null);
  const ballRef = useRef(null);
  const foodRef = useRef(null);

  // 小球的逻辑位置
  const ballPosRef = useRef({ x: 50, y: 50 }); // 百分比 0-100
  // 食物的逻辑位置
  const foodPosRef = useRef({ x: 0, y: 0 }); // 百分比 0-100

  // 速度
  const velocityRef = useRef({ vx: 0, vy: 0 });

  // 动画帧 ID
  const requestRef = useRef();

  useEffect(() => {
    // 检查是否需要专门请求权限 (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      // 非 iOS 13+，默认授权或直接监听
      setPermissionGranted(true);
    }

    // 初始化食物位置
    spawnFood();
  }, []);

  const spawnFood = () => {
    const newFoodX = random(10, 90);
    const newFoodY = random(10, 90);
    foodPosRef.current = { x: newFoodX, y: newFoodY };

    // 更新食物位置的 DOM
    if (foodRef.current) {
      gsap.set(foodRef.current, {
        x: `${newFoodX}vw`,
        y: `${newFoodY}vh`,
        scale: 0, // 初始化 scale 0 然后弹出来
      });

      gsap.to(foodRef.current, {
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  };

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event) => {
      // beta: 前后倾斜 [-180, 180] (手机顶部向地倾斜为正)
      // gamma: 左右倾斜 [-90, 90] (手机右侧向地倾斜为正)
      const beta = event.beta;
      const gamma = event.gamma;

      if (beta === null || gamma === null) return;

      // 调整灵敏度
      const maxTilt = 45;

      // 限制倾斜角度在 [-maxTilt, maxTilt] 范围内
      let cappedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta));
      let cappedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));

      // 转换为速度，这里设定最大速度为 0.5 (百分比单位/帧)
      // 这里的数值可以根据实际体验调整
      velocityRef.current.vy = (cappedBeta / maxTilt) * 0.5;
      velocityRef.current.vx = (cappedGamma / maxTilt) * 0.5;
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  useEffect(() => {
    if (!permissionGranted) return;

    const update = () => {
      // 1. 更新逻辑位置
      let newX = ballPosRef.current.x + velocityRef.current.vx;
      let newY = ballPosRef.current.y + velocityRef.current.vy;

      // 2. 边界碰撞检测 (0-100 vw/vh)
      // 需要考虑小球自身的宽度，暂时简化为 0-100 的百分比中心点。
      // 为了防止超出屏幕，限制在 [2, 98] 或类似范围
      if (newX < 2) {
        newX = 2;
        velocityRef.current.vx = 0; // 碰到边界速度归零
      } else if (newX > 98) {
        newX = 98;
        velocityRef.current.vx = 0;
      }

      if (newY < 2) {
        newY = 2;
        velocityRef.current.vy = 0;
      } else if (newY > 98) {
        newY = 98;
        velocityRef.current.vy = 0;
      }

      ballPosRef.current = { x: newX, y: newY };

      // 3. 更新 DOM 位置
      if (ballRef.current) {
        gsap.set(ballRef.current, {
          x: `${newX}vw`,
          y: `${newY}vh`
        });
      }

      // 4. 吃食物检测 (碰撞检测)
      checkCollision();

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [permissionGranted]);

  const checkCollision = () => {
    const ball = ballPosRef.current;
    const food = foodPosRef.current;

    // 计算距离，此处简化为基于百分比的距离估算。
    // 在正方形屏幕上，vw 和 vh 大致可以用来算距离。如果是长方形屏幕，会有误差。
    // 为了更精确，可以获取屏幕宽高，把百分比转为 px 再算距离。这里用简化距离。
    const dx = ball.x - food.x;
    const dy = ball.y - food.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 假设相距小于 5 个百分点算吃到了
    if (distance < 5) {
      handleEatFood();
    }
  };

  const handleEatFood = () => {
    // 增加分数
    setScore(s => s + 1);

    // 立即将食物的逻辑坐标移出屏幕或设定为一个不可能达到的值，防止动画期间连续多次触发碰撞
    foodPosRef.current = { x: -100, y: -100 };

    // 小球吃东西动画
    if (ballRef.current) {
      gsap.to(ballRef.current, {
        scale: 1.5,
        duration: 0.15,
        yoyo: true,
        repeat: 1
      });
    }

    // 食物消失并重生动画
    if (foodRef.current) {
      gsap.to(foodRef.current, {
        scale: 0,
        duration: 0.2,
        onComplete: () => {
          spawnFood();
        }
      });
    }

    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const requestPermission = async () => {
    try {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          setNeedsPermission(false);
          spawnFood(); // 重新生成食物显示
        } else {
          alert('需要方向感应器权限才能体验重力滚球哦');
        }
      }
    } catch (error) {
      console.error('Request permission error:', error);
      alert('获取权限失败');
    }
  };

  // 供电脑调试使用：点击屏幕任意位置移动小球
  const handleDebugClick = (e) => {
    if (!permissionGranted && needsPermission) return;

    // 获取点击位置相对于窗口的百分比
    const clickX = (e.clientX / window.innerWidth) * 100;
    const clickY = (e.clientY / window.innerHeight) * 100;

    // 给小球一个指向点击位置的速度
    const dx = clickX - ballPosRef.current.x;
    const dy = clickY - ballPosRef.current.y;

    // 限制单次加速大小
    velocityRef.current.vx += dx * 0.05;
    velocityRef.current.vy += dy * 0.05;
  };

  return (
    <div className={styles.container} onClick={handleDebugClick} ref={containerRef}>
      {needsPermission && !permissionGranted && (
        <div className={styles.overlay}>
          <button className={styles.startButton} onClick={requestPermission}>
            开始游戏 (允许重力感应)
          </button>
        </div>
      )}

      <div className={styles.scoreBoard}>
        Score: {score}
      </div>

      <div
        ref={foodRef}
        className={styles.food}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: FOOD_SIZE,
          height: FOOD_SIZE,
          marginLeft: -FOOD_SIZE / 2, // 居中
          marginTop: -FOOD_SIZE / 2,
        }}
      />

      <div
        ref={ballRef}
        className={styles.ball}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: BALL_SIZE,
          height: BALL_SIZE,
          marginLeft: -BALL_SIZE / 2, // 居中
          marginTop: -BALL_SIZE / 2,
        }}
      />

      {!needsPermission && (
         <div className={styles.hint}>倾斜手机(或点击屏幕)控制小球</div>
      )}
    </div>
  );
};

export default OrientationGame;