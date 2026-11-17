import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageId } from '../data/contractingData';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId, preselectDivision?: string) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (page: PageId, preselectDivision?: string) => {
    setMobileOpen(false);
    onNavigate(page, preselectDivision);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand Logo */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          aria-label="Craft Innovation Contracting home"
          className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 rounded-sm cursor-pointer"
        >
          <img
            src="/assets/aistudio/logo_f81ee417.svg"
            alt="Craft Innovation Contracting"
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 rounded-sm ${
                  isActive
                    ? 'text-slate-950 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-amber-600 transition-transform duration-150 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('contact', 'Manpower Supply Services')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            Request Manpower
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-slate-700 hover:text-slate-950 rounded-md border border-slate-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLinkClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-3 text-base rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleLinkClick('contact', 'Manpower Supply Services')}
              className="w-full py-3 px-4 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors cursor-pointer"
            >
              Request Manpower
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
