import { Icon } from '../components/Icon';
import { market, products } from '../data';
import { taka, useLang } from '../i18n';

export function Insights() {
  const { t, lang } = useLang();
  return (
    <div className="page">
      <header className="ph"><div><span className="muted">Business intelligence from your own numbers</span><h1>{t('Insights')}</h1></div></header>
      <div className="two">
        <section className="card">
          <div className="card-h"><h2>Products & margins</h2></div>
          <div className="tbl-wrap"><table className="tbl">
            <thead><tr><th>Product</th><th>Cost</th><th>Price</th><th>Margin</th><th>Break-even</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.name}>
                  <td><b>{p.name}</b></td><td>{taka(p.cost, lang)}</td><td>{taka(p.price, lang)}</td>
                  <td>{Math.round(((p.price - p.cost) / p.price) * 100)}%</td>
                  <td>{taka(Math.ceil(p.cost * 1.04), lang)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <p className="muted small">Break-even includes about 4% for transport and handling (sample assumption).</p>
        </section>
        <section className="card">
          <div className="card-h"><h2>Market watch</h2><span className="pill">With sources</span></div>
          <ul className="mlist">
            {market.map((m) => (
              <li key={m.item} className={m.tone}><b>{m.item}</b><span className="move">{m.move}</span><p>{m.note}</p></li>
            ))}
          </ul>
        </section>
      </div>
      <section className="card advisor">
        <div className="card-h"><h2><Icon name="spark" size={18} /> Advisor</h2><span className="pill">A / B / C strategies</span></div>
        <div className="abc">
          <div><span className="pill good">A · Safe</span><p>Raise twill price by Tk 15 for new orders to absorb the yarn increase. Margin stays at 21%.</p></div>
          <div><span className="pill warn">B · Balanced</span><p>Keep prices; ask Karim Textile for 30-day terms on the next two bills.</p></div>
          <div><span className="pill alert">C · Growth</span><p>Take the Lotus Apparel repeat order only with a 30% advance payment.</p></div>
        </div>
        <p className="muted small">Strategies use only your figures; the owner decides. (Prototype: sample advice.)</p>
      </section>
    </div>
  );
}
