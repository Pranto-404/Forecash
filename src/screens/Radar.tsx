import { useState } from 'react';
import { Icon } from '../components/Icon';
import { CashChart } from '../components/CashChart';
import { dueDateCase, planA, plans, project, realistic } from '../data';
import { taka, useLang } from '../i18n';

export function Radar() {
  const { t, lang } = useLang();
  const [view, setView] = useState<'cases' | 'plan'>('cases');
  const [accepted, setAccepted] = useState(false);

  const series = view === 'cases'
    ? [
        { name: 'Realistic', values: project(realistic), color: '#2ee59d' },
        { name: 'Due dates', values: project(dueDateCase), color: '#8a9c91', dashed: true },
      ]
    : [
        { name: 'With plan A', values: project(planA), color: '#c6f36b' },
        { name: 'Without a plan', values: project(realistic), color: '#ff8a8a', dashed: true },
      ];

  return (
    <div className="page">
      <header className="ph"><div><span className="muted">Learns how late each customer really pays</span><h1>{t('Cash radar')}</h1></div></header>

      <div className="banner alert">
        <Icon name="alert" />
        <div><b>Alert: up to {taka(360_000, lang)} below your reserve, starting Fri 4 Dec.</b>
          <span>Only real shortfalls trigger an alert, once per episode. Small delays stay a quiet “watch”.</span></div>
      </div>

      <section className="card">
        <div className="card-h">
          <h2>{view === 'cases' ? 'Next 30 days' : 'After rescue plan A'}</h2>
          <div className="seg small">
            <button className={view === 'cases' ? 'on' : ''} onClick={() => setView('cases')}>Outlook</button>
            <button className={view === 'plan' ? 'on' : ''} onClick={() => setView('plan')}>With plan A</button>
          </div>
        </div>
        <CashChart series={series} markBreach={view === 'cases'} />
        <div className="legend">
          {series.map((s) => <span key={s.name}><i style={{ background: s.color }} /> {s.name}</span>)}
        </div>
      </section>

      <h2 className="h2">{t('Rescue plans')}</h2>
      <div className="plans">
        {plans.map((p, i) => (
          <article key={p.id} className={`plan ${i === 0 ? 'best' : ''}`}>
            <div className="plan-h">
              <span className="rank">{i === 0 ? 'Best plan' : 'Option ' + p.id}</span>
              <span className={`pill ${p.closes === 100 ? 'good' : 'warn'}`}>{p.closes === 100 ? 'Closes the gap' : `Closes ${p.closes}% of the gap`}</span>
            </div>
            <h3>{lang === 'bn' ? p.titleBn : p.title}</h3>
            <ol>{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <div className="plan-f">
              <div><small className="muted">Lowest balance</small><b className={p.lowest >= 50_000 ? 'good' : 'danger'}>{taka(p.lowest, lang)}</b></div>
              <div><small className="muted">Cost</small><b>{p.cost}</b></div>
            </div>
            {i === 0 && (accepted
              ? <p className="okline"><Icon name="check" size={16} /> Plan accepted: 3 tasks added. Nothing is sent without your tap.</p>
              : <button className="btn primary" onClick={() => setAccepted(true)}>Accept plan A</button>)}
          </article>
        ))}
      </div>
      <p className="muted small">Every number in a plan comes from the cash engine's simulation. The AI only explains and drafts messages. (Prototype: fixed sample plans.)</p>
    </div>
  );
}
