import React, { useState } from 'react';
import styles from '../styles/DemoWrapper.module.css';

const DemoWrapper = ({ title, description, ReanimatedComponent, GsapComponent }) => {
  const [viewMode, setViewMode] = useState('split'); // 'split', 'reanimated', 'gsap'

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {description && <p style={{ color: '#718096', margin: '8px 0 0' }}>{description}</p>}
        </div>
        <div className={styles.controls}>
          <button
            className={`${styles.controlButton} ${viewMode === 'reanimated' ? styles.activeControl : ''}`}
            onClick={() => setViewMode('reanimated')}
          >
            Reanimated v3
          </button>
          <button
            className={`${styles.controlButton} ${viewMode === 'gsap' ? styles.activeControl : ''}`}
            onClick={() => setViewMode('gsap')}
          >
            GSAP
          </button>
          <button
            className={`${styles.controlButton} ${viewMode === 'split' ? styles.activeControl : ''}`}
            onClick={() => setViewMode('split')}
          >
            Split View
          </button>
        </div>
      </header>

      <div className={`${styles.demoContainer} ${viewMode === 'split' ? styles.splitView : ''}`}>

        {/* Reanimated Section */}
        {(viewMode === 'reanimated' || viewMode === 'split') && (
          <div className={styles.demoBox}>
            <div className={styles.boxHeader}>
              <h3 className={styles.boxTitle}>
                <span className={`${styles.badge} ${styles.reanimatedBadge}`}>RN Reanimated v3</span>
                Implementation
              </h3>
            </div>
            <div className={styles.canvas}>
              {ReanimatedComponent && <ReanimatedComponent />}
            </div>
          </div>
        )}

        {/* GSAP Section */}
        {(viewMode === 'gsap' || viewMode === 'split') && (
          <div className={styles.demoBox}>
            <div className={styles.boxHeader}>
              <h3 className={styles.boxTitle}>
                <span className={`${styles.badge} ${styles.gsapBadge}`}>GSAP</span>
                Implementation
              </h3>
            </div>
            <div className={styles.canvas}>
              {GsapComponent && <GsapComponent />}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DemoWrapper;
