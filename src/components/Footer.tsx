import { PageId, SERVICE_DIVISIONS } from '../data/contractingData';

interface FooterProps {
  onNavigate: (page: PageId, preselectDivision?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          <div className="md:col-span-5 space-y-4">
            <img
              src="/assets/aistudio/logo_f81ee417.svg"
              alt="Craft Innovation Contracting"
              className="h-10 w-auto object-contain"
            />
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Multi-discipline electrical, mechanical steel fabrication, fire protection,
              and certified technical manpower contracting for commercial, logistics, and
              industrial developments.
            </p>
            <p className="text-xs text-slate-400">
              IEC 60364 · AWS D1.1 · NFPA 72 · ISO 45001 Safety Governance
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="text-sm font-semibold text-white">Navigation</h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About &amp; Leadership
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Scope of Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact', 'Manpower Supply Services')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Book Consultation &amp; Manpower
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h2 className="text-sm font-semibold text-white">Contracting Divisions</h2>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_DIVISIONS.map((division) => (
                <li key={division.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact', division.title)}
                    className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {division.number}. {division.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400">
          <p>© {year} Craft Innovation Contracting. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <span>projects@craftinnovation.com</span>
            <span aria-hidden="true">·</span>
            <span>+971 4 550 8420</span>
            <span aria-hidden="true">·</span>
            <span>Plot 412, Industrial Sector 4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
