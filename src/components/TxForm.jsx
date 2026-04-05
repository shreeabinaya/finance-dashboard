import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Button } from './ui/UI';
import { CATEGORIES } from '../data/mockData';
import styles from './TxForm.module.css';

const empty = { date: '', desc: '', category: 'food', amount: '', type: 'expense', note: '' };

export default function TxForm({ open, onClose, existing }) {
  const { dispatch, notify } = useApp();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(existing
        ? { ...existing, amount: Math.abs(existing.amount).toString() }
        : { ...empty, date: new Date().toISOString().slice(0, 10) }
      );
      setErrors({});
    }
  }, [open, existing]);

  function set(key, val) {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.date) e.date = 'Date is required';
    if (!form.desc.trim()) e.desc = 'Description is required';
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 450)); // simulate API
    const amount = form.type === 'expense' ? -Math.abs(parseFloat(form.amount)) : Math.abs(parseFloat(form.amount));
    const tx = { ...form, amount, type: form.type };
    if (existing) {
      dispatch({ type: 'UPDATE_TX', payload: { ...tx, id: existing.id } });
      notify('Transaction updated successfully');
    } else {
      dispatch({ type: 'ADD_TX', payload: tx });
      notify('Transaction added successfully');
    }
    setLoading(false);
    onClose();
  }

  const cat = CATEGORIES.find(c => c.id === form.category);

  return (
    <Modal open={open} onClose={onClose} title={existing ? 'Edit Transaction' : 'New Transaction'} width={500}>
      <div className={styles.form}>

        {/* Type toggle */}
        <div className={styles.type_row}>
          {['expense', 'income'].map(t => (
            <button
              key={t}
              className={`${styles.type_btn} ${form.type === t ? (t === 'expense' ? styles.type_expense : styles.type_income) : ''}`}
              onClick={() => set('type', t)}
            >
              {t === 'expense' ? '↓ Expense' : '↑ Income'}
            </button>
          ))}
        </div>

        {/* Amount — big */}
        <div className={styles.amount_wrap}>
          <span className={styles.currency}>$</span>
          <input
            className={`${styles.amount_input} ${form.type === 'expense' ? styles.amount_expense : styles.amount_income}`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
          />
          {errors.amount && <span className={styles.err}>{errors.amount}</span>}
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Date</label>
            <input
              className={`${styles.input} ${errors.date ? styles.input_err : ''}`}
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
            {errors.date && <span className={styles.err}>{errors.date}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <div className={styles.cat_select_wrap}>
              <span className={styles.cat_icon}>{cat?.icon}</span>
              <select
                className={styles.select}
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <input
            className={`${styles.input} ${errors.desc ? styles.input_err : ''}`}
            type="text"
            placeholder="e.g. Grocery store, Netflix, Salary…"
            value={form.desc}
            onChange={e => set('desc', e.target.value)}
          />
          {errors.desc && <span className={styles.err}>{errors.desc}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Note <span className={styles.optional}>(optional)</span></label>
          <input
            className={styles.input}
            type="text"
            placeholder="Add a note or tag…"
            value={form.note}
            onChange={e => set('note', e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : null}
            {loading ? 'Saving…' : existing ? 'Save changes' : 'Add transaction'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
