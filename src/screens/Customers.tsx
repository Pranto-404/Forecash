import { useState } from 'react';
import { Icon } from '../components/Icon';
import { customers } from '../data';
import { taka, useLang } from '../i18n';

const REMINDER_BN = 'আসসালামু আলাইকুম। নুপুর বুটিকের ১৬ নভেম্বরের ৳৩৫,০০০ বিলটি এখনো বাকি আছে। সুবিধামতো দু-এক দিনের মধ্যে পরিশোধ করলে কৃতজ্ঞ থাকব। ধন্যবাদ, রহিম গার্মেন্টস।';
const REMINDER_EN = 'Assalamu alaikum. Nupur Boutique’s bill of Tk 35,000 from 16 Nov is still due. I would be grateful if you could pay in the next day or two. Thank you, Rahim Garments.';

export function Customers() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [bn, setBn] = useState(true);
  return (
    <div className="page">
      <header className="ph"><div><span className="muted">Who owes you, and when they will really pay</span><h1>{t('Customers')}</h1></div></header>
      <section className="card">
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th>Customer</th><th>Owes</th><th>Due</th><th>Payment habit</th><th>Expected</th><th /></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.name}>
                <td><b>{c.name}</b></td>
                <td>{taka(c.due, lang)}</td>
                <td>{c.dueOn}</td>
                <td><span className={`pill ${c.status === 'ok' ? 'good' : c.status === 'watch' ? 'warn' : 'alert'}`}>{c.habit}</span></td>
                <td>{c.expected}</td>
                <td>{c.status === 'remind' && <button className="btn primary sm" onClick={() => setOpen(true)}><Icon name="send" size={14} /> Remind</button>}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <p className="muted small">Reminders start only after a customer is later than their own usual habit, so good customers are never nagged.</p>
      </section>

      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Reminder draft">
          <div className="sheet">
            <div className="card-h"><h2>Reminder for Nupur Boutique</h2><button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close"><Icon name="x" /></button></div>
            <div className="seg small"><button className={bn ? 'on' : ''} onClick={() => setBn(true)}>বাংলা</button><button className={!bn ? 'on' : ''} onClick={() => setBn(false)}>English</button></div>
            <p className={`msg ${bn ? 'bn' : ''}`}>{bn ? REMINDER_BN : REMINDER_EN}</p>
            <p className="muted small">Polite, in the customer's language. You send it yourself: Forecash never messages customers on your behalf.</p>
            <div className="row gap"><button className="btn primary"><Icon name="send" size={16} /> Send via WhatsApp</button><button className="btn ghost">Send SMS</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
