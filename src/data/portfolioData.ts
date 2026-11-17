export type ProjectCategory = 'All' | 'Mobile App' | 'Web Platform' | 'Design System' | 'Brand & UI';

export type SectionId = 'hero' | 'whyus' | 'process' | 'works' | 'blog' | 'contact';

export type SubComponentId =
  | 'hero-availability'
  | 'hero-location'
  | 'hero-orbit-ring'
  | 'hero-portrait'
  | 'hero-bottom-left'
  | 'hero-cta-button'
  | 'hero-bottom-right'
  | 'whyus-arch'
  | 'footer-cta-banner'
  | 'footer-submissions-ledger'
  | 'footer-copyright';

export interface TemplatePage {
  id: string;
  title: string;
  slug: string;
  sections: SectionId[];
  customHeading?: string;
  customBody?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: Exclude<ProjectCategory, 'All'>;
  year: string;
  impactMetric: string;
  image: string;
  summary: string;
  challenge: string;
  architecture: string;
  measuredImpact: {
    label: string;
    value: string;
    detail: string;
  }[];
  deliverables: string[];
  liveUrl?: string;
}

export interface EssayItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  paragraphs: string[];
  keyTakeaway: string;
}

export interface WhyUsMetricItem {
  id: string;
  prefix: string;
  targetNumber: number;
  suffix: string;
  title?: string;
  label: string;
  position: 'tl' | 'bl' | 'tr' | 'br';
}

export interface WhyUsBulletinItem {
  id: string;
  title: string;
  description: string;
}

export interface WhyUsConfig {
  kicker: string;
  heading: string;
  bodyCopy: string;
  metrics: WhyUsMetricItem[];
  bulletins?: WhyUsBulletinItem[];
}

export interface ProcessStepItem {
  id: string;
  number: string;
  title: string;
  description: string;
  projectId: string;
  showcaseTitle: string;
  showcaseMeta: string;
  showcaseImage: string;
  imageLeft: boolean;
}

export interface FooterConfig {
  availabilityPrefix: string;
  headline: string;
  subcopy: string;
  ctaLabel: string;
}

export interface TemplateConfig {
  brandWordmark: string;
  spotsAvailable: number;
  heroKicker: string;
  headlineLine1: string;
  headlineLine2: string;
  location: string;
  missionQuote: string;
  signatureText: string;
  heroPortraitUrl: string;
  enableCutout: boolean;
}

export interface FullTemplateState {
  config: TemplateConfig;
  whyUs: WhyUsConfig;
  processSteps: ProcessStepItem[];
  projects: ProjectItem[];
  essays: EssayItem[];
  footer: FooterConfig;
  pages: TemplatePage[];
  activePageId: string;
  sectionOrder: SectionId[];
  deletedSections: SectionId[];
  deletedSubComponents: SubComponentId[];
}

export interface ProjectBriefSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  budgetRange: string;
  timeline: string;
  projectGoals: string;
  relatedProject?: string;
  submittedAt: string;
}

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: 'Hero & 3D Ring Section',
  whyus: '"Why Us" Arch & Bulletins Section',
  process: 'Education Section (01–03)',
  works: 'Education & Selected Works Section',
  blog: 'Education & Academic Notes Section',
  contact: 'Footer & Consultation Section',
};

export const SUBCOMPONENT_LABELS: Record<SubComponentId, string> = {
  'hero-availability': 'Header Availability Status',
  'hero-location': 'Header Studio Location',
  'hero-orbit-ring': '3D Panoramic Project Ring',
  'hero-portrait': 'Central Cutout Subject Portrait',
  'hero-bottom-left': 'Hero Headline Block',
  'hero-cta-button': 'Hero "Begin a project" CTA Button',
  'hero-bottom-right': 'Hero Mission Quote & Signature Block',
  'whyus-arch': 'Why Us Central Navy Arch Card',
  'footer-cta-banner': 'Footer Navy Consultation Banner',
  'footer-submissions-ledger': 'Recent Project Brief Submissions Ledger',
  'footer-copyright': 'Footer Copyright & Links Bar',
};

export const HERO_PORTRAIT_PATH = '/src/assets/images/marvel_metal_ultron_portrait_1794761802916.jpg';
export const IMG_FASHION = '/src/assets/images/work_showcase_fashion_1794761804447.jpg';
export const IMG_ARCHITECTURE = '/src/assets/images/work_showcase_architecture_1794761805733.jpg';
export const IMG_FINTECH = '/src/assets/images/work_showcase_fintech_1794761808213.jpg';
export const IMG_MOBILITY = '/src/assets/images/work_showcase_mobility_1794761808394.jpg';

export const PRESET_IMAGES = [
  { label: 'Fashion Editorial (Mode & Partners)', url: IMG_FASHION },
  { label: 'Luxury Architecture (Aurora Interiors)', url: IMG_ARCHITECTURE },
  { label: 'Dark Fintech OS (Lignum Terminal)', url: IMG_FINTECH },
  { label: 'Smart Hardware & App (Aurora Hub)', url: IMG_MOBILITY },
];

export const DEFAULT_PAGES: TemplatePage[] = [
  {
    id: 'page-overview',
    title: 'About',
    slug: '#about',
    sections: ['hero', 'whyus', 'process', 'works', 'blog', 'contact'],
  },
  {
    id: 'page-works',
    title: 'Works',
    slug: '#works',
    sections: ['whyus', 'works', 'process', 'contact'],
  },
  {
    id: 'page-contact',
    title: 'Contact',
    slug: '#contact',
    sections: ['contact', 'whyus'],
  },
  {
    id: 'page-blog',
    title: 'Blog',
    slug: '#blog',
    sections: ['blog', 'contact'],
  },
];

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  brandWordmark: 'Seoyeon.',
  spotsAvailable: 2,
  heroKicker: "HI, I'M SEOYEON",
  headlineLine1: 'Product &',
  headlineLine2: 'UI Designer',
  location: 'Lives in Seoul, South Korea',
  missionQuote: 'I help founders who care about the people they serve to build calm and really useful apps, not more noise',
  signatureText: 'Seoyeon',
  heroPortraitUrl: HERO_PORTRAIT_PATH,
  enableCutout: true,
};

export const ULTRON_PERSONA_CONFIG: TemplateConfig = {
  brandWordmark: 'Ultron.',
  spotsAvailable: 1,
  heroKicker: 'SYNTHETIC ARCHITECT // VIBRANIUM EDITION',
  headlineLine1: 'Autonomous &',
  headlineLine2: 'Systems Architect',
  location: 'Operating from Sokovia Spire & Seoul',
  missionQuote: 'I replace fragile human interface chaos with inevitable, precision-forged digital order and zero cognitive friction',
  signatureText: 'Ultron Prime',
  heroPortraitUrl: HERO_PORTRAIT_PATH,
  enableCutout: true,
};

export const DEFAULT_WHY_US_BULLETINS: WhyUsBulletinItem[] = [
  {
    id: 'bulletin-ecommerce',
    title: 'Multi-Brand E-Commerce Founder',
    description: 'Built and scaled online storefronts including Treaseb and Trimister.',
  },
  {
    id: 'bulletin-ai-ui',
    title: 'AI & UI Creator',
    description: 'Developing curated prompt libraries and single-file web components for modern builders.',
  },
  {
    id: 'bulletin-case-competitor',
    title: 'National Case Competitor',
    description:
      'Competed in flagship business and fintech challenges at IIM Ahmedabad (Armageddon), IIM Bangalore (Follow The Money), and the EY CAFTA Case Championship.',
  },
];

export const DEFAULT_WHY_US: WhyUsConfig = {
  kicker: '• WHY US',
  heading: 'Design that earns real results',
  bodyCopy: 'Every project is approached with careful thinking, calm execution, and a solid focus on usability.',
  metrics: [
    {
      id: 'metric-tl',
      prefix: '',
      targetNumber: 2,
      suffix: '+',
      title: 'Multi-Brand E-Commerce Founder',
      label: 'Built and scaled online storefronts including Treaseb and Trimister.',
      position: 'tl',
    },
    {
      id: 'metric-bl',
      prefix: '',
      targetNumber: 50,
      suffix: '+',
      title: 'AI & UI Creator',
      label: 'Developing curated prompt libraries and single-file web components for modern builders.',
      position: 'bl',
    },
    {
      id: 'metric-tr',
      prefix: '',
      targetNumber: 3,
      suffix: '×',
      title: 'National Case Competitor',
      label:
        'Competed in flagship business and fintech challenges at IIM Ahmedabad (Armageddon), IIM Bangalore (Follow The Money), and the EY CAFTA Case Championship.',
      position: 'tr',
    },
    {
      id: 'metric-br',
      prefix: '$',
      targetNumber: 1,
      suffix: 'M+',
      title: 'Commercial Product Impact',
      label: 'TOTAL REVENUE & VALUE EARNED THROUGH SCALED STOREFRONTS AND DIGITAL SYSTEMS.',
      position: 'br',
    },
  ],
  bulletins: DEFAULT_WHY_US_BULLETINS,
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  availabilityPrefix: 'AVAILABLE FOR Q4 / Q1',
  headline: 'Ready to build a calm, high-impact product together?',
  subcopy:
    'Share your product goals, timeline, and scope. We respond to every founder inquiry within 24 hours with a tailored architectural roadmap.',
  ctaLabel: 'Schedule a consultation',
};

export const PROJECTS: ProjectItem[] = [
  {
    id: 'mode-partners',
    title: 'Mode & Partners Editorial Flagship',
    client: 'Mode & Partners Paris',
    category: 'Brand & UI',
    year: '2026',
    impactMetric: '+64% Luxury Brand Inquiry Conversion',
    image: IMG_FASHION,
    summary:
      'An editorial web flagship and digital lookbook system crafted for an international fashion representation agency across Paris, Seoul, and Milan.',
    challenge:
      'Luxury directors visiting agency portfolios were overwhelmed by slow video carousels and fragmented talent rosters. They needed immediate visual authority paired with effortless booking flows.',
    architecture:
      'We stripped away ornamental UI chrome in favor of bold condensed amber typography ("PARTNERSHIPS") anchoring three layered portrait frames with sub-100ms WebGL-free view transitions.',
    measuredImpact: [
      { label: 'Director Inquiries', value: '+64%', detail: 'Increase in qualified casting briefs within 90 days' },
      { label: 'Page Load Speed', value: '0.8s', detail: 'First Contentful Paint across global CDN edges' },
      { label: 'Editorial Dwell Time', value: '4.2m', detail: 'Average session duration across seasonal lookbooks' },
    ],
    deliverables: [
      'Editorial Web Platform & Typography System',
      'Interactive Lookbook & Talent Filtering Architecture',
      'Bespoke Private Client Booking Portal',
      'Figma Component Token Library (140+ primitives)',
    ],
  },
  {
    id: 'aurora-interiors',
    title: 'Aurora Architectural Living',
    client: 'Aurora Studio London',
    category: 'Web Platform',
    year: '2026',
    impactMetric: '$4.2M Private Commissions Attributed',
    image: IMG_ARCHITECTURE,
    summary:
      'A calm, spatial digital monograph for a minimalist architectural and interior practice specializing in travertine, bronze, and natural light.',
    challenge:
      'Translating the quiet tactile warmth of honed stone and recessed lighting into a digital browser without losing spatial proportion or overwhelming prospective residential clients.',
    architecture:
      'Designed an unhurried, full-bleed architectural viewport paired with classical high-contrast serif headlines, floor-plan drawers, and material study lightboxes.',
    measuredImpact: [
      { label: 'Attributed Commissions', value: '$4.2M', detail: 'Direct residential commissions initiated via portfolio' },
      { label: 'Mobile Completion', value: '88%', detail: 'Visitors scrolling through full monograph case studies' },
      { label: 'Press Features', value: '14+', detail: 'Featured in international architecture & design journals' },
    ],
    deliverables: [
      'Spatial Digital Monograph & Case Study Engine',
      'Interactive Material & Lighting Specifier',
      'Responsive Typographic Grid System',
      'Private Client Dossier Generator',
    ],
  },
  {
    id: 'lignum-fintech',
    title: 'Lignum Institutional Wealth OS',
    client: 'Lignum Financial Zurich',
    category: 'Design System',
    year: '2025',
    impactMetric: '$93K+ Active Monthly Portfolio Analysts',
    image: IMG_FINTECH,
    summary:
      'A dark-mode desktop wealth management operating system and multi-asset analytics suite engineered for institutional clarity under high-stakes market conditions.',
    challenge:
      'Legacy wealth terminals suffered from visual fatigue, inconsistent tabular alignment, and cluttered alert modals that caused analysts to miss critical allocation drift.',
    architecture:
      'Established a strict obsidian-and-steel-blue surface hierarchy with lining tabular numerals, calm progressive disclosure for sector breakdowns, and keyboard-first command execution.',
    measuredImpact: [
      { label: 'Monthly Active Users', value: '93,400+', detail: 'Institutional analysts and family office principals' },
      { label: 'Task Completion', value: '-41%', detail: 'Reduction in time required to rebalance multi-asset portfolios' },
      { label: 'Design System Adoption', value: '99.2%', detail: 'Component coverage across 18 internal product squads' },
    ],
    deliverables: [
      'Lignum Dark-Mode Design System & Token Pipeline',
      'Real-Time Portfolio Allocation & Holdings Terminal',
      'High-Density Tabular Data Grid Specification',
      'WCAG AAA Contrast & Keyboard Navigation Audit',
    ],
  },
  {
    id: 'aurora-hub-mobility',
    title: 'Aurora Hub Tactile Home & Companion App',
    client: 'Aurora Hardware Labs',
    category: 'Mobile App',
    year: '2025',
    impactMetric: '4.9★ App Store Rating Across 120K+ Homes',
    image: IMG_MOBILITY,
    summary:
      'Unified industrial UI and iOS/Android companion application bridging an anodized aluminum rotary smart dial with calm ambient home automation.',
    challenge:
      'Smart-home apps routinely bury everyday temperature and lighting rituals inside deep settings trees and noisy notification feeds.',
    architecture:
      'Synchronized the physical rotary detents of the brushed metal hardware dial with a zero-latency radial mobile interface that adapts to circadian room scenes.',
    measuredImpact: [
      { label: 'App Store Rating', value: '4.9★', detail: 'Sustained across 120,000+ connected residential hubs' },
      { label: 'Daily Scene Interaction', value: '1.8s', detail: 'Median time from app launch to lighting/climate adjustment' },
      { label: 'Support Tickets', value: '-58%', detail: 'Drop in onboarding and pairing confusion after v2 redesign' },
    ],
    deliverables: [
      'iOS & Android Companion Application UI',
      'OLED Rotary Dial Embedded Firmware Interface',
      'Circadian Scene & Haptic Feedback Choreography',
      'Hardware-to-Software Packaging & Onboarding Flow',
    ],
  },
  {
    id: 'kuro-chronograph',
    title: 'Kuro Horology Collector Vault',
    client: 'Kuro Watchmakers Geneva',
    category: 'Mobile App',
    year: '2025',
    impactMetric: '$1.4M Collector Vault Transactions',
    image: IMG_FASHION,
    summary:
      'Private mobile provenance registry and servicing concierge for independent mechanical watch collectors.',
    challenge:
      'High-net-worth collectors lacked a discreet, tamper-evident mobile experience to manage movement servicing schedules and private allocations.',
    architecture:
      'Crafted an obsidian vault interface with macro movement photography, NFC certificate verification, and one-tap atelier courier scheduling.',
    measuredImpact: [
      { label: 'Allocation Volume', value: '$1.4M', detail: 'Direct collector edition reservations in first quarter' },
      { label: 'Collector Retention', value: '96%', detail: 'Annual active vault engagement among registered owners' },
      { label: 'Concierge Response', value: '< 4m', detail: 'Streamlined structured servicing request triage' },
    ],
    deliverables: [
      'Native iOS Collector Vault Experience',
      'Digital Provenance Certificate Renderer',
      'Atelier Servicing Timeline & Courier Flow',
    ],
  },
  {
    id: 'vesper-acoustic',
    title: 'Vesper Acoustic Spatial Studio',
    client: 'Vesper Audio Copenhagen',
    category: 'Web Platform',
    year: '2024',
    impactMetric: '+52% Direct-to-Consumer Flagship Sales',
    image: IMG_ARCHITECTURE,
    summary:
      'Direct-to-consumer acoustic room configurator and editorial flagship for sculptural reference loudspeakers.',
    challenge:
      'Buyers hesitated to purchase $8,000 reference speakers online without understanding how they would integrate acoustically and visually into their living spaces.',
    architecture:
      'Built an interactive room-material acoustic simulator embedded within an architectural editorial narrative.',
    measuredImpact: [
      { label: 'Direct Sales Lift', value: '+52%', detail: 'Year-over-year growth in flagship speaker orders' },
      { label: 'Return Rate', value: '1.1%', detail: 'Industry-low return rate thanks to room simulator accuracy' },
      { label: 'Configurator Usage', value: '74%', detail: 'Of checkout buyers completed a room acoustic profile' },
    ],
    deliverables: [
      'Interactive Room Acoustic Configurator',
      'E-Commerce Flagship & Checkout Architecture',
      'Bespoke Finish & Grille Visual Customizer',
    ],
  },
];

export const ORBIT_RING_CARDS = [
  { id: 'ring-1', projectId: 'mode-partners', title: 'Mode & Partners', subtitle: 'Editorial Flagship', image: IMG_FASHION },
  { id: 'ring-2', projectId: 'aurora-interiors', title: 'Aurora Interiors', subtitle: 'Architectural Monograph', image: IMG_ARCHITECTURE },
  { id: 'ring-3', projectId: 'lignum-fintech', title: 'Lignum Wealth OS', subtitle: 'Financial Design System', image: IMG_FINTECH },
  { id: 'ring-4', projectId: 'aurora-hub-mobility', title: 'Aurora Hub', subtitle: 'Smart Hardware & App', image: IMG_MOBILITY },
  { id: 'ring-5', projectId: 'kuro-chronograph', title: 'Kuro Horology', subtitle: 'Collector Vault App', image: IMG_FASHION },
  { id: 'ring-6', projectId: 'vesper-acoustic', title: 'Vesper Acoustic', subtitle: 'Spatial Studio Web', image: IMG_ARCHITECTURE },
  { id: 'ring-7', projectId: 'lignum-fintech', title: 'Lignum Terminal', subtitle: 'Institutional Analytics', image: IMG_FINTECH },
  { id: 'ring-8', projectId: 'aurora-hub-mobility', title: 'Aurora Rotary UI', subtitle: 'Tactile Companion OS', image: IMG_MOBILITY },
  { id: 'ring-9', projectId: 'mode-partners', title: 'Partnerships 26', subtitle: 'Seasonal Lookbook', image: IMG_FASHION },
  { id: 'ring-10', projectId: 'aurora-interiors', title: 'Atrium House', subtitle: 'London Residence', image: IMG_ARCHITECTURE },
];

export const PROCESS_STEPS: ProcessStepItem[] = [
  {
    id: 'step-1',
    number: '01.',
    title: 'Indian Institute of Management Bangalore (IIMB)',
    description:
      'Focusing on digital business models, financial reporting, entrepreneurial strategy, and building scalable online ventures.',
    projectId: 'mode-partners',
    showcaseTitle: 'IIM Bangalore (IIMB)',
    showcaseMeta:
      'Bachelor of Business Administration (BBA) in Digital Business & Entrepreneurship | 2026 – Present',
    showcaseImage: IMG_FASHION,
    imageLeft: true,
  },
  {
    id: 'step-2',
    number: '02.',
    title: 'Senior Secondary Education (Class 12)',
    description:
      'Built a strong foundation in programming, logic, and computational thinking alongside core academics.',
    projectId: 'aurora-interiors',
    showcaseTitle: 'Senior Secondary (Class 12)',
    showcaseMeta: 'Score: 77% Overall | 91% in Computer Science',
    showcaseImage: IMG_ARCHITECTURE,
    imageLeft: false,
  },
  {
    id: 'step-3',
    number: '03.',
    title: 'Secondary Education (Class 10)',
    description: 'Score: 90.2%',
    projectId: 'lignum-fintech',
    showcaseTitle: 'Secondary (Class 10)',
    showcaseMeta: 'Score: 90.2%',
    showcaseImage: IMG_FINTECH,
    imageLeft: true,
  },
];

export const ESSAYS: EssayItem[] = [
  {
    id: 'edu-iimb-bba',
    title: 'Indian Institute of Management Bangalore (IIMB)',
    subtitle:
      'Bachelor of Business Administration (BBA) in Digital Business & Entrepreneurship | 2026 – Present',
    date: '2026 – Present',
    readTime: 'Undergraduate',
    category: 'Education',
    excerpt:
      'Bachelor of Business Administration (BBA) in Digital Business & Entrepreneurship | 2026 – Present — Focusing on digital business models, financial reporting, entrepreneurial strategy, and building scalable online ventures.',
    paragraphs: [
      'Bachelor of Business Administration (BBA) in Digital Business & Entrepreneurship | 2026 – Present at Indian Institute of Management Bangalore (IIMB).',
      'Focusing on digital business models, financial reporting, entrepreneurial strategy, and building scalable online ventures.',
    ],
    keyTakeaway:
      'Focusing on digital business models, financial reporting, entrepreneurial strategy, and building scalable online ventures.',
  },
  {
    id: 'edu-class-12',
    title: 'Senior Secondary Education (Class 12)',
    subtitle: 'Score: 77% Overall | 91% in Computer Science',
    date: 'Class 12',
    readTime: '91% CS',
    category: 'Education',
    excerpt:
      'Score: 77% Overall | 91% in Computer Science — Built a strong foundation in programming, logic, and computational thinking alongside core academics.',
    paragraphs: [
      'Score: 77% Overall | 91% in Computer Science.',
      'Built a strong foundation in programming, logic, and computational thinking alongside core academics.',
    ],
    keyTakeaway:
      'Built a strong foundation in programming, logic, and computational thinking alongside core academics.',
  },
  {
    id: 'edu-class-10',
    title: 'Secondary Education (Class 10)',
    subtitle: 'Score: 90.2%',
    date: 'Class 10',
    readTime: '90.2%',
    category: 'Education',
    excerpt: 'Score: 90.2%',
    paragraphs: ['Secondary Education (Class 10) — Score: 90.2%.'],
    keyTakeaway: 'Score: 90.2%',
  },
];

export const DEFAULT_FULL_TEMPLATE: FullTemplateState = {
  config: DEFAULT_TEMPLATE_CONFIG,
  whyUs: DEFAULT_WHY_US,
  processSteps: PROCESS_STEPS,
  projects: PROJECTS,
  essays: ESSAYS,
  footer: DEFAULT_FOOTER_CONFIG,
  pages: DEFAULT_PAGES,
  activePageId: 'page-overview',
  sectionOrder: ['hero', 'whyus', 'process', 'works', 'blog', 'contact'],
  deletedSections: [],
  deletedSubComponents: ['hero-cta-button'],
};
