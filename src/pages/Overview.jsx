import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/UI';
import { computeMetrics, computeMonthlyData, computeInsights, fmtAmount } from '../utils/helpers';
import styles from './Overview.module.css';

export default function OverviewPage() {
  const { state } = useApp();
  const { transactions } = state;

  const { income, expense, balance, savingsRate } = computeMetrics(transactions);
  const monthly = computeMonthlyData(transactions);
  const { topCat, momChange, avgMonthlySpend } = computeInsights(transactions);

  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];
  const incMoM = last && prev && prev.income > 0 ? ((last.income - prev.income) / prev.income) * 100 : 0;

  return (
    <div className={styles.page}>
      {/* Stat Cards */}
      <div className={styles.stats_grid}>
        <StatCard
          label="Net Balance"
          value={`$${fmtAmount(Math.abs(balance))}`}
          sub={balance >= 0 ? 'Positive cashflow' : 'Negative cashflow'}
          icon="◈"
          accentColor="#2563eb"
          animate
        />
        <StatCard
          label="Total Income"
          value={`$${fmtAmount(income)}`}
          trend={-incMoM}
          sub="vs. last month"
          icon="↑"
          accentColor="#059669"
          animate
        />
        <StatCard
          label="Total Expenses"
          value={`$${fmtAmount(expense)}`}
          trend={momChange}
          sub="vs. last month"
          icon="↓"
          accentColor="#dc2626"
          animate
        />
        <StatCard
          label="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          sub={savingsRate >= 20 ? '✓ Healthy savings' : 'Consider saving more'}
          icon="%"
          accentColor="#d97706"
          animate
        />
      </div>

      {/* Monthly Summary table */}
      <div className={styles.section}>
        <div className={styles.section_header}>
          <h2 className={styles.section_title}>Monthly summary</h2>
        </div>
        <div className={styles.table_wrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Month</th>
                <th className={styles.th}>Income</th>
                <th className={styles.th}>Expenses</th>
                <th className={styles.th}>Net</th>
                <th className={styles.th}>Savings rate</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((m, i) => {
                const net = m.income - m.expense;
                const rate = m.income > 0 ? (net / m.income) * 100 : 0;
                const label = new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                return (
                  <tr key={m.month} className={styles.tr} style={{ animationDelay: `${i * 0.05}s` }}>
                    <td className={styles.td}><span className={styles.month_label}>{label}</span></td>
                    <td className={styles.td}><span className={styles.inc}>${fmtAmount(m.income)}</span></td>
                    <td className={styles.td}><span className={styles.exp}>${fmtAmount(m.expense)}</span></td>
                    <td className={styles.td}>
                      <span className={net >= 0 ? styles.inc : styles.exp}>${fmtAmount(Math.abs(net))}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.rate_wrap}>
                        <div className={styles.rate_bar_bg}>
                          <div
                            className={styles.rate_bar}
                            style={{
                              width: `${Math.min(100, Math.max(0, rate))}%`,
                              background: rate >= 20 ? 'var(--green)' : rate >= 10 ? 'var(--amber)' : 'var(--red)',
                            }}
                          />
                        </div>
                        <span className={styles.rate_label}>{rate.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Facts */}
      <div className={styles.facts_grid}>
        <div className={styles.fact_card}>
          <div className={styles.fact_icon} style={{ background: topCat?.bg, color: topCat?.color }}>
            {topCat?.icon}
          </div>
          <div className={styles.fact_body}>
            <div className={styles.fact_label}>Top spending category</div>
            <div className={styles.fact_value}>{topCat?.label}</div>
            <div className={styles.fact_sub}>${fmtAmount(topCat?.val || 0)} total</div>
          </div>
        </div>
        <div className={styles.fact_card}>
          <div className={styles.fact_icon} style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            ≈
          </div>
          <div className={styles.fact_body}>
            <div className={styles.fact_label}>Avg monthly spending</div>
            <div className={styles.fact_value}>${fmtAmount(avgMonthlySpend)}</div>
            <div className={styles.fact_sub}>Across {monthly.length} months</div>
          </div>
        </div>
        <div className={styles.fact_card}>
          <div className={styles.fact_icon} style={{ background: momChange <= 0 ? 'var(--green-bg)' : 'var(--red-bg)', color: momChange <= 0 ? 'var(--green)' : 'var(--red)' }}>
            {momChange <= 0 ? '↓' : '↑'}
          </div>
          <div className={styles.fact_body}>
            <div className={styles.fact_label}>Month-on-month spend</div>
            <div className={styles.fact_value}>{Math.abs(momChange).toFixed(1)}% {momChange <= 0 ? 'less' : 'more'}</div>
            <div className={styles.fact_sub}>vs previous month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
