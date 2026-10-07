import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { CARD_DESIGNS } from '../utils/sampleData';

function rand4() {
  return Math.floor(1000 + Math.random() * 9000);
}

export function AddCardModal({ isOpen, onClose, onSave }) {
  const [name,    setName]    = useState('');
  const [design,  setDesign]  = useState('indigo');
  const [balance, setBalance] = useState('1000000');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const last = rand4();
    onSave({
      id: 'card-' + Date.now(),
      name: name.trim(),
      cardNumber: `9860 •••• •••• ${last}`,
      cardHolder: 'PAYNET VIRTUAL',
      expiry: '12/28',
      balance: Math.max(0, +balance || 0),
      design,
      status: 'active',
      isDefault: false,
    });
    setName(''); setDesign('indigo'); setBalance('1000000');
    onClose();
  };

  const selDesign = CARD_DESIGNS.find(d => d.id === design) || CARD_DESIGNS[0];

  const F = ({ label, children }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:12, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="modal-bg fade-up" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{ width:'100%', maxWidth:460, padding:26, background:'rgba(10,16,32,0.98)' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22, paddingBottom:16, borderBottom:'1px solid var(--sunken-brd)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:'rgba(16,185,129,0.14)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <CreditCard size={15} color="#34d399" />
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>Yangi Virtual Karta Qo'shish</span>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex', padding:4 }}>
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

          {/* Preview */}
          <div style={{
            borderRadius:14,
            background: selDesign.gradient,
            padding:'14px 18px',
            boxShadow: `0 8px 28px ${selDesign.glow}`,
            minHeight:90,
            display:'flex', flexDirection:'column', justifyContent:'space-between',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontFamily:'var(--font-mono)', fontWeight:800, fontSize:13, color:'#fde68a' }}>PAYNET</span>
              <div style={{ width:30, height:20, background:'linear-gradient(135deg,#fef08a,#ca8a04)', borderRadius:4 }} />
            </div>
            <div>
              <div style={{ fontSize:10, color:`${selDesign.textColor}88`, marginBottom:2 }}>{name || 'Karta Nomi'}</div>
              <div className="num" style={{ fontSize:14, fontWeight:800, color:'#fff' }}>
                {(+balance||0).toLocaleString('uz-UZ')} so'm
              </div>
            </div>
          </div>

          <F label="Karta Nomi">
            <input
              className="inp"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Masalan: Asosiy Karta, Jamg'arma..."
              required
              maxLength={30}
            />
          </F>

          <F label="Boshlang'ich Balans (UZS)">
            <div style={{ position:'relative' }}>
              <input
                className="inp"
                type="number"
                value={balance}
                onChange={e => setBalance(e.target.value)}
                placeholder="1000000"
                min="0"
                style={{ paddingRight:50 }}
              />
              <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:11, color:'#10b981', fontWeight:700 }}>UZS</span>
            </div>
          </F>

          <F label="Karta Dizayni">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8 }}>
              {CARD_DESIGNS.map(d => (
                <button
                  key={d.id}
                  type="button"
                  title={d.name}
                  onClick={() => setDesign(d.id)}
                  style={{
                    height:34, borderRadius:10, cursor:'pointer', border:'none',
                    background:`linear-gradient(135deg,${d.preview[0]},${d.preview[1]})`,
                    outline: design === d.id ? '3px solid #fff' : '2px solid transparent',
                    boxShadow: design === d.id ? `0 0 0 1px rgba(0,0,0,0.40), 0 4px 12px ${d.glow}` : 'none',
                    transform: design === d.id ? 'scale(1.10)' : 'scale(1)',
                    transition:'all 0.2s',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>{selDesign.name}</div>
          </F>

          {/* Footer */}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:14, borderTop:'1px solid var(--sunken-brd)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-green">
              <CreditCard size={13} />
              Karta Yaratish
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
