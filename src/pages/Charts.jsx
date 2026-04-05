import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { computeMonthlyData, computeCategoryBreakdown, fmtAmount } from '../utils/helpers';
import { Chart, registerables } from 'chart.js';
import styles from './Charts.module.css';

Chart.register(...registerables);

function useChart(ref, config, deps) {
  const instance = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(() => {
      if (!ref.current) return;
      if (instance.current) instance.current.destroy();
      instance.current = new Chart(ref.current, config());
      observer.disconnect();
    });
    observer.observe(ref.current.parentElement);
    return () => {
      observer.disconnect();
      instance.current?.destroy();
    };
  }, deps);
}

export default function ChartsPage() {
  const { state } = useApp();
  const { transactions, darkMode } = state;

  const monthly   = computeMonthlyData(transactions);
  const breakdown = computeCategoryBreakdown(transactions);

  const textColor    = darkMode ? '#8b949e' : '#6b7280';
  const gridColor    = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const surfaceColor = darkMode ? '#1c2128' : '#ffffff';
  const isMobile     = window.innerWidth < 600; // ✅ detect mobile

  const barRef   = useRef(null);
  const donutRef = useRef(null);
  const lineRef  = useRef(null);
  const stackRef = useRef(null);

  const commonScales = {
    x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: "'DM Sans'" } } },
    y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: "'DM Sans'" }, callback: v => '$' + v.toLocaleString() } },
  };

  useChart(barRef, () => ({
    type: 'bar',
    data: {
      labels: monthly.map(m => new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
      datasets: [
        { label: 'Income',   data: monthly.map(m => m.income),  backgroundColor: 'rgba(5,150,105,0.8)',  borderRadius: 6, borderSkipped: false },
        { label: 'Expenses', data: monthly.map(m => m.expense), backgroundColor: 'rgba(220,38,38,0.8)', borderRadius: 6, borderSkipped: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor, font: { family: "'DM Sans'", size: 12 }, boxWidth: 10, borderRadius: 3 } } },
      scales: commonScales,
    },
  }), [transactions, darkMode]);

  // ✅ Fixed donut — legend bottom on mobile, correct % in tooltip
  useChart(donutRef, () => ({
    type: 'doughnut',
    data: {
      labels: breakdown.map(c => c.label),
      datasets: [{
        data: breakdown.map(c => c.val),
        backgroundColor: breakdown.map(c => c.color),
        borderWidth: 2,
        borderColor: surfaceColor,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: isMobile ? 'bottom' : 'right', // ✅ bottom on mobile
          labels: { color: textColor, font: { family: "'DM Sans'", size: 12 }, boxWidth: 10, borderRadius: 3, padding: 12 }
        },
        tooltip: {
          callbacks: {
            label: ctx => { // ✅ fixed percentage calculation
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.raw / total) * 100).toFixed(1);
              return ` ${ctx.label}: $${fmtAmount(ctx.raw)} (${pct}%)`;
            }
          }
        },
      },
    },
  }), [transactions, darkMode]);

  useChart(lineRef, () => ({
    type: 'line',
    data: {
      labels: monthly.map(m => new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
      datasets: [{
        label: 'Net savings',
        data: monthly.map(m => +(m.income - m.expense).toFixed(2)),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#2563eb',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor, font: { family: "'DM Sans'", size: 12 }, boxWidth: 10 } } },
      scales: commonScales,
    },
  }), [transactions, darkMode]);

  const cumulativeIncome  = [];
  const cumulativeExpense = [];
  let ci = 0, ce = 0;
  monthly.forEach(m => { ci += m.income; ce += m.expense; cumulativeIncome.push(+ci.toFixed(2)); cumulativeExpense.push(+ce.toFixed(2)); });

  useChart(stackRef, () => ({
    type: 'bar',
    data: {
      labels: monthly.map(m => new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })),
      datasets: [
        { label: 'Cumulative income',   data: cumulativeIncome,  backgroundColor: 'rgba(5,150,105,0.75)',  borderRadius: 4, stack: 'a' },
        { label: 'Cumulative expenses', data: cumulativeExpense, backgroundColor: 'rgba(220,38,38,0.75)', borderRadius: 4, stack: 'b' },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor, font: { family: "'DM Sans'", size: 12 }, boxWidth: 10, borderRadius: 3 } } },
      scales: { ...commonScales },
    },
  }), [transactions, darkMode]);

  return (
    <div className={styles.page}>
      <div className={styles.grid2}>
        <div className={styles.chart_card} style={{ animationDelay: '0s' }}>
          <div className={styles.chart_header}>
            <div>
              <div className={styles.chart_title}>Income vs Expenses</div>
              <div className={styles.chart_sub}>Monthly comparison</div>
            </div>
          </div>
          <div className={styles.chart_wrap} style={{ height: 260 }}>
            <canvas ref={barRef} />
          </div>
        </div>

        <div className={styles.chart_card} style={{ animationDelay: '0.08s' }}>
          <div className={styles.chart_header}>
            <div>
              <div className={styles.chart_title}>Spending by Category</div>
              <div className={styles.chart_sub}>All-time distribution</div>
            </div>
          </div>
          {/* ✅ taller on mobile to fit bottom legend */}
          <div className={styles.chart_wrap} style={{ height: isMobile ? 320 : 260 }}>
            <canvas ref={donutRef} />
          </div>
        </div>

        <div className={styles.chart_card} style={{ animationDelay: '0.14s' }}>
          <div className={styles.chart_header}>
            <div>
              <div className={styles.chart_title}>Net Savings Trend</div>
              <div className={styles.chart_sub}>Income minus expenses per month</div>
            </div>
          </div>
          <div className={styles.chart_wrap} style={{ height: 220 }}>
            <canvas ref={lineRef} />
          </div>
        </div>

        <div className={styles.chart_card} style={{ animationDelay: '0.2s' }}>
          <div className={styles.chart_header}>
            <div>
              <div className={styles.chart_title}>Cumulative Growth</div>
              <div className={styles.chart_sub}>Running totals over time</div>
            </div>
          </div>
          <div className={styles.chart_wrap} style={{ height: 220 }}>
            <canvas ref={stackRef} />
          </div>
        </div>
      </div>
    </div>
  );
}