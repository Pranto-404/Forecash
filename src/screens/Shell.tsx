import { Icon, Logo } from '../components/Icon';
import { useLang } from '../i18n';
import { Today } from './Today';
import { AddRecords } from './AddRecords';
import { Radar } from './Radar';
import { Customers } from './Customers';
import { Loans } from './Loans';
import { Insights } from './Insights';
import { Passport } from './Passport';
import { Alerts } from './Alerts';

export type Tab = 'today' | 'add' | 'radar' | 'customers' | 'loans' | 'insights' | 'passport' | 'alerts';

const NAV: { tab: Tab; label: string; icon: string }[] = [
  { tab: 'today', label: 'Today', icon: 'today' },
  { tab: 'add', label: 'Add records', icon: 'add' },
  { tab: 'radar', label: 'Cash radar', icon: 'radar' },
  { tab: 'customers', label: 'Customers', icon: 'users' },
  { tab: 'loans', label: 'Loans', icon: 'bank' },
  { tab: 'insights', label: 'Insights', icon: 'chart' },
  { tab: 'passport', label: 'Passport', icon: 'shield' },
  { tab: 'alerts', label: 'Alerts', icon: 'bell' },
];

const SCREENS: Record<Tab, () => React.JSX.Element> = {
  today: Today, add: AddRecords, radar: Radar, customers: Customers,
  loans: Loans, insights: Insights, passport: Passport, alerts: Alerts,
};

export function Shell({ tab }: { tab: Tab }) {
  const { t, lang, setLang } = useLang();
  const Screen = SCREENS[tab];
  return (
    <div className="shell">
      <aside className="side">
        <a className="brand" href="#/"><Logo /> <span>Forecash</span></a>
        <nav>
          {NAV.map((n) => (
            <a key={n.tab} href={`#/app/${n.tab}`} className={n.tab === tab ? 'active' : ''}>
              <Icon name={n.icon} /> <span>{t(n.label)}</span>
              {n.tab === 'alerts' && <i className="dot">2</i>}
            </a>
          ))}
        </nav>
        <div className="side-foot">
          <div className="biz"><span className="avatar">R</span><div><b>Rahim Garments</b><small>Owner · Cumilla</small></div></div>
          <button className="lang wide" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}><Icon name="globe" size={16} /> {lang === 'en' ? 'বাংলা' : 'English'}</button>
        </div>
      </aside>

      <main className="main">
        <div className="notice"><Icon name="lock" size={14} /> {t('Prototype · sample data · no backend')}. Round 1 mockup for Aethermind 2026. <a href="#/">{t('Back to site')}</a></div>
        <Screen />
      </main>

      <nav className="bottom">
        {NAV.map((n) => (
          <a key={n.tab} href={`#/app/${n.tab}`} className={n.tab === tab ? 'active' : ''}>
            <Icon name={n.icon} /> <span>{t(n.label)}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
