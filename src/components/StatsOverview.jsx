import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { CATEGORIES } from '../utils/categories';

export function StatsOverview({ transactions, cards }) {
  // sum all cards balance
  const totalBalance = cards.reduce((s, c) => s + c.balance, 0);

  const income  = transactions.filter(t => t.type === 'income').reduce((s,t) => s + +t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s,t) => s + +t.amount, 0);

  const catTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + +t.amount;
  });
  const topId  = Object.entries(catTotals).sort((a,b) => b[1]-a[1])[0]?.[0] || 'food';
  const topCat = CATEGORIES.find(c => c.id === topId) || CATEGORIES[0];
  const TopIcon = topCat.icon;
  const topSpent = catTotals[topId] || 0;

  const stats = [
    {
      label:'Jami Balans',
      value: formatMoney(totalBalance),
      sub: `${cards.length} ta virtual karta`,
      Icon: Wallet,
      color:'#3b82f6', bg:'rgba(59,130,246,0.12)', border:'rgba(59,130,246,0.25)', textColor:'var(--text-1)',
    },
    {
      label:'Jami Daromad',
      value: `+${formatMoney(income)}`,
      sub: `${transactions.filter(t=>t.type==='income').length} ta tushum`,
      Icon: TrendingUp,
      color:'#10b981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.25)', textColor:'#34d399',
    },
    {
      label:'Jami Xarajat',
      value: `-${formatMoney(expense)}`,
      sub: `${transactions.filter(t=>t.type==='expense').length} ta chiqim`,
      Icon: TrendingDown,
      color:'#f43f5e', bg:'rgba(244,63,94,0.12)', border:'rgba(244,63,94,0.25)', textColor:'#fb7185',
    },
    {
      label:"Eng Ko'p Xarajat",
      value: topCat.shortName,
      sub: formatMoney(topSpent) + ' yechilgan',
      Icon: TopIcon,
      color: topCat.color, bg: topCat.bgLight, border: topCat.border, textColor: 'var(--text-1)',
    },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16 }}>
      {stats.map(s => {
        const SIcon = s.Icon;
        return (
          <div key={s.label} className="card" style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:14 }}>
            {/* Icon */}
            <div style={{
              width:44, height:44, borderRadius:14, flexShrink:0,
              background:s.bg, border:`1px solid ${s.border}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'inset 2px 2px 5px rgba(0,0,0,0.40)',
            }}>
              <SIcon size={20} color={s.color} />
            </div>
            {/* Text */}
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-3)', marginBottom:4 }}>
                {s.label}
              </div>
              <div className="num" style={{ fontSize:16, fontWeight:800, color:s.textColor, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {s.value}
              </div>
              <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {s.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
