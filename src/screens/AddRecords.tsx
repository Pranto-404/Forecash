import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon';
import { drafts as sampleDrafts, smsFeed, transcript } from '../data';
import { taka, useLang } from '../i18n';

type Stage = 'idle' | 'recording' | 'transcript' | 'drafts' | 'saved';

// A scripted walk-through of the planned voice flow. Nothing is recorded or sent anywhere:
// the transcript and drafts are fixed sample data for the Round 1 mockup.
export function AddRecords() {
  const { t, lang } = useLang();
  const [mode, setMode] = useState<'voice' | 'photo' | 'sms'>('voice');
  const [stage, setStage] = useState<Stage>('idle');
  const [seconds, setSeconds] = useState(0);
  const [items, setItems] = useState(sampleDrafts.map((d) => ({ ...d, on: true })));

  useEffect(() => {
    if (stage !== 'recording') return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    const stop = setTimeout(() => setStage('transcript'), 4200);
    return () => { clearInterval(id); clearTimeout(stop); };
  }, [stage]);

  const chosen = items.filter((i) => i.on);
  const total = chosen.reduce((s, i) => s + (i.kind === 'Received' ? 0 : i.amount), 0);

  return (
    <div className="page">
      <header className="ph"><div><span className="muted">Capture anything, in your own words</span><h1>{t('Add records')}</h1></div></header>

      <div className="seg">
        <button className={mode === 'voice' ? 'on' : ''} onClick={() => setMode('voice')}><Icon name="mic" size={16} /> Voice note</button>
        <button className={mode === 'photo' ? 'on' : ''} onClick={() => setMode('photo')}><Icon name="camera" size={16} /> Bill photo</button>
        <button className={mode === 'sms' ? 'on' : ''} onClick={() => setMode('sms')}><Icon name="sms" size={16} /> Payment SMS</button>
      </div>

      {mode === 'voice' && (
        <section className="card">
          {stage === 'idle' && (
            <div className="rec">
              <button className="mic" onClick={() => { setSeconds(0); setStage('recording'); }} aria-label="Start the sample recording"><Icon name="mic" size={34} /></button>
              <h2>{t('Record a voice note')}</h2>
              <p className="muted">Say a whole week of spending in one go, in Bangla, Banglish or English. This prototype plays a sample note.</p>
            </div>
          )}
          {stage === 'recording' && (
            <div className="rec">
              <div className="wave">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.09}s` }} />)}</div>
              <h2>Listening… 0:0{seconds}</h2>
              <button className="btn ghost sm" onClick={() => setStage('transcript')}>Stop</button>
            </div>
          )}
          {stage === 'transcript' && (
            <div>
              <div className="card-h"><h2>Transcript</h2><span className="pill">Check & edit</span></div>
              <blockquote className="quote">{transcript}</blockquote>
              <div className="row gap"><button className="btn primary" onClick={() => setStage('drafts')}><Icon name="spark" size={16} /> {t('Make drafts')}</button>
                <button className="btn ghost" onClick={() => setStage('idle')}>Record again</button></div>
            </div>
          )}
          {stage === 'drafts' && (
            <div>
              <div className="card-h"><h2>5 drafts from one voice note</h2><span className="muted small">Each amount is checked against the words you said</span></div>
              <div className="drafts">
                {items.map((d) => (
                  <label key={d.id} className={`draft ${d.on ? '' : 'off'}`}>
                    <input type="checkbox" checked={d.on} onChange={() => setItems(items.map((x) => x.id === d.id ? { ...x, on: !x.on } : x))} />
                    <div className="dmain">
                      <div className="drow"><span className={`tag ${d.kind === 'Received' ? 'in' : d.kind === 'Paid' ? 'out' : 'due'}`}>{d.kind}</span><b>{d.who}</b><b className="amt">{taka(d.amount, lang)}</b></div>
                      <small className="muted">{d.day} · “{d.quote}”</small>
                    </div>
                  </label>
                ))}
              </div>
              <div className="savebar">
                <span>{chosen.length} selected · spending {taka(total, lang)}</span>
                <button className="btn primary" disabled={!chosen.length} onClick={() => setStage('saved')}><Icon name="check" size={16} /> Save {chosen.length} records</button>
              </div>
            </div>
          )}
          {stage === 'saved' && (
            <div className="rec">
              <span className="okbig"><Icon name="check" size={34} /></span>
              <h2>{chosen.length} records saved</h2>
              <p className="muted">Your balance and 30-day forecast update at once. (Prototype: nothing is stored.)</p>
              <div className="row gap"><a className="btn primary" href="#/app/today">See today</a><button className="btn ghost" onClick={() => { setItems(sampleDrafts.map((d) => ({ ...d, on: true }))); setStage('idle'); }}>Try again</button></div>
            </div>
          )}
        </section>
      )}

      {mode === 'photo' && (
        <section className="card photo">
          <div className="bill">
            <b>KARIM TEXTILE MILLS</b><small>Narayanganj</small>
            <div className="bl"><span>Cotton twill 1,200 m × 300</span><span>3,60,000</span></div>
            <div className="bl"><span>Dyeing charge</span><span>60,000</span></div>
            <div className="bl total"><span>TOTAL (BDT)</span><span>4,20,000</span></div>
            <small>Bill KTM-2291 · Due 4 Dec 2026</small>
          </div>
          <div className="pdraft">
            <div className="card-h"><h2>Read from the photo</h2><span className="pill">Check before saving</span></div>
            <dl className="fields">
              <dt>Type</dt><dd>Bill to pay</dd>
              <dt>Supplier</dt><dd>Karim Textile Mills</dd>
              <dt>Amount</dt><dd>{taka(420_000, lang)}</dd>
              <dt>Bill no.</dt><dd>KTM-2291</dd>
              <dt>Due date</dt><dd>Fri 4 Dec 2026</dd>
            </dl>
            <p className="muted small">Line items add up to the total ✓</p>
            <button className="btn primary"><Icon name="check" size={16} /> Add to my records</button>
          </div>
        </section>
      )}

      {mode === 'sms' && (
        <section className="card">
          <div className="card-h"><h2>Payment SMS inbox</h2><span className="muted small">Forwarded from your Android phone</span></div>
          <ul className="sms">
            {smsFeed.map((m) => (
              <li key={m.id} className={m.state}>
                <span className="src">{m.from}</span>
                <p>{m.text}</p>
                {m.state === 'match' && <div className="row gap"><span className="pill good">Matches Rahim's due · {taka(m.amount, lang)}</span><button className="btn primary sm">Save</button><button className="btn ghost sm">Skip</button></div>}
                {m.state === 'draft' && <div className="row gap"><span className="pill">Draft · {taka(m.amount, lang)}</span><button className="btn primary sm">Save</button><button className="btn ghost sm">Skip</button></div>}
                {m.state === 'dropped' && <span className="pill muted">OTP message dropped · never stored</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
