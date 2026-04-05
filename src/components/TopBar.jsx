import { useState } from 'react';
import { useApp } from '../context/AppContext';      
import { Button } from './ui/UI';
import styles from './TopBar.module.css';

export default function TopBar({ onMenuClick }) {
  const { state, dispatch, notify } = useApp();
  const { role, notification, activeTab } = state;
  const [showExport, setShowExport] = useState(false);

  const TAB_TITLES = {
    overview: 'Overview',
    transactions: 'Transactions',
    insights: 'Insights',
    charts: 'Analytics',
  };

  function switchRole(r) {
    dispatch({ type: 'SET_ROLE', payload: r });
    notify(`Switched to ${r === 'admin' ? 'Admin' : 'Viewer'} mode`, r === 'admin' ? 'success' : 'info');
  }

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.left}>
          <button className={styles.menu_btn} onClick={onMenuClick} aria-label="Open menu">
            <span /><span /><span />
          </button>
          <div className={styles.page_info}>
            <h1 className={styles.page_title}>{TAB_TITLES[activeTab] || 'Dashboard'}</h1>
            <span className={styles.page_date}>
              {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
            </span>
          </div>
        </div>

        <div className={styles.right}>
          {/* Role RBAC Switch */}
          <div className={styles.role_switch}>
            <span className={styles.role_label}>Role</span>
            <div className={styles.role_pills}>
              <button
                className={`${styles.role_pill} ${role === 'admin' ? styles.admin_active : ''}`}
                onClick={() => switchRole('admin')}
              >
                <span className={styles.role_dot} style={{ background: role==='admin'?'#fff':'var(--green)' }} />
                Admin
              </button>
              <button
                className={`${styles.role_pill} ${role === 'viewer' ? styles.viewer_active : ''}`}
                onClick={() => switchRole('viewer')}
              >
                <span className={styles.role_dot} style={{ background: role==='viewer'?'#fff':'var(--text-muted)' }} />
                Viewer
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className={styles.avatar} title={role === 'admin' ? 'Admin User' : 'Viewer User'}>
            {role === 'admin' ? 'AU' : 'VU'}
          </div>
        </div>
      </header>

      {/* RBAC Banner */}
      {role === 'viewer' && (
        <div className={styles.rbac_banner}>
          <span className={styles.rbac_icon}>🔒</span>
          <span><strong>Viewer mode</strong> — You can browse and explore data but cannot add, edit, or delete transactions.</span>
          <button className={styles.rbac_switch} onClick={() => switchRole('admin')}>Switch to Admin →</button>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`${styles.toast} ${styles[`toast_${notification.type}`]}`}>
          <span>{notification.type === 'success' ? '✓' : notification.type === 'info' ? 'ℹ' : '!'}</span>
          {notification.msg}
        </div>
      )}
    </>
  );
}
