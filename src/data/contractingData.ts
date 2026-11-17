export type PageId = 'home' | 'about' | 'services' | 'contact';

export interface ServiceDivision {
  id: 'electrical' | 'mechanical' | 'fire-protection' | 'manpower';
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  summary: string;
  image: string;
  imageAlt: string;
  standards: string;
  turnaround: string;
  engagementModel: string;
  indicativePricing: string;
  deliverables: string[];
  featuredSpan?: boolean;
}

export interface CaseMetric {
  id: string;
  sector: string;
  projectTitle: string;
  division: string;
  metricValue: string;
  metricContext: string;
  beforeAfter: string;
}

export interface ClientTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  projectScope: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string;
  experience: string;
  credentials: string;
  bio: string;
}

export interface ManpowerTrade {
  id: string;
  trade: string;
  category: 'Skilled' | 'Semi-Skilled & Helpers' | 'Technical';
  hourlyIndicative: number;
  dailyHours: number;
  summary: string;
}

export const SERVICE_DIVISIONS: ServiceDivision[] = [
  {
    id: 'electrical',
    number: '01',
    title: 'Electrical Contracting & Maintenance',
    shortTitle: 'Electrical Works',
    subtitle: 'Power Distribution · Conduit Routing · Illumination',
    summary:
      'Complete LV/MV electrical installations, precision galvanized conduit routing, heavy cable pulling, and preventive testing for commercial complexes and industrial plants.',
    image: '/src/assets/images/service_electrical_works_1794923036283.jpg',
    imageAlt:
      'Industrial electrical distribution room with aligned galvanized steel conduits, cable trays, and switchgear panels',
    standards: 'IEC 60364 · NFPA 70',
    turnaround: '48 hr site mobilization',
    engagementModel: 'Turnkey BoQ or Annual Maintenance Contract',
    indicativePricing: 'From $4,800 per circuit zone · Custom BoQ tender',
    deliverables: [
      'Electrical conduit installation',
      'Electrical cable laying and pulling',
      'Lighting installation and maintenance',
      'Cable termination and connection',
      'Electrical installation, testing and maintenance',
    ],
    featuredSpan: true,
  },
  {
    id: 'mechanical',
    number: '02',
    title: 'Mechanical Contracting & Maintenance',
    shortTitle: 'Mechanical & Steel',
    subtitle: 'Structural Fabrication · Erection · Architectural Metalwork',
    summary:
      'In-house workshop steel fabrication and certified site erection covering primary structural trusses, rooftop parapets, safety handrails, and plant mechanical upkeep.',
    image: '/src/assets/images/service_mechanical_steel_1794923037037.jpg',
    imageAlt:
      'Structural steel truss fabrication and brushed stainless steel handrails inside an industrial workshop',
    standards: 'AWS D1.1 · ISO 3834',
    turnaround: '5–10 day shop drawing to erection',
    engagementModel: 'Fabrication + Erection Lump Sum or Tonnage Rate',
    indicativePricing: 'From $2,150 per metric ton fabricated & erected',
    deliverables: [
      'Mechanical fabrication and erection',
      'Parapet fabrication and installation',
      'Structural steel fabrication and erection',
      'Handrail fabrication and installation',
      'Miscellaneous steel fabrication and installation',
      'Mechanical maintenance works',
    ],
  },
  {
    id: 'fire-protection',
    number: '03',
    title: 'Fire Alarm & Fire Protection Works',
    shortTitle: 'Fire & Life Safety',
    subtitle: 'Addressable Detection · Fire Conduit · Commissioning',
    summary:
      'Code-compliant life-safety infrastructure engineered to Civil Defense and NFPA standards—from dedicated fire-rated conduit runs and loop cabling to full panel commissioning.',
    image: '/src/assets/images/service_fire_protection_1794923038772.jpg',
    imageAlt:
      'Commercial fire protection control room with red fire alarm conduits, control panel, and riser pressure gauges',
    standards: 'NFPA 72 · NFPA 13 · UL/FM',
    turnaround: '72 hr inspection & commissioning',
    engagementModel: 'Turnkey Authority-Approved Package or Testing AMC',
    indicativePricing: 'From $3,600 per addressable loop zone',
    deliverables: [
      'Fire alarm conduit installation',
      'Fire alarm cable laying and pulling',
      'Fire alarm system installation',
      'Cable termination and connection',
      'Fire alarm system testing and maintenance',
    ],
  },
  {
    id: 'manpower',
    number: '04',
    title: 'Manpower Supply Services',
    shortTitle: 'Manpower Supply',
    subtitle: 'Certified Trades · Supervisors · Flexible Mobilization',
    summary:
      'Rapid deployment of trade-tested electricians, certified welders, mechanical fitters, and site helpers backed by full PPE compliance, safety induction, and payroll administration.',
    image: '/src/assets/images/service_manpower_team_1794923037088.jpg',
    imageAlt:
      'Certified electricians, steel fabricators, and MEP engineers reviewing blueprints on a commercial construction site',
    standards: 'OSHA 30 · Trade-Tested',
    turnaround: '24–72 hr crew deployment',
    engagementModel: 'Project-Based Surge or Long-Term Monthly Retainer',
    indicativePricing: 'From $18–$34 / hr per certified technician (PPE included)',
    deliverables: [
      'Skilled manpower supply',
      'Unskilled and semi-skilled manpower supply',
      'Technical and industrial manpower',
      'Electrical and mechanical technicians',
      'Fabricators, welders, fitters, and helpers',
      'Project-based and long-term manpower support',
    ],
    featuredSpan: true,
  },
];

export const MANPOWER_TRADES: ManpowerTrade[] = [
  {
    id: 'elec-tech',
    trade: 'Certified Electrical Technicians',
    category: 'Technical',
    hourlyIndicative: 28,
    dailyHours: 8,
    summary: 'Conduit bending, cable pulling, glanding, termination & megger testing',
  },
  {
    id: 'mech-tech',
    trade: 'Mechanical & Piping Technicians',
    category: 'Technical',
    hourlyIndicative: 29,
    dailyHours: 8,
    summary: 'Plant equipment alignment, valve servicing, rigging & mechanical maintenance',
  },
  {
    id: 'welders-fab',
    trade: '6G Welders & Steel Fabricators',
    category: 'Skilled',
    hourlyIndicative: 32,
    dailyHours: 8,
    summary: 'Structural steel erection, parapet framing, handrail TIG/MIG & stick welding',
  },
  {
    id: 'fire-tech',
    trade: 'Fire Alarm & Life-Safety Technicians',
    category: 'Technical',
    hourlyIndicative: 31,
    dailyHours: 8,
    summary: 'Fire-rated conduit, addressable loop wiring, panel termination & cause-effect tests',
  },
  {
    id: 'fitters',
    trade: 'Steel & Mechanical Fitters',
    category: 'Skilled',
    hourlyIndicative: 25,
    dailyHours: 8,
    summary: 'Blueprint reading, bolt torqueing, flange assembly & bracket mounting',
  },
  {
    id: 'helpers',
    trade: 'Semi-Skilled Crew & Site Helpers',
    category: 'Semi-Skilled & Helpers',
    hourlyIndicative: 18,
    dailyHours: 8,
    summary: 'Cable drum handling, site logistics, fire-watch & material staging support',
  },
];

export const KEY_METRICS = [
  { value: '4', label: 'Integrated Contracting Divisions' },
  { value: '24–72 hr', label: 'Certified Crew Mobilization' },
  { value: '99.4%', label: 'Milestone Schedule Adherence' },
  { value: '0 LTI', label: 'Lost-Time Injury Target Record' },
];

export const CASE_METRICS: CaseMetric[] = [
  {
    id: 'case-1',
    sector: 'Logistics & Cold Chain',
    projectTitle: 'Al-Mina Distribution Hub MEP & Fire Retrofit',
    division: 'Electrical + Fire Protection',
    metricValue: '18 Days Early',
    metricContext: '42,000 m of galvanized conduit & fire-rated cabling commissioned ahead of handover',
    beforeAfter:
      'Replaced fragmented sub-tier wiring crews with a single 28-technician Craft Innovation team, clearing Civil Defense final inspection on first walkthrough.',
  },
  {
    id: 'case-2',
    sector: 'Commercial Manufacturing',
    projectTitle: 'Horizon Heavy Assembly Bay Structural Steel & Handrails',
    division: 'Mechanical & Structural Steel',
    metricValue: '310 Metric Tons',
    metricContext: 'Roof trusses, safety parapets & 1.4 km of stainless steel handrails erected with zero rework',
    beforeAfter:
      'Fabricated modular assemblies off-site at our workshop while civil foundations cured, cutting on-site crane occupancy by 34%.',
  },
  {
    id: 'case-3',
    sector: 'Industrial Petrochemical',
    projectTitle: 'Turnaround Shutdown Technical Manpower Deployment',
    division: 'Manpower Supply Services',
    metricValue: '64 Specialists',
    metricContext: 'Mobilized within 48 hours for a 90-day continuous electrical & mechanical turnaround',
    beforeAfter:
      'Supplied trade-tested 6G welders, MV cable jointers, and mechanical fitters with 100% attendance across two daily shifts.',
  },
];

export const CLIENT_TESTIMONIALS: ClientTestimonial[] = [
  {
    id: 'test-1',
    quote:
      'Before bringing Craft Innovation onto our 18-bay warehouse expansion, our electrical conduit and fire alarm rough-in were slipping by three weeks. Their crew unified both scopes under one site supervisor and passed authority testing on the first inspection.',
    author: 'Tariq Al-Mansoor',
    role: 'Senior MEP Project Manager',
    organization: 'Meridian Industrial Developments',
    projectScope: 'Electrical Conduit, Lighting & Fire Alarm Commissioning',
  },
  {
    id: 'test-2',
    quote:
      'Their mechanical fabrication bay delivered 850 meters of galvanized parapet framing and architectural handrails with millimeter bolt-hole accuracy. Our erection schedule stayed tight without a single field modification.',
    author: 'Elena Kovacs',
    role: 'Director of Facilities Engineering',
    organization: 'Nordic Logistics Group',
    projectScope: 'Parapet, Handrail & Structural Steel Fabrication',
  },
  {
    id: 'test-3',
    quote:
      'When we needed 30 certified electrical technicians and pipe fitters for a plant maintenance outage, Craft Innovation mobilized fully inducted personnel in under 48 hours. Every technician arrived with verified trade credentials and full PPE.',
    author: 'Rajesh Nair',
    role: 'Plant Operations Lead',
    organization: 'Apex Precision Metals',
    projectScope: 'Long-Term Skilled & Technical Manpower Support',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Eng. Khalid Al-Harbi',
    role: 'Managing Director & Principal MEP Engineer',
    division: 'Executive Operations',
    experience: '19 Years Field & EPC Leadership',
    credentials: 'B.Sc. Electrical Engineering · PMP',
    bio: 'Leads turnkey MEP contracting strategy, authority compliance, and multi-discipline site governance across commercial and heavy industrial developments.',
  },
  {
    id: 'team-2',
    name: 'Eng. Vikram Deshmukh',
    role: 'Head of Electrical & Fire Protection Systems',
    division: 'Electrical & Life Safety',
    experience: '15 Years HV/LV & NFPA Systems',
    credentials: 'B.Eng. Electrical · NFPA CFPS Certified',
    bio: 'Oversees conduit engineering, switchgear terminations, megawatt distribution testing, and addressable fire alarm loop commissioning.',
  },
  {
    id: 'team-3',
    name: 'Marcus Lindqvist',
    role: 'Mechanical & Structural Steel Superintendent',
    division: 'Mechanical Fabrication',
    experience: '17 Years Heavy Steel & Piping',
    credentials: 'AWS Certified Welding Inspector (CWI)',
    bio: 'Directs shop fabrication tolerances, NDT weld inspections, structural steel erection rigging, and custom parapet and handrail installations.',
  },
  {
    id: 'team-4',
    name: 'Samira Haddad',
    role: 'Director of Workforce Mobilization & HSE',
    division: 'Manpower & Safety',
    experience: '13 Years Industrial Staffing & NEBOSH',
    credentials: 'NEBOSH Diploma · ISO 45001 Lead Auditor',
    bio: 'Manages technical trade testing, rapid 24–72 hour crew mobilization, shift compliance, and our zero-incident field safety culture.',
  },
];

export const REGIONAL_HUBS = [
  {
    id: 'hq',
    name: 'Engineering Headquarters & MEP Operations',
    address: 'Plot 412, Industrial Sector 4, Business Engineering Park',
    hours: 'Sun–Thu · 07:30 AM – 06:00 PM',
    coverage: 'Project estimation, electrical & fire protection engineering, contract administration',
    coordinates: '25.1972° N, 55.2744° E',
  },
  {
    id: 'fab-yard',
    name: 'Steel Fabrication & Mechanical Workshop',
    address: 'Bay 18–22, Heavy Fabrication Zone, Port Access Road',
    hours: 'Sat–Thu · 06:30 AM – 07:30 PM',
    coverage: 'Structural trusses, parapets, handrails, miscellaneous steel & pre-assembly',
    coordinates: '25.0113° N, 55.0612° E',
  },
  {
    id: 'manpower-center',
    name: 'Trade Testing & Manpower Mobilization Center',
    address: 'Building 9, Technical Workforce Hub, East Ring Corridor',
    hours: 'Daily · 06:00 AM – 08:00 PM',
    coverage: 'Practical trade assessments, HSE induction, PPE issue & rapid dispatch',
    coordinates: '25.1429° N, 55.2318° E',
  },
];
