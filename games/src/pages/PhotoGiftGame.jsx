import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import styles from './PhotoGiftGame.module.less';

// 步骤枚举
const STEPS = {
  HOME: 'HOME',
  A_CAMERA: 'A_CAMERA', // A 拍照
  A_SET_GIFT: 'A_SET_GIFT', // A 放置礼物
  B_HOME: 'B_HOME', // B 准备
  B_CAMERA: 'B_CAMERA', // B 找礼物拍照
  RESULT: 'RESULT', // 结果判定
};

const PhotoGiftGame = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(STEPS.HOME);

  // A 的状态
  const [photoA, setPhotoA] = useState(null);
  const [giftPos, setGiftPos] = useState(null); // { x: %, y: % }

  // B 的状态
  const [photoB, setPhotoB] = useState(null);
  const [similarity, setSimilarity] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 摄像头相关
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // 动画相关
  const giftRef = useRef(null);
  const resultGiftRef = useRef(null);

  // 初始化摄像头
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera access denied or error:", err);
      alert("无法访问摄像头，请检查权限。");
    }
  };

  // 停止摄像头
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // 拍照 (返回 base64)
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // 清理摄像头
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // 当步骤切换到需要摄像头的步骤时，启动摄像头
  useEffect(() => {
    if (currentStep === STEPS.A_CAMERA || currentStep === STEPS.B_CAMERA) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [currentStep]);

  // A 拍照
  const handleACapture = () => {
    const dataUrl = capturePhoto();
    if (dataUrl) {
      setPhotoA(dataUrl);
      setCurrentStep(STEPS.A_SET_GIFT);
    }
  };

  // A 点击屏幕放置礼物
  const handlePhotoClick = (e) => {
    if (currentStep !== STEPS.A_SET_GIFT) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGiftPos({ x, y });

    // 简单的缩放出现动画
    setTimeout(() => {
      if (giftRef.current) {
        gsap.fromTo(giftRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }, 0);
  };

  // A 完成设置
  const handleAFinish = () => {
    if (!giftPos) {
      alert('请先在照片上点击任意位置放置一个礼物！');
      return;
    }
    setCurrentStep(STEPS.B_HOME);
  };

  // B 拍照并开始比对
  const handleBCapture = () => {
    const dataUrl = capturePhoto();
    if (dataUrl) {
      setPhotoB(dataUrl);
      setIsProcessing(true);
      setCurrentStep(STEPS.RESULT);

      // 模拟请求 AI API 的过程
      mockAIApiCall(photoA, dataUrl).then(score => {
        setIsProcessing(false);
        setSimilarity(score);
        const success = score >= 80;
        setIsSuccess(success);

        if (success) {
          // 成功弹出礼物的动画
          setTimeout(() => {
            if (resultGiftRef.current) {
              gsap.fromTo(resultGiftRef.current,
                { scale: 0, y: 50, opacity: 0 },
                { scale: 1.5, y: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
              );
            }
          }, 100);
        }
      });
    }
  };

  // TODO: AI 相似度计算接口预留点 (当前使用 Mock)
  const mockAIApiCall = async (imgA, imgB) => {
    return new Promise(resolve => {
      setTimeout(() => {
        // 这里留空真实请求，返回一个固定或随机的分数，模拟 85% 成功率 (方便测试)
        // const score = Math.floor(Math.random() * 40) + 60; // 60 ~ 100
        const score = 85; // 固定给成功，方便测试后续流程
        resolve(score);
      }, 1500);
    });
  };

  // B 重试
  const handleBRetry = () => {
    setPhotoB(null);
    setSimilarity(0);
    setIsSuccess(false);
    setCurrentStep(STEPS.B_CAMERA);
  };

  // 重新开始游戏
  const handleRestart = () => {
    setPhotoA(null);
    setPhotoB(null);
    setGiftPos(null);
    setSimilarity(0);
    setIsSuccess(false);
    setCurrentStep(STEPS.HOME);
  };

  return (
    <div className={styles.container}>
      {/* 隐藏的 Canvas 用于截图 */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* --- Step 1: 首页 --- */}
      {currentStep === STEPS.HOME && (
        <div className={styles.screen}>
          <h1 className={styles.title}>🎁 藏礼物大作战</h1>
          <p className={styles.desc}>单机双人互动小游戏，A 藏 B 找！</p>
          <button className={styles.btnPrimary} onClick={() => setCurrentStep(STEPS.A_CAMERA)}>
            A：开始藏礼物
          </button>
          <button className={styles.btnBack} onClick={() => navigate('/')}>
            返回大厅
          </button>
        </div>
      )}

      {/* --- Step 2: A 拍照 --- */}
      {currentStep === STEPS.A_CAMERA && (
        <div className={styles.screen}>
          <div className={styles.cameraView}>
            <video ref={videoRef} className={styles.videoElement} playsInline muted />
            <div className={styles.cameraOverlay}>
              <div className={styles.instruction}>A，拍一张照片作为藏宝地！</div>
            </div>
          </div>
          <div className={styles.controls}>
            <button className={styles.btnCapture} onClick={handleACapture}>
              📸 拍照
            </button>
          </div>
        </div>
      )}

      {/* --- Step 3: A 放置礼物 --- */}
      {currentStep === STEPS.A_SET_GIFT && (
        <div className={styles.screen}>
          <div className={styles.photoView} onClick={handlePhotoClick}>
            <img src={photoA} alt="Location" className={styles.photoImg} />
            {giftPos && (
              <div
                ref={giftRef}
                className={styles.giftIcon}
                style={{ left: `${giftPos.x}%`, top: `${giftPos.y}%` }}
              >
                🎁
              </div>
            )}
            <div className={styles.instructionTop}>点击屏幕放置礼物</div>
          </div>
          <div className={styles.controls}>
            <button className={styles.btnSecondary} onClick={() => {setGiftPos(null); setCurrentStep(STEPS.A_CAMERA);}}>
              🔄 重拍
            </button>
            <button className={styles.btnPrimary} onClick={handleAFinish}>
              ✅ 藏好了
            </button>
          </div>
        </div>
      )}

      {/* --- Step 4: B 准备界面 --- */}
      {currentStep === STEPS.B_HOME && (
        <div className={styles.screen}>
          <h1 className={styles.title}>🤫 藏好啦！</h1>
          <p className={styles.desc}>请把手机交给 B 小朋友<br/>让他/她去找找看吧！</p>
          <button className={styles.btnPrimary} onClick={() => setCurrentStep(STEPS.B_CAMERA)}>
            B：我准备好啦
          </button>
        </div>
      )}

      {/* --- Step 5: B 拍照找礼物 --- */}
      {currentStep === STEPS.B_CAMERA && (
        <div className={styles.screen}>
          <div className={styles.cameraView}>
            <video ref={videoRef} className={styles.videoElement} playsInline muted />
            <div className={styles.cameraOverlay}>
              <div className={styles.instruction}>B，走到 A 藏礼物的地方拍一张！</div>
            </div>
          </div>
          <div className={styles.controls}>
            <button className={styles.btnCapture} onClick={handleBCapture}>
              📸 就是这儿
            </button>
          </div>
        </div>
      )}

      {/* --- Step 6: 结果判定 --- */}
      {currentStep === STEPS.RESULT && (
        <div className={styles.screen}>
          <div className={styles.photoView}>
            <img src={photoB} alt="Result" className={styles.photoImg} />

            {/* 正在处理 */}
            {isProcessing && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>AI 正在对比图片重合度...</p>
              </div>
            )}

            {/* 成功：展示礼物 */}
            {!isProcessing && isSuccess && (
              <div
                ref={resultGiftRef}
                className={styles.giftIconResult}
                style={{ left: `${giftPos.x}%`, top: `${giftPos.y}%` }}
              >
                🎁
              </div>
            )}
          </div>

          {!isProcessing && (
            <div className={styles.resultPanel}>
              <h2 className={isSuccess ? styles.successText : styles.failText}>
                {isSuccess ? '🎉 找到礼物啦！' : '😢 好像不是这里哦...'}
              </h2>
              <p>图片重合度: {similarity}% (需要 {'>'} 80%)</p>
              <div className={styles.controlsRow}>
                {!isSuccess && (
                  <button className={styles.btnPrimary} onClick={handleBRetry}>
                    再试一次
                  </button>
                )}
                <button className={styles.btnSecondary} onClick={handleRestart}>
                  再玩一局
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default PhotoGiftGame;
