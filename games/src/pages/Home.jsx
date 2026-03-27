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
          重力音乐球 (全年龄环绕)
        </Link>
        <Link to="/rollball" className={styles.linkButton}>
          进入“平衡滚球”游戏
        </Link>
        <Link to="/catch" className={`${styles.linkButton} ${styles.orangeButton}`}>
          进入“重力接球”游戏
        </Link>
        <Link to="/orientation" className={`${styles.linkButton} ${styles.greenButton}`}>
          进入“重力感应滚球”游戏
        </Link>
        <Link to="/compass" className={styles.linkButton}>
          进入“魔法指南针”游戏
        </Link>
        <Link to="/geocache" className={`${styles.linkButton} ${styles.gravityBtn}`}>
          进入“地理寻宝”游戏
        </Link>
        <Link to="/starcatcher" className={`${styles.linkButton} ${styles.darkButton}`}>
          进入“全景捕星星”游戏
        </Link>
        <Link to="/windmill" className={`${styles.linkButton} ${styles.greenButton}`}>
          进入“声控音乐风车”游戏
        </Link>
        <Link to="/lightcatcher" className={`${styles.linkButton} ${styles.goldButton}`}>
          进入“捕光者”游戏 (重力&时间)
        </Link>
        <Link to="/voiceballoon" className={`${styles.linkButton} ${styles.orangeButton}`}>
          进入“声控吹气球”游戏 (全年龄段)
        </Link>
        <Link to="/photogift" className={`${styles.linkButton} ${styles.pinkButton}`}>
          进入“照片寻宝”游戏 (🎁)
        </Link>
      </div>
    </div>
  );
};

export default Home;
