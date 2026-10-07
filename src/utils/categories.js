import {
  Utensils,
  Car,
  Zap,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  TrendingUp,
  HelpCircle,
  Tag
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Ovqatlanish & Restoran',
    shortName: 'Ovqatlanish',
    icon: Utensils,
    color: '#f97316', // Orange
    bgLight: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.4)',
    keywords: ['evos', 'les ailes', 'korzinka', 'makro', 'rayhon', 'restaurant', 'restoran', 'cafe', 'kofe', 'oshxona', 'burger', 'pizza', 'kfc', 'tavuk', 'bistro', 'supermarket', 'oziq-ovqat', 'lavash', 'doner', 'toshkent osh', 'choyxona', 'food', 'market', 'halal', 'safia', 'wosman', 'feedo', 'fast food']
  },
  {
    id: 'transport',
    name: 'Transport & Yo\'l',
    shortName: 'Transport',
    icon: Car,
    color: '#3b82f6', // Blue
    bgLight: 'rgba(59, 130, 246, 0.15)',
    border: 'rgba(59, 130, 246, 0.4)',
    keywords: ['yandex', 'taksi', 'taxi', 'benzin', 'zapravka', 'metropoliten', 'metro', 'avtobus', 'uzbekistan airways', 'train', 'poyezd', 'petrol', 'shell', 'mustang', 'ung', 'loko', 'uber', 'my taxi', 'propel']
  },
  {
    id: 'utilities',
    name: 'Kommunal & Xizmatlar',
    shortName: 'Kommunal',
    icon: Zap,
    color: '#eab308', // Yellow
    bgLight: 'rgba(234, 179, 8, 0.15)',
    border: 'rgba(234, 179, 8, 0.4)',
    keywords: ['uztelecom', 'beeline', 'ucell', 'mobiuz', 'humans', 'wifi', 'internet', 'svet', 'gaz', 'suv', 'mahalla', 'kommunal', 'telefon', 'paynet', 'to\'lov', 'billing', 'click', 'payme']
  },
  {
    id: 'shopping',
    name: 'Xaridlar & Kiyim',
    shortName: 'Xaridlar',
    icon: ShoppingBag,
    color: '#ec4899', // Pink
    bgLight: 'rgba(236, 72, 153, 0.15)',
    border: 'rgba(236, 72, 153, 0.4)',
    keywords: ['uzum', 'aliexpress', 'zara', 'terra pro', 'clothes', 'bozor', 'bazar', 'texnomart', 'mediapark', 'apparel', 'moll', 'shoes', 'dress', 'boutique', 'brand', 'mall', 'magazin']
  },
  {
    id: 'entertainment',
    name: 'Ko\'ngilochar & Hordiq',
    shortName: 'Ko\'ngilochar',
    icon: Film,
    color: '#a855f7', // Purple
    bgLight: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.4)',
    keywords: ['cinema', 'kino', 'netflix', 'spotify', 'steam', 'playstation', 'concert', 'game', 'bowling', 'park', 'attraction', 'pub', 'club', 'youtube', 'games', 'bilyard']
  },
  {
    id: 'health',
    name: 'Salomatlik & Tibbiyot',
    shortName: 'Salomatlik',
    icon: HeartPulse,
    color: '#10b981', // Emerald
    bgLight: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)',
    keywords: ['apteka', 'dori', 'pharmacy', 'shifoxona', 'hospital', 'doktor', 'stomatolog', 'fitness', 'gym', 'sport', 'klinika', 'med', 'zuhra', 'oza pharm', 'grand pharm']
  },
  {
    id: 'education',
    name: 'Ta\'lim & Kitoblar',
    shortName: 'Ta\'lim',
    icon: GraduationCap,
    color: '#06b6d4', // Cyan
    bgLight: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.4)',
    keywords: ['kurs', 'udemy', 'coursera', 'kitob', 'book', 'maktab', 'universitet', 'tutor', 'student', 'school', 'edu', 'it live', 'najot ta\'lim', 'mohirdev']
  },
  {
    id: 'income',
    name: 'Daromad (Tushum)',
    shortName: 'Daromad',
    icon: TrendingUp,
    color: '#22c55e', // Green
    bgLight: 'rgba(34, 197, 94, 0.15)',
    border: 'rgba(34, 197, 94, 0.4)',
    keywords: ['oylik', 'zarplata', 'daromad', 'pay', 'salary', 'bonus', 'cashback', 'kashbek', 'karta o\'tkazmasi', 'transfer', 'tushum', 'mukofot', 'stipendiya']
  },
  {
    id: 'nomalum',
    name: 'Noma\'lum',
    shortName: 'Noma\'lum',
    icon: HelpCircle,
    color: '#94a3b8', // Slate gray
    bgLight: 'rgba(148, 163, 184, 0.15)',
    border: 'rgba(148, 163, 184, 0.4)',
    keywords: [] // Matches everything else
  }
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === 'nomalum');
};

/**
 * Smart Auto-Categorization Algorithm:
 * Checks title or merchant string against category keyword patterns.
 * Returns category ID ('food', 'transport', 'utilities', ..., or 'nomalum' if unrecognized).
 */
export const autoCategorizeMerchant = (merchantName = '') => {
  if (!merchantName || typeof merchantName !== 'string') {
    return 'nomalum';
  }

  const cleanText = merchantName.toLowerCase().trim();

  // First check if it's explicitly income related
  const incomeCategory = CATEGORIES.find(c => c.id === 'income');
  if (incomeCategory.keywords.some(kw => cleanText.includes(kw))) {
    return 'income';
  }

  // Check expense categories
  for (const cat of CATEGORIES) {
    if (cat.id === 'income' || cat.id === 'nomalum') continue;
    for (const kw of cat.keywords) {
      if (cleanText.includes(kw)) {
        return cat.id;
      }
    }
  }

  // If no match found, route to 'nomalum' as required
  return 'nomalum';
};
