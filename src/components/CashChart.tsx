import { RESERVE, dayDate } from '../data';
import { taka, useLang } from '../i18n';

type Series = { name: string; values: number[]; color: string; dashed?: boolean };

const W = 720;
const H = 260;
const PAD = { l: 92, r: 16, t: 16, b: 32 };

export function CashChart({ series, markBreach = true }: { series: Series[]; markBreach?: boolean }) {
  const { lang } = useLang();
  const all = series.flatMap((s) => s.values).concat(RESERVE);
  const max = Math.max(...all) * 1.08;
  const min = Math.min(...all, 0) * 1.12;
  const days = series[0].values.length - 1;
  const x = (d: number) => PAD.l + (d / days) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);
  const path = (vals: number[]) =>
    vals.map((v, d) => `${d === 0 ? 'M' : 'L'}${x(d).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const main = series[0].values;
  const breach = main.findIndex((v) => v < RESERVE);
  const ticks = [max * 0.9, (max + min) / 2, min * 0.9].map((v) => Math.round(v / 10_000) * 10_000);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cash projection for the next 30 days">
      <defs>
        <linearGradient id="danger" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ef4444" stopOpacity="0" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      {ticks.map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="grid" />
          <text x={PAD.l - 8} y={y(v) + 4} textAnchor="end" className="axis">{taka(v, lang)}</text>
        </g>
      ))}
      <rect x={PAD.l} y={y(RESERVE)} width={W - PAD.l - PAD.r} height={Math.max(0, y(min) - y(RESERVE))} fill="url(#danger)" />
      <line x1={PAD.l} x2={W - PAD.r} y1={y(RESERVE)} y2={y(RESERVE)} className="reserve" />
      <text x={W - PAD.r} y={y(RESERVE) - 6} textAnchor="end" className="axis reserve-label">Reserve {taka(RESERVE, lang)}</text>
      {series.map((s) => (
        <path key={s.name} d={path(s.values)} fill="none" stroke={s.color} strokeWidth={s.dashed ? 2 : 3}
          strokeDasharray={s.dashed ? '6 6' : undefined} strokeLinejoin="round" />
      ))}
      {markBreach && breach > 0 && (
        <g>
          <circle cx={x(breach)} cy={y(main[breach])} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
          <text x={x(breach) + 10} y={y(main[breach]) + 18} className="axis breach-label">
            {dayDate(breach).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </text>
        </g>
      )}
      {[0, 7, 14, 21, 28].map((d) => (
        <text key={d} x={x(d)} y={H - 8} textAnchor="middle" className="axis">
          {dayDate(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </text>
      ))}
    </svg>
  );
}
