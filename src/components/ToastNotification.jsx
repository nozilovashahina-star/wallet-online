import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { getCategoryById } from '../utils/categories';
import { formatMoney } from '../utils/formatters';

export function ToastNotification({ toast, onClose }) {
  if (!toast) return null;
  const cat = getCategoryById(toast.category);
  const Icon = cat.icon;

  return (
    <div
      className="toast-anim"
      style={{
        position:'fixed', top:24, right:24, zIndex:200,
        maxWidth:340, width:'calc(100vw - 48px)',
      }}
    >
      <div className="card" style={{
        padding:'14px 16px',
        background:'rgba(10,16,32,0.97)',
        border:'1px solid rgba(99,102,241,0.35)',
        boxShadow:'0 8px 32px rgba(0,0,0,0.60), 0 0 0 1px rgba(99,102,241,0.15)',
        display:'flex', alignItems:'flex-start', gap:12,
      }}>
        {/* Icon */}
        <div style={{
          width:38, height:38, borderRadius:12, flexShrink:0,
          background:cat.bgLight, border:`1px solid ${cat.border}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'inset 2px 2px 5px rgba(0,0,0,0.50)'
        }}>
          <Icon size={18} color={cat.color} />
        </div>

        {/* Body */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4, fontSize:10, color:'#818cf8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>
            <Sparkles size={10} color="#fbbf24" />
            Avto-To'lov Yechildi
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:5 }}>
            {toast.title}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span className="num" style={{ fontSize:14, fontWeight:800, color: toast.type==='expense' ? '#f43f5e' : '#34d399' }}>
              {toast.type==='expense' ? '-' : '+'}{formatMoney(toast.amount)}
            </span>
            <span className="badge" style={{ background:cat.bgLight, color:cat.color, border:`1px solid ${cat.border}`, fontSize:10 }}>
              {cat.shortName}
            </span>
          </div>
          <div style={{ fontSize:11, color:'#475569', marginTop:4 }}>
            Avto-kategoriyaga ketti: <strong style={{ color:'#64748b' }}>{cat.name}</strong>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{ background:'none', border:'none', cursor:'pointer', color:'#334155', padding:2, display:'flex', flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.color='#94a3b8'}
          onMouseLeave={e=>e.currentTarget.style.color='#334155'}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
