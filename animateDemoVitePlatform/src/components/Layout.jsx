import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Layout.module.css';

const Layout = ({ children, categories }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.mobileToggle}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.title}>Animation Demos</h1>
          <p style={{ margin: '8px 0 0', color: '#718096', fontSize: '0.85rem' }}>
            Reanimated v3 + GSAP
          </p>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Home
                </NavLink>
              </li>
            </ul>
          </div>

          {categories.map((category, index) => (
            <div key={index} className={styles.navGroup}>
              <div className={styles.groupTitle}>{category.name}</div>
              <ul className={styles.navList}>
                {category.demos.map((demo) => (
                  <li key={demo.id} className={styles.navItem}>
                    <NavLink
                      to={demo.path}
                      className={({ isActive }) =>
                        isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {demo.id}. {demo.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
