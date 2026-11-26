import { Icon, Logo } from '../components/Icon';
import { CashChart } from '../components/CashChart';
import { project, realistic } from '../data';
import { useLang } from '../i18n';

const FEATURES = [
  { icon: 'mic', title: 'Talk, don’t type', body: 'Say a week of spending in one Banglish voice note. Each payment becomes a separate draft you check before saving.' },
  { icon: 'radar', title: 'Cash radar', body: 'A 30-day outlook that learns how late each customer really pays, and names the day cash drops below your reserve.' },
  { icon: 'spark', title: 'Rescue plans', body: 'When a gap is coming, Forecash compares ways to close it (collect early, split a bill, the cheapest loan) and proves each plan with exact math.' },
  { icon: 'sms', title: 'Where money already moves', body: 'bKash, Nagad and bank SMS turn into one-tap drafts. OTP and PIN messages are never stored.' },
  { icon: 'bank', title: 'True loan cost', body: 'A “9% flat” loan really costs about 17.7% a year. Every offer is compared on its true yearly cost.' },
  { icon: 'shield', title: 'Cash-flow passport', body: 'A signed, expiring summary of your records that a bank or MFI can verify by QR, to help you get fairer credit.' },
];

const STEPS = [
  ['Capture', 'Voice, photo, SMS or typing, in Bangla, Banglish or English'],
  ['Understand', 'Our own Bangla finance AI turns it into checked drafts'],
  ['Forecast', 'Exact cash engine projects 30 days and spots the crunch'],
  ['Decide', 'Ranked rescue plans; the owner approves every step'],
];

export function Landing() {
  const { t, lang, setLang } = useLang();
  return (
    <div className="landing">
      <header className="lnav">
        <a className="brand" href="#/"><Logo /> <span>Forecash</span></a>
        <nav>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#impact">Impact</a>
          <button className="lang" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}>{lang === 'en' ? 'বাংলা' : 'English'}</button>
          <a className="btn primary sm" href="#/app/today">{t('Open the prototype')}</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Icon name="spark" size={14} /> AI cash copilot · Bangladesh</span>
          <h1>{t('See tomorrow’s cash today.')}</h1>
          <p className="lead">Forecash warns growing businesses <b>weeks before cash runs short</b>, builds a rescue plan
            from their own records, and shows the true cost of every loan, in Bangla, Banglish or English.
            It never moves money.</p>
          <div className="cta">
            <a className="btn primary" href="#/app/today">{t('Open the prototype')} <Icon name="arrow" size={18} /></a>
            <a className="btn ghost" href="#/app/add">Try the voice note</a>
          </div>
          <p className="fine">Round 1 static prototype · sample business · no backend or AI yet</p>
        </div>
        <div className="hero-card">
          <div className="hc-top">
            <div>
              <span className="muted">Rahim Garments · next 30 days</span>
              <strong className="danger">Cash runs short on Fri 4 Dec</strong>
            </div>
            <span className="pill alert">Alert</span>
          </div>
          <CashChart series={[{ name: 'Realistic', values: project(realistic), color: '#7b6cff' }]} />
          <a className="hc-fix" href="#/app/radar"><Icon name="spark" size={16} /> {t('Fix this gap')}: 2 rescue plans ready <Icon name="arrow" size={16} /></a>
        </div>
      </section>

      <section className="strip">
        <div><b>7.8M+</b><span>cottage, micro, small & medium businesses in Bangladesh</span></div>
        <div><b>17.7%</b><span>real yearly cost of a “9% flat” loan</span></div>
        <div><b>0</b><span>times Forecash moves money: people decide</span></div>
      </section>

      <section id="features" className="features">
        <h2>Everything an owner needs to stay ahead of cash</h2>
        <div className="fgrid">
          {FEATURES.map((f) => (
            <article key={f.title} className="fcard">
              <span className="ficon"><Icon name={f.icon} /></span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="how">
        <h2>How it works</h2>
        <ol className="steps">
          {STEPS.map(([title, body], i) => (
            <li key={title}><span className="num">{i + 1}</span><h3>{title}</h3><p>{body}</p></li>
          ))}
        </ol>
      </section>

      <section id="impact" className="impact">
        <div>
          <span className="eyebrow light">UN SDG target 8.3</span>
          <h2>Helping micro, small and medium businesses grow, with access to fair finance</h2>
          <p>Forecash turns informal khata and voice notes into verifiable records, warns owners before a cash crunch, and
            helps them borrow on fair terms. Success is measured as cash gaps caught early, cheaper credit taken, and
            businesses that get a loan using their cash-flow passport (SDG indicator 9.3.2).</p>
        </div>
        <a className="btn light" href="#/app/today">{t('Open the prototype')} <Icon name="arrow" size={18} /></a>
      </section>

      <footer className="lfoot">
        <span><Logo size={22} /> Forecash · Team Kemon Dilam Bondhura · Aethermind 2026</span>
        <span>Open source (MIT) · sample data only</span>
      </footer>
    </div>
  );
}
