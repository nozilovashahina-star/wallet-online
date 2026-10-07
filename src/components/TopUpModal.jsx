import React, { useState } from 'react';
import { X, PlusCircle, ShieldCheck } from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { CARD_DESIGNS } from '../utils/sampleData';

const PRESETS = [100000, 250000, 500000, 1000000, 2000000];

export function TopUpModal({ isOpen, onClose, onTopUp, cards, activeCardId }) {
  const [amount,     setAmount]     = useState('500000');
  const [targetCard, setTargetCard] = useState(activeCardId || (cards?.[0]?.id ?? ''));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = +amount;
    if (!isNaN(v) && v > 0) { onTopUp(v, targetCard); onClose(); }
  };

  return (
    <div className="modal-bg fade-up" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width:'100%', maxWidth:420, padding:26, background:'rgba(10,16,32,0.98)' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, paddingBottom:16, borderBottom:'1px solid var(--sunken-brd)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'rgba(16,185,129,0.14)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <PlusCircle size={15} color="#34d399" />
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>Kartani To'ldirish</span>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex', padding:4 }}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Card selector */}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Qaysi Kartaga To'ldirish
            </label>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {cards.map(c => {
                const d = CARD_DESIGNS.find(dd => dd.id === c.design) || CARD_DESIGNS[0];
                const selected = targetCard === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setTargetCard(c.id)}
                    style={{
                      display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                      borderRadius:12, cursor:'pointer',
                      background: selected ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                      border: selected ? '1px solid rgba(16,185,129,0.35)' : '1px solid var(--sunken-brd)',
                      transition:'all 0.18s',
                    }}
                  >
                    <div style={{ width:36, height:22, borderRadius:6, background:d.gradient, flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:'var(--text-1)' }}>{c.name}</div>
                      <div className="num" style={{ fontSize:11, color:'var(--text-3)' }}>{formatMoney(c.balance)}</div>
                    </div>
                    <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${selected ? '#10b981' : 'var(--text-4)'}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'border-color 0.2s' }}>
                      {selected && <div style={{ width:8, height:8, borderRadius:'50%', background:'#10b981' }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Presets */}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Tez Tanlash</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7 }}>
              {PRESETS.map(p => (
                <button
                  key={p} type="button"
                  onClick={() => setAmount(String(p))}
                  style={{
                    padding:'8px 4px', borderRadius:11, fontSize:11, fontWeight:700, cursor:'pointer',
                    border: +amount===p ? '1px solid #10b981' : '1px solid var(--sunken-brd)',
                    background: +amount===p ? 'rgba(16,185,129,0.14)' : 'rgba(255,255,255,0.04)',
                    color: +amount===p ? '#34d399' : 'var(--text-3)',
                    transition:'all 0.18s',
                    boxShadow: +amount===p ? '0 0 0 1px rgba(16,185,129,0.22)' : 'inset 1px 1px 3px rgba(0,0,0,0.35)',
                  }}
                >+{p/1000}k so'm</button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Moslashtirilgan Summa</label>
            <div style={{ position:'relative' }}>
              <input className="inp" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="500000" min="1000" required style={{ paddingRight:50, fontSize:15, fontWeight:700 }} />
              <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:11, color:'#10b981', fontWeight:700 }}>UZS</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="sunken" style={{ padding:'9px 13px', display:'flex', alignItems:'center', gap:9 }}>
            <ShieldCheck size={14} color="#34d399" style={{ flexShrink:0 }} />
            <span style={{ fontSize:11, color:'var(--text-3)', lineHeight:1.5 }}>Bu simulyatsiya project. Haqiqiy bank operatsiyasi amalga oshirilmaydi.</span>
          </div>

          {/* Footer */}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:12, borderTop:'1px solid var(--sunken-brd)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-green">
              <PlusCircle size={13} />
              {formatMoney(+amount || 0)} Qo'shish
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
