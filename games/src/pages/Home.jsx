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
        <Link to="/tilt" className={styles.linkButton} style={{ marginTop: '16px' }}>
          进入“重力收集”游戏
        </Link>
      </div>
    </div>
  );
};

export default Home;