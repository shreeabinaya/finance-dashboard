import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OverviewPage from './pages/Overview';
import TransactionsPage from './pages/Transactions';
import InsightsPage from './pages/Insights';
import ChartsPage from './pages/Charts';
import styles from './App.module.css';

function Layout() {
  const { state } = useApp();
  const { activeTab } = state;
  const [mobileOpen, setMobileOpen] = useState(false);

  const PAGE = {
    overview:     <OverviewPage />,
    transactions: <TransactionsPage />,
    insights:     <InsightsPage />,
    charts:       <ChartsPage />,
  };

  return (
    <div className={styles.shell}>
      {/* Sidebar — desktop always visible, mobile via overlay */}
      <div className={`${styles.sidebar_wrap} ${mobileOpen ? styles.sidebar_open : ''}`}>
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div className={styles.backdrop} onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <div className={styles.main}>
        <TopBar onMenuClick={() => setMobileOpen(p => !p)} />
        <main className={styles.content} key={activeTab}>
          {PAGE[activeTab] || <OverviewPage />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
