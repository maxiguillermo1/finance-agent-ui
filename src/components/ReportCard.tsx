import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Trash2 } from 'lucide-react';
import type { FinanceReport } from '../types/finance';

export interface ReportCardProps {
  report: FinanceReport;
  onDelete: (id: string) => void;
}

function mockSeries(symbol: string) {
  let seed = 0;
  for (let i = 0; i < symbol.length; i += 1) seed += symbol.charCodeAt(i);
  const data: { x: string; v: number }[] = [];
  let v = 100 + (seed % 18);
  for (let i = 0; i < 14; i += 1) {
    v += ((seed + i * 7) % 7) - 3;
    data.push({ x: `${i + 1}`, v: Math.round(v * 10) / 10 });
  }
  return data;
}

export function ReportCard({ report, onDelete }: ReportCardProps) {
  const chartData = useMemo(() => mockSeries(report.ticker), [report.ticker]);
  const formattedDate = new Date(report.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <article className="reportCard glass">
      <div className="reportCardTop">
        <div>
          <div className="reportTickerRow">
            <h2 className="reportTicker">{report.ticker}</h2>
            {report.companyName ? (
              <p className="reportCompany">{report.companyName}</p>
            ) : null}
          </div>
          <p className="reportDate">{formattedDate}</p>
        </div>
        <button
          type="button"
          className="reportDelete"
          onClick={() => onDelete(report.id)}
        >
          <Trash2 size={16} aria-hidden />
          Remove
        </button>
      </div>

      <h3 className="reportTitle">{report.title}</h3>
      <p className="reportSummary">{report.summary}</p>

      <div className="sparklineWrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`fill-${report.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5b8cff" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#5b8cff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="x" hide />
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              contentStyle={{
                background: 'rgba(18, 18, 24, 0.92)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                fontSize: 12,
              }}
              labelStyle={{ display: 'none' }}
              formatter={(val: number) => [`${val}`, 'Mock trend']}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#7ba3ff"
              strokeWidth={2}
              fill={`url(#fill-${report.id})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="sparklineCaption">Illustrative sparkline only — not market data.</p>

      <div className="columns">
        <div className="pointBlock bull">
          <h4>Bull case</h4>
          <ul className="pointList">
            {report.bullishPoints.map((p, i) => (
              <li key={`b-${i}`} className="pointItem">
                <strong>{p.title}</strong>
                <p>{p.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="pointBlock bear">
          <h4>Bear case</h4>
          <ul className="pointList">
            {report.bearishPoints.map((p, i) => (
              <li key={`r-${i}`} className="pointItem">
                <strong>{p.title}</strong>
                <p>{p.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="risksBlock">
        <h4>Risks & caveats</h4>
        <ul className="risksList">
          {report.risks.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
