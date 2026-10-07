import React, { useState, useEffect } from 'react';
import { Header }              from './components/Header';
import { VirtualCardPanel }    from './components/VirtualCardPanel';
import { StatsOverview }       from './components/StatsOverview';
import { ChartsPanel }         from './components/ChartsPanel';
import { BudgetLimitsPanel }   from './components/BudgetLimitsPanel';
import { TransactionList }     from './components/TransactionList';
import { AddTransactionModal } from './components/AddTransactionModal';
import { AddCardModal }        from './components/AddCardModal';
import { TopUpModal }          from './components/TopUpModal';
import { ToastNotification }   from './components/ToastNotification';

import { INITIAL_TRANSACTIONS, INITIAL_CARDS, INITIAL_BUDGETS } from './utils/sampleData';
import { generateRandomTransaction } from './utils/randomTransactions';

export default function App() {
  const load = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  };

  const [theme,        setTheme]        = useState(() => localStorage.getItem('pn_theme') || 'dark');
  const [transactions, setTransactions] = useState(() => load('pn_txs',   INITIAL_TRANSACTIONS));
  const [cards,        setCards]        = useState(() => load('pn_cards',  INITIAL_CARDS));
  const [budgets,      setBudgets]      = useState(() => load('pn_bud',    INITIAL_BUDGETS));
  const [activeCardId, setActiveCardId] = useState(() => load('pn_cards',  INITIAL_CARDS)?.[0]?.id);
  const [autoPayOn,    setAutoPayOn]    = useState(true);
  const [intervalMs,   setIntervalMs]   = useState(6000);

  const [addTxOpen,   setAddTxOpen]    = useState(false);
  const [addCardOpen, setAddCardOpen]  = useState(false);
  const [topUpOpen,   setTopUpOpen]    = useState(false);
  const [editItem,    setEditItem]     = useState(null);
  const [selCat,      setSelCat]       = useState('all');
  const [toast,       setToast]        = useState(null);

  /* ── Persist theme ── */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pn_theme', theme);
  }, [theme]);

  /* ── Persist data ── */
  useEffect(() => { localStorage.setItem('pn_txs',   JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('pn_cards', JSON.stringify(cards));        }, [cards]);
  useEffect(() => { localStorage.setItem('pn_bud',   JSON.stringify(budgets));      }, [budgets]);

  /* ── Auto-payment simulator ── */
  useEffect(() => {
    if (!autoPayOn || !activeCardId) return;
    const id = setInterval(() => {
      const tx = { ...generateRandomTransaction(), cardId: activeCardId };
      setCards(prev => prev.map(c =>
        c.id === activeCardId
          ? { ...c, balance: Math.max(0, c.balance + (tx.type === 'expense' ? -tx.amount : tx.amount)) }
          : c
      ));
      setTransactions(prev => [tx, ...prev]);
      setToast(tx);
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoPayOn, intervalMs, activeCardId]);

  /* ── Helpers ── */
  const addTx = (tx) => {
    if (editItem) {
      setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t));
      setEditItem(null);
    } else {
      const cId = tx.cardId || activeCardId;
      setTransactions(prev => [{ ...tx, cardId: cId }, ...prev]);
      if (tx.method === 'virtual_card' && cId) {
        const delta = tx.type === 'expense' ? -tx.amount : tx.amount;
        setCards(prev => prev.map(c => c.id === cId ? { ...c, balance: Math.max(0, c.balance + delta) } : c));
      }
    }
  };

  const delTx    = (id) => setTransactions(prev => prev.filter(t => t.id !== id));

  const topUp    = (amount, cardId) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, balance: c.balance + amount } : c));
    setTransactions(prev => [{
      id: 'tx-topup-' + Date.now(),
      title: "Kartani To'ldirish (TopUp)",
      amount, type: 'income', category: 'income', autoCategorized: true,
      cardId, method: 'virtual_card',
      date: new Date().toISOString(), note: "Balans to'ldirildi",
    }, ...prev]);
  };

  const randTx   = () => {
    const tx = { ...generateRandomTransaction(), cardId: activeCardId };
    setCards(prev => prev.map(c =>
      c.id === activeCardId
        ? { ...c, balance: Math.max(0, c.balance + (tx.type === 'expense' ? -tx.amount : tx.amount)) }
        : c
    ));
    setTransactions(prev => [tx, ...prev]);
    setToast(tx);
  };

  const addCard  = (card) => { setCards(prev => [...prev, card]); setActiveCardId(card.id); };
  const delCard  = (id)   => {
    setCards(prev => {
      const next = prev.filter(c => c.id !== id);
      if (activeCardId === id) setActiveCardId(next[0]?.id);
      return next;
    });
  };
  const updateCardDesign = (cardId, designId) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, design: designId } : c));
  };

  const resetAll = () => {
    if (!window.confirm("Barcha ma'lumotlarni qayta boshlashni istaysizmi?")) return;
    setTransactions(INITIAL_TRANSACTIONS);
    setCards(INITIAL_CARDS);
    setBudgets(INITIAL_BUDGETS);
    setActiveCardId(INITIAL_CARDS[0].id);
    ['pn_txs','pn_cards','pn_bud'].forEach(k => localStorage.removeItem(k));
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', padding:'24px 28px 60px', boxSizing:'border-box', transition:'background 0.3s' }}>
      <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', flexDirection:'column', gap:22 }}>

        {/* Header */}
        <Header
          theme={theme}
          toggleTheme={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
          onOpenAddCard={() => setAddCardOpen(true)}
          onResetData={resetAll}
          autoPayEnabled={autoPayOn}
        />

        {/* Hero Section: Virtual Cards Panel */}
        <VirtualCardPanel
          cards={cards}
          activeCardId={activeCardId}
          onSetActiveCard={setActiveCardId}
          onUpdateCardDesign={updateCardDesign}
          autoPayEnabled={autoPayOn}
          onToggleAutoPay={() => setAutoPayOn(p => !p)}
          intervalSpeed={intervalMs}
          onChangeIntervalSpeed={setIntervalMs}
          onTriggerRandomTransaction={randTx}
          onOpenTopUpModal={() => setTopUpOpen(true)}
          onDeleteCard={delCard}
          onOpenAddCard={() => setAddCardOpen(true)}
        />

        {/* Stats Overview */}
        <StatsOverview transactions={transactions} cards={cards} />

        {/* Row 2: Charts */}
        <ChartsPanel transactions={transactions} />

        {/* Row 3: Budget Limits */}
        <BudgetLimitsPanel
          transactions={transactions}
          budgets={budgets}
          onUpdateBudget={(id, v) => setBudgets(p => ({ ...p, [id]: v }))}
        />

        {/* Row 4: Transactions */}
        <TransactionList
          transactions={transactions}
          onDeleteTransaction={delTx}
          onEditTransaction={item => { setEditItem(item); setAddTxOpen(true); }}
        />

      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={addTxOpen}
        onClose={() => { setAddTxOpen(false); setEditItem(null); }}
        onSave={addTx}
        editItem={editItem}
        cards={cards}
        activeCardId={activeCardId}
      />
      <AddCardModal
        isOpen={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        onSave={addCard}
      />
      <TopUpModal
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        onTopUp={topUp}
        cards={cards}
        activeCardId={activeCardId}
      />

      {/* Toast */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
