import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { getCategoryById } from '../utils/categories';
import { formatMoney } from '../utils/formatters';

const PieTTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card sunken" style={{ padding:'10px 14px', fontSize:12, minWidth:130, boxShadow:'0 10px 25px rgba(0,0,0,0.5)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:7, fontWeight:700, color: d.color || payload[0].fill }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background: d.color || payload[0].fill, display:'inline-block' }} />
        {d.name}
      </div>
      <div className="num" style={{ fontSize:13, fontWeight:800, color:'var(--text-1)', marginTop:4 }}>
        {formatMoney(d.value || payload[0].value)}
      </div>
    </div>
  );
};

const BarTTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card sunken" style={{ padding:'10px 14px', fontSize:12, minWidth:150, boxShadow:'0 10px 25px rgba(0,0,0,0.5)' }}>
      <div style={{ fontWeight:700, color:'var(--text-1)', marginBottom:6, borderBottom:'1px solid rgba(255,255,255,0.08)', paddingBottom:4 }}>
        Sana: {label}
      </div>
      {payload.map((item, idx) => (
        <div key={idx} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginTop:4 }}>
          <span style={{ color: item.fill, fontWeight:600, fontSize:11, display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:2, background: item.fill }} />
            {item.name}:
          </span>
          <span className="num" style={{ fontWeight:800, color:'var(--text-1)', fontSize:12 }}>
            {formatMoney(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const formatYAxis = (v) => {
  if (v === 0) return '0';
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${Math.round(v / 1000)}k`;
  return `${v}`;
};

export function ChartsPanel({ transactions }) {
  /* ── Pie data ── */
  const catMap = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + +t.amount;
  });
  const pieData = Object.entries(catMap)
    .map(([id, value]) => { const c = getCategoryById(id); return { id, name:c.shortName, value, color:c.color }; })
    .sort((a,b) => b.value - a.value);

  /* ── Bar data (7 days) ── */
  const dayMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('uz-UZ', { day:'numeric', month:'short' });
    dayMap[key] = { date: key, expense:0, income:0 };
  }
  transactions.forEach(t => {
    const key = new Date(t.date).toLocaleDateString('uz-UZ', { day:'numeric', month:'short' });
    if (dayMap[key]) {
      if (t.type === 'expense') dayMap[key].expense += +t.amount;
      else dayMap[key].income += +t.amount;
    }
  });
  const barData = Object.values(dayMap);

  const panelStyle = { padding:'24px' };
  const titleStyle = { display:'flex', alignItems:'center', gap:9, marginBottom:20, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.07)' };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

      {/* ── Pie Chart ── */}
      <div className="card" style={panelStyle}>
        <div style={titleStyle}>
          <PieIcon size={17} color="#818cf8" />
          <span style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>Kategoriyalar Bo'yicha</span>
          <span style={{ marginLeft:'auto', fontSize:11, color:'var(--text-3)' }}>{pieData.length} kategoriya</span>
        </div>

        {pieData.length === 0 ? (
          <div className="sunken" style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-3)', fontSize:13 }}>
            Xarajatlar yo'q
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, alignItems:'center' }}>
            {/* Chart */}
            <div style={{ height:220, position:'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={84} paddingAngle={4} dataKey="value">
                    {pieData.map((e,i) => <Cell key={i} fill={e.color} stroke="none" />)}
                  </Pie>
                  <Tooltip content={<PieTTip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                <span style={{ fontSize:10, color:'var(--text-3)', textTransform:'uppercase', fontWeight:700, letterSpacing:'0.06em' }}>TAQSIMOT</span>
                <span style={{ fontSize:13, fontWeight:800, color:'var(--text-1)', marginTop:2 }}>{pieData.length} turda</span>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:220, overflowY:'auto', paddingRight:4 }}>
              {pieData.map(item => {
                const total = pieData.reduce((s,i) => s+i.value, 0);
                const pct = Math.round(item.value / total * 100);
                return (
                  <div key={item.id} className="sunken" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, minWidth:0 }}>
                      <span style={{ width:8, height:8, borderRadius:'50%', background:item.color, flexShrink:0 }} />
                      <span style={{ fontSize:11, color:'var(--text-2)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</span>
                    </div>
                    <span className="num" style={{ fontSize:11, fontWeight:800, color:'var(--text-1)', marginLeft:6 }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Bar Chart ── */}
      <div className="card" style={panelStyle}>
        <div style={titleStyle}>
          <BarChart3 size={17} color="#34d399" />
          <span style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>7 Kunlik Dinamika</span>
          <div style={{ marginLeft:'auto', display:'flex', gap:14 }}>
            {[['#f43f5e','Xarajat'],['#10b981','Daromad']].map(([c,l]) => (
              <div key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'var(--text-2)', fontWeight:600 }}>
                <span style={{ width:10, height:10, borderRadius:3, background:c, display:'inline-block' }} />
                {l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top:10, right:10, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--text-4)" fontSize={11} tickLine={false} tick={{ fill:'var(--text-3)' }} />
              <YAxis stroke="var(--text-4)" fontSize={11} tickLine={false} tick={{ fill:'var(--text-3)' }} tickFormatter={formatYAxis} width={50} />
              <Tooltip content={<BarTTip />} />
              <Bar dataKey="expense" name="Xarajat" fill="#f43f5e" radius={[5,5,0,0]} minPointSize={3} />
              <Bar dataKey="income"  name="Daromad" fill="#10b981" radius={[5,5,0,0]} minPointSize={3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
