import { Icon, Logo } from '../components/Icon';
import { passport } from '../data';
import { taka, useLang } from '../i18n';

// A decorative QR-style pattern. The real passport QR (built in the build phase) links to a verification page.
function QrArt() {
  const cells: [number, number][] = [];
  let seed = 7;
  const inFinder = (r: number, c: number) => (r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8);
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      seed = (seed * 9301 + 49297) % 233280;
      if (!inFinder(r, c) && seed / 233280 > 0.52) cells.push([r, c]);
    }
  }
  const finder = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" className="qr-bg" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg viewBox="-1 -1 23 23" className="qr" aria-label="Sample verification code">
      {cells.map(([r, c]) => <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" />)}
      {finder(0, 0)}{finder(14, 0)}{finder(0, 14)}
    </svg>
  );
}

export function Passport() {
  const { t, lang } = useLang();
  return (
    <div className="page">
      <header className="ph"><div><span className="muted">Turn honest books into fairer credit</span><h1>{t('Passport')}</h1></div></header>
      <div className="two">
        <section className="card passport">
          <div className="pp-h"><Logo size={28} /><div><b>Cash-flow passport</b><small>Rahim Garments · {passport.period}</small></div></div>
          <dl className="fields big">
            <dt>Money in</dt><dd>{taka(passport.moneyIn, lang)}</dd>
            <dt>Money out</dt><dd>{taka(passport.moneyOut, lang)}</dd>
            <dt>Bills paid on time</dt><dd>{passport.onTime}%</dd>
            <dt>Records</dt><dd>{passport.records}, none edited</dd>
          </dl>
          <div className="pp-f"><QrArt /><div><span className="pill good"><Icon name="shield" size={14} /> Signed</span><p className="muted small">A lender scans the code to check the signature, the expiry date and whether you revoked it. Only totals are shared.</p></div></div>
        </section>
        <section className="card">
          <div className="card-h"><h2>Share with a lender</h2></div>
          <ol className="steps-sm">
            <li>Choose the period: 30, 90 or 180 days</li>
            <li>Forecash signs a summary of your records</li>
            <li>Send the link or print the QR for a bank or MFI</li>
            <li>Revoke it any time; it also expires after 90 days</li>
          </ol>
          <div className="row gap"><button className="btn primary"><Icon name="shield" size={16} /> Create passport</button><button className="btn ghost">Revoke</button></div>
          <p className="muted small">Prototype: the signature, QR verification and expiry are built in the build phase.</p>
        </section>
      </div>
    </div>
  );
}
