import { autoCategorizeMerchant } from './categories';

export const RANDOM_SIMULATOR_ITEMS = [
  // Food & Restaurant
  { title: 'Evos Express Lavash', amount: 38000, type: 'expense', note: 'Avto-yechuv: Evos Fast Food' },
  { title: 'Korzinka Supermarket', amount: 115000, type: 'expense', note: 'Avto-yechuv: Korzinka Oziq-ovqat' },
  { title: 'Safia Bakery & Cafe', amount: 52000, type: 'expense', note: 'Avto-yechuv: Kofe va tort' },
  { title: 'Les Ailes Chicken', amount: 64000, type: 'expense', note: 'Avto-yechuv: Stripsi kombo' },
  { title: 'Toshkent Osh Markazi', amount: 45000, type: 'expense', note: 'Avto-yechuv: To\'y oshi va salat' },

  // Transport
  { title: 'Yandex Go Comfort Taxi', amount: 26000, type: 'expense', note: 'Avto-yechuv: Taksi safari' },
  { title: 'UNG Petrol Zapravka', amount: 150000, type: 'expense', note: 'Avto-yechuv: Benzin to\'lovi' },
  { title: 'Toshkent Metropoliteni', amount: 3000, type: 'expense', note: 'Avto-yechuv: Metro yo\'l haqi' },

  // Utilities & Phone
  { title: 'Uztelecom Internet Billing', amount: 110000, type: 'expense', note: 'Avto-yechuv: Oylik internet' },
  { title: 'Beeline Mobiles Balans', amount: 25000, type: 'expense', note: 'Avto-yechuv: Telefon balansi' },
  { title: 'Kommunal Svet To\'lovi', amount: 75000, type: 'expense', note: 'Avto-yechuv: Elektr energiyasi' },

  // Shopping
  { title: 'Uzum Market Xarid', amount: 185000, type: 'expense', note: 'Avto-yechuv: Uy-rozg\'or buyumlari' },
  { title: 'Terra Pro Kiyim Do\'koni', amount: 240000, type: 'expense', note: 'Avto-yechuv: Futbolka va shim' },

  // Entertainment
  { title: 'Netflix Premium HD', amount: 115000, type: 'expense', note: 'Avto-yechuv: Video obuna' },
  { title: 'Steam Games Store', amount: 89000, type: 'expense', note: 'Avto-yechuv: Kompyuter o\'yini' },

  // Health
  { title: 'Apteka Grand Pharm', amount: 48000, type: 'expense', note: 'Avto-yechuv: Dorixona xaridi' },
  { title: 'Stomatologiya Klinika', amount: 120000, type: 'expense', note: 'Avto-yechuv: Tish ko\'rigi' },

  // Education
  { title: 'Udemy Online Course', amount: 135000, type: 'expense', note: 'Avto-yechuv: Dasturlash kursi' },

  // UNKNOWN MERCHANTS (Will automatically route to 'nomalum' category)
  { title: 'Noma\'lum POS Terminal #8912', amount: 35000, type: 'expense', note: 'Avto-yechuv (Noma\'lum manba)' },
  { title: 'Mavhum Savdo Nuqtasi X-4', amount: 42000, type: 'expense', note: 'Avto-yechuv (Noma\'lum kassa)' },
  { title: 'Merchant Terminal 09841', amount: 67000, type: 'expense', note: 'Avto-yechuv (Kategoriya aniqlanmadi)' },
  { title: 'Noma\'lum Xizmat Yechuvi', amount: 29000, type: 'expense', note: 'Avto-yechuv (Sirli xarajat)' },

  // Income items (Occasionally adds money back)
  { title: 'Paynet CashBack Bonus', amount: 35000, type: 'income', note: 'Avto-tushum: Paynet kashbek' },
  { title: 'Karta O\'tkazmasi (Bonus)', amount: 150000, type: 'income', note: 'Avto-tushum: Do\'stidan o\'tkazma' }
];

export const generateRandomTransaction = () => {
  const randomIndex = Math.floor(Math.random() * RANDOM_SIMULATOR_ITEMS.length);
  const template = RANDOM_SIMULATOR_ITEMS[randomIndex];

  // Slight random fluctuation in amount (+/- 15%)
  const variation = (Math.random() * 0.3 - 0.15);
  const finalAmount = Math.round((template.amount * (1 + variation)) / 1000) * 1000;

  // Smart auto categorization
  const categoryId = autoCategorizeMerchant(template.title);

  return {
    id: 'tx-sim-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    title: template.title,
    amount: Math.max(1000, finalAmount),
    type: template.type,
    category: categoryId,
    autoCategorized: true,
    method: 'virtual_card',
    date: new Date().toISOString(),
    note: template.note
  };
};
