export const CARD_DESIGNS = [
  {
    id: 'indigo',
    name: 'Indigo Classic',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4338ca 80%, #1e1b4b 100%)',
    glow: 'rgba(99,102,241,0.55)',
    textColor: '#e0e7ff',
    preview: ['#1e1b4b', '#4338ca'],
  },
  {
    id: 'midnight',
    name: 'Midnight Black',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 80%, #0f3460 100%)',
    glow: 'rgba(15,52,96,0.70)',
    textColor: '#e2e8f0',
    preview: ['#0a0a0a', '#0f3460'],
  },
  {
    id: 'purple',
    name: 'Purple Galaxy',
    gradient: 'linear-gradient(135deg, #2d1b69 0%, #553c9a 50%, #7c3aed 80%, #2d1b69 100%)',
    glow: 'rgba(124,58,237,0.60)',
    textColor: '#ede9fe',
    preview: ['#2d1b69', '#7c3aed'],
  },
  {
    id: 'teal',
    name: 'Ocean Teal',
    gradient: 'linear-gradient(135deg, #042f2e 0%, #134e4a 45%, #0d9488 80%, #042f2e 100%)',
    glow: 'rgba(13,148,136,0.60)',
    textColor: '#ccfbf1',
    preview: ['#042f2e', '#0d9488'],
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    gradient: 'linear-gradient(135deg, #4c0519 0%, #881337 45%, #be185d 80%, #4c0519 100%)',
    glow: 'rgba(190,24,93,0.60)',
    textColor: '#fce7f3',
    preview: ['#4c0519', '#be185d'],
  },
  {
    id: 'gold',
    name: 'Premium Gold',
    gradient: 'linear-gradient(135deg, #1c1008 0%, #451a03 45%, #92400e 80%, #1c1008 100%)',
    glow: 'rgba(146,64,14,0.60)',
    textColor: '#fef3c7',
    preview: ['#1c1008', '#92400e'],
  },
];

export const INITIAL_CARDS = [
  {
    id: 'card-1',
    name: 'Asosiy Karta',
    cardNumber: '8600 •••• •••• 4921',
    cardHolder: 'PAYNET VIRTUAL',
    expiry: '12/28',
    balance: 3868000,
    design: 'indigo',
    status: 'active',
    isDefault: true,
  },
  {
    id: 'card-2',
    name: "Jamg'arma Karta",
    cardNumber: '9860 •••• •••• 7734',
    cardHolder: 'PAYNET VIRTUAL',
    expiry: '08/27',
    balance: 12500000,
    design: 'teal',
    status: 'active',
    isDefault: false,
  },
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Evos Fast Food',
    amount: 45000,
    type: 'expense',
    category: 'food',
    autoCategorized: true,
    cardId: 'card-1',
    method: 'virtual_card',
    date: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    note: 'Tovuqli Lavash & Cola'
  },
  {
    id: 'tx-2',
    title: 'Yandex Go Taksi',
    amount: 22000,
    type: 'expense',
    category: 'transport',
    autoCategorized: true,
    cardId: 'card-1',
    method: 'virtual_card',
    date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    note: 'Chorsu -> Amir Temur xiyoboni'
  },
  {
    id: 'tx-3',
    title: 'Korzinka Supermarket',
    amount: 135000,
    type: 'expense',
    category: 'food',
    autoCategorized: true,
    cardId: 'card-1',
    method: 'virtual_card',
    date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    note: 'Haftalik oziq-ovqat va mevalar'
  },
  {
    id: 'tx-4',
    title: "Oylik Maosh O'tkazmasi",
    amount: 4500000,
    type: 'income',
    category: 'income',
    autoCategorized: true,
    cardId: 'card-1',
    method: 'virtual_card',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    note: 'Sentyabr oylik maoshi'
  },
  {
    id: 'tx-5',
    title: 'Uztelecom Home Wi-Fi',
    amount: 110000,
    type: 'expense',
    category: 'utilities',
    autoCategorized: true,
    cardId: 'card-2',
    method: 'virtual_card',
    date: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    note: "Oktyabr oyi internet to'lovi"
  },
  {
    id: 'tx-6',
    title: "Noma'lum POS Terminal #4920",
    amount: 38000,
    type: 'expense',
    category: 'nomalum',
    autoCategorized: true,
    cardId: 'card-1',
    method: 'virtual_card',
    date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    note: 'Karta orqali avto-yechib olindi'
  },
  {
    id: 'tx-7',
    title: 'Apteka Grand Pharm',
    amount: 64000,
    type: 'expense',
    category: 'health',
    autoCategorized: true,
    cardId: 'card-2',
    method: 'virtual_card',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    note: 'Vitamin va shamollash dorilari'
  },
  {
    id: 'tx-8',
    title: "Mavhum Do'kon #88",
    amount: 18000,
    type: 'expense',
    category: 'nomalum',
    autoCategorized: true,
    cardId: 'card-2',
    method: 'virtual_card',
    date: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
    note: "Noma'lum kartadan yechilgan summa"
  }
];

export const INITIAL_BUDGETS = {
  food: 1200000,
  transport: 400000,
  utilities: 300000,
  shopping: 500000,
  entertainment: 350000,
  health: 300000,
  education: 500000,
  nomalum: 200000
};
