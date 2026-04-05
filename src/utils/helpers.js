import { getCategoryById } from '../data/mockData';

export function fmtAmount(amount) {
  const abs = Math.abs(amount);
  return abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function computeMetrics(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
  return { income, expense, balance, savingsRate };
}

export function computeMonthlyData(transactions) {
  const map = {};
  transactions.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!map[m]) map[m] = { month: m, income: 0, expense: 0 };
    if (t.type === 'income') map[m].income += t.amount;
    else map[m].expense += Math.abs(t.amount);
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

export function computeCategoryBreakdown(transactions) {
  const map = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
  });
  const total = Object.values(map).reduce((s, v) => s + v, 0);
  return Object.entries(map)
    .map(([cat, val]) => ({ cat, val, pct: total > 0 ? (val / total) * 100 : 0, ...getCategoryById(cat) }))
    .sort((a, b) => b.val - a.val);
}

export function computeInsights(transactions) {
  const monthly = computeMonthlyData(transactions);
  const breakdown = computeCategoryBreakdown(transactions);
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];

  const topCat = breakdown[0];
  const momChange = last && prev ? ((last.expense - prev.expense) / prev.expense) * 100 : 0;
  const avgMonthlySpend = monthly.length > 0
    ? monthly.reduce((s, m) => s + m.expense, 0) / monthly.length : 0;
  const { savingsRate, income, expense } = computeMetrics(transactions);

  const largestTx = [...transactions].filter(t=>t.type==='expense').sort((a,b)=>Math.abs(b.amount)-Math.abs(a.amount))[0];

  return { topCat, momChange, avgMonthlySpend, savingsRate, income, expense, largestTx, monthly, breakdown };
}

export function exportCSV(transactions) {
  const header = ['Date', 'Description', 'Category', 'Amount', 'Type', 'Note'].join(',');
  const rows = transactions.map(t =>
    [t.date, `"${t.desc}"`, t.category, t.amount, t.type, `"${t.note || ''}"`].join(',')
  );
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `fintrack_export_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

export function exportJSON(transactions) {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `fintrack_export_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

export const MONTH_OPTIONS = [
  { value: '2025-01', label: 'January 2025' },
  { value: '2025-02', label: 'February 2025' },
  { value: '2025-03', label: 'March 2025' },
  { value: '2025-04', label: 'April 2025' },
];
