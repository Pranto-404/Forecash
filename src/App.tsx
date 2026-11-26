import { useEffect, useState } from 'react';
import { Landing } from './screens/Landing';
import { Shell, type Tab } from './screens/Shell';

const TABS: Tab[] = ['today', 'add', 'radar', 'customers', 'loans', 'insights', 'passport', 'alerts'];

function readRoute(): { page: 'landing' } | { page: 'app'; tab: Tab } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash.startsWith('app')) return { page: 'landing' };
  const tab = hash.split('/')[1] as Tab;
  return { page: 'app', tab: TABS.includes(tab) ? tab : 'today' };
}

export function App() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route.page === 'landing' ? <Landing /> : <Shell tab={route.tab} />;
}

export const go = (path: string) => {
  window.location.hash = path;
};
