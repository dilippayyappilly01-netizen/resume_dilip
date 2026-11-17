import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FilePlus,
  Layers,
  Plus,
  Redo2,
  RotateCcw,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  X,
} from 'lucide-react';
import {
  DEFAULT_FULL_TEMPLATE,
  DEFAULT_TEMPLATE_CONFIG,
  EssayItem,
  FullTemplateState,
  HERO_PORTRAIT_PATH,
  PRESET_IMAGES,
  ProjectBriefSubmission,
  ProjectCategory,
  ProjectItem,
  SECTION_LABELS,
  SectionId,
  SUBCOMPONENT_LABELS,
  SubComponentId,
  TemplateConfig,
  ULTRON_PERSONA_CONFIG,
  WhyUsMetricItem,
} from '../data/portfolioData';
import {
  addTemplatePage,
  deleteSection,
  deleteSubComponent,
  deleteTemplatePage,
  moveSectionOrder,
  parseTemplateJson,
  removeEssayItem,
  removeProjectItem,
  restoreAllDeleted,
  restoreSection,
  restoreSubComponent,
  upsertEssayItem,
  upsertProjectItem,
  validateProjectInquiry,
} from '../utils/portfolioLogic';

/* -------------------------------------------------------------------------- */
/* 1. PROJECT CASE STUDY MODAL                                                */
/* -------------------------------------------------------------------------- */
interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquireSimilar: (projectTitle: string) => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquireSimilar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#11151c] text-[#f3f5f8] shadow-[0_32px_90px_rgba(0,0,0,0.85)] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#141820]">
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#9aa6b8]">
            <span className="font-medium text-white">{project.client}</span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{project.year}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project case study modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#11151c] text-[#c7d0dd] transition-colors hover:border-white/30 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0d10] max-h-[300px]">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="h-full max-h-[300px] w-full object-cover object-top"
            />
          </div>

          <div>
            <p className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#7aa2d4]">
              {project.impactMetric}
            </p>
            <h2
              id="case-study-modal-title"
              className="font-serif-display mt-2 text-[34px] sm:text-[42px] leading-[1.08] font-normal text-white"
            >
              {project.title}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.65] text-[#c7d0dd]">
              {project.summary}
            </p>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#8d9ab0] mb-4">
              Measured Impact
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {project.measuredImpact.map((metric, idx) => (
                <div
                  key={`${metric.label}-${idx}`}
                  className="rounded-xl border border-white/10 bg-[#141820] p-5"
                >
                  <div className="metric-numeral text-[36px] leading-none text-white">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-[13px] font-semibold text-[#7aa2d4]">
                    {metric.label}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#9aa6b8]">
                    {metric.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="space-y-4 md:col-span-7">
              <div>
                <h4 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#8d9ab0]">
                  The Challenge
                </h4>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#b5c0d0]">
                  {project.challenge}
                </p>
              </div>
              <div className="pt-2">
                <h4 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#8d9ab0]">
                  Architectural Approach
                </h4>
                <p className="mt-2 text-[14px] leading-[1.7] text-[#b5c0d0]">
                  {project.architecture}
                </p>
              </div>
            </div>

            <div className="md:col-span-5 rounded-xl border border-white/10 bg-[#141820] p-5">
              <h4 className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#7aa2d4]">
                Core Deliverables
              </h4>
              <ul className="mt-3 space-y-2.5 text-[13px] text-[#dce4f0]">
                {project.deliverables.map((item, idx) => (
                  <li key={`${item}-${idx}`} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#5c85b8] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <p className="text-[13px] text-[#9aa6b8]">
              Interested in similar outcomes for your product?
            </p>
            <button
              type="button"
              onClick={() => onInquireSimilar(project.title)}
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-[#0b0d10] transition-colors hover:bg-[#dce6f5] whitespace-nowrap shrink-0"
            >
              <span>Inquire About a Similar Project</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. BEGIN A PROJECT INQUIRY MODAL                                           */
/* -------------------------------------------------------------------------- */
interface InquiryModalProps {
  isOpen: boolean;
  relatedProject?: string;
  spotsAvailable: number;
  onClose: () => void;
  onSubmitBrief: (submission: Omit<ProjectBriefSubmission, 'id' | 'submittedAt'>) => void;
}

export const ProjectInquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  relatedProject,
  spotsAvailable,
  onClose,
  onSubmitBrief,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [budgetRange, setBudgetRange] = useState('$35k – $60k');
  const [timeline, setTimeline] = useState('Q4 / Q1 (8–10 Weeks)');
  const [projectGoals, setProjectGoals] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; projectGoals?: string }>({});
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setSubmittedSuccess(false);
    }
  }, [isOpen, relatedProject]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateProjectInquiry({ name, email, projectGoals });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSubmitBrief({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || 'Independent Venture',
      budgetRange,
      timeline,
      projectGoals: projectGoals.trim(),
      relatedProject,
    });

    setName('');
    setEmail('');
    setCompany('');
    setProjectGoals('');
    setErrors({});
    setSubmittedSuccess(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#11151c] text-[#f3f5f8] shadow-[0_32px_90px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-[#141820] px-6 py-4">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7aa2d4]">
              • STUDIO DISCOVERY BRIEF ({spotsAvailable} {spotsAvailable === 1 ? 'SPOT' : 'SPOTS'} OPEN)
            </span>
            <h2 id="inquiry-modal-title" className="font-serif-display mt-0.5 text-[28px] leading-tight text-white">
              Begin a project
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#11151c] text-[#c7d0dd] hover:border-white/30 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {relatedProject && (
            <div className="mb-5 rounded-xl border border-[#5c85b8]/35 bg-[#213f66]/25 px-4 py-3 text-[13px] text-[#cbd7e8]">
              Inquiring with reference to: <strong className="text-white">{relatedProject}</strong>
            </div>
          )}

          {submittedSuccess ? (
            <div className="py-8 text-center space-y-4" data-testid="inquiry-success-state">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#7aa2d4]" aria-hidden="true" />
              <h3 className="font-serif-display text-[32px] text-white">
                Project Brief Logged
              </h3>
              <p className="mx-auto max-w-md text-[14px] leading-relaxed text-[#a9b4c4]">
                Thank you. Your brief has been added to the studio ledger in the footer and a consultation slot has been reserved.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-[#0b0d10] hover:bg-[#e5ecf6]"
                >
                  Return to Portfolio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="inquiry-name" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Your Name *
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3.5 py-2.5 text-[14px] text-white placeholder-[#5e6b7e] focus:border-[#7aa2d4] focus:outline-none"
                  />
                  {errors.name && (
                    <p className="mt-1 text-[12px] text-rose-400" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="inquiry-email" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Work Email *
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3.5 py-2.5 text-[14px] text-white placeholder-[#5e6b7e] focus:border-[#7aa2d4] focus:outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1 text-[12px] text-rose-400" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="inquiry-company" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Company / Studio
                  </label>
                  <input
                    id="inquiry-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Lignum Labs"
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3.5 py-2.5 text-[14px] text-white placeholder-[#5e6b7e] focus:border-[#7aa2d4] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-budget" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Estimated Budget
                  </label>
                  <select
                    id="inquiry-budget"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2.5 text-[14px] text-white focus:border-[#7aa2d4] focus:outline-none"
                  >
                    <option value="$20k – $35k">$20k – $35k</option>
                    <option value="$35k – $60k">$35k – $60k</option>
                    <option value="$60k – $100k+">$60k – $100k+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="inquiry-timeline" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Target Timeline
                  </label>
                  <select
                    id="inquiry-timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2.5 text-[14px] text-white focus:border-[#7aa2d4] focus:outline-none"
                  >
                    <option value="Immediate (4–6 Weeks)">Immediate (4–6 Weeks)</option>
                    <option value="Q4 / Q1 (8–10 Weeks)">Q4 / Q1 (8–10 Weeks)</option>
                    <option value="Flexible Retainer">Flexible Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="inquiry-goals" className="block text-[12px] font-medium text-[#b5c0d0]">
                  Project Goals & Product Scope * (minimum 10 characters)
                </label>
                <textarea
                  id="inquiry-goals"
                  rows={4}
                  value={projectGoals}
                  onChange={(e) => setProjectGoals(e.target.value)}
                  placeholder="Tell us about the product you are building, key user workflows, and desired outcomes..."
                  className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] p-3.5 text-[14px] text-white placeholder-[#5e6b7e] focus:border-[#7aa2d4] focus:outline-none"
                />
                {errors.projectGoals && (
                  <p className="mt-1 text-[12px] text-rose-400" role="alert">
                    {errors.projectGoals}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/15 px-5 py-2 text-[13px] font-medium text-[#b5c0d0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-[13px] font-semibold text-[#0b0d10] transition-colors hover:bg-[#dce6f5]"
                >
                  <span>Submit Project Brief</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. ARTICLE READER MODAL (Notes & Essays)                                   */
/* -------------------------------------------------------------------------- */
interface EssayModalProps {
  essay: EssayItem | null;
  signatureText: string;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<EssayModalProps> = ({
  essay,
  signatureText,
  onClose,
}) => {
  if (!essay) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="essay-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#11151c] text-[#f3f5f8] shadow-[0_32px_90px_rgba(0,0,0,0.85)] max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-[#141820] px-6 py-4">
          <div className="flex items-center gap-2 text-[12px] text-[#9aa6b8]">
            <span className="text-[#7aa2d4]">{essay.category}</span>
            <span aria-hidden="true">·</span>
            <span>{essay.date}</span>
            <span aria-hidden="true">·</span>
            <span>{essay.readTime}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close essay reader"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#11151c] text-[#c7d0dd] hover:border-white/30 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <article className="overflow-y-auto p-6 sm:p-10 space-y-6">
          <h2
            id="essay-modal-title"
            className="font-serif-display text-[34px] sm:text-[42px] leading-[1.1] font-normal text-white"
          >
            {essay.title}
          </h2>
          <p className="font-serif-display text-[20px] italic text-[#9ec2f0]">
            {essay.subtitle}
          </p>

          <div className="h-px w-full bg-white/10" />

          <div className="space-y-5 text-[15px] sm:text-[16px] leading-[1.8] text-[#cbd5e3]">
            {essay.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="rounded-xl border border-[#5c85b8]/35 bg-[#141820] p-5">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7aa2d4]">
              Studio Principle
            </p>
            <p className="font-serif-display mt-2 text-[22px] leading-snug text-white">
              “{essay.keyTakeaway}”
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="font-signature text-[34px] text-[#7aa2d4]">{signatureText}</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/15 px-5 py-2 text-[13px] font-medium text-white hover:border-white/35"
            >
              Done Reading
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. MULTI-TAB CUSTOMIZE TEMPLATE STUDIO DRAWER                              */
/* -------------------------------------------------------------------------- */
export type StudioDrawerTab = 'pages' | 'hero' | 'whyus' | 'process' | 'projects' | 'essays' | 'export';

interface CustomizeDrawerProps {
  isOpen: boolean;
  initialTab?: StudioDrawerTab;
  templateState: FullTemplateState;
  onUpdateTemplateState: (next: FullTemplateState, label?: string, isDeletion?: boolean) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  lastDeletedLabel?: string | null;
  onUndo?: () => void;
  onRedo?: () => void;
  onClose: () => void;
}

const ALL_SUBCOMPONENTS: SubComponentId[] = [
  'hero-availability',
  'hero-location',
  'hero-orbit-ring',
  'hero-portrait',
  'hero-bottom-left',
  'hero-cta-button',
  'hero-bottom-right',
  'whyus-arch',
  'footer-cta-banner',
  'footer-submissions-ledger',
  'footer-copyright',
];

export const CustomizeTemplateDrawer: React.FC<CustomizeDrawerProps> = ({
  isOpen,
  initialTab = 'pages',
  templateState,
  onUpdateTemplateState,
  canUndo = false,
  canRedo = false,
  lastDeletedLabel = null,
  onUndo,
  onRedo,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<StudioDrawerTab>(initialTab);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    templateState.projects[0]?.id || ''
  );
  const [selectedEssayId, setSelectedEssayId] = useState<string>(
    templateState.essays[0]?.id || ''
  );
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const {
    config,
    whyUs,
    processSteps,
    projects,
    essays,
    footer,
    pages,
    activePageId,
    sectionOrder,
    deletedSections,
    deletedSubComponents,
  } = templateState;

  const handleConfigChange = <K extends keyof TemplateConfig>(key: K, value: TemplateConfig[K]) => {
    onUpdateTemplateState({
      ...templateState,
      config: { ...config, [key]: value },
    });
  };

  const handleWhyUsMetricChange = (id: string, patch: Partial<WhyUsMetricItem>) => {
    const nextMetrics = whyUs.metrics.map((m) => (m.id === id ? { ...m, ...patch } : m));
    onUpdateTemplateState({
      ...templateState,
      whyUs: { ...whyUs, metrics: nextMetrics },
    });
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const activeEssay = essays.find((e) => e.id === selectedEssayId) || essays[0];

  const handleAddNewPage = (e: React.FormEvent) => {
    e.preventDefault();
    const nextState = addTemplatePage(templateState, newPageTitle || `Custom Page ${pages.length + 1}`);
    onUpdateTemplateState(nextState);
    setNewPageTitle('');
  };

  const handleToggleSectionInPage = (pageId: string, secId: SectionId) => {
    const nextPages = pages.map((p) => {
      if (p.id !== pageId) return p;
      const has = p.sections.includes(secId);
      return {
        ...p,
        sections: has ? p.sections.filter((s) => s !== secId) : [...p.sections, secId],
      };
    });
    onUpdateTemplateState({ ...templateState, pages: nextPages });
  };

  const handleCreateNewProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Studio Case Study',
      client: 'Client Name',
      category: 'Web Platform',
      year: '2026',
      impactMetric: '+48% Core Conversion Lift',
      image: PRESET_IMAGES[projects.length % PRESET_IMAGES.length].url,
      summary: 'A bespoke product architecture and interface system designed for clarity and measurable impact.',
      challenge: 'Defining a calm, high-contrast user journey for a complex multi-stakeholder workflow.',
      architecture: 'Built a modular component system with zero ornamental clutter and sub-100ms transitions.',
      measuredImpact: [
        { label: 'Conversion Lift', value: '+48%', detail: 'Measured across first 60 days post-launch' },
        { label: 'Task Velocity', value: '2.1x', detail: 'Faster core workflow completion' },
        { label: 'System Coverage', value: '100%', detail: 'Unified Figma & production tokens' },
      ],
      deliverables: ['Product Strategy & Architecture', 'UI Design System', 'Interactive Prototype'],
    };
    const nextProjects = upsertProjectItem(projects, newProj);
    onUpdateTemplateState({ ...templateState, projects: nextProjects });
    setSelectedProjectId(newProj.id);
  };

  const handleCreateNewEssay = () => {
    const newEssay: EssayItem = {
      id: `essay-${Date.now()}`,
      title: 'Designing for Zero Cognitive Friction',
      subtitle: 'How spatial proportion and typography replace noisy interface chrome.',
      date: 'November 2026',
      readTime: '4 min read',
      category: 'Design Systems',
      excerpt: 'When every element on screen shouts for attention, nothing is heard. Calm interfaces guide the eye effortlessly.',
      paragraphs: [
        'Great digital products feel inevitable. Every spacing token, typographic weight, and surface contrast level serves a clear human intention.',
        'By auditing and removing redundant borders and status pills, teams unlock immediate visual calm and faster user comprehension.',
      ],
      keyTakeaway: 'Clarity is achieved not by adding explanatory chrome, but by removing competing visual noise.',
    };
    const nextEssays = upsertEssayItem(essays, newEssay);
    onUpdateTemplateState({ ...templateState, essays: nextEssays });
    setSelectedEssayId(newEssay.id);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(templateState, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(templateState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.brandWordmark.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'portfolio'}_template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    setImportError(null);
    setImportSuccess(false);
    const res = parseTemplateJson(importText);
    if (!res.valid || !res.state) {
      setImportError(res.error || 'Invalid template JSON.');
      return;
    }
    onUpdateTemplateState(res.state);
    setImportSuccess(true);
    setImportText('');
  };

  const TABS: { id: StudioDrawerTab; label: string }[] = [
    { id: 'pages', label: 'Pages & Components' },
    { id: 'hero', label: 'Hero & Brand' },
    { id: 'whyus', label: 'Why Us & Metrics' },
    { id: 'process', label: 'Process' },
    { id: 'projects', label: `Projects (${projects.length})` },
    { id: 'essays', label: 'Essays & Footer' },
    { id: 'export', label: 'Export / JSON' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-xl flex-col border-l border-white/15 bg-[#11151c] text-[#f3f5f8] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#141820] px-6 py-4">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#7aa2d4]">
              • TEMPLATE STUDIO BUILDER
            </span>
            <h2 id="customize-drawer-title" className="font-serif-display text-[26px] leading-none text-white mt-1">
              Customize Pages & Components
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customize drawer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#11151c] text-[#c7d0dd] hover:border-white/30 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-white/10 bg-[#0e1218] px-4 py-2 gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === t.id
                  ? 'bg-[#213f66] text-white'
                  : 'text-[#9aa6b8] hover:bg-white/5 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 0: PAGES & COMPONENTS MANAGER (Delete/Restore/Reorder Pages, Sections & Sub-Components) */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              {/* QUICK UNDO / REDO / RESTORE BAR */}
              {(canUndo || canRedo || deletedSections.length + deletedSubComponents.length > 0) && (
                <div className="rounded-xl border border-[#7aa2d4]/40 bg-[#213f66]/20 p-3.5 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="text-[12px] text-[#dce4f0]">
                    {lastDeletedLabel ? (
                      <span>
                        Last deleted: <strong className="text-white">{lastDeletedLabel}</strong>
                      </span>
                    ) : (
                      <span>History & Component Recovery</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {onUndo && (
                      <button
                        type="button"
                        disabled={!canUndo}
                        onClick={onUndo}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/45 bg-emerald-950/60 px-2.5 py-1 text-[11px] font-medium text-emerald-200 hover:bg-emerald-900 disabled:opacity-40"
                      >
                        <Undo2 className="h-3 w-3" aria-hidden="true" />
                        <span>Undo / Restore Last</span>
                      </button>
                    )}
                    {onRedo && (
                      <button
                        type="button"
                        disabled={!canRedo}
                        onClick={onRedo}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#0b0d10] px-2.5 py-1 text-[11px] font-medium text-[#dce4f0] hover:border-[#7aa2d4] disabled:opacity-40"
                      >
                        <Redo2 className="h-3 w-3" aria-hidden="true" />
                        <span>Redo</span>
                      </button>
                    )}
                    {deletedSections.length + deletedSubComponents.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTemplateState(
                            restoreAllDeleted(templateState),
                            'Restored all deleted sections & components'
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/50 bg-emerald-900/60 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-800"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        <span>
                          Restore All ({deletedSections.length + deletedSubComponents.length})
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 1. PAGES MANAGER */}
              <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#7aa2d4]">
                      Template Pages ({pages.length})
                    </h3>
                    <p className="text-[11px] text-[#8d9ab0] mt-0.5">
                      Switch, add, rename, or delete pages and choose which sections appear on each page.
                    </p>
                  </div>
                </div>

                {/* Add Page Form */}
                <form onSubmit={handleAddNewPage} className="flex gap-2">
                  <input
                    type="text"
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    placeholder="New page title (e.g. Lab, Playground, Services)..."
                    className="flex-1 rounded-lg border border-white/15 bg-[#0b0d10] px-3 py-1.5 text-[12px] text-white focus:border-[#7aa2d4] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#213f66] px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-[#2c5282] whitespace-nowrap shrink-0"
                  >
                    <FilePlus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Add Page</span>
                  </button>
                </form>

                {/* Page List */}
                <div className="space-y-2.5">
                  {pages.map((page) => {
                    const isActive = page.id === activePageId;
                    return (
                      <div
                        key={page.id}
                        className={`rounded-lg border p-3 transition-colors ${
                          isActive
                            ? 'border-[#7aa2d4]/60 bg-[#213f66]/20'
                            : 'border-white/10 bg-[#0b0d10]/70'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              aria-label={`Page title ${page.title}`}
                              value={page.title}
                              onChange={(e) => {
                                const nextPages = pages.map((p) =>
                                  p.id === page.id ? { ...p, title: e.target.value } : p
                                );
                                onUpdateTemplateState({ ...templateState, pages: nextPages });
                              }}
                              className="w-36 rounded border border-white/12 bg-[#141820] px-2 py-1 text-[13px] font-medium text-white"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateTemplateState({ ...templateState, activePageId: page.id })
                              }
                              className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                                isActive
                                  ? 'bg-[#213f66] text-white'
                                  : 'border border-white/15 text-[#9aa6b8] hover:text-white'
                              }`}
                            >
                              {isActive ? 'Active Page' : 'Switch to Page'}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onUpdateTemplateState(
                                deleteTemplatePage(templateState, page.id),
                                `Page "${page.title}"`,
                                true
                              )
                            }
                            aria-label={`Delete page ${page.title}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/60 px-2.5 py-1 text-[11px] font-medium text-rose-200 hover:border-rose-400 hover:bg-rose-900"
                          >
                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                            <span>Delete Page</span>
                          </button>
                        </div>

                        {/* Toggle sections included in this page */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/8">
                          <span className="text-[10px] uppercase tracking-wider text-[#7f8c9f] mr-1">
                            Page Sections:
                          </span>
                          {(['hero', 'whyus', 'process', 'works', 'blog', 'contact'] as SectionId[]).map(
                            (secId) => {
                              const included = page.sections.includes(secId);
                              return (
                                <button
                                  key={secId}
                                  type="button"
                                  onClick={() => handleToggleSectionInPage(page.id, secId)}
                                  className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                    included
                                      ? 'bg-[#5c85b8]/30 text-white border border-[#7aa2d4]/50'
                                      : 'bg-white/5 text-[#6c7a8e] line-through'
                                  }`}
                                >
                                  {secId}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. MAJOR PAGE SECTIONS MANAGER (Reorder / Delete / Restore) */}
              <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                <div>
                  <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#7aa2d4]">
                    Major Page Sections
                  </h3>
                  <p className="text-[11px] text-[#8d9ab0] mt-0.5">
                    Reorder sections up/down or delete entire sections from the portfolio.
                  </p>
                </div>

                <div className="space-y-2">
                  {sectionOrder.map((secId, index) => {
                    const isSecDeleted = deletedSections.includes(secId);
                    return (
                      <div
                        key={secId}
                        className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#0b0d10] px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
                          <span
                            className={`text-[12px] font-medium ${
                              isSecDeleted ? 'line-through text-[#6c7a8e]' : 'text-white'
                            }`}
                          >
                            {SECTION_LABELS[secId]}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() =>
                              onUpdateTemplateState({
                                ...templateState,
                                sectionOrder: moveSectionOrder(sectionOrder, secId, 'up'),
                              })
                            }
                            aria-label={`Move ${SECTION_LABELS[secId]} up`}
                            className="rounded border border-white/10 p-1 text-[#9aa6b8] hover:text-white disabled:opacity-30"
                          >
                            <ArrowUp className="h-3 w-3" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            disabled={index === sectionOrder.length - 1}
                            onClick={() =>
                              onUpdateTemplateState({
                                ...templateState,
                                sectionOrder: moveSectionOrder(sectionOrder, secId, 'down'),
                              })
                            }
                            aria-label={`Move ${SECTION_LABELS[secId]} down`}
                            className="rounded border border-white/10 p-1 text-[#9aa6b8] hover:text-white disabled:opacity-30"
                          >
                            <ArrowDown className="h-3 w-3" aria-hidden="true" />
                          </button>

                          {isSecDeleted ? (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateTemplateState(restoreSection(templateState, secId))
                              }
                              className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-900"
                            >
                              Restore Section
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateTemplateState(
                                  deleteSection(templateState, secId),
                                  SECTION_LABELS[secId],
                                  true
                                )
                              }
                              aria-label={`Delete ${SECTION_LABELS[secId]} from drawer`}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/60 px-2.5 py-1 text-[11px] font-medium text-rose-200 hover:bg-rose-900"
                            >
                              <Trash2 className="h-3 w-3" aria-hidden="true" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. GRANULAR UI SUB-COMPONENTS MANAGER (Delete / Restore) */}
              <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                <div>
                  <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#7aa2d4]">
                    Individual UI Components
                  </h3>
                  <p className="text-[11px] text-[#8d9ab0] mt-0.5">
                    Delete or restore individual visual components (3D Ring, Portrait, Arch Card, Banners).
                  </p>
                </div>

                <div className="space-y-2">
                  {ALL_SUBCOMPONENTS.map((compId) => {
                    const isCompDeleted = deletedSubComponents.includes(compId);
                    return (
                      <div
                        key={compId}
                        className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-[#0b0d10] px-3 py-2"
                      >
                        <span
                          className={`text-[12px] ${
                            isCompDeleted ? 'line-through text-[#6c7a8e]' : 'text-[#dce4f0]'
                          }`}
                        >
                          {SUBCOMPONENT_LABELS[compId]}
                        </span>

                        {isCompDeleted ? (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateTemplateState(restoreSubComponent(templateState, compId))
                            }
                            className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-900"
                          >
                            Restore Component
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateTemplateState(
                                deleteSubComponent(templateState, compId),
                                SUBCOMPONENT_LABELS[compId],
                                true
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/60 px-2.5 py-1 text-[11px] font-medium text-rose-200 hover:bg-rose-900"
                          >
                            <Trash2 className="h-3 w-3" aria-hidden="true" />
                            <span>Delete Component</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: HERO & BRAND */}
          {activeTab === 'hero' && (
            <>
              <div>
                <p className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#8d9ab0] mb-3">
                  Quick Persona Presets
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => onUpdateTemplateState({ ...templateState, config: DEFAULT_TEMPLATE_CONFIG })}
                    className="flex items-center justify-between rounded-xl border border-white/12 bg-[#141820] px-3.5 py-2.5 text-left text-[12px] font-medium text-white transition-colors hover:border-[#7aa2d4]"
                  >
                    <span>Seoyeon. (Default)</span>
                    <Sparkles className="h-3.5 w-3.5 text-[#7aa2d4] shrink-0" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateTemplateState({ ...templateState, config: ULTRON_PERSONA_CONFIG })}
                    className="flex items-center justify-between rounded-xl border border-white/12 bg-[#141820] px-3.5 py-2.5 text-left text-[12px] font-medium text-white transition-colors hover:border-[#7aa2d4]"
                  >
                    <span>Marvel Ultron Persona</span>
                    <Sparkles className="h-3.5 w-3.5 text-[#7aa2d4] shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cfg-wordmark" className="block text-[12px] font-medium text-[#b5c0d0]">
                      Brand Wordmark
                    </label>
                    <input
                      id="cfg-wordmark"
                      type="text"
                      value={config.brandWordmark}
                      onChange={(e) => handleConfigChange('brandWordmark', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white focus:border-[#7aa2d4] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="cfg-spots" className="block text-[12px] font-medium text-[#b5c0d0]">
                      Open Project Spots
                    </label>
                    <input
                      id="cfg-spots"
                      type="number"
                      min={0}
                      max={20}
                      value={config.spotsAvailable}
                      onChange={(e) =>
                        handleConfigChange('spotsAvailable', Math.max(0, parseInt(e.target.value, 10) || 0))
                      }
                      className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white focus:border-[#7aa2d4] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cfg-kicker" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Hero Kicker
                  </label>
                  <input
                    id="cfg-kicker"
                    type="text"
                    value={config.heroKicker}
                    onChange={(e) => handleConfigChange('heroKicker', e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white focus:border-[#7aa2d4] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cfg-line1" className="block text-[12px] font-medium text-[#b5c0d0]">
                      Headline Line 1
                    </label>
                    <input
                      id="cfg-line1"
                      type="text"
                      value={config.headlineLine1}
                      onChange={(e) => handleConfigChange('headlineLine1', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white focus:border-[#7aa2d4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="cfg-line2" className="block text-[12px] font-medium text-[#b5c0d0]">
                      Headline Line 2
                    </label>
                    <input
                      id="cfg-line2"
                      type="text"
                      value={config.headlineLine2}
                      onChange={(e) => handleConfigChange('headlineLine2', e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white focus:border-[#7aa2d4] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cfg-location" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Studio Location
                  </label>
                  <input
                    id="cfg-location"
                    type="text"
                    value={config.location}
                    onChange={(e) => handleConfigChange('location', e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white focus:border-[#7aa2d4] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="cfg-quote" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Mission Quote
                  </label>
                  <textarea
                    id="cfg-quote"
                    rows={3}
                    value={config.missionQuote}
                    onChange={(e) => handleConfigChange('missionQuote', e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] p-3 text-[13px] text-white focus:border-[#7aa2d4] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="cfg-signature" className="block text-[12px] font-medium text-[#b5c0d0]">
                    Signature Text
                  </label>
                  <input
                    id="cfg-signature"
                    type="text"
                    value={config.signatureText}
                    onChange={(e) => handleConfigChange('signatureText', e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white focus:border-[#7aa2d4] focus:outline-none"
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-white">Hero Subject Portrait</span>
                    <button
                      type="button"
                      onClick={() => handleConfigChange('heroPortraitUrl', HERO_PORTRAIT_PATH)}
                      className="text-[11px] text-[#7aa2d4] hover:underline"
                    >
                      Restore Marvel Ultron Portrait
                    </button>
                  </div>
                  <input
                    type="text"
                    aria-label="Hero Portrait Image URL"
                    value={config.heroPortraitUrl}
                    onChange={(e) => handleConfigChange('heroPortraitUrl', e.target.value)}
                    placeholder="Paste image URL or data URI..."
                    className="w-full rounded-lg border border-white/12 bg-[#0b0d10] px-3 py-1.5 text-[12px] text-white"
                  />
                  <label className="flex items-center gap-2.5 text-[12px] text-[#cbd7e8] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.enableCutout}
                      onChange={(e) => handleConfigChange('enableCutout', e.target.checked)}
                      className="rounded border-white/20 bg-[#0b0d10] text-[#5c85b8]"
                    />
                    <span>Enable Border-Seeded Flood-Fill Background Cutout</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: WHY US & METRICS */}
          {activeTab === 'whyus' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#7aa2d4]">
                  Central Navy Arch Card
                </h3>
                <div>
                  <label className="block text-[12px] text-[#b5c0d0]">Arch Kicker</label>
                  <input
                    type="text"
                    value={whyUs.kicker}
                    onChange={(e) =>
                      onUpdateTemplateState({ ...templateState, whyUs: { ...whyUs, kicker: e.target.value } })
                    }
                    className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#b5c0d0]">Arch Serif Heading</label>
                  <input
                    type="text"
                    value={whyUs.heading}
                    onChange={(e) =>
                      onUpdateTemplateState({ ...templateState, whyUs: { ...whyUs, heading: e.target.value } })
                    }
                    className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-[#b5c0d0]">Arch Body Copy</label>
                  <textarea
                    rows={3}
                    value={whyUs.bodyCopy}
                    onChange={(e) =>
                      onUpdateTemplateState({ ...templateState, whyUs: { ...whyUs, bodyCopy: e.target.value } })
                    }
                    className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] p-2.5 text-[13px] text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#7aa2d4]">
                  Animated Counter Callouts ({whyUs.metrics.length})
                </h3>
                {whyUs.metrics.map((m, idx) => (
                  <div key={m.id} className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase text-[#8d9ab0]">
                        Callout #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateTemplateState({
                            ...templateState,
                            whyUs: {
                              ...whyUs,
                              metrics: whyUs.metrics.filter((item) => item.id !== m.id),
                            },
                          })
                        }
                        className="inline-flex items-center gap-1 rounded border border-rose-500/40 bg-rose-950/60 px-2 py-0.5 text-[11px] text-rose-300"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                        <span>Delete Callout</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-[#9aa6b8]">Prefix</label>
                        <input
                          type="text"
                          value={m.prefix}
                          onChange={(e) => handleWhyUsMetricChange(m.id, { prefix: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2.5 py-1.5 text-[13px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#9aa6b8]">Target Number</label>
                        <input
                          type="number"
                          value={m.targetNumber}
                          onChange={(e) =>
                            handleWhyUsMetricChange(m.id, {
                              targetNumber: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2.5 py-1.5 text-[13px] text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#9aa6b8]">Suffix</label>
                        <input
                          type="text"
                          value={m.suffix}
                          onChange={(e) => handleWhyUsMetricChange(m.id, { suffix: e.target.value })}
                          className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2.5 py-1.5 text-[13px] text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9aa6b8]">Metric Description</label>
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => handleWhyUsMetricChange(m.id, { label: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2.5 py-1.5 text-[12px] text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROCESS STEPS */}
          {activeTab === 'process' && (
            <div className="space-y-4">
              {processSteps.map((step, idx) => (
                <div key={step.id || idx} className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#7aa2d4]">
                      Step {step.number} — {step.title}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateTemplateState({
                          ...templateState,
                          processSteps: processSteps.filter((_, i) => i !== idx),
                        })
                      }
                      className="inline-flex items-center gap-1 rounded border border-rose-500/40 bg-rose-950/60 px-2 py-0.5 text-[11px] text-rose-300"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      <span>Delete Step</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-[#9aa6b8]">Numeral</label>
                      <input
                        type="text"
                        value={step.number}
                        onChange={(e) => {
                          const next = [...processSteps];
                          next[idx] = { ...step, number: e.target.value };
                          onUpdateTemplateState({ ...templateState, processSteps: next });
                        }}
                        className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2.5 py-1.5 text-[13px] text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] text-[#9aa6b8]">Heading</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const next = [...processSteps];
                          next[idx] = { ...step, title: e.target.value };
                          onUpdateTemplateState({ ...templateState, processSteps: next });
                        }}
                        className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2.5 py-1.5 text-[13px] text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9aa6b8]">Process Description</label>
                    <textarea
                      rows={3}
                      value={step.description}
                      onChange={(e) => {
                        const next = [...processSteps];
                        next[idx] = { ...step, description: e.target.value };
                        onUpdateTemplateState({ ...templateState, processSteps: next });
                      }}
                      className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] p-2.5 text-[12px] text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-2">
                <select
                  aria-label="Select project to edit"
                  value={activeProject?.id || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="flex-1 rounded-xl border border-white/15 bg-[#0b0d10] px-3 py-2 text-[13px] text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.category})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleCreateNewProject}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#213f66] px-3.5 py-2 text-[12px] font-medium text-white hover:bg-[#2c5282] whitespace-nowrap shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>New Project</span>
                </button>
              </div>

              {activeProject && (
                <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3.5">
                  <div>
                    <label className="block text-[11px] text-[#9aa6b8]">Project Title</label>
                    <input
                      type="text"
                      value={activeProject.title}
                      onChange={(e) =>
                        onUpdateTemplateState({
                          ...templateState,
                          projects: upsertProjectItem(projects, { ...activeProject, title: e.target.value }),
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-3 py-2 text-[13px] text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-[#9aa6b8]">Client</label>
                      <input
                        type="text"
                        value={activeProject.client}
                        onChange={(e) =>
                          onUpdateTemplateState({
                            ...templateState,
                            projects: upsertProjectItem(projects, { ...activeProject, client: e.target.value }),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2.5 py-1.5 text-[12px] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9aa6b8]">Category</label>
                      <select
                        value={activeProject.category}
                        onChange={(e) =>
                          onUpdateTemplateState({
                            ...templateState,
                            projects: upsertProjectItem(projects, {
                              ...activeProject,
                              category: e.target.value as Exclude<ProjectCategory, 'All'>,
                            }),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2 py-1.5 text-[12px] text-white"
                      >
                        <option value="Mobile App">Mobile App</option>
                        <option value="Web Platform">Web Platform</option>
                        <option value="Design System">Design System</option>
                        <option value="Brand & UI">Brand & UI</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9aa6b8]">Year</label>
                      <input
                        type="text"
                        value={activeProject.year}
                        onChange={(e) =>
                          onUpdateTemplateState({
                            ...templateState,
                            projects: upsertProjectItem(projects, { ...activeProject, year: e.target.value }),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-2.5 py-1.5 text-[12px] text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#9aa6b8]">Headline Impact Metric</label>
                    <input
                      type="text"
                      value={activeProject.impactMetric}
                      onChange={(e) =>
                        onUpdateTemplateState({
                          ...templateState,
                          projects: upsertProjectItem(projects, { ...activeProject, impactMetric: e.target.value }),
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-3 py-1.5 text-[12px] text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#9aa6b8]">Case Study Summary</label>
                    <textarea
                      rows={2}
                      value={activeProject.summary}
                      onChange={(e) =>
                        onUpdateTemplateState({
                          ...templateState,
                          projects: upsertProjectItem(projects, { ...activeProject, summary: e.target.value }),
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] p-2.5 text-[12px] text-white"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const next = removeProjectItem(projects, activeProject.id);
                        onUpdateTemplateState({ ...templateState, projects: next });
                        setSelectedProjectId(next[0]?.id || '');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-1.5 text-[12px] text-rose-300 hover:border-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ESSAYS & FOOTER */}
          {activeTab === 'essays' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <select
                    aria-label="Select essay to edit"
                    value={activeEssay?.id || ''}
                    onChange={(e) => setSelectedEssayId(e.target.value)}
                    className="flex-1 rounded-xl border border-white/15 bg-[#0b0d10] px-3 py-2 text-[13px] text-white"
                  >
                    {essays.map((es) => (
                      <option key={es.id} value={es.id}>
                        {es.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleCreateNewEssay}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#213f66] px-3.5 py-2 text-[12px] font-medium text-white hover:bg-[#2c5282] whitespace-nowrap shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>New Essay</span>
                  </button>
                </div>

                {activeEssay && (
                  <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                    <div>
                      <label className="block text-[11px] text-[#9aa6b8]">Essay Title</label>
                      <input
                        type="text"
                        value={activeEssay.title}
                        onChange={(e) =>
                          onUpdateTemplateState({
                            ...templateState,
                            essays: upsertEssayItem(essays, { ...activeEssay, title: e.target.value }),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-3 py-1.5 text-[13px] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9aa6b8]">Excerpt</label>
                      <textarea
                        rows={2}
                        value={activeEssay.excerpt}
                        onChange={(e) =>
                          onUpdateTemplateState({
                            ...templateState,
                            essays: upsertEssayItem(essays, { ...activeEssay, excerpt: e.target.value }),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] p-2.5 text-[12px] text-white"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const next = removeEssayItem(essays, activeEssay.id);
                          onUpdateTemplateState({ ...templateState, essays: next });
                          setSelectedEssayId(next[0]?.id || '');
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-1 text-[11px] text-rose-300"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                        <span>Delete Essay</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#7aa2d4]">
                  Footer Consultation Banner
                </h3>
                <div>
                  <label className="block text-[11px] text-[#9aa6b8]">Availability Kicker Prefix</label>
                  <input
                    type="text"
                    value={footer.availabilityPrefix}
                    onChange={(e) =>
                      onUpdateTemplateState({
                        ...templateState,
                        footer: { ...footer, availabilityPrefix: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-3 py-1.5 text-[12px] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9aa6b8]">Footer Headline</label>
                  <input
                    type="text"
                    value={footer.headline}
                    onChange={(e) =>
                      onUpdateTemplateState({
                        ...templateState,
                        footer: { ...footer, headline: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/12 bg-[#0b0d10] px-3 py-1.5 text-[12px] text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: EXPORT / IMPORT JSON */}
          {activeTab === 'export' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#7aa2d4]">
                  Export Editable Template Config
                </h3>
                <p className="text-[12px] leading-relaxed text-[#9aa6b8]">
                  Download or copy your complete customized template (including pages, section order, deleted components, and case studies) as a portable JSON file.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#0b0d10] px-4 py-2 text-[12px] font-medium text-white hover:border-[#7aa2d4]"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                        <span>Copied JSON!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
                        <span>Copy JSON to Clipboard</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#213f66] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#2c5282]"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Download .json File</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#141820] p-4 space-y-3">
                <h3 className="text-[12px] font-semibold tracking-[0.16em] uppercase text-[#7aa2d4]">
                  Import Template JSON
                </h3>
                <textarea
                  rows={5}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='Paste exported template JSON here ({"config": ...})'
                  className="w-full rounded-lg border border-white/12 bg-[#0b0d10] p-3 font-mono text-[11px] text-white"
                />
                {importError && <p className="text-[12px] text-rose-400">{importError}</p>}
                {importSuccess && (
                  <p className="text-[12px] text-emerald-400">Template configuration imported and applied!</p>
                )}
                <button
                  type="button"
                  onClick={handleImportJson}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-[12px] font-semibold text-[#0b0d10] hover:bg-[#dce6f5]"
                >
                  <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Apply Imported JSON</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#141820] px-6 py-4">
          <button
            type="button"
            onClick={() => onUpdateTemplateState(DEFAULT_FULL_TEMPLATE)}
            className="inline-flex items-center gap-1.5 text-[12px] text-[#9aa6b8] hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset All to Factory Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-[#0b0d10] hover:bg-[#dce6f5]"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
