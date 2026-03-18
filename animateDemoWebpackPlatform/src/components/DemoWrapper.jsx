import React, { useState } from 'react';
import styles from '../styles/DemoWrapper.module.css';
import { extractComponentCode } from '../utils/codeUtils';

const DemoWrapper = ({ title, description, ReanimatedComponent, GsapComponent, rawCode }) => {
  const [viewMode, setViewMode] = useState('split'); // 'split', 'reanimated', 'gsap'
  const [showCode, setShowCode] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  const reanimatedName = ReanimatedComponent?.displayName || ReanimatedComponent?.name;
  const gsapName = GsapComponent?.displayName || GsapComponent?.name;

  const reanimatedCode = extractComponentCode(rawCode, reanimatedName);
  const gsapCode = extractComponentCode(rawCode, gsapName);

  const handleCopy = (code, type) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopyStatus(type);
      setTimeout(() => setCopyStatus(''), 2000);
    });
  };

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
          <button
            className={`${styles.controlButton} ${showCode ? styles.activeControl : ''}`}
            onClick={() => setShowCode(!showCode)}
            style={{ marginLeft: '4px', borderLeft: '1px solid #e2e8f0' }}
          >
            {showCode ? 'Hide Code' : 'View Code'}
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

            {!showCode ? (
              <div className={styles.canvas}>
                {ReanimatedComponent && <ReanimatedComponent />}
              </div>
            ) : (
              <div className={styles.codeSection}>
                <div className={styles.codeHeader}>
                  <span>Source Code</span>
                  <button onClick={() => handleCopy(reanimatedCode, 'reanimated')} className={styles.copyBtn}>
                    {copyStatus === 'reanimated' ? '✅ Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className={styles.pre}><code>{reanimatedCode}</code></pre>
              </div>
            )}
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

            {!showCode ? (
              <div className={styles.canvas}>
                {GsapComponent && <GsapComponent />}
              </div>
            ) : (
              <div className={styles.codeSection}>
                <div className={styles.codeHeader}>
                  <span>Source Code</span>
                  <button onClick={() => handleCopy(gsapCode, 'gsap')} className={styles.copyBtn}>
                    {copyStatus === 'gsap' ? '✅ Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className={styles.pre}><code>{gsapCode}</code></pre>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DemoWrapper;
