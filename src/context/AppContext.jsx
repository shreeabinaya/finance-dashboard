import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { initialTransactions, getNextId } from '../data/mockData';

const AppContext = createContext(null);

const STORAGE_KEY = 'fintrack_v2';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions: state.transactions,
      role: state.role,
      darkMode: state.darkMode,
    }));
  } catch {}
}

const defaultState = {
  transactions: initialTransactions,
  role: 'admin',
  darkMode: false,
  filters: { category: '', month: '', type: '', search: '', amountMin: '', amountMax: '' },
  sortBy: 'date',
  sortDir: 'desc',
  activeTab: 'transactions',
  notification: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: defaultState.filters };
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload,
        sortDir: state.sortBy === action.payload && state.sortDir === 'desc' ? 'asc' : 'desc',
      };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'ADD_TX': {
      const tx = { ...action.payload, id: getNextId() };
      return { ...state, transactions: [tx, ...state.transactions] };
    }
    case 'UPDATE_TX':
      return {
        ...state,
        transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TX':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'NOTIFY':
      return { ...state, notification: action.payload };
    case 'CLEAR_NOTIFY':
      return { ...state, notification: null };
    case 'RESET_DATA':
      return { ...state, transactions: initialTransactions };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    ...(saved || {}),
    filters: defaultState.filters,
    activeTab: 'transactions',
    notification: null,
  });

  useEffect(() => { saveState(state); }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  const notify = useCallback((msg, type = 'success') => {
    dispatch({ type: 'NOTIFY', payload: { msg, type } });
    setTimeout(() => dispatch({ type: 'CLEAR_NOTIFY' }), 3000);
  }, []);

  const getFilteredSorted = useCallback(() => {
    const { filters, sortBy, sortDir, transactions } = state;
    let result = transactions.filter(t => {
      if (filters.category && t.category !== filters.category) return false;
      if (filters.month && !t.date.startsWith(filters.month)) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.search && !t.desc.toLowerCase().includes(filters.search.toLowerCase()) &&
          !t.note?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.amountMin && Math.abs(t.amount) < parseFloat(filters.amountMin)) return false;
      if (filters.amountMax && Math.abs(t.amount) > parseFloat(filters.amountMax)) return false;
      return true;
    });
    result = [...result].sort((a, b) => {
      let va, vb;
      if (sortBy === 'date') { va = a.date; vb = b.date; }
      else if (sortBy === 'amount') { va = Math.abs(a.amount); vb = Math.abs(b.amount); }
      else if (sortBy === 'desc') { va = a.desc; vb = b.desc; }
      else { va = a.category; vb = b.category; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch, notify, getFilteredSorted }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
