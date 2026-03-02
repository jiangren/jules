import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Layout.module.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const demos = [
    { id: 1, path: '/demo/1', title: 'Hero Entrance' },
    { id: 2, path: '/demo/2', title: 'Pulse/Heartbeat' },
    { id: 3, path: '/demo/3', title: 'Infinite Marquee' },
    { id: 4, path: '/demo/4', title: 'Card Flip' },
    { id: 5, path: '/demo/5', title: 'Floating Elements' },
    { id: 6, path: '/demo/6', title: 'Pop-up/Modal' },
    { id: 7, path: '/demo/7', title: 'Counter/Numbers' },
    { id: 8, path: '/demo/8', title: 'Success/Confetti' },
    { id: 9, path: '/demo/9', title: 'Sticky/Hide Header' },
    { id: 10, path: '/demo/10', title: 'Like/Favorite' },
  ];

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
            {demos.map((demo) => (
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
        </nav>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
