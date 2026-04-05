import { useApp } from '../context/AppContext';
import { computeInsights, fmtAmount } from '../utils/helpers';
import styles from './Insights.module.css';

function InsightCard({ icon, title, value, description, color, bg, delay = 0 }) {
  return (
    <div className={styles.insight_card} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.insight_icon} style={{ background: bg, color }}>
        {icon}
      </div>
      <div className={styles.insight_content}>
        <div className={styles.insight_title}>{title}</div>
        <div className={styles.insight_value} style={{ color }}>{value}</div>
        <div className={styles.insight_desc}>{description}</div>
      </div>
    </div>
  );
}

function CategoryBar({ cat, total }) {
  const pct = total > 0 ? (cat.val / total) * 100 : 0;
  return (
    <div className={styles.cat_row}>
      <div className={styles.cat_left}>
        <span className={styles.cat_icon} style={{ background: cat.bg, color: cat.color }}>{cat.icon}</span>
        <span className={styles.cat_name}>{cat.label}</span>
      </div>
      <div className={styles.cat_bar_wrap}>
        <div className={styles.cat_bar_bg}>
          <div
            className={styles.cat_bar_fill}
            style={{ width: `${pct}%`, background: cat.color }}
          />
        </div>
        <span className={styles.cat_pct}>{pct.toFixed(1)}%</span>
        <span className={styles.cat_amt}>${fmtAmount(cat.val)}</span>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { state } = useApp();
  const data = computeInsights(state.transactions);
  const { topCat, momChange, avgMonthlySpend, savingsRate, largestTx, monthly, breakdown } = data;

  const totalExpense = breakdown.reduce((s, c) => s + c.val, 0);
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];

  const insights = [
    {
      icon: topCat?.icon || '🏆',
      title: 'Highest spending category',
      value: topCat?.label || '—',
      description: `You spent $${fmtAmount(topCat?.val || 0)} on ${topCat?.label?.toLowerCase()}, which is ${topCat?.pct?.toFixed(1)}% of total expenses.`,
      color: topCat?.color || '#6b7280',
      bg: topCat?.bg || '#f3f4f6',
    },
    {
      icon: momChange <= 0 ? '📉' : '📈',
      title: 'Month-on-month change',
      value: `${momChange <= 0 ? '↓' : '↑'} ${Math.abs(momChange).toFixed(1)}%`,
      description: momChange <= 0
        ? `Great job! You spent ${Math.abs(momChange).toFixed(1)}% less this month than last month. Keep it up!`
        : `Heads up — spending increased ${momChange.toFixed(1)}% vs last month ($${fmtAmount(last?.expense || 0)} vs $${fmtAmount(prev?.expense || 0)}).`,
      color: momChange <= 0 ? 'var(--green)' : 'var(--red)',
      bg: momChange <= 0 ? 'var(--green-bg)' : 'var(--red-bg)',
    },
    {
      icon: '💡',
      title: 'Savings rate',
      value: `${savingsRate.toFixed(1)}%`,
      description: savingsRate >= 20
        ? `Excellent! A ${savingsRate.toFixed(1)}% savings rate is above the recommended 20% benchmark.`
        : `Your savings rate is ${savingsRate.toFixed(1)}%. Financial advisors recommend saving at least 20% of income.`,
      color: savingsRate >= 20 ? 'var(--green)' : 'var(--amber)',
      bg: savingsRate >= 20 ? 'var(--green-bg)' : 'var(--amber-bg)',
    },
    {
      icon: '📊',
      title: 'Average monthly spend',
      value: `$${fmtAmount(avgMonthlySpend)}`,
      description: `Your monthly spend averages $${fmtAmount(avgMonthlySpend)} across ${monthly.length} recorded months.`,
      color: 'var(--accent)',
      bg: 'var(--accent-light)',
    },
    {
      icon: '🔍',
      title: 'Largest single expense',
      value: largestTx ? `$${fmtAmount(Math.abs(largestTx.amount))}` : '—',
      description: largestTx
        ? `"${largestTx.desc}" on ${largestTx.date} was your biggest single purchase.`
        : 'No expense transactions found.',
      color: 'var(--red)',
      bg: 'var(--red-bg)',
    },
    {
      icon: last && prev && last.income > prev.income ? '🚀' : '📌',
      title: 'Latest month income',
      value: last ? `$${fmtAmount(last.income)}` : '—',
      description: last && prev
        ? `Income ${last.income >= prev.income ? 'grew' : 'dropped'} by $${fmtAmount(Math.abs(last.income - prev.income))} compared to the previous month.`
        : 'Only one month of data available.',
      color: 'var(--accent)',
      bg: 'var(--accent-light)',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.insights_grid}>
        {insights.map((ins, i) => (
          <InsightCard key={i} {...ins} delay={i * 0.06} />
        ))}
      </div>

      {/* Category breakdown */}
      <div className={styles.breakdown_section}>
        <div className={styles.section_header}>
          <h2 className={styles.section_title}>Expense breakdown</h2>
          <span className={styles.section_sub}>Total: ${fmtAmount(totalExpense)}</span>
        </div>
        <div className={styles.breakdown_list}>
          {breakdown.map((cat, i) => (
            <div key={cat.cat} style={{ animationDelay: `${i * 0.05}s`, animation: 'fadeSlideUp 0.35s ease both' }}>
              <CategoryBar cat={cat} total={totalExpense} />
            </div>
          ))}
          {breakdown.length === 0 && (
            <div className={styles.empty}>No expense data to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}
