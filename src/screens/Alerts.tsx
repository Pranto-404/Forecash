import { Icon } from '../components/Icon';
import { alerts } from '../data';
import { useLang } from '../i18n';

const TONE: Record<string, string> = { Alert: 'alert', Watch: 'warn', Reminder: 'warn', Info: '' };

export function Alerts() {
  const { t } = useLang();
  return (
    <div className="page">
      <header className="ph"><div><span className="muted">In the app, on your phone, Telegram or email: your choice</span><h1>{t('Alerts')}</h1></div></header>
      <section className="card">
        <ul className="alerts">
          {alerts.map((a) => (
            <li key={a.title}>
              <span className={`pill ${TONE[a.level]}`}>{a.level}</span>
              <div><b>{a.title}</b><p className="muted">{a.body}</p></div>
              <small className="muted">{a.time}</small>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <div className="card-h"><h2>How alerts behave</h2></div>
        <ul className="checks">
          <li><Icon name="check" size={16} /> Quiet hours 9 pm – 8 am</li>
          <li><Icon name="check" size={16} /> One alert per cash-gap episode, re-sent only if it gets clearly worse</li>
          <li><Icon name="check" size={16} /> Privacy mode: no amounts on the lock screen</li>
          <li><Icon name="check" size={16} /> Channels you choose: app, push, Telegram, email</li>
        </ul>
      </section>
    </div>
  );
}
