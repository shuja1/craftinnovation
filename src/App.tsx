import { useCallback, useEffect, useState } from 'react';
import { AboutView } from './components/AboutView';
import { ContactBookingView } from './components/ContactBookingView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { Navbar } from './components/Navbar';
import { ServicesView } from './components/ServicesView';
import { PageId } from './data/contractingData';

const VALID_PAGES: PageId[] = ['home', 'about', 'services', 'contact'];

function getPageFromHash(): PageId {
  const hash = window.location.hash.replace('#', '') as PageId;
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(getPageFromHash);
  const [preselectedDivision, setPreselectedDivision] = useState<string | undefined>(
    undefined,
  );
  const [manpowerSummary, setManpowerSummary] = useState<string | undefined>(undefined);

  useEffect(() => {
    const onHashChange = () => {
      setActivePage(getPageFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = useCallback(
    (page: PageId, division?: string, crewSummary?: string) => {
      if (division) {
        setPreselectedDivision(division);
      }
      if (crewSummary !== undefined) {
        setManpowerSummary(crewSummary);
      }
      setActivePage(page);
      window.history.replaceState(null, '', `#${page}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-slate-950 focus:font-semibold focus:rounded-md"
      >
        Skip to main content
      </a>

      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      <main id="main-content" className="flex-1">
        {activePage === 'home' && <HomeView onNavigate={handleNavigate} />}
        {activePage === 'about' && <AboutView onNavigate={handleNavigate} />}
        {activePage === 'services' && <ServicesView onNavigate={handleNavigate} />}
        {activePage === 'contact' && (
          <ContactBookingView
            initialDivision={preselectedDivision}
            initialManpowerSummary={manpowerSummary}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
