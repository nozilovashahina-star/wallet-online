import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, ShieldAlert, Edit2, X, Save } from 'lucide-react';
import { CATEGORIES } from '../utils/categories';
import { formatMoney } from '../utils/formatters';

const PRESETS = [200000, 500000, 1000000, 2000000, 5000000];

export function BudgetLimitsPanel({ transactions, budgets, onUpdateBudget }) {
  const [modalCat, setModalCat] = useState(null);
  const [valInput, setValInput] = useState('');

  const spentMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    spentMap[t.category] = (spentMap[t.category] || 0) + +t.amount;
  });

  const handleOpenEdit = (cat, currentLimit) => {
    setModalCat(cat);
    setValInput(String(currentLimit));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const num = parseFloat(valInput);
    if (modalCat && !isNaN(num) && num >= 0) {
      onUpdateBudget(modalCat.id, num);
    }
    setModalCat(null);
  };

  return (
    <div className="card" style={{ padding:24 }}>
      {/* Title */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Target size={17} color="#fbbf24" />
          <span style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>Kategoriyalar Bo'yicha Limitlar (Bujet)</span>
        </div>
        <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:600 }}>Oylik sarflash me'yori</span>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16 }}>
        {CATEGORIES.filter(c => c.id !== 'income').map(cat => {
          const Icon = cat.icon;
          const limit = budgets[cat.id] || 500000;
          const spent = spentMap[cat.id] || 0;
          const pct = Math.min(100, Math.round(spent / limit * 100));
          const danger  = pct >= 100;
          const warning = pct >= 80 && pct < 100;

          let barColor = 'linear-gradient(90deg,#3b82f6,#6366f1)';
          if (warning) barColor = 'linear-gradient(90deg,#f59e0b,#fbbf24)';
          if (danger)  barColor = 'linear-gradient(90deg,#f43f5e,#ef4444)';

          return (
            <div
              key={cat.id}
              className="sunken"
              style={{
                padding:16,
                border: danger  ? '1px solid rgba(244,63,94,0.40)'
                       : warning ? '1px solid rgba(245,158,11,0.35)'
                       : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Top */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                  <div style={{
                    width:30, height:30, borderRadius:9, flexShrink:0,
                    background:cat.bgLight, border:`1px solid ${cat.border}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:'inset 1px 1px 3px rgba(0,0,0,0.50)'
                  }}>
                    <Icon size={15} color={cat.color} />
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:'var(--text-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {cat.shortName}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenEdit(cat, limit)}
                  style={{
                    background:'rgba(59,130,246,0.10)', border:'1px solid rgba(59,130,246,0.25)',
                    borderRadius:7, cursor:'pointer', color:'#60a5fa', padding:'4px 8px',
                    display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600,
                    transition:'all 0.18s'
                  }}
                  title="Limitni o'zgartirish"
                >
                  <Edit2 size={12} />
                  O'zgartirish
                </button>
              </div>

              {/* Values */}
              <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8, gap:4 }}>
                <span className="num" style={{ fontSize:13, fontWeight:800, color:'var(--text-1)' }}>
                  {formatMoney(spent)}
                </span>
                <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:600 }}>
                  / {formatMoney(limit)}
                </span>
              </div>

              {/* Progress */}
              <div className="progress-track" style={{ marginBottom:10 }}>
                <div style={{ width:`${pct}%`, height:'100%', borderRadius:999, background:barColor, transition:'width 0.5s ease' }} />
              </div>

              {/* Status */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:600 }}>{pct}% sarflandi</span>
                {danger  ? <span style={{ fontSize:11, color:'#fb7185', fontWeight:700, display:'flex', alignItems:'center', gap:3 }}><AlertTriangle size={11} /> Limit oshdi!</span>
                : warning ? <span style={{ fontSize:11, color:'#fbbf24', fontWeight:700, display:'flex', alignItems:'center', gap:3 }}><ShieldAlert size={11} /> Xavfli zona</span>
                :           <span style={{ fontSize:11, color:'#34d399', fontWeight:600, display:'flex', alignItems:'center', gap:3 }}><CheckCircle2 size={11} /> Me'yorda</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Modal (Small window with Blurred Background) */}
      {modalCat && (
        <div style={{
          position:'fixed', inset:0, zIndex:999,
          background:'rgba(0,0,0,0.60)',
          backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        }}>
          <div className="card" style={{ maxWidth:420, width:'100%', padding:24, borderRadius:18, boxShadow:'0 25px 50px -12px rgba(0, 0, 0, 0.7)', animation:'fadeIn 0.2s ease-out' }}>
            
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, paddingBottom:12, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{
                  width:34, height:34, borderRadius:10,
                  background:modalCat.bgLight, border:`1px solid ${modalCat.border}`,
                  display:'flex', alignItems:'center', justifyContent:'center'
                }}>
                  {React.createElement(modalCat.icon, { size:18, color:modalCat.color })}
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:'var(--text-1)' }}>
                    {modalCat.shortName} Limitini O'zgartirish
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-3)' }}>
                    Oylik rejalashtirilgan xarajat chegari
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalCat(null)}
                style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', padding:4, borderRadius:6 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <label style={{ fontSize:12, color:'var(--text-2)', fontWeight:600, display:'block', marginBottom:6 }}>
                  Yangi Oylik Limit Summasi (so'm):
                </label>
                <input
                  className="inp"
                  type="number"
                  step="50000"
                  value={valInput}
                  onChange={e => setValInput(e.target.value)}
                  placeholder="Masalan: 500000"
                  autoFocus
                  style={{ width:'100%', fontSize:15, fontWeight:700, padding:'10px 14px' }}
                />
              </div>

              {/* Presets */}
              <div>
                <div style={{ fontSize:11, color:'var(--text-3)', fontWeight:600, marginBottom:8 }}>
                  Tayyor Qiymatlar:
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {PRESETS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setValInput(String(p))}
                      style={{
                        padding:'5px 10px', borderRadius:8, fontSize:11, fontWeight:600,
                        border: String(p) === valInput ? '1px solid #3b82f6' : '1px solid var(--sunken-brd)',
                        background: String(p) === valInput ? 'rgba(59,130,246,0.20)' : 'var(--sunken-bg)',
                        color: String(p) === valInput ? '#60a5fa' : 'var(--text-2)',
                        cursor:'pointer', transition:'all 0.15s'
                      }}
                    >
                      {formatMoney(p)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModalCat(null)}
                  style={{ padding:'9px 16px', fontSize:13 }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn btn-blue"
                  style={{ padding:'9px 18px', fontSize:13, display:'flex', alignItems:'center', gap:6 }}
                >
                  <Save size={14} />
                  Saqlash
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
