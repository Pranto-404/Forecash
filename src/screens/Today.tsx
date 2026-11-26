import { Icon } from '../components/Icon';
import { CashChart } from '../components/CashChart';
import { START_CASH, customers, project, realistic } from '../data';
import { taka, useLang } from '../i18n';

export function Today() {
  const { t, lang } = useLang();
  const owed = customers.reduce((s, c) => s + c.due, 0);
  return (
    <div className="page">
      <header className="ph">
        <div><span className="muted">Saturday, 28 November</span><h1>{t('Good morning, Rahim')}</h1></div>
        <a className="btn primary" href="#/app/add"><Icon name="mic" size={18} /> {t('Record a voice note')}</a>
      </header>

      <div className="banner alert">
        <Icon name="alert" />
        <div>
          <b>Cash falls below your Tk 50,000 reserve on Fri 4 Dec.</b>
          <span>The Karim Textile bill (Tk 4,20,000) is due before Dhaka Fashion usually pays.</span>
        </div>
        <a className="btn danger sm" href="#/app/radar">{t('Fix this gap')}</a>
      </div>

      <div className="kpis">
        <div className="kpi"><span>{t('Cash in hand')}</span><b>{taka(START_CASH, lang)}</b><small>From confirmed records</small></div>
        <div className="kpi"><span>{t('Money in this month')}</span><b className="good">{taka(412_000, lang)}</b><small>+8% vs October</small></div>
        <div className="kpi"><span>{t('Money out this month')}</span><b>{taka(386_450, lang)}</b><small>Fabric is 61% of spending</small></div>
        <div className="kpi"><span>{t('Customers owe you')}</span><b>{taka(owed, lang)}</b><small>1 customer overdue</small></div>
      </div>

      <section className="card">
        <div className="card-h"><h2>{t('Next 30 days')}</h2><span className="pill alert">Alert</span></div>
        <CashChart series={[{ name: 'Realistic', values: project(realistic), color: '#10b981' }]} />
        <p className="muted small">Projection using each customer's real payment habit. Lowest point {taka(-310_000, lang)} on 8 Dec.</p>
      </section>

      <div className="two">
        <section className="card">
          <div className="card-h"><h2>Morning briefing</h2><span className="pill">AI</span></div>
          <p className="brief">“Good morning, Rahim. You have <b>Tk 1,50,000</b> today. Next Friday the fabric bill takes you below your
            reserve. Nupur Boutique owes <b>Tk 35,000</b> and is 12 days late. A reminder is ready to send.”</p>
          <div className="row gap"><button className="btn ghost sm"><Icon name="send" size={16} /> Send reminder</button><a className="btn ghost sm" href="#/app/radar">See rescue plans</a></div>
        </section>
        <section className="card">
          <div className="card-h"><h2>Recent records</h2><a className="link" href="#/app/add">Add</a></div>
          <ul className="list">
            <li><span className="tag in">In</span> Rahim · bKash <b>{taka(12_000, lang)}</b></li>
            <li><span className="tag out">Out</span> Electricity bill <b>{taka(1_850, lang)}</b></li>
            <li><span className="tag out">Out</span> Shop rent <b>{taka(5_000, lang)}</b></li>
            <li><span className="tag out">Out</span> Tea & snacks <b>{taka(250, lang)}</b></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
