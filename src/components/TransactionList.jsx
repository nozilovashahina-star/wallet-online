import React from 'react';
import { Download, Trash2, Edit, ArrowUpRight, ArrowDownLeft, Sparkles, Clock, Layers } from 'lucide-react';
import { getCategoryById } from '../utils/categories';
import { formatMoney, getRelativeTimeString } from '../utils/formatters';

export function TransactionList({ transactions, onDeleteTransaction, onEditTransaction }) {
  // Always take only the latest 10 transactions
  const sorted10 = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const exportCSV = () => {
    const rows = [['ID','Nomi','Summa','Turi','Kategoriya','Sana','Izoh'], ...sorted10.map(t => [
      t.id, `"${t.title}"`, t.amount, t.type, getCategoryById(t.category).shortName, `"${t.date}"`, `"${t.note||''}"`
    ])];
    const uri = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(r=>r.join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href:encodeURI(uri), download:`paynet_${new Date().toISOString().slice(0,10)}.csv` });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="card" style={{ padding:24 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.07)', gap:16, flexWrap:'wrap' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:4 }}>
            <Layers size={17} color="#3b82f6" />
            <span style={{ fontSize:15, fontWeight:700, color:'var(--text-1)' }}>Xarajatlar & Tushumlar Tarixi</span>
          </div>
          <div style={{ fontSize:11, color:'var(--text-3)' }}>
            Oxirgi 10 ta operatsiya ko'rsatilmoqda
          </div>
        </div>
        <button className="btn btn-ghost" onClick={exportCSV} style={{ fontSize:11, padding:'8px 14px' }}>
          <Download size={13} />
          CSV Yuklab olish
        </button>
      </div>

      {/* List */}
      {sorted10.length === 0 ? (
        <div className="sunken" style={{ padding:36, textAlign:'center', color:'var(--text-3)', fontSize:13 }}>
          Hozircha hech qanday operatsiyalar yo'q
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {sorted10.map(tx => {
            const cat = getCategoryById(tx.category);
            const CIcon = cat.icon;
            const isExp = tx.type === 'expense';
            const isUnk = tx.category === 'nomalum';

            return (
              <div
                key={tx.id}
                className="sunken"
                style={{
                  display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
                  border: isUnk ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  transition:'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = isUnk ? 'rgba(245,158,11,0.45)' : 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = isUnk ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)'}
              >
                {/* Icon */}
                <div style={{
                  width:42, height:42, borderRadius:12, flexShrink:0,
                  background:cat.bgLight, border:`1px solid ${cat.border}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'inset 2px 2px 5px rgba(0,0,0,0.50)'
                }}>
                  <CIcon size={18} color={cat.color} />
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--text-1)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:240 }}>
                      {tx.title}
                    </span>
                    <span className="badge" style={{ background:cat.bgLight, color:cat.color, border:`1px solid ${cat.border}`, fontSize:10 }}>
                      {cat.shortName}
                    </span>
                    {tx.autoCategorized && (
                      <span className="badge" style={{ background: isUnk ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.12)', color: isUnk ? '#fbbf24' : '#60a5fa', border: isUnk ? '1px solid rgba(245,158,11,0.30)' : '1px solid rgba(59,130,246,0.25)', fontSize:10 }}>
                        <Sparkles size={9} color="#fbbf24" />
                        {isUnk ? "Noma'lum chek" : 'Avto-kategoriya'}
                      </span>
                    )}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:11, color:'var(--text-3)' }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <Clock size={11} />
                      {getRelativeTimeString(tx.date)}
                    </span>
                    {tx.note && <><span>·</span><span style={{ fontStyle:'italic', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:220 }}>"{tx.note}"</span></>}
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div className="num" style={{ fontSize:15, fontWeight:800, color: isExp ? '#f43f5e' : '#34d399', display:'flex', alignItems:'center', gap:4, justifyContent:'flex-end' }}>
                    {isExp ? <ArrowUpRight size={14} color="#f43f5e" /> : <ArrowDownLeft size={14} color="#34d399" />}
                    {isExp ? '-' : '+'}{formatMoney(tx.amount)}
                  </div>
                  <div style={{ fontSize:10, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:2 }}>
                    {tx.method === 'virtual_card' ? 'Virtual Karta' : tx.method === 'cash' ? 'Naqd' : 'Bank Karta'}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                  {[
                    { icon:Edit,   fn:() => onEditTransaction(tx),      color:'#3b82f6' },
                    { icon:Trash2, fn:() => onDeleteTransaction(tx.id), color:'#f43f5e' },
                  ].map(({ icon:Icon, fn, color }, i) => (
                    <button
                      key={i}
                      onClick={fn}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', padding:6, borderRadius:8, display:'flex', alignItems:'center', transition:'color 0.15s, background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = color + '18'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'none'; }}
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
