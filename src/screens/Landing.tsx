import { useEffect, useRef, type CSSProperties } from 'react';
import { Icon, Logo } from '../components/Icon';
import { CashTerrain } from '../components/CashTerrain';
import { RESERVE, dayDate, project, realistic, transcript } from '../data';
import { taka, useLang } from '../i18n';
import '../landing.css';

const values = project(realistic);
const shortfall = RESERVE - Math.min(...values);
const breach = dayDate(values.findIndex((v) => v < RESERVE)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

const SECTORS = ['Garments', 'Retail shops', 'Pharmacies', 'Wholesale', 'Restaurants', 'Electronics', 'Agro traders', 'Hardware', 'Boutiques', 'Printing', 'Light engineering', 'Grocery'];

const STEPS = [
  ['Capture', 'Voice, photo, SMS or typing, in Bangla, Banglish or English.'],
  ['Understand', 'Each payment becomes a draft the owner checks before saving.'],
  ['Forecast', 'An exact cash engine projects the next 30 days and finds the crunch.'],
  ['Decide', 'Ranked rescue plans with the maths shown. The owner approves every step.'],
];

const STATS: { n: number; dec?: number; suffix: string; label: string }[] = [
  { n: 7.8, dec: 1, suffix: 'M+', label: 'cottage, micro, small and medium businesses in Bangladesh' },
  { n: 17.7, dec: 1, suffix: '%', label: 'real yearly cost of a “9% flat” loan' },
  { n: 30, suffix: ' days', label: 'of cash seen ahead, every morning' },
  { n: 0, suffix: '', label: 'times Forecash moves money. People decide.' },
];

/** Reveal-on-scroll, count-up numbers and pointer parallax, without extra libraries. */
function useMotion(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const t = e.target as HTMLElement;
        t.classList.add('in');
        if (t.dataset.count !== undefined) {
          const end = Number(t.dataset.count);
          const dec = Number(t.dataset.dec ?? 0);
          if (reduce) { t.textContent = end.toFixed(dec); }
          else {
            const t0 = performance.now();
            const tick = (now: number) => {
              const k = Math.min(1, (now - t0) / 1400);
              t.textContent = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec);
              if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
        io.unobserve(t);
      }
    }, { threshold: 0.2 });
    el.querySelectorAll('.rv, [data-count]').forEach((n) => io.observe(n));

    const hero = el.querySelector<HTMLElement>('.lx-hero');
    const onMove = (e: PointerEvent) => {
      if (!hero || reduce) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    hero?.addEventListener('pointermove', onMove);
    return () => { io.disconnect(); hero?.removeEventListener('pointermove', onMove); };
  }, [root]);
}

function Dots() {
  return <span className="lx-dots" aria-hidden="true"><i /><i /><i /></span>;
}

export function Landing() {
  const { t, lang, setLang } = useLang();
  const root = useRef<HTMLDivElement>(null);
  useMotion(root);
  const bn = lang === 'bn';

  return (
    <div className="lx" ref={root}>
      <header className="lx-nav">
        <a className="brand" href="#/"><Logo size={30} /> <span>Forecash</span></a>
        <nav>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#impact">Impact</a>
        </nav>
        <div className="lx-nav-r">
          <button className="lx-lang" onClick={() => setLang(bn ? 'en' : 'bn')}>{bn ? 'English' : 'বাংলা'}</button>
          <a className="lx-btn lime sm" href="#/app/today">{t('Open the prototype')} <Icon name="arrow" size={15} /></a>
        </div>
      </header>

      <section className="lx-hero">
        <CashTerrain />
        <div className="lx-hero-in">
          <a className="lx-badge up" href="#/app/radar"><b>New</b> Round 1 prototype for Aethermind 2026 <Icon name="arrow" size={13} /></a>
          <h1 className="up">
            {bn ? t('See tomorrow’s cash today.') : <>See tomorrow’s cash <em>today.</em></>}
          </h1>
          <p className="lx-lead up">An AI cash copilot for growing businesses in Bangladesh. It warns you <b>weeks before cash runs short</b>,
            builds a rescue plan from your own records and shows the true cost of every loan. It never moves money.</p>
          <div className="lx-cta up">
            <a className="lx-btn lime" href="#/app/today">{t('Open the prototype')} <Icon name="arrow" size={18} /></a>
            <a className="lx-btn glass" href="#/app/add"><Icon name="mic" size={18} /> Try the voice note</a>
          </div>
          <ul className="lx-checks up">
            <li><Icon name="check" size={14} /> Bangla, Banglish, English</li>
            <li><Icon name="check" size={14} /> Owner approves every step</li>
            <li><Icon name="check" size={14} /> Sample data, no sign-up</li>
          </ul>
        </div>

        <div className="lx-float">
          <a className="lx-wcard c1" href="#/app/radar" style={{ '--d': '0s' } as CSSProperties}>
            <Dots /><span className="lx-wt">Cash radar</span>
            <strong className="red">{breach}</strong>
            <span className="lx-ws">{taka(shortfall, lang)} below your reserve</span>
            <span className="lx-bar"><i style={{ width: '72%' }} /></span>
          </a>
          <a className="lx-wcard c2" href="#/app/add" style={{ '--d': '-2s' } as CSSProperties}>
            <Dots /><span className="lx-wt">Voice to drafts</span>
            <span className="lx-quote">“{transcript.split('.')[0]}…”</span>
            <span className="lx-chips"><i>Rent −5,000</i><i>Transport −300</i><i>+12,000</i></span>
          </a>
          <a className="lx-wcard c3" href="#/app/loans" style={{ '--d': '-4s' } as CSSProperties}>
            <Dots /><span className="lx-wt">True loan cost</span>
            <strong>9% flat <Icon name="arrow" size={16} /> <span className="lime-t">17.7%</span></strong>
            <span className="lx-ws">real yearly cost, shown before you sign</span>
          </a>
        </div>
      </section>

      <section className="lx-marquee" aria-label="Built for these businesses">
        <p>Built for the businesses that keep Bangladesh running</p>
        <div className="lx-track">
          {[...SECTORS, ...SECTORS].map((s, i) => <span key={i} aria-hidden={i >= SECTORS.length}><Icon name="spark" size={14} /> {s}</span>)}
        </div>
      </section>

      <section id="features" className="lx-sec">
        <span className="lx-kicker rv">What Forecash does</span>
        <h2 className="rv">Cash clarity that <em>grows</em> with you.</h2>
        <div className="lx-bento">
          <article className="lx-card rv">
            <div className="lx-ch"><span className="lx-ic"><Icon name="mic" /></span><h3>Talk, don’t type</h3></div>
            <p>Say a week of spending in one Banglish voice note. Each payment becomes its own draft to check.</p>
            <div className="lx-viz voice" aria-hidden="true">
              <div className="lx-wave">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>
              <div className="lx-drafts"><i>Shop rent · −5,000</i><i>Transport · −300</i><i>From Rahim · +12,000</i></div>
            </div>
          </article>
          <article className="lx-card rv">
            <div className="lx-ch"><span className="lx-ic"><Icon name="radar" /></span><h3>See the crunch early</h3></div>
            <p>A 30-day outlook that learns how late each customer really pays and names the day cash drops below your reserve.</p>
            <div className="lx-viz" aria-hidden="true">
              <svg viewBox="0 0 300 140" className="lx-spark">
                <defs>
                  <linearGradient id="lxfill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2ee59d" stopOpacity=".35" /><stop offset="1" stopColor="#2ee59d" stopOpacity="0" /></linearGradient>
                </defs>
                <line x1="0" x2="300" y1="92" y2="92" className="res" />
                <path d="M0 40 C40 38 50 44 70 60 S95 110 120 112 S190 116 210 104 S240 30 300 22 L300 140 L0 140Z" fill="url(#lxfill)" className="area" />
                <path d="M0 40 C40 38 50 44 70 60 S95 110 120 112 S190 116 210 104 S240 30 300 22" className="line" pathLength={1} />
                <circle cx="88" cy="92" r="5" className="dot" />
              </svg>
              <span className="lx-tip">↓ {breach}</span>
            </div>
          </article>
          <article className="lx-card rv">
            <div className="lx-ch"><span className="lx-ic"><Icon name="shield" /></span><h3>Borrow on fair terms</h3></div>
            <p>Offers compared on true yearly cost, and a signed cash-flow passport a lender can check by QR.</p>
            <div className="lx-viz rings" aria-hidden="true">
              <span className="r r1" /><span className="r r2" /><span className="r r3" />
              <span className="core"><Icon name="shield" size={22} /></span>
              <i className="p p1" /><i className="p p2" /><i className="p p3" />
            </div>
          </article>
        </div>
        <div className="lx-mini">
          <div className="rv"><Icon name="sms" /><b>bKash, Nagad and bank SMS</b><span>become one-tap drafts. OTP and PIN messages are never stored.</span></div>
          <div className="rv"><Icon name="spark" /><b>Rescue plans</b><span>collect early, split a bill or take the cheapest loan, each proved with exact maths.</span></div>
          <div className="rv"><Icon name="globe" /><b>Bangla first</b><span>the whole app works in Bangla, Banglish or English.</span></div>
        </div>
      </section>

      <section className="lx-stats">
        {STATS.map((s) => (
          <div key={s.label} className="rv">
            <b><span data-count={s.n} data-dec={s.dec ?? 0}>0</span>{s.suffix}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      <section id="how" className="lx-sec">
        <span className="lx-kicker rv">How it works</span>
        <h2 className="rv">From a voice note to a decision in four steps.</h2>
        <ol className="lx-steps">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="rv" style={{ '--i': i } as CSSProperties}>
              <span className="n">0{i + 1}</span><h3>{title}</h3><p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="impact" className="lx-impact rv">
        <div>
          <span className="lx-kicker">UN SDG target 8.3</span>
          <h2>Helping small businesses <em>grow</em>, with access to fair finance.</h2>
          <p>Forecash turns notebooks and voice notes into records a lender can verify, warns owners before a cash crunch and
            helps them borrow on fair terms. Success is cash gaps caught early, cheaper credit taken, and businesses that
            get a loan with their cash-flow passport (SDG indicator 9.3.2).</p>
        </div>
        <a className="lx-btn lime" href="#/app/today">{t('Open the prototype')} <Icon name="arrow" size={18} /></a>
      </section>

      <footer className="lx-foot">
        <span><Logo size={22} /> Forecash · Team Kemon Dilam Bondhura · Aethermind 2026</span>
        <span>Open source (MIT) · Round 1 static prototype · sample data only</span>
      </footer>
    </div>
  );
}
