import { ArrowRight } from 'lucide-react';
import { PageId, TEAM_MEMBERS } from '../data/contractingData';
import { SafeImage } from './SafeImage';

interface AboutViewProps {
  onNavigate: (page: PageId, preselectDivision?: string) => void;
}

const PRINCIPLES = [
  {
    number: '01',
    title: 'Single-Point Field Accountability',
    description:
      'Electrical conduit, structural steel supports, fire alarm loops, and site trades operate under one coordinated engineering schedule—eliminating inter-contractor finger-pointing.',
  },
  {
    number: '02',
    title: 'Code-Verified Testing & Handover',
    description:
      'Every circuit megawatt check, AWS D1.1 weld inspection, and NFPA 72 cause-and-effect test is documented in standardized commissioning dossiers prior to client sign-off.',
  },
  {
    number: '03',
    title: 'Trade-Tested Workforce & Zero-LTI Safety',
    description:
      'All supplied technicians, welders, and helpers undergo practical bay testing, HSE site induction, and full PPE outfitting before stepping onto your project floor.',
  },
];

export function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div className="bg-slate-50">
      {/* Header Band */}
      <section className="bg-slate-950 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
            <p className="text-sm font-medium text-amber-400">
              About Craft Innovation Contracting
            </p>
            <h1 className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-tight tracking-tight text-white [text-wrap:balance]">
              Built by Field Engineers to Eliminate MEP &amp; Fabrication Bottlenecks
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Craft Innovation Contracting was established to solve a recurring industrial
              construction challenge: fragmented subcontractors causing delays between
              structural steel erection, electrical rough-in, fire life-safety
              commissioning, and site labor availability.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="h-64 sm:h-80 lg:h-full min-h-[260px] rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
              <SafeImage
                src="/src/assets/images/service_manpower_team_1794923037088.jpg"
                alt="Craft Innovation Contracting engineering supervisors and certified technicians reviewing structural drawings"
                title="Engineering & Field Leadership"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Operational Standards */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="text-sm font-medium text-amber-700">Mission &amp; Governance</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 [text-wrap:balance]">
                Delivering Safe, Inspectable Infrastructure on Fixed Schedules
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-base text-slate-600 leading-relaxed">
              <p>
                Our mission is straightforward: execute electrical, mechanical steel,
                and fire protection scopes with zero rework while supplying industrial
                clients with reliable, trade-certified manpower that integrates seamlessly
                into active plant and construction environments.
              </p>
              <p>
                From our dedicated steel fabrication bay and trade testing facility, we
                pre-verify weld tolerances, bend tolerances, and technician competencies
                before mobilization—protecting project timelines and safety records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {PRINCIPLES.map((item) => (
              <div
                key={item.number}
                className="p-6 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
              >
                <p className="text-sm font-mono tabular-nums font-semibold text-amber-700">
                  {item.number}
                </p>
                <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Engineering Team Bios */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-sm font-medium text-amber-700">Leadership Team</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                Senior Engineers &amp; Workforce Directors
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact', 'Manpower Supply Services')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Schedule Leadership Consultation
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <article
                key={member.id}
                className="p-6 sm:p-8 bg-white border border-slate-200 rounded-lg space-y-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{member.division}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{member.experience}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">{member.name}</h3>
                  <p className="text-sm font-medium text-amber-700">{member.role}</p>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{member.bio}</p>

                <p className="pt-3 border-t border-slate-100 text-xs font-medium text-slate-500">
                  Credentials: {member.credentials}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
