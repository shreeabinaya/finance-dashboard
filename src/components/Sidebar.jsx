import { useApp } from '../context/AppContext';      
import styles from './Sidebar.module.css';

const NAV = [
  { id: 'overview',      icon: '⬡',  label: 'Overview' },
  { id: 'transactions',  icon: '≡',   label: 'Transactions' },
  { id: 'insights',      icon: '◎',   label: 'Insights' },
  { id: 'charts',        icon: '▦',   label: 'Analytics' },
];

export default function Sidebar({ mobile = false, onClose }) {
  const { state, dispatch } = useApp();
  const { activeTab, darkMode } = state;

  function setTab(id) {
    dispatch({ type: 'SET_TAB', payload: id });
    onClose?.();
  }

  return (
    <aside className={`${styles.sidebar} ${mobile ? styles.mobile : ''}`}>
      <div className={styles.brand}>
        <div className={styles.brand_dot} />
        <span className={styles.brand_name}>FinTrack</span>
        
      </div>

      <nav className={styles.nav}>
        <div className={styles.nav_label}>Menu</div>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`${styles.nav_item} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setTab(item.id)}
          >
            <span className={styles.nav_icon}>{item.icon}</span>
            <span className={styles.nav_label_text}>{item.label}</span>
            {activeTab === item.id && <span className={styles.nav_pip} />}
          </button>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.theme_toggle}>
          <span className={styles.theme_label}>{darkMode ? 'Dark' : 'Light'} mode</span>
          <button
            className={`${styles.toggle} ${darkMode ? styles.toggle_on : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
            aria-label="Toggle dark mode"
          >
            <span className={styles.toggle_thumb} />
          </button>
        </div>

        <div className={styles.storage_indicator}>
          <span className={styles.storage_dot} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Auto-saved</span>
        </div>
      </div>
    </aside>
  );
}
