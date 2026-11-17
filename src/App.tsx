import { useCallback, useEffect, useState } from 'react';
import {
  Download,
  Layers,
  PencilLine,
  Plus,
  Redo2,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  Undo2,
  X,
} from 'lucide-react';
import {
  DEFAULT_FULL_TEMPLATE,
  EssayItem,
  FullTemplateState,
  PRESET_IMAGES,
  ProjectBriefSubmission,
  ProjectItem,
  SECTION_LABELS,
  SectionId,
  SUBCOMPONENT_LABELS,
  SubComponentId,
} from './data/portfolioData';
import {
  addTemplatePage,
  decrementSpots,
  deleteSection,
  deleteSubComponent,
  deleteTemplatePage,
  INITIAL_SUBMISSIONS,
  moveSectionOrder,
  pushTemplateHistory,
  redoTemplateHistory,
  removeEssayItem,
  removeProjectItem,
  restoreAllDeleted,
  restoreSection,
  restoreSubComponent,
  TemplateHistoryState,
  undoTemplateHistory,
  upsertEssayItem,
  upsertProjectItem,
} from './utils/portfolioLogic';
import { HeroSection } from './components/HeroSection';
import { WhyUsSection } from './components/WhyUsSection';
import { HowWeWorkSection } from './components/HowWeWorkSection';
import { SelectedWorksSection } from './components/SelectedWorksSection';
import { FooterSection, NotesSection } from './components/NotesAndFooterSection';
import { SectionEditWrapper } from './components/SectionEditWrapper';
import {
  ArticleReaderModal,
  CustomizeTemplateDrawer,
  ProjectCaseStudyModal,
  ProjectInquiryModal,
  StudioDrawerTab,
} from './components/ModalsAndDrawers';

const STORAGE_KEY_FULL_TEMPLATE = 'seoyeon_ultron_full_template_v8';
const STORAGE_KEY_SUBMISSIONS = 'seoyeon_ultron_submissions_v1';

function detectDeletionLabel(
  prev: FullTemplateState,
  next: FullTemplateState,
  explicitLabel?: string,
  explicitIsDeletion?: boolean
): { isDeletion: boolean; label: string } {
  if (explicitIsDeletion && explicitLabel) {
    return { isDeletion: true, label: explicitLabel };
  }

  if (next.deletedSections.length > prev.deletedSections.length) {
    const added = next.deletedSections.find((id) => !prev.deletedSections.includes(id));
    if (added) return { isDeletion: true, label: SECTION_LABELS[added] };
  }

  if (next.deletedSubComponents.length > prev.deletedSubComponents.length) {
    const added = next.deletedSubComponents.find((id) => !prev.deletedSubComponents.includes(id));
    if (added) return { isDeletion: true, label: SUBCOMPONENT_LABELS[added] };
  }

  if (next.pages.length < prev.pages.length) {
    const removed = prev.pages.find((p) => !next.pages.some((np) => np.id === p.id));
    return { isDeletion: true, label: `Page "${removed?.title || 'Page'}"` };
  }

  if (next.whyUs.metrics.length < prev.whyUs.metrics.length) {
    const removed = prev.whyUs.metrics.find((m) => !next.whyUs.metrics.some((nm) => nm.id === m.id));
    return { isDeletion: true, label: `Metric "${removed?.title || removed?.label || 'Callout'}"` };
  }

  const prevBulletins = prev.whyUs.bulletins || [];
  const nextBulletins = next.whyUs.bulletins || [];
  if (nextBulletins.length < prevBulletins.length) {
    const removed = prevBulletins.find((b) => !nextBulletins.some((nb) => nb.id === b.id));
    return { isDeletion: true, label: `Bulletin "${removed?.title || 'Item'}"` };
  }

  if (next.processSteps.length < prev.processSteps.length) {
    const removed = prev.processSteps.find((s) => !next.processSteps.some((ns) => ns.id === s.id));
    return { isDeletion: true, label: `Process Step "${removed?.title || 'Step'}"` };
  }

  if (next.projects.length < prev.projects.length) {
    const removed = prev.projects.find((p) => !next.projects.some((np) => np.id === p.id));
    return { isDeletion: true, label: `Case Study "${removed?.title || 'Project'}"` };
  }

  if (next.essays.length < prev.essays.length) {
    const removed = prev.essays.find((e) => !next.essays.some((ne) => ne.id === e.id));
    return { isDeletion: true, label: `Essay "${removed?.title || 'Article'}"` };
  }

  return { isDeletion: Boolean(explicitIsDeletion), label: explicitLabel || 'Template update' };
}

export default function App() {
  const [templateState, setTemplateState] = useState<FullTemplateState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FULL_TEMPLATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          config: { ...DEFAULT_FULL_TEMPLATE.config, ...parsed.config },
          whyUs: parsed.whyUs ? { ...DEFAULT_FULL_TEMPLATE.whyUs, ...parsed.whyUs } : DEFAULT_FULL_TEMPLATE.whyUs,
          processSteps: Array.isArray(parsed.processSteps)
            ? parsed.processSteps
            : DEFAULT_FULL_TEMPLATE.processSteps,
          projects: Array.isArray(parsed.projects)
            ? parsed.projects
            : DEFAULT_FULL_TEMPLATE.projects,
          essays: Array.isArray(parsed.essays)
            ? parsed.essays
            : DEFAULT_FULL_TEMPLATE.essays,
          footer: parsed.footer ? { ...DEFAULT_FULL_TEMPLATE.footer, ...parsed.footer } : DEFAULT_FULL_TEMPLATE.footer,
          pages: Array.isArray(parsed.pages) ? parsed.pages : DEFAULT_FULL_TEMPLATE.pages,
          activePageId: parsed.activePageId || DEFAULT_FULL_TEMPLATE.activePageId,
          sectionOrder: Array.isArray(parsed.sectionOrder)
            ? parsed.sectionOrder
            : DEFAULT_FULL_TEMPLATE.sectionOrder,
          deletedSections: Array.isArray(parsed.deletedSections) ? parsed.deletedSections : [],
          deletedSubComponents: Array.isArray(parsed.deletedSubComponents)
            ? parsed.deletedSubComponents
            : [],
        };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_FULL_TEMPLATE;
  });

  const [submissions, setSubmissions] = useState<ProjectBriefSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_SUBMISSIONS;
  });

  const [history, setHistory] = useState<TemplateHistoryState>({ past: [], future: [] });
  const [justDeletedBanner, setJustDeletedBanner] = useState<{ label: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [activeEssay, setActiveEssay] = useState<EssayItem | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryContextProject, setInquiryContextProject] = useState<string | undefined>(undefined);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [customizerTab, setCustomizerTab] = useState<StudioDrawerTab>('pages');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        setIsEditMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FULL_TEMPLATE, JSON.stringify(templateState));
    } catch {
      // ignore storage errors
    }
  }, [templateState]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    } catch {
      // ignore storage errors
    }
  }, [submissions]);

  const commitTemplateChange = useCallback(
    (
      updater: FullTemplateState | ((prev: FullTemplateState) => FullTemplateState),
      explicitLabel?: string,
      explicitIsDeletion?: boolean
    ) => {
      setTemplateState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (next === prev) return prev;
        const { isDeletion, label } = detectDeletionLabel(
          prev,
          next,
          explicitLabel,
          explicitIsDeletion
        );
        setHistory((h) =>
          pushTemplateHistory(h, {
            state: prev,
            submissions,
            actionLabel: label,
            isDeletion,
          })
        );
        if (isDeletion) {
          setJustDeletedBanner({ label });
        } else {
          setJustDeletedBanner(null);
        }
        return next;
      });
    },
    [submissions]
  );

  const handleDeleteSubmission = useCallback(
    (subId: string) => {
      const removed = submissions.find((s) => s.id === subId);
      const label = `Inquiry brief from "${removed?.name || 'Client'}"`;
      setHistory((h) =>
        pushTemplateHistory(h, {
          state: templateState,
          submissions,
          actionLabel: label,
          isDeletion: true,
        })
      );
      setSubmissions((prev) => prev.filter((s) => s.id !== subId));
      setJustDeletedBanner({ label });
    },
    [submissions, templateState]
  );

  const handleUndo = useCallback(() => {
    const res = undoTemplateHistory(history, templateState, submissions);
    if (res.restoredLabel !== undefined) {
      setHistory(res.history);
      setTemplateState(res.state);
      setSubmissions(res.submissions);
      setJustDeletedBanner(null);
    }
  }, [history, submissions, templateState]);

  const handleRedo = useCallback(() => {
    const res = redoTemplateHistory(history, templateState, submissions);
    if (res.reappliedLabel !== undefined) {
      setHistory(res.history);
      setTemplateState(res.state);
      setSubmissions(res.submissions);
    }
  }, [history, submissions, templateState]);

  // Global Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z keyboard shortcuts when not typing in inputs
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
        return;
      }
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (history.past.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
        if (history.future.length > 0) {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleRedo, handleUndo, history.future.length, history.past.length]);

  const handleOpenCustomizer = (tab: string = 'pages') => {
    setCustomizerTab(tab as StudioDrawerTab);
    setCustomizerOpen(true);
  };

  const handleOpenInquiry = (contextProjectTitle?: string) => {
    setInquiryContextProject(contextProjectTitle);
    setInquiryModalOpen(true);
  };

  const handleInquireFromCaseStudy = (projectTitle: string) => {
    setActiveProject(null);
    handleOpenInquiry(projectTitle);
  };

  const handleSubmitBrief = (newBrief: Omit<ProjectBriefSubmission, 'id' | 'submittedAt'>) => {
    const entry: ProjectBriefSubmission = {
      ...newBrief,
      id: `brief-${Date.now()}`,
      submittedAt: 'Just now',
    };

    setSubmissions((prev) => [entry, ...prev]);
    commitTemplateChange((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        spotsAvailable: decrementSpots(prev.config.spotsAvailable),
      },
    }));
  };

  const handleAddProjectInline = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Bespoke Digital Flagship',
      client: 'Atelier Studio',
      category: 'Web Platform',
      year: '2026',
      impactMetric: '+54% Qualified Conversions',
      image: PRESET_IMAGES[templateState.projects.length % PRESET_IMAGES.length].url,
      summary:
        'Click any text when Inline Edit Mode is active to customize this project title, client, metric, or summary directly on the page.',
      challenge: 'Creating a calm, high-converting digital flagship with zero visual clutter.',
      architecture: 'Designed a modular typographic grid with rapid view transitions and clear product storytelling.',
      measuredImpact: [
        { label: 'Conversion Lift', value: '+54%', detail: 'Measured within 60 days of launch' },
        { label: 'Load Time', value: '0.7s', detail: 'Sub-second global page rendering' },
        { label: 'Retention', value: '94%', detail: 'Sustained repeat client engagement' },
      ],
      deliverables: ['Product Strategy', 'UI Design System', 'Interactive Prototype'],
    };
    commitTemplateChange((prev) => ({
      ...prev,
      projects: upsertProjectItem(prev.projects, newProj),
    }));
  };

  const handleAddEssayInline = () => {
    const newEssay: EssayItem = {
      id: `essay-${Date.now()}`,
      title: 'Designing Calm Interfaces in an Era of Noise',
      subtitle: 'Why restraint and typographic clarity outperform ornamental UI.',
      date: 'November 2026',
      readTime: '4 min read',
      category: 'Studio Essay',
      excerpt:
        'Click any text in Inline Edit Mode to customize this essay title, category, date, or excerpt directly on the canvas.',
      paragraphs: [
        'Digital products succeed when they respect the user’s attention and cognitive bandwidth.',
        'Use the Customize Template drawer or click inline to tailor every monograph to your own design voice.',
      ],
      keyTakeaway: 'Calm execution and clear hierarchy compound user trust over time.',
    };
    commitTemplateChange((prev) => ({
      ...prev,
      essays: upsertEssayItem(prev.essays, newEssay),
    }));
  };

  // Determine active page & visible sections
  const activePage =
    templateState.pages.find((p) => p.id === templateState.activePageId) ||
    templateState.pages[0];

  const visibleSections = templateState.sectionOrder.filter((secId) => {
    if (templateState.deletedSections.includes(secId)) return false;
    if (!activePage) return true;
    return activePage.sections.includes(secId);
  });

  const heroIsVisible = visibleSections.includes('hero');
  const totalDeletedCount =
    templateState.deletedSections.length + templateState.deletedSubComponents.length;
  const lastDeletionEntry = [...history.past].reverse().find((item) => item.isDeletion);

  const renderSectionById = (secId: SectionId, indexInVisible: number) => {
    const orderIdx = templateState.sectionOrder.indexOf(secId);
    const canMoveUp = orderIdx > 0;
    const canMoveDown = orderIdx < templateState.sectionOrder.length - 1;

    const wrapperProps = {
      sectionId: secId,
      isEditMode,
      canMoveUp,
      canMoveDown,
      onMoveUp: () =>
        commitTemplateChange((prev) => ({
          ...prev,
          sectionOrder: moveSectionOrder(prev.sectionOrder, secId, 'up'),
        })),
      onMoveDown: () =>
        commitTemplateChange((prev) => ({
          ...prev,
          sectionOrder: moveSectionOrder(prev.sectionOrder, secId, 'down'),
        })),
      onDeleteSection: () =>
        commitTemplateChange(
          (prev) => deleteSection(prev, secId),
          SECTION_LABELS[secId],
          true
        ),
    };

    switch (secId) {
      case 'hero':
        return (
          <SectionEditWrapper key={`${secId}-${indexInVisible}`} {...wrapperProps}>
            <HeroSection
              config={templateState.config}
              projects={templateState.projects}
              pages={templateState.pages}
              activePageId={activePage?.id || ''}
              deletedSubComponents={templateState.deletedSubComponents}
              isEditMode={isEditMode}
              onToggleEditMode={() => setIsEditMode((prev) => !prev)}
              onUpdateConfig={(nextConfig) =>
                commitTemplateChange((prev) => ({ ...prev, config: nextConfig }))
              }
              onSelectPage={(pageId) =>
                setTemplateState((prev) => ({ ...prev, activePageId: pageId }))
              }
              onAddPage={() =>
                commitTemplateChange((prev) =>
                  addTemplatePage(prev, `Page ${prev.pages.length + 1}`)
                )
              }
              onDeletePage={(pageId) =>
                commitTemplateChange((prev) => deleteTemplatePage(prev, pageId))
              }
              onRenamePage={(pageId, nextTitle) =>
                commitTemplateChange((prev) => ({
                  ...prev,
                  pages: prev.pages.map((p) =>
                    p.id === pageId ? { ...p, title: nextTitle } : p
                  ),
                }))
              }
              onDeleteSubComponent={(compId: SubComponentId) =>
                commitTemplateChange(
                  (prev) => deleteSubComponent(prev, compId),
                  SUBCOMPONENT_LABELS[compId],
                  true
                )
              }
              onOpenProject={(proj) => setActiveProject(proj)}
              onOpenInquiry={handleOpenInquiry}
              onOpenCustomizer={handleOpenCustomizer}
            />
          </SectionEditWrapper>
        );

      case 'whyus':
        return (
          <SectionEditWrapper key={`${secId}-${indexInVisible}`} {...wrapperProps}>
            <WhyUsSection
              whyUs={templateState.whyUs}
              signatureText={templateState.config.signatureText}
              deletedSubComponents={templateState.deletedSubComponents}
              isEditMode={isEditMode}
              onUpdateWhyUs={(nextWhyUs) =>
                commitTemplateChange((prev) => ({ ...prev, whyUs: nextWhyUs }))
              }
              onUpdateSignature={(nextSig) =>
                commitTemplateChange((prev) => ({
                  ...prev,
                  config: { ...prev.config, signatureText: nextSig },
                }))
              }
              onDeleteSubComponent={(compId: SubComponentId) =>
                commitTemplateChange(
                  (prev) => deleteSubComponent(prev, compId),
                  SUBCOMPONENT_LABELS[compId],
                  true
                )
              }
              onOpenCustomizer={handleOpenCustomizer}
            />
          </SectionEditWrapper>
        );

      case 'process':
        return (
          <SectionEditWrapper key={`${secId}-${indexInVisible}`} {...wrapperProps}>
            <HowWeWorkSection
              processSteps={templateState.processSteps}
              projects={templateState.projects}
              isEditMode={isEditMode}
              onUpdateProcessSteps={(nextSteps) =>
                commitTemplateChange((prev) => ({ ...prev, processSteps: nextSteps }))
              }
              onOpenProject={(proj) => setActiveProject(proj)}
            />
          </SectionEditWrapper>
        );

      case 'works':
        return (
          <SectionEditWrapper key={`${secId}-${indexInVisible}`} {...wrapperProps}>
            <SelectedWorksSection
              projects={templateState.projects}
              isEditMode={isEditMode}
              onOpenProject={(proj) => setActiveProject(proj)}
              onUpdateProject={(updated) =>
                commitTemplateChange((prev) => ({
                  ...prev,
                  projects: upsertProjectItem(prev.projects, updated),
                }))
              }
              onAddProject={handleAddProjectInline}
              onDeleteProject={(projectId) =>
                commitTemplateChange((prev) => ({
                  ...prev,
                  projects: removeProjectItem(prev.projects, projectId),
                }))
              }
              onOpenCustomizerForProjects={() => handleOpenCustomizer('projects')}
            />
          </SectionEditWrapper>
        );

      case 'blog':
        return (
          <SectionEditWrapper key={`${secId}-${indexInVisible}`} {...wrapperProps}>
            <NotesSection
              essays={templateState.essays}
              isEditMode={isEditMode}
              onOpenEssay={(essay) => setActiveEssay(essay)}
              onUpdateEssay={(updated) =>
                commitTemplateChange((prev) => ({
                  ...prev,
                  essays: upsertEssayItem(prev.essays, updated),
                }))
              }
              onAddEssay={handleAddEssayInline}
              onDeleteEssay={(essayId) =>
                commitTemplateChange((prev) => ({
                  ...prev,
                  essays: removeEssayItem(prev.essays, essayId),
                }))
              }
            />
          </SectionEditWrapper>
        );

      case 'contact':
        return (
          <SectionEditWrapper key={`${secId}-${indexInVisible}`} {...wrapperProps}>
            <FooterSection
              config={templateState.config}
              footer={templateState.footer}
              submissions={submissions}
              deletedSubComponents={templateState.deletedSubComponents}
              isEditMode={isEditMode}
              onUpdateFooter={(nextFooter) =>
                commitTemplateChange((prev) => ({ ...prev, footer: nextFooter }))
              }
              onDeleteSubComponent={(compId: SubComponentId) =>
                commitTemplateChange(
                  (prev) => deleteSubComponent(prev, compId),
                  SUBCOMPONENT_LABELS[compId],
                  true
                )
              }
              onDeleteSubmission={handleDeleteSubmission}
              onOpenInquiry={() => handleOpenInquiry()}
            />
          </SectionEditWrapper>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#f3f5f8]">
      {/* Persistent Top Page Bar if Hero section was deleted or not on current page */}
      {!heroIsVisible && (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d10]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-12">
            <span className="font-serif-display text-[26px] text-white">
              {templateState.config.brandWordmark}
            </span>
            <nav aria-label="Page Navigation" className="flex flex-wrap items-center gap-4 text-[13px]">
              {templateState.pages.map((p) => (
                <div key={p.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTemplateState((prev) => ({ ...prev, activePageId: p.id }))}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      p.id === activePage?.id
                        ? 'bg-[#213f66] text-white font-semibold'
                        : 'text-[#9aa6b8] hover:text-white'
                    }`}
                  >
                    {p.title}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() =>
                        commitTemplateChange((prev) => deleteTemplatePage(prev, p.id))
                      }
                      aria-label={`Delete page ${p.title}`}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-rose-500/40 bg-rose-950/80 text-rose-300"
                    >
                      <Trash2 className="h-2.5 w-2.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button
                  type="button"
                  onClick={() =>
                    commitTemplateChange((prev) =>
                      addTemplatePage(prev, `Page ${prev.pages.length + 1}`)
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-[#7aa2d4]/50 bg-[#213f66]/45 px-3 py-1 text-[11px] font-medium text-white"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                  <span>Add Page</span>
                </button>
              )}
            </nav>
          </div>
        </header>
      )}

      <main>
        {visibleSections.length === 0 ? (
          <div className="mx-auto flex min-h-[75vh] max-w-xl flex-col items-center justify-center px-6 text-center">
            <Layers className="h-12 w-12 text-[#7aa2d4] mb-4" aria-hidden="true" />
            <h1 className="font-serif-display text-[38px] text-white">
              All Sections on This Page Have Been Deleted
            </h1>
            <p className="mt-2 text-[14px] text-[#9aa6b8]">
              Use the Pages & Components manager or click below to restore the just-deleted section or reset your template.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {history.past.length > 0 && (
                <button
                  type="button"
                  onClick={handleUndo}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-950/70 px-5 py-2.5 text-[13px] font-medium text-emerald-200 hover:bg-emerald-900"
                >
                  <Undo2 className="h-4 w-4" aria-hidden="true" />
                  <span>Restore Just Deleted</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleOpenCustomizer('pages')}
                className="rounded-full bg-[#213f66] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#2c5282]"
              >
                Open Pages & Components Manager
              </button>
              <button
                type="button"
                onClick={() =>
                  commitTemplateChange(DEFAULT_FULL_TEMPLATE, 'Reset template to factory defaults')
                }
                className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-medium text-white hover:border-white/40"
              >
                Reset All to Defaults
              </button>
            </div>
          </div>
        ) : (
          visibleSections.map((secId, idx) => renderSectionById(secId, idx))
        )}
      </main>

      {/* FLOATING DELETED ITEMS RESTORE BAR (When user has deleted sections or components) */}
      {isEditMode && totalDeletedCount > 0 && (
        <div className="mx-auto max-w-[1320px] px-6 pb-24">
          <div className="rounded-2xl border border-[#7aa2d4]/35 bg-[#11151c]/95 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="font-semibold text-[#7aa2d4]">
                Deleted Components & Sections ({totalDeletedCount}):
              </span>
              {templateState.deletedSections.map((secId) => (
                <button
                  key={secId}
                  type="button"
                  onClick={() => commitTemplateChange((prev) => restoreSection(prev, secId))}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-0.5 text-[11px] text-emerald-300 hover:bg-emerald-900"
                >
                  <span>+ Restore {SECTION_LABELS[secId]}</span>
                </button>
              ))}
              {templateState.deletedSubComponents.map((compId) => (
                <button
                  key={compId}
                  type="button"
                  onClick={() => commitTemplateChange((prev) => restoreSubComponent(prev, compId))}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-0.5 text-[11px] text-emerald-300 hover:bg-emerald-900"
                >
                  <span>+ Restore {SUBCOMPONENT_LABELS[compId]}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => commitTemplateChange((prev) => restoreAllDeleted(prev))}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-900/60 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-800 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>Restore All ({totalDeletedCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* INSTANT "JUST DELETED" RECOVERY TOAST ABOVE BOTTOM DOCK */}
      {justDeletedBanner && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-emerald-400/50 bg-[#11151c]/95 px-4 py-2 text-[12px] text-[#e5edf7] shadow-[0_16px_44px_rgba(0,0,0,0.85)] backdrop-blur-md"
        >
          <span className="truncate max-w-[260px] sm:max-w-sm">
            Deleted <strong className="text-white">{justDeletedBanner.label}</strong>
          </span>
          <button
            type="button"
            onClick={handleUndo}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 px-3 py-1 text-[11px] font-semibold text-emerald-200 hover:bg-emerald-500/35 hover:text-white whitespace-nowrap shrink-0"
          >
            <Undo2 className="h-3 w-3" aria-hidden="true" />
            <span>Restore / Undo</span>
          </button>
          <button
            type="button"
            onClick={() => setJustDeletedBanner(null)}
            aria-label="Dismiss deleted component notification"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[#9aa6b8] hover:text-white"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* FLOATING TEMPLATE EDITOR DOCK (Bottom-Center) */}
      <div
        role="region"
        aria-label="Editable Template Controls"
        className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#7aa2d4]/45 bg-[#11151c]/95 px-4 py-2 text-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-md"
      >
          <button
            type="button"
            onClick={() => setIsEditMode((prev) => !prev)}
            aria-pressed={isEditMode}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold transition-colors whitespace-nowrap shrink-0 ${
              isEditMode
                ? 'bg-[#213f66] text-white'
                : 'bg-white/8 text-[#c7d0dd] hover:text-white'
            }`}
          >
            <PencilLine className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
            <span>{isEditMode ? 'Inline Edit: ON' : 'Enable Inline Edit'}</span>
          </button>

          {/* Undo (Restore Just Deleted) & Redo Controls */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.past.length === 0}
            title={
              lastDeletionEntry
                ? `Undo / Restore ${lastDeletionEntry.actionLabel} (Ctrl+Z)`
                : 'Undo last edit (Ctrl+Z)'
            }
            aria-label="Undo last change or restore deleted component"
            className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-[#141820] px-3 py-1.5 font-medium text-[#dce4f0] hover:border-emerald-400/60 hover:text-white disabled:opacity-35 disabled:pointer-events-none whitespace-nowrap shrink-0"
          >
            <Undo2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span>Undo</span>
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={history.future.length === 0}
            title="Redo undone change (Ctrl+Y)"
            aria-label="Redo last undone change"
            className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-[#141820] px-3 py-1.5 font-medium text-[#dce4f0] hover:border-[#7aa2d4] hover:text-white disabled:opacity-35 disabled:pointer-events-none whitespace-nowrap shrink-0"
          >
            <Redo2 className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
            <span>Redo</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCustomizer('pages')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-[#141820] px-3.5 py-1.5 font-medium text-[#dce4f0] hover:border-[#7aa2d4] hover:text-white whitespace-nowrap shrink-0"
          >
            <Layers className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
            <span>Pages & Components</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCustomizer('hero')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-[#141820] px-3.5 py-1.5 font-medium text-[#dce4f0] hover:border-[#7aa2d4] hover:text-white whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
            <span>Studio Drawer</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCustomizer('export')}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-[#141820] px-3.5 py-1.5 font-medium text-[#dce4f0] hover:border-[#7aa2d4] hover:text-white whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() =>
              commitTemplateChange(DEFAULT_FULL_TEMPLATE, 'Reset template to factory defaults')
            }
            title="Reset template to factory defaults"
            aria-label="Reset template to defaults"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#141820] text-[#9aa6b8] hover:border-white/30 hover:text-white shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

      {/* INTERACTIVE MODALS & CUSTOMIZE DRAWER */}
      <ProjectCaseStudyModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onInquireSimilar={handleInquireFromCaseStudy}
      />

      <ProjectInquiryModal
        isOpen={inquiryModalOpen}
        relatedProject={inquiryContextProject}
        spotsAvailable={templateState.config.spotsAvailable}
        onClose={() => setInquiryModalOpen(false)}
        onSubmitBrief={handleSubmitBrief}
      />

      <ArticleReaderModal
        essay={activeEssay}
        signatureText={templateState.config.signatureText}
        onClose={() => setActiveEssay(null)}
      />

      <CustomizeTemplateDrawer
        isOpen={customizerOpen}
        initialTab={customizerTab}
        templateState={templateState}
        onUpdateTemplateState={(next, label, isDeletion) =>
          commitTemplateChange(next, label, isDeletion)
        }
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        lastDeletedLabel={lastDeletionEntry?.actionLabel || null}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClose={() => setCustomizerOpen(false)}
      />
    </div>
  );
}
