import { useEffect, useRef } from 'react';
import styles from './UI.module.css';

/* ── Button ── */
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, icon, className = '' }) {
  return (
    <button
      className={`${styles.btn} ${styles[`btn_${variant}`]} ${styles[`btn_${size}`]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.btn_icon}>{icon}</span>}
      {children}
    </button>
  );
}

/* ── Badge ── */
export function Badge({ label, color, bg, icon }) {
  return (
    <span className={styles.badge} style={{ color, background: bg }}>
      {icon && <span style={{ fontSize: 12 }}>{icon}</span>}
      {label}
    </span>
  );
}

/* ── Card ── */
export function Card({ children, className = '', animate = true, style }) {
  return (
    <div
      className={`${styles.card} ${animate ? styles.animate : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ── Modal ── */
export function Modal({ open, onClose, title, children, width = 480 }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className={styles.modal} style={{ maxWidth: width }}>
        <div className={styles.modal_header}>
          <h2 className={styles.modal_title}>{title}</h2>
          <button className={styles.modal_close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modal_body}>{children}</div>
      </div>
    </div>
  );
}

/* ── Tooltip ── */
export function Tooltip({ text, children }) {
  return (
    <span className={styles.tooltip_wrap}>
      {children}
      <span className={styles.tooltip_box}>{text}</span>
    </span>
  );
}

/* ── Empty State ── */
export function EmptyState({ icon = '📭', title, subtitle, action }) {
  return (
    <div className={styles.empty}>
      <div className={styles.empty_icon}>{icon}</div>
      <div className={styles.empty_title}>{title}</div>
      {subtitle && <div className={styles.empty_sub}>{subtitle}</div>}
      {action}
    </div>
  );
}

/* ── Skeleton Loader ── */
export function Skeleton({ h = 20, w = '100%', r = 6 }) {
  return <div className={styles.skeleton} style={{ height: h, width: w, borderRadius: r }} />;
}

/* ── Stat Card ── */
export function StatCard({ label, value, sub, trend, icon, accentColor, animate = true }) {
  const isUp = trend > 0;
  return (
    <div className={`${styles.statCard} ${animate ? styles.animate : ''}`}>
      <div className={styles.statCard_top}>
        <span className={styles.statCard_label}>{label}</span>
        {icon && (
          <span className={styles.statCard_icon} style={{ background: accentColor + '18', color: accentColor }}>
            {icon}
          </span>
        )}
      </div>
      <div className={styles.statCard_value}>{value}</div>
      {(sub || trend !== undefined) && (
        <div className={styles.statCard_bottom}>
          {trend !== undefined && (
            <span className={styles.statCard_trend} style={{ color: isUp ? 'var(--red)' : 'var(--green)' }}>
              {isUp ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
          {sub && <span className={styles.statCard_sub}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
