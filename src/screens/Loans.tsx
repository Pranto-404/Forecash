import { Icon } from '../components/Icon';
import { loans } from '../data';
import { taka, useLang } from '../i18n';

export function Loans() {
  const { t, lang } = useLang();
  return (
    <div className="page">
      <header className="ph"><div><span className="muted">Every offer compared on its true yearly cost</span><h1>{t('Loans')}</h1></div>
        <button className="btn ghost"><Icon name="camera" size={16} /> Read an offer letter</button></header>
      <div className="loans">
        {loans.map((l) => (
          <article key={l.lender} className={`loan ${l.verdict}`}>
            <div className="plan-h">
              <h3>{l.lender}</h3>
              <span className={`pill ${l.verdict === 'best' ? 'good' : l.verdict === 'trap' ? 'alert' : 'warn'}`}>{l.verdict === 'best' ? 'Best fit' : l.verdict === 'trap' ? 'Rate trap' : 'Too small'}</span>
            </div>
            <p className="muted">{l.type}</p>
            <div className="rate"><b>{l.effective}%</b><span>true yearly cost</span></div>
            <dl className="fields">
              <dt>Amount</dt><dd>{taka(l.amount, lang)}</dd>
              <dt>Fee</dt><dd>{taka(l.fee, lang)}</dd>
              <dt>Total cost</dt><dd>{taka(l.total, lang)}</dd>
            </dl>
            <p className="note">{l.note}</p>
          </article>
        ))}
      </div>
      <p className="muted small">Effective annual rate includes fees and how interest is charged. Quotes are entered by the owner; Forecash never applies for a loan. (Prototype: sample offers.)</p>
    </div>
  );
}
