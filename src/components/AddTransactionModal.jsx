import React, { useState, useEffect } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { CATEGORIES, autoCategorizeMerchant, getCategoryById } from '../utils/categories';

export function AddTransactionModal({ isOpen, onClose, onSave, editItem }) {
  const [title,    setTitle]    = useState('');
  const [amount,   setAmount]   = useState('');
  const [type,     setType]     = useState('expense');
  const [category, setCategory] = useState('food');
  const [method,   setMethod]   = useState('virtual_card');
  const [note,     setNote]     = useState('');
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setTitle(editItem.title || ''); setAmount(editItem.amount || '');
        setType(editItem.type || 'expense'); setCategory(editItem.category || 'food');
        setMethod(editItem.method || 'virtual_card'); setNote(editItem.note || '');
        setAutoDetected(false);
      } else {
        setTitle(''); setAmount(''); setType('expense'); setCategory('food');
        setMethod('virtual_card'); setNote(''); setAutoDetected(false);
      }
    }
  }, [isOpen, editItem]);

  const handleTitleChange = (v) => {
    setTitle(v);
    if (v.trim()) { setCategory(autoCategorizeMerchant(v)); setAutoDetected(true); }
    else setAutoDetected(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || +amount <= 0) return;
    onSave({
      id: editItem ? editItem.id : 'tx-' + Date.now(),
      title: title.trim(), amount: +amount, type, category,
      autoCategorized: autoDetected, method, note: note.trim(),
      date: editItem ? editItem.date : new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;
  const detCat = getCategoryById(category);

  const F = ({ label, children }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="modal-bg fade-up" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width:'100%', maxWidth:500, padding:28, background:'rgba(10,16,32,0.98)' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, paddingBottom:18, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'rgba(59,130,246,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Plus size={16} color="#60a5fa" />
            </div>
            <span style={{ fontSize:15, fontWeight:700, color:'#e2e8f0' }}>
              {editItem ? "Xarajatni Tahrirlash" : "Yangi Xarajat Qo'shish"}
            </span>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#475569', display:'flex', padding:4, borderRadius:8 }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {/* Type toggle */}
          <div className="sunken" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, padding:4, borderRadius:14 }}>
            {[['expense','Xarajat (Chiqim)','#f43f5e'], ['income','Daromad (Tushum)','#10b981']].map(([v,l,c]) => (
              <button
                key={v} type="button"
                onClick={() => { setType(v); if(v==='income') setCategory('income'); }}
                style={{
                  padding:'10px 8px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:700, fontSize:12,
                  background: type===v ? c : 'transparent',
                  color: type===v ? '#fff' : '#475569',
                  boxShadow: type===v ? `0 2px 10px ${c}55` : 'none',
                  transition:'all 0.2s'
                }}
              >{l}</button>
            ))}
          </div>

          {/* Title */}
          <F label="Chek / Do'kon Nomi">
            <input className="inp" type="text" value={title} onChange={e=>handleTitleChange(e.target.value)} placeholder="Masalan: Evos Fast Food, Yandex Taksi..." required />
            {title && (
              <div className="sunken" style={{ padding:'8px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderRadius:10, marginTop:4 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#64748b' }}>
                  <Sparkles size={12} color="#fbbf24" />
                  Avto-aniqlangan kategoriya:
                </div>
                <span className="badge" style={{ background:detCat.bgLight, color:detCat.color, border:`1px solid ${detCat.border}` }}>
                  {detCat.shortName}
                </span>
              </div>
            )}
          </F>

          {/* Amount + Method */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <F label="Summa (UZS)">
              <div style={{ position:'relative' }}>
                <input className="inp" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="50000" required min="1" style={{ paddingRight:50 }} />
                <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:11, color:'#3b82f6', fontWeight:700 }}>UZS</span>
              </div>
            </F>
            <F label="To'lov Usuli">
              <select className="sel" value={method} onChange={e=>setMethod(e.target.value)}>
                <option value="virtual_card">Virtual Paynet Karta</option>
                <option value="cash">Naqd Pul</option>
                <option value="bank_card">Bank Karta</option>
              </select>
            </F>
          </div>

          {/* Category */}
          <F label="Kategoriya">
            <select className="sel" value={category} onChange={e=>{ setCategory(e.target.value); setAutoDetected(false); }}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </F>

          {/* Note */}
          <F label="Izoh (Ixtiyoriy)">
            <input className="inp" type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="Qo'shimcha ma'lumot..." />
          </F>

          {/* Footer */}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-blue">
              <Plus size={14} strokeWidth={3} />
              {editItem ? 'Saqlash' : "Qo'shish"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
