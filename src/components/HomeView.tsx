import { ArrowRight, Check } from 'lucide-react';
import {
  CASE_METRICS,
  CLIENT_TESTIMONIALS,
  KEY_METRICS,
  PageId,
  SERVICE_DIVISIONS,
} from '../data/contractingData';
import { SafeImage } from './SafeImage';

interface HomeViewProps {
  onNavigate: (page: PageId, preselectDivision?: string) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div>
      {/* 1. Hero Proposition */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-sm font-medium text-amber-400 tracking-wide">
                Craft Innovation Contracting · Electrical · Mechanical · Fire Safety · Manpower
              </p>

              <h1 className="text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-white [text-wrap:balance]">
                Engineered MEP Contracting &amp; Certified Site Manpower
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Single-point execution across electrical conduit and power distribution,
                structural steel and mechanical fabrication, NFPA-compliant fire alarm
                protection, and rapid skilled workforce mobilization.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('contact', 'Manpower Supply Services')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Request Manpower &amp; Quote
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm sm:text-base font-medium text-slate-100 hover:text-white border border-slate-700 hover:border-slate-500 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  View Scope of Services
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-72 sm:h-96 lg:h-full min-h-[340px] rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                <SafeImage
                  src="/src/assets/images/hero_mep_contracting_1794923035566.jpg"
                  alt="Structural steel beams, galvanized electrical conduits, and high-bay lighting installed inside an industrial facility"
                  title="MEP & Structural Steel Execution"
                  eager
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"
                />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200">
                  <span>Turnkey Commercial &amp; Industrial Execution</span>
                  <span className="font-mono tabular-nums text-amber-400">
                    IEC · AWS D1.1 · NFPA 72
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-column operational proof strip below hero split */}
          <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {KEY_METRICS.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">
                  {metric.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Capabilities & Scope of Services (Asymmetric Bento Grid) */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-slate-200">
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm font-medium text-amber-700">
                Core Contracting Divisions
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 [text-wrap:balance]">
                Four Integrated Disciplines Built for Schedule Certainty
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Inspect full specifications
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {SERVICE_DIVISIONS.map((division, idx) => {
              const isWide = idx === 0 || idx === 3;
              return (
                <article
                  key={division.id}
                  className={`${
                    isWide ? 'lg:col-span-7' : 'lg:col-span-5'
                  } bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col`}
                >
                  <div className="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/9] bg-slate-900 overflow-hidden">
                    <SafeImage
                      src={division.image}
                      alt={division.imageAlt}
                      title={division.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono tabular-nums font-medium text-amber-700">
                          {division.standards}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{division.turnaround}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                        {division.number}. {division.title}
                      </h3>

                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {division.summary}
                      </p>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-2">
                        {division.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-slate-700"
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

                    <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <span className="text-xs font-medium text-slate-500">
                        {division.engagementModel}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('contact', division.title)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-950 hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Request scope quote
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Proof of Impact & Client Testimonials */}
      <section className="py-16 lg:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm font-medium text-amber-700">
              Verified Field Performance
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 [text-wrap:balance]">
              Measured Delivery Across Industrial &amp; Commercial Sites
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CASE_METRICS.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{item.sector}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.division}</span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-950">
                    {item.metricValue}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.projectTitle}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.metricContext}
                  </p>
                </div>
                <p className="pt-4 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
                  {item.beforeAfter}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {CLIENT_TESTIMONIALS.map((t) => (
              <blockquote
                key={t.id}
                className="flex flex-col justify-between space-y-6 p-6 bg-white border border-slate-200 rounded-lg"
              >
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  “{t.quote}”
                </p>
                <footer className="pt-4 border-t border-slate-100 space-y-1">
                  <p className="text-sm font-semibold text-slate-950">{t.author}</p>
                  <p className="text-xs text-slate-600">
                    {t.role} · {t.organization}
                  </p>
                  <p className="text-xs text-amber-700 font-medium">{t.projectScope}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Final Conversion Band */}
      <section className="py-16 lg:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white [text-wrap:balance]">
              Need Certified MEP Contractors or Site Manpower Within 48 Hours?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Reserve a technical site survey, request a measured BoQ tender quote, or
              schedule trade-tested electricians, welders, fitters, and helpers directly.
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('contact', 'Manpower Supply Services')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Book Consultation or Manpower
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
