import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';                    // ✅ already correct
import { Button, Badge, EmptyState } from '../components/ui/UI'; // ✅ added components/
import TxForm from '../components/TxForm';                        // ✅ added components/
import { getCategoryById, CATEGORIES } from '../data/mockData';   // ✅ already correct
import { fmtAmount, fmtDate, exportCSV, exportJSON, MONTH_OPTIONS } from '../utils/helpers'; // ✅ already correct
import styles from './Transactions.module.css'; 

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const { state, dispatch, notify, getFilteredSorted } = useApp();
  const { role, filters, sortBy, sortDir } = state;
  const isAdmin = role === 'admin';

  const [modal, setModal] = useState({ open: false, tx: null });
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const all = getFilteredSorted();
  const totalPages = Math.ceil(all.length / PAGE_SIZE);
  const rows = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  function setFilter(k, v) {
    dispatch({ type: 'SET_FILTER', payload: { [k]: v } });
    setPage(1);
  }
  function clearAll() { dispatch({ type: 'CLEAR_FILTERS' }); setPage(1); }

  function setSort(col) { dispatch({ type: 'SET_SORT', payload: col }); setPage(1); }

  function handleDelete(id) {
    dispatch({ type: 'DELETE_TX', payload: id });
    setDeleteConfirm(null);
    notify('Transaction deleted', 'error');
  }

  function SortIcon({ col }) {
    if (sortBy !== col) return <span className={styles.sort_neutral}>⇅</span>;
    return <span className={styles.sort_active}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbar_left}>
          <button
            className={`${styles.filter_toggle} ${showFilters ? styles.filter_toggle_active : ''}`}
            onClick={() => setShowFilters(p => !p)}
          >
            ⊞ Filters {activeFilterCount > 0 && <span className={styles.filter_count}>{activeFilterCount}</span>}
          </button>
          {activeFilterCount > 0 && (
            <button className={styles.clear_btn} onClick={clearAll}>Clear all ✕</button>
          )}
          <span className={styles.result_count}>
            {all.length} transaction{all.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className={styles.toolbar_right}>
          {/* Export Menu */}
          <div className={styles.export_group}>
            <Button variant="secondary" size="sm" onClick={() => exportCSV(all)}>↓ CSV</Button>
            <Button variant="secondary" size="sm" onClick={() => exportJSON(all)}>↓ JSON</Button>
          </div>
          {isAdmin && (
            <Button variant="primary" size="md" onClick={() => setModal({ open: true, tx: null })}>
              + New Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className={styles.filter_panel}>
          <div className={styles.filter_grid}>
            <div className={styles.filter_field}>
              <label className={styles.filter_label}>Search</label>
              <input
                className={styles.filter_input}
                type="text"
                placeholder="Description or note…"
                value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
              />
            </div>
            <div className={styles.filter_field}>
              <label className={styles.filter_label}>Category</label>
              <select className={styles.filter_select} value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div className={styles.filter_field}>
              <label className={styles.filter_label}>Month</label>
              <select className={styles.filter_select} value={filters.month} onChange={e => setFilter('month', e.target.value)}>
                <option value="">All months</option>
                {MONTH_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div className={styles.filter_field}>
              <label className={styles.filter_label}>Type</label>
              <select className={styles.filter_select} value={filters.type} onChange={e => setFilter('type', e.target.value)}>
                <option value="">All types</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className={styles.filter_field}>
              <label className={styles.filter_label}>Min amount ($)</label>
              <input className={styles.filter_input} type="number" placeholder="0" value={filters.amountMin} onChange={e => setFilter('amountMin', e.target.value)} />
            </div>
            <div className={styles.filter_field}>
              <label className={styles.filter_label}>Max amount ($)</label>
              <input className={styles.filter_input} type="number" placeholder="9999" value={filters.amountMax} onChange={e => setFilter('amountMax', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.table_card}>
        {rows.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No transactions found"
            subtitle="Try adjusting your filters or add a new transaction."
            action={activeFilterCount > 0 && (
              <Button variant="secondary" size="sm" onClick={clearAll}>Clear filters</Button>
            )}
          />
        ) : (
          <div className={styles.table_scroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} onClick={() => setSort('date')}>
                    Date <SortIcon col="date" />
                  </th>
                  <th className={styles.th} onClick={() => setSort('desc')}>
                    Description <SortIcon col="desc" />
                  </th>
                  <th className={styles.th} onClick={() => setSort('category')}>
                    Category <SortIcon col="category" />
                  </th>
                  <th className={`${styles.th} ${styles.th_right}`} onClick={() => setSort('amount')}>
                    Amount <SortIcon col="amount" />
                  </th>
                  {isAdmin && <th className={styles.th} style={{ width: 100 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((tx, i) => {
                  const cat = getCategoryById(tx.category);
                  return (
                    <tr key={tx.id} className={styles.tr} style={{ animationDelay: `${i * 0.03}s` }}>
                      <td className={styles.td}>
                        <div className={styles.date_cell}>
                          <span className={styles.date_main}>{fmtDate(tx.date)}</span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.desc_cell}>
                          <span className={styles.desc_main}>{tx.desc}</span>
                          {tx.note && <span className={styles.desc_note}>{tx.note}</span>}
                        </div>
                      </td>
                      <td className={styles.td}>
                        <Badge label={cat.label} color={cat.color} bg={cat.bg} icon={cat.icon} />
                      </td>
                      <td className={`${styles.td} ${styles.td_right}`}>
                        <span className={`${styles.amount} ${tx.amount < 0 ? styles.amount_neg : styles.amount_pos}`}>
                          {tx.amount < 0 ? '−' : '+'} ${fmtAmount(Math.abs(tx.amount))}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className={styles.td}>
                          <div className={styles.actions_cell}>
                            <button className={styles.action_btn} onClick={() => setModal({ open: true, tx })}>
                              ✎
                            </button>
                            <button
                              className={`${styles.action_btn} ${styles.action_del}`}
                              onClick={() => setDeleteConfirm(tx.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <span className={styles.pag_info}>Page {page} of {totalPages}</span>
            <div className={styles.pag_btns}>
              <button className={styles.pag_btn} onClick={() => setPage(1)} disabled={page === 1}>«</button>
              <button className={styles.pag_btn} onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - page) <= 2)
                .map(p => (
                  <button
                    key={p}
                    className={`${styles.pag_btn} ${p === page ? styles.pag_active : ''}`}
                    onClick={() => setPage(p)}
                  >{p}</button>
                ))}
              <button className={styles.pag_btn} onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
              <button className={styles.pag_btn} onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className={styles.confirm_overlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirm_box} onClick={e => e.stopPropagation()}>
            <div className={styles.confirm_icon}>🗑️</div>
            <div className={styles.confirm_title}>Delete transaction?</div>
            <div className={styles.confirm_sub}>This action cannot be undone.</div>
            <div className={styles.confirm_actions}>
              <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}>Yes, delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <TxForm
        open={modal.open}
        onClose={() => setModal({ open: false, tx: null })}
        existing={modal.tx}
      />
    </div>
  );
}
