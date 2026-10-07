import React, { useState, useEffect } from 'react';
import { CreditCard, Sun, Moon, RefreshCw, Clock, Plus } from 'lucide-react';

export function Header({ theme, toggleTheme, onOpenAddCard, onResetData, autoPayEnabled }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  const dateStr = now.toLocaleDateString('uz-UZ', { day:'numeric', month:'long', year:'numeric' });
  const isDark = theme === 'dark';

  return (
    <header className="card" style={{ padding:'14px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>

        {/* ── Brand ── */}
        <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div style={{
              width:42, height:42, borderRadius:13,
              background:'linear-gradient(135deg,#2563eb,#6366f1,#10b981)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 14px rgba(99,102,241,0.40)',
            }}>
              <CreditCard size={20} color="#fff" />
            </div>
            {autoPayEnabled && (
              <span style={{
                position:'absolute', top:-3, right:-3,
                width:11, height:11, borderRadius:'50%', background:'#10b981',
                boxShadow:'0 0 0 2px var(--bg)',
                animation:'pulse-dot 1.5s infinite'
              }} />
            )}
          </div>
          <div>
            <span style={{ fontSize:17, fontWeight:800, color:'var(--text-1)', letterSpacing:'-0.02em' }}>
              Paynet<span style={{ color:'#3b82f6' }}>Xarajat</span>
            </span>
            <span style={{
              marginLeft:8, fontSize:10, fontWeight:700, letterSpacing:'0.06em',
              background:'rgba(59,130,246,0.14)', color:'#60a5fa',
              border:'1px solid rgba(59,130,246,0.28)', borderRadius:999, padding:'2px 7px'
            }}>VIRTUAL</span>
            <div style={{ fontSize:11, color:'var(--text-3)', marginTop:1 }}>
              Xarajatlar &amp; Balans Nazorati Tizimi
            </div>
          </div>
        </div>

        {/* ── Clock ── */}
        <div className="sunken" style={{ padding:'7px 18px', textAlign:'center', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center' }}>
            <Clock size={11} color="#10b981" />
            <span className="num" style={{ fontSize:13, fontWeight:700, color:'var(--text-1)', letterSpacing:'0.04em' }}>
              {hh}:{mm}:{ss}
            </span>
          </div>
          <div style={{ fontSize:11, color:'var(--text-3)', marginTop:1 }}>{dateStr}</div>
        </div>

        {/* ── Actions ── */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, flexWrap:'wrap' }}>
          <button className="btn btn-ghost" onClick={onResetData} style={{ padding:'8px 14px', fontSize:12 }}>
            <RefreshCw size={13} />
            Qayta yuklash
          </button>

          {/* Theme toggle — full button */}
          <button
            className="btn btn-ghost"
            onClick={toggleTheme}
            style={{ padding:'8px 14px', fontSize:12, gap:7 }}
          >
            {isDark
              ? <><Sun size={14} color="#fbbf24" /> Yorug' rejim</>
              : <><Moon size={14} color="#818cf8" /> Qorong'i rejim</>
            }
          </button>
        </div>

      </div>
    </header>
  );
}
