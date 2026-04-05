export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍽️', color: '#10b981', bg: '#d1fae5' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#3b82f6', bg: '#dbeafe' },
  { id: 'housing', label: 'Housing', icon: '🏠', color: '#f59e0b', bg: '#fef3c7' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#ec4899', bg: '#fce7f3' },
  { id: 'health', label: 'Health', icon: '❤️', color: '#14b8a6', bg: '#ccfbf1' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#8b5cf6', bg: '#ede9fe' },
  { id: 'education', label: 'Education', icon: '📚', color: '#6366f1', bg: '#e0e7ff' },
  { id: 'utilities', label: 'Utilities', icon: '⚡', color: '#f97316', bg: '#ffedd5' },
  { id: 'income', label: 'Income', icon: '💰', color: '#059669', bg: '#d1fae5' },
  { id: 'investment', label: 'Investment', icon: '📈', color: '#0ea5e9', bg: '#e0f2fe' },
];

export const getCategoryById = (id) =>
  CATEGORIES.find(c => c.id === id) || { label: id, icon: '💳', color: '#6b7280', bg: '#f3f4f6' };

let _nextId = 31;
export const getNextId = () => _nextId++;

export const initialTransactions = [
  { id: 1,  date: '2025-01-03', desc: 'Whole Foods Market',      category: 'food',          amount: -127.50, type: 'expense', note: 'Weekly groceries' },
  { id: 2,  date: '2025-01-10', desc: 'Monthly Salary',          category: 'income',        amount: 4800.00, type: 'income',  note: 'Jan paycheck' },
  { id: 3,  date: '2025-01-12', desc: 'Uber Pool',               category: 'transport',     amount: -18.40,  type: 'expense', note: '' },
  { id: 4,  date: '2025-01-15', desc: 'Netflix Premium',         category: 'entertainment', amount: -22.99,  type: 'expense', note: '' },
  { id: 5,  date: '2025-01-18', desc: 'Apartment Rent',          category: 'housing',       amount: -1400.00,type: 'expense', note: 'Jan rent' },
  { id: 6,  date: '2025-01-20', desc: 'Pharmacy CVS',            category: 'health',        amount: -43.20,  type: 'expense', note: '' },
  { id: 7,  date: '2025-01-22', desc: 'Zara Clothing',           category: 'shopping',      amount: -89.99,  type: 'expense', note: '' },
  { id: 8,  date: '2025-01-25', desc: 'Electricity Bill',        category: 'utilities',     amount: -78.00,  type: 'expense', note: '' },
  { id: 9,  date: '2025-01-28', desc: 'Freelance Payment',       category: 'income',        amount: 650.00,  type: 'income',  note: 'Design project' },
  { id: 10, date: '2025-01-30', desc: 'Sushi Restaurant',        category: 'food',          amount: -67.00,  type: 'expense', note: 'Dinner with team' },

  { id: 11, date: '2025-02-02', desc: 'Spotify + Apple Music',   category: 'entertainment', amount: -19.99,  type: 'expense', note: '' },
  { id: 12, date: '2025-02-05', desc: 'Grocery Run',             category: 'food',          amount: -98.30,  type: 'expense', note: '' },
  { id: 13, date: '2025-02-08', desc: 'Monthly Salary',          category: 'income',        amount: 4800.00, type: 'income',  note: 'Feb paycheck' },
  { id: 14, date: '2025-02-10', desc: 'Metro Monthly Pass',      category: 'transport',     amount: -55.00,  type: 'expense', note: '' },
  { id: 15, date: '2025-02-14', desc: 'Valentine Dinner',        category: 'food',          amount: -145.00, type: 'expense', note: 'Special occasion' },
  { id: 16, date: '2025-02-18', desc: 'Apartment Rent',          category: 'housing',       amount: -1400.00,type: 'expense', note: 'Feb rent' },
  { id: 17, date: '2025-02-20', desc: 'Gym Membership',          category: 'health',        amount: -49.99,  type: 'expense', note: '' },
  { id: 18, date: '2025-02-22', desc: 'Amazon Shopping',         category: 'shopping',      amount: -156.78, type: 'expense', note: '' },
  { id: 19, date: '2025-02-25', desc: 'Udemy Course',            category: 'education',     amount: -29.99,  type: 'expense', note: 'React course' },
  { id: 20, date: '2025-02-27', desc: 'Freelance Payment',       category: 'income',        amount: 920.00,  type: 'income',  note: 'App development' },

  { id: 21, date: '2025-03-01', desc: 'Coffee Shop Weekly',      category: 'food',          amount: -52.40,  type: 'expense', note: '' },
  { id: 22, date: '2025-03-05', desc: 'Internet + Phone',        category: 'utilities',     amount: -89.00,  type: 'expense', note: '' },
  { id: 23, date: '2025-03-08', desc: 'Monthly Salary',          category: 'income',        amount: 4800.00, type: 'income',  note: 'Mar paycheck' },
  { id: 24, date: '2025-03-10', desc: 'Petrol Station',          category: 'transport',     amount: -61.00,  type: 'expense', note: '' },
  { id: 25, date: '2025-03-15', desc: 'Grocery Store',           category: 'food',          amount: -113.90, type: 'expense', note: '' },
  { id: 26, date: '2025-03-18', desc: 'Apartment Rent',          category: 'housing',       amount: -1400.00,type: 'expense', note: 'Mar rent' },
  { id: 27, date: '2025-03-20', desc: 'Concert Tickets',         category: 'entertainment', amount: -120.00, type: 'expense', note: 'Jazz festival' },
  { id: 28, date: '2025-03-22', desc: 'ETF Investment',          category: 'investment',    amount: -300.00, type: 'expense', note: 'S&P 500 index' },
  { id: 29, date: '2025-03-26', desc: 'Doctor Visit',            category: 'health',        amount: -80.00,  type: 'expense', note: '' },
  { id: 30, date: '2025-03-30', desc: 'Bonus Payment',           category: 'income',        amount: 1200.00, type: 'income',  note: 'Q1 bonus' },
];
