import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.less';

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>H5 游戏中心</h1>
      <div className={styles.menu}>
        <Link to="/shake" className={styles.linkButton}>
          进入“摇一摇”游戏
        </Link>
        <Link to="/gravity" className={`${styles.linkButton} ${styles.gravityBtn}`}>
          重力音乐球 (全年龄)
        </Link>
        <Link to="/rollball" className={styles.linkButton}>
          进入“平衡滚球”游戏
        </Link>
        <Link to="/catch" className={styles.linkButton} style={{ marginTop: '15px' }}>
          进入“重力接球”游戏
        </Link>
        <Link to="/orientation" className={`${styles.linkButton} ${styles.greenButton}`}>
          进入“重力感应滚球”游戏
        </Link>
        <Link to="/compass" className={styles.linkButton} style={{ marginTop: '15px' }}>
          进入“魔法指南针”游戏
        </Link>
        <Link to="/geocache" className={`${styles.linkButton} ${styles.gravityBtn}`} style={{ marginTop: '15px' }}>
          进入“地理寻宝”游戏
        </Link>
        <Link to="/lightcatcher" className={`${styles.linkButton} ${styles.greenButton}`} style={{ marginTop: '15px', background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#333' }}>
          进入“捕光者”游戏 (重力&时间)
        </Link>
      </div>
    </div>
  );
};

export default Home;
