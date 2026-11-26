// Sample business used by the Round 1 prototype. Every figure here is fictional and fixed:
// the prototype has no backend, no database and no AI. The real engine is built from 11 Dec 2026.

export const TODAY = new Date(2026, 10, 28); // 28 Nov 2026
export const RESERVE = 50_000;
export const START_CASH = 150_000;

export const business = {
  name: 'Rahim Garments',
  nameBn: 'রহিম গার্মেন্টস',
  owner: 'Rahim',
  city: 'Cumilla',
  kind: 'Garment supplier',
};

export function dayDate(offset: number): Date {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + offset);
  return d;
}

export type Movement = { day: number; amount: number; label: string; kind: 'in' | 'out' };

// The realistic case: Dhaka Fashion usually pays 8 days after the due date.
export const realistic: Movement[] = [
  { day: 2, amount: -5_000, label: 'Transport & tea', kind: 'out' },
  { day: 6, amount: -420_000, label: 'Karim Textile: fabric bill', kind: 'out' },
  { day: 10, amount: -35_000, label: 'Shop rent', kind: 'out' },
  { day: 12, amount: 80_000, label: 'Dhaka Fashion (expected late)', kind: 'in' },
  { day: 15, amount: -60_000, label: 'Staff wages', kind: 'out' },
  { day: 18, amount: 120_000, label: 'Shapla Traders', kind: 'in' },
  { day: 25, amount: 600_000, label: 'Lotus Apparel export order', kind: 'in' },
];

export const dueDateCase: Movement[] = realistic.map((m) =>
  m.label.startsWith('Dhaka Fashion') ? { ...m, day: 4, label: 'Dhaka Fashion (on due date)' } : m,
);

// Plan A: collect Dhaka Fashion early, split the fabric bill, borrow the cheapest offer that fits.
export const planA: Movement[] = [
  { day: 2, amount: -5_000, label: 'Transport & tea', kind: 'out' },
  { day: 5, amount: 80_000, label: 'Dhaka Fashion (collected early)', kind: 'in' },
  { day: 6, amount: -210_000, label: 'Karim Textile: first half', kind: 'out' },
  { day: 6, amount: 198_000, label: 'Bank SME loan (net of fee)', kind: 'in' },
  { day: 10, amount: -35_000, label: 'Shop rent', kind: 'out' },
  { day: 15, amount: -60_000, label: 'Staff wages', kind: 'out' },
  { day: 18, amount: 120_000, label: 'Shapla Traders', kind: 'in' },
  { day: 25, amount: 600_000, label: 'Lotus Apparel export order', kind: 'in' },
  { day: 26, amount: -210_000, label: 'Karim Textile: second half', kind: 'out' },
];

export function project(moves: Movement[], days = 30): number[] {
  const out: number[] = [];
  let bal = START_CASH;
  for (let d = 0; d <= days; d++) {
    for (const m of moves) if (m.day === d) bal += m.amount;
    out.push(bal);
  }
  return out;
}

export const plans = [
  {
    id: 'A',
    title: 'Collect early, split the bill, borrow the cheapest fit',
    titleBn: 'আগে আদায়, বিল ভাগ, সবচেয়ে সস্তা ঋণ',
    lowest: 118_000,
    closes: 100,
    cost: 'Loan cost Tk 16,925 over 12 months (interest + fee)',
    steps: [
      'Remind Dhaka Fashion: Tk 80,000, usually 8 days late',
      'Ask Karim Textile to split Tk 4,20,000 into two parts (4 Dec and 24 Dec)',
      'Take the bank SME loan of Tk 2,00,000: 16.6% true yearly cost',
    ],
  },
  {
    id: 'B',
    title: 'Collect early and split the bill (no loan)',
    titleBn: 'আগে আদায় ও বিল ভাগ (ঋণ ছাড়া)',
    lowest: -80_000,
    closes: 64,
    cost: 'No interest',
    steps: [
      'Remind Dhaka Fashion: Tk 80,000',
      'Ask Karim Textile to split Tk 4,20,000 into two parts',
      'Still Tk 1,30,000 below the reserve on 13 Dec',
    ],
  },
];

export const drafts = [
  { id: 1, kind: 'Paid', who: 'Shop rent', amount: 5_000, day: 'Sat 21 Nov', quote: 'Shombar dokan bhara 5000 taka dilam' },
  { id: 2, kind: 'Paid', who: 'Transport', amount: 300, day: 'Sat 21 Nov', quote: 'tarpor transport e 300' },
  { id: 3, kind: 'Received', who: 'Rahim', amount: 12_000, day: 'Wed 25 Nov', quote: 'Budhbar Rahim theke 12 hajar pelam' },
  { id: 4, kind: 'Bill to pay', who: 'Electricity', amount: 1_850, day: 'Fri 27 Nov', quote: 'Shukrobar biddut bill 1,850' },
  { id: 5, kind: 'Paid', who: 'Tea & snacks', amount: 250, day: 'Sat 28 Nov', quote: 'Aj cha nasta 250' },
];

export const transcript =
  'Shombar dokan bhara 5000 taka dilam, tarpor transport e 300. Budhbar Rahim theke 12 hajar pelam. Shukrobar biddut bill 1,850. Aj cha nasta 250.';

export const smsFeed = [
  { id: 's1', from: 'bKash', text: 'You have received Tk 12,000.00 from 01XXXXXXX42. TrxID 9KX3T1QZ.', amount: 12_000, who: 'Rahim', state: 'match' },
  { id: 's2', from: 'Nagad', text: 'Cash Out Tk 3,000.00 successful. TxnID 71A9C2.', amount: -3_000, who: 'Cash out', state: 'draft' },
  { id: 's3', from: 'Bank', text: 'Your OTP is ******. Do not share it.', amount: 0, who: '', state: 'dropped' },
];

export const customers = [
  { name: 'Dhaka Fashion', due: 80_000, dueOn: '2 Dec', habit: 'Usually pays 8 days late', expected: '10 Dec', status: 'watch' },
  { name: 'Nupur Boutique', due: 35_000, dueOn: '16 Nov', habit: 'Usually pays 5 days late', expected: 'Overdue 12 days', status: 'remind' },
  { name: 'Shapla Traders', due: 120_000, dueOn: '16 Dec', habit: 'Pays on time', expected: '16 Dec', status: 'ok' },
  { name: 'Lotus Apparel', due: 600_000, dueOn: '23 Dec', habit: 'New customer', expected: '23 Dec', status: 'ok' },
];

export const loans = [
  { lender: 'Bank SME loan', type: '13.5% a year, reducing balance', amount: 200_000, fee: 2_000, effective: 16.6, total: 16_925, verdict: 'best', note: 'Fits your cash flow · ranked first' },
  { lender: 'Quick NBFI loan', type: '“9% flat” for 12 months', amount: 200_000, fee: 0, effective: 17.7, total: 18_000, verdict: 'trap', note: 'Flat-rate trap: costs more than it looks' },
  { lender: 'Supplier finance', type: '2% flat for 60 days', amount: 175_000, fee: 750, effective: 15.8, total: 4_250, verdict: 'small', note: 'Cheapest, but too small to cover the gap' },
];

export const products = [
  { name: 'Cotton twill (per metre)', cost: 300, price: 380, sold: 1_150 },
  { name: 'Denim (per metre)', cost: 420, price: 495, sold: 640 },
  { name: 'Knit fabric (per kg)', cost: 610, price: 690, sold: 210 },
];

export const market = [
  { item: 'Cotton yarn (30s)', move: '+6%', note: 'Up this month: your margin on twill drops to 18% if you cannot pass it on', tone: 'warn' },
  { item: 'USD / BDT', move: '+0.4%', note: 'Export order value rises slightly', tone: 'good' },
  { item: 'Diesel', move: '0%', note: 'No change to transport costs', tone: 'neutral' },
];

export const alerts = [
  { level: 'Alert', title: 'Cash falls below your reserve on Fri 4 Dec', body: 'The Karim Textile bill (Tk 4,20,000) arrives before Dhaka Fashion pays. A rescue plan is ready.', time: '8:00 am' },
  { level: 'Watch', title: 'Dhaka Fashion may pay late', body: 'They usually pay 8 days after the due date. Expected around 10 Dec.', time: 'Yesterday' },
  { level: 'Reminder', title: 'Nupur Boutique is 12 days overdue', body: 'Tk 35,000. A polite reminder in Bangla is drafted for you to send.', time: 'Yesterday' },
  { level: 'Info', title: 'Weekly summary', body: 'Money in Tk 92,000 · money out Tk 61,450 · 14 new records.', time: 'Mon' },
];

export const passport = {
  period: '90 days · 30 Aug to 27 Nov 2026',
  moneyIn: 1_840_000,
  moneyOut: 1_610_000,
  onTime: 92,
  records: 214,
  edited: 0,
};
