import React, { useState } from 'react';
import {
  CreditCard, Copy, Check, ShieldCheck, Zap,
  PlusCircle, Sparkles, Trash2, Palette, ChevronLeft, ChevronRight
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { CARD_DESIGNS } from '../utils/sampleData';

/* ── Single Credit Card Visual (Real Credit Card Dimensions & Style) ─────────────── */
function CreditCardVisual({ card, isActive = true, onCopy, copied }) {
  const design = CARD_DESIGNS.find(d => d.id === card.design) || CARD_DESIGNS[0];

  return (
    <div
      className="credit-card"
      style={{
        width: 380,
        height: 230,
        borderRadius: 20,
        padding: 22,
        background: design.gradient,
        boxShadow: isActive
          ? `0 20px 50px rgba(0,0,0,0.65), 0 0 35px ${design.glow}, inset 0 1px 2px rgba(255,255,255,0.35), inset 0 -2px 5px rgba(0,0,0,0.45)`
          : `0 10px 30px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.2)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        position: 'relative',
        boxSizing: 'border-box',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Top row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontFamily:'var(--font-mono)', fontWeight:800, fontSize:16, color:'#fde68a', letterSpacing:'0.06em' }}>PAYNET</span>
          <span style={{ fontSize:9, background:'rgba(255,255,255,0.20)', color:'rgba(255,255,255,0.90)', padding:'2px 6px', borderRadius:4, letterSpacing:'0.06em', fontWeight:700 }}>VIRTUAL</span>
        </div>
        <div style={{ width:44, height:32, background:'linear-gradient(135deg,#fef08a,#ca8a04)', borderRadius:6, boxShadow:'inset 0 1px 2px rgba(255,255,255,0.70),inset 0 -1px 2px rgba(0,0,0,0.35)' }} />
      </div>

      {/* Balance */}
      <div>
        <div style={{ fontSize:10, color:`${design.textColor}aa`, fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:4 }}>
          {card.name || 'Mavjud Balans'}
        </div>
        <div className="num" style={{ fontSize:26, fontWeight:800, color:'#ffffff', letterSpacing:'-0.03em' }}>
          {formatMoney(card.balance)}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
        <div>
          <div className="num" style={{ fontSize:14, fontWeight:700, color:`${design.textColor}ee`, letterSpacing:'0.14em' }}>
            {card.cardNumber}
          </div>
          <div style={{ fontSize:10, color:`${design.textColor}99`, marginTop:4, letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:600 }}>
            {card.cardHolder}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:9, color:`${design.textColor}77`, textTransform:'uppercase', letterSpacing:'0.05em' }}>Muddati</div>
          <div className="num" style={{ fontSize:13, fontWeight:700, color:`${design.textColor}ee` }}>{card.expiry}</div>
        </div>
      </div>

      {/* Copy button overlay on active card */}
      {isActive && onCopy && (
        <button
          onClick={e => { e.stopPropagation(); onCopy(); }}
          style={{
            position:'absolute', bottom:14, right:14,
            background:'rgba(0,0,0,0.45)', border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer',
            borderRadius:8, padding:'5px 10px', display:'flex', alignItems:'center', gap:5,
            color:'rgba(255,255,255,0.90)', fontSize:11, fontWeight:600,
            backdropFilter:'blur(6px)', transition:'all 0.18s'
          }}
        >
          {copied ? <><Check size={12} color="#6ee7b7" /> Nusxalandi</> : <><Copy size={12} /> Raqamni nusxalash</>}
        </button>
      )}
    </div>
  );
}

/* ── Design Picker ───────────────────────────── */
function DesignPicker({ current, onSelect }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:7 }}>
      {CARD_DESIGNS.map(d => (
        <button
          key={d.id}
          title={d.name}
          onClick={() => onSelect(d.id)}
          style={{
            height:32, borderRadius:10, cursor:'pointer', border:'none',
            background:`linear-gradient(135deg,${d.preview[0]},${d.preview[1]})`,
            outline: current === d.id ? `3px solid #fff` : '2px solid transparent',
            boxShadow: current === d.id ? `0 0 0 1px rgba(0,0,0,0.50), 0 4px 10px ${d.glow}` : 'none',
            transform: current === d.id ? 'scale(1.08)' : 'scale(1)',
            transition:'all 0.2s',
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Panel ──────────────────────────────── */
export function VirtualCardPanel({
  cards, activeCardId, onSetActiveCard, onUpdateCardDesign,
  autoPayEnabled, onToggleAutoPay,
  intervalSpeed, onChangeIntervalSpeed,
  onTriggerRandomTransaction, onOpenTopUpModal,
  onDeleteCard, onOpenAddCard,
}) {
  const [copied, setCopied] = useState(false);
  const [showDesignPicker, setShowDesignPicker] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];
  const activeIdx  = cards.findIndex(c => c.id === activeCardId);

  const goPrev = () => { const i = (activeIdx - 1 + cards.length) % cards.length; onSetActiveCard(cards[i].id); };
  const goNext = () => { const i = (activeIdx + 1) % cards.length; onSetActiveCard(cards[i].id); };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCard.cardNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmDelete = (cardId) => {
    onDeleteCard(cardId);
    setCardToDelete(null);
  };

  return (
    <div className="card" style={{ padding:24, display:'flex', flexDirection:'column', gap:20 }}>

      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:14, borderBottom:'1px solid var(--sunken-brd)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <CreditCard size={16} color="#818cf8" />
          <span style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>Virtual Paynet Kartalar</span>
          <span className="badge" style={{ background:'rgba(16,185,129,0.12)', color:'#34d399', border:'1px solid rgba(16,185,129,0.25)', fontSize:10 }}>
            <ShieldCheck size={11} />
            Test Rejimi
          </span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setShowDesignPicker(p=>!p)} title="Dizayn tanlash" style={{ background:showDesignPicker?'rgba(99,102,241,0.20)':'none', border:'1px solid '+(showDesignPicker?'rgba(99,102,241,0.50)':'var(--sunken-brd)'), cursor:'pointer', borderRadius:9, padding:'5px 12px', display:'flex', alignItems:'center', gap:5, color:'#818cf8', fontSize:11, fontWeight:600 }}>
            <Palette size={13} /> Dizayn
          </button>
          <button onClick={onOpenAddCard} title="Karta qo'shish" style={{ background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.25)', cursor:'pointer', borderRadius:9, padding:'5px 12px', display:'flex', alignItems:'center', gap:5, color:'#60a5fa', fontSize:11, fontWeight:700 }}>
            + Karta Qo'shish
          </button>
        </div>
      </div>

      {/* 3D Coverflow Card Carousel */}
      <div style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
        minHeight: 270,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '10px 0',
      }}>
        {cards.map((c, i) => {
          let diff = i - activeIdx;
          if (cards.length > 2) {
            if (diff < -Math.floor(cards.length / 2)) diff += cards.length;
            if (diff > Math.floor(cards.length / 2)) diff -= cards.length;
          }

          const isActive = diff === 0;

          let transform = 'translateX(0px) scale(1) rotateY(0deg)';
          let zIndex = 10;
          let opacity = 1;
          let pointerEvents = 'auto';

          if (diff === 0) {
            transform = 'translateX(0px) scale(1) rotateY(0deg) translateZ(0px)';
            zIndex = 10;
            opacity = 1;
          } else if (diff === 1 || (cards.length === 2 && diff === -1 && activeIdx === 0)) {
            transform = 'translateX(210px) scale(0.82) rotateY(-22deg) translateZ(-50px)';
            zIndex = 5;
            opacity = 0.65;
          } else if (diff === -1 || (cards.length === 2 && diff === 1 && activeIdx === 1)) {
            transform = 'translateX(-210px) scale(0.82) rotateY(22deg) translateZ(-50px)';
            zIndex = 5;
            opacity = 0.65;
          } else {
            transform = diff > 0 ? 'translateX(380px) scale(0.65) rotateY(-35deg)' : 'translateX(-380px) scale(0.65) rotateY(35deg)';
            zIndex = 1;
            opacity = 0;
            pointerEvents = 'none';
          }

          return (
            <div
              key={c.id}
              onClick={() => onSetActiveCard(c.id)}
              style={{
                position: 'absolute',
                transform,
                zIndex,
                opacity,
                pointerEvents,
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                cursor: isActive ? 'default' : 'pointer',
                transformStyle: 'preserve-3d',
              }}
            >
              <CreditCardVisual
                card={c}
                isActive={isActive}
                onCopy={handleCopy}
                copied={copied}
              />
            </div>
          );
        })}

        {/* Carousel arrows */}
        {cards.length > 1 && (
          <>
            <button onClick={goPrev} style={{
              position:'absolute', left:20, top:'50%', transform:'translateY(-50%)',
              zIndex:20, width:38, height:38, borderRadius:'50%',
              background:'rgba(15, 23, 42, 0.75)', border:'1px solid rgba(255,255,255,0.15)',
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', boxShadow:'0 4px 14px rgba(0,0,0,0.50)', backdropFilter:'blur(6px)',
              transition:'all 0.2s',
            }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={goNext} style={{
              position:'absolute', right:20, top:'50%', transform:'translateY(-50%)',
              zIndex:20, width:38, height:38, borderRadius:'50%',
              background:'rgba(15, 23, 42, 0.75)', border:'1px solid rgba(255,255,255,0.15)',
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', boxShadow:'0 4px 14px rgba(0,0,0,0.50)', backdropFilter:'blur(6px)',
              transition:'all 0.2s',
            }}>
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Dots indicator */}
      {cards.length > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:-6 }}>
          {cards.map(c => (
            <button key={c.id} onClick={() => onSetActiveCard(c.id)} style={{
              width: c.id === activeCardId ? 22 : 7,
              height:7, borderRadius:999, border:'none', cursor:'pointer',
              background: c.id === activeCardId ? '#3b82f6' : 'var(--text-4)',
              transition:'all 0.25s',
            }} />
          ))}
        </div>
      )}

      {/* Design Picker (collapsible) */}
      {showDesignPicker && (
        <div className="sunken" style={{ padding:14 }}>
          <div style={{ fontSize:11, color:'var(--text-3)', fontWeight:700, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>
            Karta Dizaynini Tanlang — {activeCard.name}
          </div>
          <DesignPicker
            current={activeCard.design}
            onSelect={id => onUpdateCardDesign(activeCard.id, id)}
          />
          <div style={{ fontSize:10, color:'var(--text-3)', marginTop:8 }}>
            {CARD_DESIGNS.find(d => d.id === activeCard.design)?.name}
          </div>
        </div>
      )}

      {/* Card list mini */}
      <div className="sunken" style={{ padding:14 }}>
        <div style={{ fontSize:11, color:'var(--text-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>
          Barcha Kartalar ({cards.length})
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:10 }}>
          {cards.map(c => {
            const d = CARD_DESIGNS.find(dd => dd.id === c.design) || CARD_DESIGNS[0];
            const isActive = c.id === activeCardId;
            return (
              <div
                key={c.id}
                onClick={() => onSetActiveCard(c.id)}
                style={{
                  display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10,
                  background: isActive ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                  border: isActive ? '1px solid rgba(59,130,246,0.30)' : '1px solid transparent',
                  cursor:'pointer', transition:'all 0.18s',
                }}
              >
                {/* Mini gradient pill */}
                <div style={{ width:38, height:24, borderRadius:6, background:d.gradient, flexShrink:0, boxShadow:'0 2px 6px rgba(0,0,0,0.40)' }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--text-1)' }}>{c.name}</div>
                  <div className="num" style={{ fontSize:11, color:'var(--text-3)' }}>{formatMoney(c.balance)}</div>
                </div>
                {cards.length > 1 && !c.isDefault && (
                  <button
                    onClick={e => { e.stopPropagation(); setCardToDelete(c); }}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-4)', display:'flex', padding:4, borderRadius:6, transition:'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color='#f43f5e'}
                    onMouseLeave={e => e.currentTarget.style.color='var(--text-4)'}
                    title="Kartani o'chirish"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Controls & Action buttons row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div className="sunken" style={{ padding:14, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <Zap size={14} color={autoPayEnabled ? '#fbbf24' : 'var(--text-4)'} style={{ transition:'color 0.2s' }} />
              <span style={{ fontSize:12, fontWeight:700, color:'var(--text-1)' }}>Avto-To'lov Simulyatori</span>
            </div>
            <button className={`toggle ${autoPayEnabled ? 'toggle-on' : 'toggle-off'}`} onClick={onToggleAutoPay}>
              <div className="toggle-knob" />
            </button>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
            <span style={{ fontSize:11, color:'var(--text-3)' }}>Oraliq tezlik:</span>
            <select
              className="sel"
              value={intervalSpeed}
              onChange={e => onChangeIntervalSpeed(+e.target.value)}
              disabled={!autoPayEnabled}
              style={{ width:'auto', padding:'4px 8px', fontSize:11, opacity: autoPayEnabled ? 1 : 0.45 }}
            >
              <option value={3000}>Har 3s</option>
              <option value={5000}>Har 5s</option>
              <option value={10000}>Har 10s</option>
            </select>
          </div>
        </div>

        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button className="btn btn-green" onClick={onOpenTopUpModal} style={{ flex:1, justifyContent:'center', fontSize:12, padding:'12px 10px', height:'100%' }}>
            <PlusCircle size={15} />
            Balansni To'ldirish
          </button>
          <button className="btn btn-ghost" onClick={onTriggerRandomTransaction} style={{ flex:1, justifyContent:'center', fontSize:12, padding:'12px 10px', height:'100%' }}>
            <Sparkles size={15} color="#fbbf24" />
            Random To'lov
          </button>
        </div>
      </div>

      {/* Delete Card Confirmation Modal */}
      {cardToDelete && (
        <div style={{
          position:'fixed', inset:0, zIndex:999,
          background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        }}>
          <div className="card" style={{ maxWidth:400, width:'100%', padding:24, animation:'fadeIn 0.2s ease-out' }}>
            <div style={{ fontSize:16, fontWeight:800, color:'var(--text-1)', marginBottom:8 }}>
              Kartani o'chirishni tasdiqlaysizmi?
            </div>
            <div style={{ fontSize:13, color:'var(--text-3)', marginBottom:20, lineHeight:1.5 }}>
              <strong style={{ color:'#f43f5e' }}>"{cardToDelete.name}"</strong> kartasini o'chirishga ishonchingiz komilmi? Bu amalni ortga qaytarib bo'lmaydi.
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setCardToDelete(null)}
                style={{ padding:'9px 16px', fontSize:13 }}
              >
                Bekor qilish
              </button>
              <button
                className="btn btn-danger"
                onClick={() => confirmDelete(cardToDelete.id)}
                style={{ padding:'9px 18px', fontSize:13, background:'#f43f5e', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer' }}
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
