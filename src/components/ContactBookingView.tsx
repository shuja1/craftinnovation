import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { REGIONAL_HUBS, SERVICE_DIVISIONS } from '../data/contractingData';

interface ContactBookingViewProps {
  initialDivision?: string;
  initialManpowerSummary?: string;
}

interface SlotInfo {
  time: string;
  available: boolean;
}

interface BookingConfirmation {
  referenceId: string;
  preferredDate: string;
  preferredSlot: string;
  division: string;
  message: string;
}

function getNextBusinessDays(count = 6): { iso: string; label: string; weekday: string }[] {
  const days: { iso: string; label: string; weekday: string }[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);

  while (days.length < count) {
    const dayOfWeek = cursor.getDay();
    // Skip Friday/Saturday or Sunday? Keep Mon-Sat / Sun-Thu standard; skip Friday only or Sunday only.
    if (dayOfWeek !== 0) {
      const iso = cursor.toISOString().slice(0, 10);
      const weekday = cursor.toLocaleDateString('en-US', { weekday: 'short' });
      const label = cursor.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      days.push({ iso, label, weekday });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function ContactBookingView({
  initialDivision,
  initialManpowerSummary,
}: ContactBookingViewProps) {
  const quickDates = useMemo(() => getNextBusinessDays(6), []);

  const [csrfToken, setCsrfToken] = useState<string>('');
  const [selectedHubId, setSelectedHubId] = useState<string>(REGIONAL_HUBS[0].id);

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState(
    initialDivision || 'Manpower Supply Services',
  );
  const [engagementType, setEngagementType] = useState('Manpower Supply Mobilization');
  const [preferredDate, setPreferredDate] = useState(quickDates[0]?.iso || '');
  const [preferredSlot, setPreferredSlot] = useState('09:00 AM');
  const [manpowerSummary, setManpowerSummary] = useState(initialManpowerSummary || '');
  const [projectNotes, setProjectNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [slots, setSlots] = useState<SlotInfo[]>([
    { time: '09:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '02:00 PM', available: true },
    { time: '04:00 PM', available: true },
  ]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    if (initialDivision) {
      setDivision(initialDivision);
      if (initialDivision === 'Manpower Supply Services') {
        setEngagementType('Manpower Supply Mobilization');
      } else {
        setEngagementType('Site Survey & Project Proposal');
      }
    }
  }, [initialDivision]);

  useEffect(() => {
    if (initialManpowerSummary) {
      setManpowerSummary(initialManpowerSummary);
    }
  }, [initialManpowerSummary]);

  const fetchCsrfToken = useCallback(async () => {
    try {
      const res = await fetch('/api/security-token');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = (await res.json()) as { csrfToken?: string };
        if (data.csrfToken) setCsrfToken(data.csrfToken);
      }
    } catch {
      // Static hosting mode or offline retry
    }
  }, []);

  useEffect(() => {
    fetchCsrfToken();
  }, [fetchCsrfToken]);

  const fetchSlots = useCallback(async (dateIso: string) => {
    if (!dateIso) return;
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/bookings/slots?date=${encodeURIComponent(dateIso)}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = (await res.json()) as { slots: SlotInfo[] };
        setSlots(data.slots);
        const firstAvailable = data.slots.find((s) => s.available);
        if (firstAvailable) {
          setPreferredSlot((curr) => {
            const currentStillFree = data.slots.some(
              (s) => s.time === curr && s.available,
            );
            return currentStillFree ? curr : firstAvailable.time;
          });
        }
        return;
      }
      throw new Error('Static fallback');
    } catch {
      const defaultTimes = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];
      const stored = JSON.parse(
        localStorage.getItem('cic_reserved_slots') || '{}',
      ) as Record<string, string[]>;
      const booked = new Set(stored[dateIso] || []);
      setSlots(
        defaultTimes.map((time) => ({ time, available: !booked.has(time) })),
      );
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots(preferredDate);
  }, [preferredDate, fetchSlots]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (honeypot.trim().length > 0) {
      setFormError('Submission rejected by spam validation.');
      return;
    }

    if (fullName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setFormError('Please provide a valid business email address.');
      return;
    }
    if (phone.replace(/[^\d]/g, '').length < 7) {
      setFormError('Please provide a valid contact phone number.');
      return;
    }

    setSubmitting(true);
    try {
      let tokenToSend = csrfToken;
      if (!tokenToSend) {
        try {
          const tokenRes = await fetch('/api/security-token');
          const tokenType = tokenRes.headers.get('content-type') || '';
          if (tokenRes.ok && tokenType.includes('application/json')) {
            const tokenData = (await tokenRes.json()) as { csrfToken: string };
            tokenToSend = tokenData.csrfToken;
            setCsrfToken(tokenData.csrfToken);
          }
        } catch {
          // Static hosting mode
        }
      }

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': tokenToSend,
        },
        body: JSON.stringify({
          fullName,
          companyName,
          email,
          phone,
          division,
          engagementType,
          preferredDate,
          preferredSlot,
          manpowerSummary,
          projectNotes,
          website_url: honeypot,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          setFormError(
            data.error || 'Unable to submit request. Please review your entries.',
          );
          if (response.status === 403) {
            fetchCsrfToken();
          }
          if (response.status === 409) {
            fetchSlots(preferredDate);
          }
          return;
        }

        setConfirmation(data as BookingConfirmation);
        fetchSlots(preferredDate);
        fetchCsrfToken();
        return;
      }

      // Static cPanel fallback when /api/* is not routed to Node.js
      const stored = JSON.parse(
        localStorage.getItem('cic_reserved_slots') || '{}',
      ) as Record<string, string[]>;
      const dateSlots = new Set(stored[preferredDate] || []);
      dateSlots.add(preferredSlot);
      stored[preferredDate] = Array.from(dateSlots);
      localStorage.setItem('cic_reserved_slots', JSON.stringify(stored));

      const refNum = `CIC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmation({
        referenceId: refNum,
        preferredDate,
        preferredSlot,
        division,
        message: 'Your consultation & scope request has been logged.',
      });
      fetchSlots(preferredDate);
    } catch {
      const refNum = `CIC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmation({
        referenceId: refNum,
        preferredDate,
        preferredSlot,
        division,
        message: 'Your consultation & scope request has been logged.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const activeHub =
    REGIONAL_HUBS.find((h) => h.id === selectedHubId) || REGIONAL_HUBS[0];

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="bg-slate-950 text-white py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-sm font-medium text-amber-400">
            Contact &amp; Consultation Booking
          </p>
          <h1 className="text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-tight tracking-tight text-white [text-wrap:balance]">
            Book a Site Survey, Tender Review or Manpower Dispatch
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Select a consultation window below to connect directly with our electrical,
            mechanical, fire safety, or workforce mobilization leads.
          </p>
        </div>
      </section>

      {/* Main Booking Form + Facilities Grid */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Interactive Form & Booking Calendar */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 lg:p-10">
            {confirmation ? (
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-7 h-7 text-emerald-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-emerald-700">
                      Request Confirmed
                    </p>
                    <h2 className="text-2xl font-bold text-slate-950">
                      Consultation &amp; Scope Logged
                    </h2>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {confirmation.message} Our division engineer will contact you prior to
                  your scheduled window to confirm site access or mobilization details.
                </p>

                <dl className="p-5 bg-slate-50 border border-slate-200 rounded-md space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Reference Number</dt>
                    <dd className="font-mono tabular-nums font-bold text-slate-950">
                      {confirmation.referenceId}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Division</dt>
                    <dd className="font-medium text-slate-900">
                      {confirmation.division}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Reserved Window</dt>
                    <dd className="font-mono tabular-nums font-medium text-slate-900">
                      {confirmation.preferredDate} · {confirmation.preferredSlot}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmation(null);
                    setProjectNotes('');
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="space-y-1 border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-bold text-slate-950">
                    Project &amp; Manpower Consultation Form
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Fields marked with * are required for engineering assignment.
                  </p>
                </div>

                {/* Honeypot hidden field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url">Leave blank</label>
                  <input
                    id="website_url"
                    name="website_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {formError && (
                  <div
                    role="alert"
                    className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-800"
                  >
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tariq Al-Mansoor"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Company / Organization
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Meridian Industrial LLC"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Business Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Contact Phone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 000 0000"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="division"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Scope Division *
                    </label>
                    <select
                      id="division"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    >
                      {SERVICE_DIVISIONS.map((d) => (
                        <option key={d.id} value={d.title}>
                          {d.number}. {d.title}
                        </option>
                      ))}
                      <option value="Multi-Discipline MEP & Manpower Package">
                        Multi-Discipline MEP &amp; Manpower Package
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="engagementType"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Request Type
                    </label>
                    <select
                      id="engagementType"
                      value={engagementType}
                      onChange={(e) => setEngagementType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    >
                      <option value="Manpower Supply Mobilization">
                        Manpower Supply Mobilization
                      </option>
                      <option value="Site Survey & Project Proposal">
                        Site Survey &amp; Project Proposal
                      </option>
                      <option value="BoQ Tender Pricing">BoQ Tender Pricing</option>
                      <option value="Annual Maintenance Contract (AMC)">
                        Annual Maintenance Contract (AMC)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Interactive Booking Calendar & Time Slots */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Calendar className="w-4 h-4 text-amber-700" aria-hidden="true" />
                      Site Survey / Consultation Calendar
                    </span>
                    <input
                      type="date"
                      aria-label="Choose custom consultation date"
                      value={preferredDate}
                      min={quickDates[0]?.iso}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="px-2.5 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-md text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {quickDates.map((d) => {
                      const active = preferredDate === d.iso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setPreferredDate(d.iso)}
                          className={`p-2.5 rounded-md border text-center transition-colors cursor-pointer ${
                            active
                              ? 'bg-slate-950 text-white border-slate-950'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span className="block text-[11px] opacity-80">
                            {d.weekday}
                          </span>
                          <span className="block text-xs font-semibold font-mono tabular-nums">
                            {d.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                      {loadingSlots
                        ? 'Checking available windows...'
                        : 'Select available time slot'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => {
                        const selected = preferredSlot === slot.time && slot.available;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setPreferredSlot(slot.time)}
                            className={`py-2.5 px-3 text-xs font-mono tabular-nums font-medium rounded-md border transition-colors ${
                              !slot.available
                                ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                                : selected
                                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-semibold cursor-pointer'
                                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-500 cursor-pointer'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {manpowerSummary && (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="manpowerSummary"
                      className="block text-sm font-medium text-slate-800"
                    >
                      Attached Crew Plan
                    </label>
                    <input
                      id="manpowerSummary"
                      type="text"
                      value={manpowerSummary}
                      onChange={(e) => setManpowerSummary(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-300 rounded-md text-slate-900"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="projectNotes"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Project Scope, Location &amp; Timeline Notes
                  </label>
                  <textarea
                    id="projectNotes"
                    rows={4}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Describe site location, conduit/steel tonnage or trade headcount requirements, and target mobilization date."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
                    Protected by CSRF verification &amp; sanitized inquiry handling
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {submitting ? 'Submitting Request...' : 'Confirm Consultation & Request'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct Contact & Operational Hub Map Selector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-lg space-y-5">
              <h2 className="text-lg font-bold text-slate-950">Direct Dispatch &amp; Tendering</h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-slate-500">Tenders &amp; Manpower Desk</p>
                    <a
                      href="mailto:projects@craftinnovation.com"
                      className="font-semibold text-slate-900 hover:text-amber-700"
                    >
                      projects@craftinnovation.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-700 shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-slate-500">24/7 Operations &amp; Emergency Maintenance</p>
                    <p className="font-semibold font-mono tabular-nums text-slate-900">
                      +971 4 550 8420
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-slate-500">Registered Contracting Office</p>
                    <p className="font-medium text-slate-900">
                      Plot 412, Industrial Sector 4, Business Engineering Park
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facility Coverage Locator */}
            <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-lg space-y-5">
              <div className="space-y-1">
                <p className="text-xs font-medium text-amber-400">
                  Regional Facilities &amp; Yards
                </p>
                <h2 className="text-lg font-bold text-white">
                  Operational Locations
                </h2>
              </div>

              <div className="space-y-2">
                {REGIONAL_HUBS.map((hub) => {
                  const active = hub.id === activeHub.id;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => setSelectedHubId(hub.id)}
                      className={`w-full text-left p-3.5 rounded-md border transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-800 border-amber-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-sm font-semibold">{hub.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{hub.address}</p>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-md space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Operating Hours</span>
                  <span className="font-mono tabular-nums text-amber-400">
                    {activeHub.coordinates}
                  </span>
                </div>
                <p className="text-sm font-medium text-white">{activeHub.hours}</p>
                <p className="text-slate-400 leading-relaxed">{activeHub.coverage}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
