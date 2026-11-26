import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'bn';

const BN: Record<string, string> = {
  'Today': 'আজ',
  'Add records': 'হিসাব যোগ',
  'Cash radar': 'ক্যাশ রাডার',
  'Customers': 'গ্রাহক',
  'Loans': 'ঋণ',
  'Insights': 'ইনসাইট',
  'Passport': 'পাসপোর্ট',
  'Alerts': 'সতর্কতা',
  'Cash in hand': 'হাতে নগদ',
  'Money in this month': 'এই মাসে আয়',
  'Money out this month': 'এই মাসে খরচ',
  'Customers owe you': 'গ্রাহকের বাকি',
  'Next 30 days': 'আগামী ৩০ দিন',
  'Safety reserve': 'নিরাপত্তা রিজার্ভ',
  'Fix this gap': 'ঘাটতি মেটান',
  'Record a voice note': 'ভয়েস নোট রেকর্ড করুন',
  'Make drafts': 'ড্রাফট তৈরি করুন',
  'Prototype · sample data · no backend': 'প্রোটোটাইপ · নমুনা তথ্য · ব্যাকএন্ড নেই',
  'See tomorrow’s cash today.': 'আগামীকালের ক্যাশ, আজই দেখুন।',
  'Open the prototype': 'প্রোটোটাইপ খুলুন',
  'Good morning, Rahim': 'শুভ সকাল, রহিম',
  'Rescue plans': 'উদ্ধার পরিকল্পনা',
  'Back to site': 'সাইটে ফিরুন',
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'en', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LangCtx);
  const t = (s: string) => (lang === 'bn' ? BN[s] ?? s : s);
  return { lang, setLang, t };
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

// Bangladeshi grouping: 4,20,000 and 18,40,000.
export function taka(n: number, lang: Lang = 'en'): string {
  const sign = n < 0 ? '−' : '';
  const s = Math.abs(Math.round(n)).toString();
  let grouped = s;
  if (s.length > 3) {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    grouped = `${rest},${last3}`;
  }
  const text = `${sign}Tk ${grouped}`;
  return lang === 'bn' ? text.replace('Tk', '৳').replace(/\d/g, (d) => BN_DIGITS[Number(d)]) : text;
}
