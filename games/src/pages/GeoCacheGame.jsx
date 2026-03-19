import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GeoCacheGame.module.less';
import { initAudioContext, playNote } from '../audio';

// 使用 Haversine 公式计算两个经纬度之间的距离（单位：米）
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // 地球半径，单位米
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const GeoCacheGame = () => {
  const navigate = useNavigate();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 寻宝模式状态
  const [isFindingMode, setIsFindingMode] = useState(false);
  const [foundTreasure, setFoundTreasure] = useState(null);

  // 藏宝模式状态
  const [isHidingMode, setIsHidingMode] = useState(false);
  const [hideMessage, setHideMessage] = useState('');

  const [watchId, setWatchId] = useState(null);

  // 初始化 Audio
  const handleInteract = () => {
    initAudioContext();
  };

  const startWatchingLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('你的浏览器不支持地理位置定位。');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });
        setErrorMsg('');

        // 如果在寻宝模式下，检查是否靠近宝藏
        if (isFindingMode) {
          checkTreasures(latitude, longitude);
        }
      },
      (error) => {
        console.error(error);
        setErrorMsg('获取位置失败: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    );
    setWatchId(id);
  };

  useEffect(() => {
    startWatchingLocation();
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFindingMode]); // 重新监听以防模式改变

  const checkTreasures = (lat, lon) => {
    const savedTreasures = JSON.parse(localStorage.getItem('geoTreasures') || '[]');
    let found = null;

    for (const treasure of savedTreasures) {
      const distance = getDistance(lat, lon, treasure.lat, treasure.lon);
      // 如果距离小于 50 米，认为找到了宝藏
      if (distance <= 50) {
        found = treasure;
        break;
      }
    }

    if (found && !foundTreasure) {
      setFoundTreasure(found);
      // 播放发现音效
      playNote(880, 'sine');
      setTimeout(() => playNote(1046.5, 'sine'), 150);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } else if (!found && foundTreasure) {
      // 走远了
      setFoundTreasure(null);
    }
  };

  const handleHideTreasure = () => {
    if (!currentPosition) {
      setErrorMsg('还未获取到当前位置，无法藏宝。');
      return;
    }
    if (!hideMessage.trim()) {
      setErrorMsg('请输入宝藏留言。');
      return;
    }

    const newTreasure = {
      id: Date.now(),
      lat: currentPosition.latitude,
      lon: currentPosition.longitude,
      message: hideMessage,
      timestamp: new Date().toISOString()
    };

    const savedTreasures = JSON.parse(localStorage.getItem('geoTreasures') || '[]');
    savedTreasures.push(newTreasure);
    localStorage.setItem('geoTreasures', JSON.stringify(savedTreasures));

    alert('藏宝成功！其他人来到这里就可以发现它。');
    setIsHidingMode(false);
    setHideMessage('');
    playNote(440, 'triangle');
  };

  const clearTreasures = () => {
    if(window.confirm('确定要清除所有本地保存的宝藏记录吗？')) {
        localStorage.removeItem('geoTreasures');
        alert('已清除所有宝藏。');
    }
  };

  return (
    <div className={styles.container} onClick={handleInteract}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        返回首页
      </button>

      <h1 className={styles.title}>📍 地理寻宝</h1>

      {errorMsg && <div className={styles.error}>{errorMsg}</div>}

      <div className={styles.locationBox}>
        <h3>你的当前位置</h3>
        {currentPosition ? (
          <p>
            纬度: {currentPosition.latitude.toFixed(5)}<br/>
            经度: {currentPosition.longitude.toFixed(5)}
          </p>
        ) : (
          <p>正在获取定位...</p>
        )}
      </div>

      {!isFindingMode && !isHidingMode && (
        <div className={styles.menu}>
          <button className={styles.actionBtn} onClick={() => setIsHidingMode(true)}>
            埋藏宝藏
          </button>
          <button className={`${styles.actionBtn} ${styles.findBtn}`} onClick={() => setIsFindingMode(true)}>
            开始寻宝
          </button>
          <button className={styles.clearBtn} onClick={clearTreasures} style={{marginTop: '20px'}}>
            清除数据
          </button>
        </div>
      )}

      {isHidingMode && (
        <div className={styles.hideArea}>
          <h2>埋藏一个虚拟宝藏</h2>
          <p>它将被放置在您当前的经纬度。</p>
          <textarea
            className={styles.textArea}
            placeholder="留下一句话或一个小故事..."
            value={hideMessage}
            onChange={(e) => setHideMessage(e.target.value)}
          />
          <div className={styles.btnGroup}>
            <button className={styles.actionBtn} onClick={handleHideTreasure}>埋下宝藏</button>
            <button className={styles.cancelBtn} onClick={() => setIsHidingMode(false)}>取消</button>
          </div>
        </div>
      )}

      {isFindingMode && (
        <div className={styles.findArea}>
          <h2>寻宝模式开启</h2>
          <p>在现实世界中走动，当靠近宝藏 (50米内) 时会收到提示！</p>

          <div className={styles.radar}></div>

          {foundTreasure ? (
            <div className={styles.treasureFound}>
              <h3>✨ 发现宝藏 ✨</h3>
              <div className={styles.messageCard}>
                "{foundTreasure.message}"
              </div>
              <p className={styles.timeStr}>埋藏时间: {new Date(foundTreasure.timestamp).toLocaleString()}</p>
            </div>
          ) : (
            <p className={styles.scanningText}>正在扫描附近区域...</p>
          )}

          <button className={styles.cancelBtn} style={{marginTop: '30px'}} onClick={() => {
              setIsFindingMode(false);
              setFoundTreasure(null);
          }}>
            退出寻宝
          </button>
        </div>
      )}
    </div>
  );
};

export default GeoCacheGame;