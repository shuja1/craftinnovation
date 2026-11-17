import { useMemo, useState } from 'react';
import { ArrowRight, Check, Minus, Plus } from 'lucide-react';
import {
  MANPOWER_TRADES,
  PageId,
  SERVICE_DIVISIONS,
  ServiceDivision,
} from '../data/contractingData';
import { SafeImage } from './SafeImage';

interface ServicesViewProps {
  onNavigate: (
    page: PageId,
    preselectDivision?: string,
    manpowerSummary?: string,
  ) => void;
}

type FilterId = 'all' | ServiceDivision['id'];

const FILTER_OPTIONS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All Divisions' },
  { id: 'electrical', label: '01. Electrical' },
  { id: 'mechanical', label: '02. Mechanical' },
  { id: 'fire-protection', label: '03. Fire Protection' },
  { id: 'manpower', label: '04. Manpower Supply' },
];

export function ServicesView({ onNavigate }: ServicesViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [tradeCounts, setTradeCounts] = useState<Record<string, number>>({
    'elec-tech': 4,
    'mech-tech': 2,
    'welders-fab': 2,
    'fire-tech': 0,
    fitters: 2,
    helpers: 4,
  });
  const [durationDays, setDurationDays] = useState<number>(30);

  const filteredDivisions = useMemo(() => {
    if (activeFilter === 'all') return SERVICE_DIVISIONS;
    return SERVICE_DIVISIONS.filter((d) => d.id === activeFilter);
  }, [activeFilter]);

  const estimatorSummary = useMemo(() => {
    let totalHeadcount = 0;
    let dailyCost = 0;
    const lines: string[] = [];

    for (const trade of MANPOWER_TRADES) {
      const count = tradeCounts[trade.id] || 0;
      if (count > 0) {
        totalHeadcount += count;
        dailyCost += count * trade.hourlyIndicative * trade.dailyHours;
        lines.push(`${count}x ${trade.trade}`);
      }
    }

    const totalEstimate = dailyCost * durationDays;
    const summaryText =
      lines.length > 0
        ? `${totalHeadcount} personnel for ${durationDays} days (${lines.join(', ')})`
        : '';

    return {
      totalHeadcount,
      dailyCost,
      totalEstimate,
      summaryText,
    };
  }, [tradeCounts, durationDays]);

  const adjustTrade = (id: string, delta: number) => {
    setTradeCounts((prev) => {
      const next = Math.max(0, Math.min(100, (prev[id] || 0) + delta));
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="bg-slate-50">
      {/* Header & Interactive Filter Control */}
      <section className="bg-slate-950 text-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-4 max-w-3xl">
            <p className="text-sm font-medium text-amber-400">
              Technical Scope of Services
            </p>
            <h1 className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-tight tracking-tight text-white [text-wrap:balance]">
              Contracting Specifications, Standards &amp; Commercial Models
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Every division operates with dedicated engineering supervision, full
              material traceability, and transparent commercial rates tailored to turnkey
              or labor-only project requirements.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter service divisions"
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-lg"
          >
            {FILTER_OPTIONS.map((option) => {
              const selected = activeFilter === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveFilter(option.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    selected
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Division Cards */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {filteredDivisions.map((division) => (
            <article
              key={division.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              <div className="lg:col-span-5 bg-slate-900 min-h-[260px]">
                <SafeImage
                  src={division.image}
                  alt={division.imageAlt}
                  title={division.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono tabular-nums font-semibold text-amber-700">
                      {division.standards}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{division.turnaround}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                    {division.number}. {division.title}
                  </h2>

                  <p className="text-base text-slate-600 leading-relaxed">
                    {division.summary}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs font-semibold tracking-wide text-slate-500 mb-3">
                      Included Field Deliverables
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {division.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-slate-800"
                        >
                          <Check
                            className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-500">{division.engagementModel}</p>
                    <p className="text-sm font-semibold font-mono tabular-nums text-slate-900">
                      {division.indicativePricing}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('contact', division.title)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Request Quote for {division.shortTitle}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Manpower Estimator */}
      <section className="py-14 lg:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-sm font-medium text-amber-700">
                Manpower Planning Tool
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 [text-wrap:balance]">
                Configure Project-Based or Long-Term Crew Support
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Select trade headcounts and deployment duration to generate an
                indicative mobilization estimate to attach directly to your booking request.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="duration-select"
                className="text-sm font-medium text-slate-700 whitespace-nowrap"
              >
                Deployment Term
              </label>
              <select
                id="duration-select"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="px-3.5 py-2 text-sm font-medium bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              >
                <option value={7}>7 Days (Short Shutdown)</option>
                <option value={30}>30 Days (Monthly Support)</option>
                <option value={90}>90 Days (Quarterly Project)</option>
                <option value={180}>180 Days (Long-Term Contract)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 divide-y divide-slate-200 border border-slate-200 rounded-lg bg-slate-50">
              {MANPOWER_TRADES.map((trade) => {
                const count = tradeCounts[trade.id] || 0;
                return (
                  <div
                    key={trade.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{trade.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          ${trade.hourlyIndicative}/hr indicative
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-950">
                        {trade.trade}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600">{trade.summary}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => adjustTrade(trade.id, -1)}
                        aria-label={`Decrease ${trade.trade}`}
                        className="w-10 h-10 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-mono tabular-nums text-base font-semibold text-slate-950">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjustTrade(trade.id, 1)}
                        aria-label={`Increase ${trade.trade}`}
                        className="w-10 h-10 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-4 p-6 bg-slate-950 text-white rounded-lg space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-amber-400">
                  Crew Mobilization Summary
                </p>
                <h3 className="text-xl font-bold text-white">Indicative Crew Plan</h3>
              </div>

              <dl className="space-y-3 text-sm border-y border-slate-800 py-4">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400">Total Crew Headcount</dt>
                  <dd className="font-mono tabular-nums font-semibold text-white">
                    {estimatorSummary.totalHeadcount} personnel
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400">Deployment Window</dt>
                  <dd className="font-mono tabular-nums font-semibold text-white">
                    {durationDays} days
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-400">Indicative Daily Rate</dt>
                  <dd className="font-mono tabular-nums font-semibold text-white">
                    ${estimatorSummary.dailyCost.toLocaleString()} / day
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <dt className="text-slate-300 font-medium">Estimated Term Total</dt>
                  <dd className="font-mono tabular-nums text-lg font-bold text-amber-400">
                    ${estimatorSummary.totalEstimate.toLocaleString()}
                  </dd>
                </div>
              </dl>

              <p className="text-xs text-slate-400 leading-relaxed">
                Includes standard PPE kit, safety induction, and payroll compliance. Final
                contract rate is confirmed upon site shift assessment.
              </p>

              <button
                type="button"
                disabled={estimatorSummary.totalHeadcount === 0}
                onClick={() =>
                  onNavigate(
                    'contact',
                    'Manpower Supply Services',
                    estimatorSummary.summaryText,
                  )
                }
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
              >
                Attach Crew Plan &amp; Book
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
