import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ImagePlus,
  MapPin,
  Pause,
  PencilLine,
  Play,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  HERO_PORTRAIT_PATH,
  ProjectItem,
  SubComponentId,
  TemplateConfig,
  TemplatePage,
} from '../data/portfolioData';
import { buildOrbitRingCards } from '../utils/portfolioLogic';
import { CutoutPortrait } from './CutoutPortrait';
import { EditableText } from './EditableText';
import { DeleteSubComponentButton } from './SectionEditWrapper';

interface HeroSectionProps {
  config: TemplateConfig;
  projects: ProjectItem[];
  pages: TemplatePage[];
  activePageId: string;
  deletedSubComponents: SubComponentId[];
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onUpdateConfig: (next: TemplateConfig) => void;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
  onRenamePage: (pageId: string, nextTitle: string) => void;
  onDeleteSubComponent: (id: SubComponentId) => void;
  onOpenProject: (project: ProjectItem) => void;
  onOpenInquiry: (contextProjectTitle?: string) => void;
  onOpenCustomizer: (initialTab?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  projects,
  pages,
  activePageId,
  deletedSubComponents,
  isEditMode,
  onToggleEditMode,
  onUpdateConfig,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onRenamePage,
  onDeleteSubComponent,
  onOpenProject,
  onOpenInquiry,
  onOpenCustomizer,
}) => {
  const [ringPaused, setRingPaused] = useState(false);
  const [ringHovered, setRingHovered] = useState(false);
  const portraitInputRef = useRef<HTMLInputElement | null>(null);

  const isOrbitPaused = ringPaused || ringHovered;
  const ringCards = buildOrbitRingCards(projects);
  const isDeleted = (id: SubComponentId) => deletedSubComponents.includes(id);

  const handleCardClick = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId) || projects[0];
    if (found) onOpenProject(found);
  };

  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateConfig({ ...config, heroPortraitUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section
      id="about"
      className="relative min-h-[820px] md:h-screen md:max-h-[980px] w-full overflow-hidden bg-[#0b0d10] text-[#f3f5f8] flex flex-col justify-between"
    >
      {/* Subtle top studio vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(33,63,102,0.22)_0%,rgba(11,13,16,0.92)_68%,#0b0d10_100%)]"
      />

      {/* TOP HEADER BAR (z-40) */}
      <header className="pointer-events-none relative z-40 mx-auto flex w-full max-w-[1440px] flex-wrap items-start justify-between gap-6 px-6 pt-7 pb-3 md:px-12">
        {/* Left: Serif brand wordmark */}
        <div className="pointer-events-auto font-serif-display text-[28px] leading-none font-medium tracking-tight text-[#f3f5f8] whitespace-nowrap shrink-0">
          {isEditMode ? (
            <EditableText
              value={config.brandWordmark}
              onChange={(val) => onUpdateConfig({ ...config, brandWordmark: val })}
              isEditMode={isEditMode}
              ariaLabel="Brand Wordmark"
            />
          ) : (
            <a href="#about" className="hover:text-[#7aa2d4] transition-colors">
              {config.brandWordmark}
            </a>
          )}
        </div>

        {/* Center-Left Metadata Strip */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-[#c7d0dd]/90">
          {!isDeleted('hero-availability') && (
            <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
              <span className="h-2 w-2 rounded-full bg-[#5c85b8] shadow-[0_0_10px_#5c85b8]" aria-hidden="true" />
              <span>Taking on new projects: </span>
              {isEditMode ? (
                <span className="inline-flex items-center gap-1 rounded border border-dashed border-[#7aa2d4]/60 bg-[#213f66]/25 px-1.5 py-0.5 text-white">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    aria-label="Open Project Spots"
                    value={config.spotsAvailable}
                    onChange={(e) =>
                      onUpdateConfig({
                        ...config,
                        spotsAvailable: Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="w-10 bg-transparent text-center font-semibold text-white focus:outline-none"
                  />
                  <span>Spots</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenInquiry()}
                  className="font-medium text-white underline decoration-[#7aa2d4] underline-offset-4 hover:text-[#7aa2d4]"
                >
                  {config.spotsAvailable} {config.spotsAvailable === 1 ? 'Spot' : 'Spots'}
                </button>
              )}
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => onDeleteSubComponent('hero-availability')}
                  title="Delete Header Availability Status"
                  aria-label="Delete Header Availability Status"
                  className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-rose-500/40 bg-rose-950/75 text-rose-300 hover:bg-rose-900 hover:text-white"
                >
                  <Trash2 className="h-2.5 w-2.5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {!isDeleted('hero-location') && (
            <div className="flex items-center gap-2 text-[#9aa6b8] whitespace-nowrap shrink-0">
              <MapPin className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
              <EditableText
                value={config.location}
                onChange={(val) => onUpdateConfig({ ...config, location: val })}
                isEditMode={isEditMode}
                ariaLabel="Studio Location"
              />
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => onDeleteSubComponent('hero-location')}
                  title="Delete Studio Location"
                  aria-label="Delete Header Studio Location"
                  className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-rose-500/40 bg-rose-950/75 text-rose-300 hover:bg-rose-900 hover:text-white"
                >
                  <Trash2 className="h-2.5 w-2.5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {/* Inline Edit Mode Toggle */}
            <button
              type="button"
              onClick={onToggleEditMode}
              aria-pressed={isEditMode}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                isEditMode
                  ? 'border-[#7aa2d4] bg-[#213f66] text-white shadow-[0_0_20px_rgba(92,133,184,0.4)]'
                  : 'border-white/15 bg-[#11151c]/90 text-[#dce4f0] hover:border-[#5c85b8]/60 hover:text-white'
              }`}
            >
              <PencilLine className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
              <span>{isEditMode ? 'Exit Inline Edit' : 'Edit Inline'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenCustomizer('pages')}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-[#11151c]/90 px-3.5 py-1.5 text-[12px] font-medium text-[#dce4f0] transition-colors hover:border-[#5c85b8]/60 hover:bg-[#171d26] hover:text-white whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
              <span>Customize Template</span>
            </button>

            {!isDeleted('hero-orbit-ring') && (
              <button
                type="button"
                onClick={() => setRingPaused((prev) => !prev)}
                aria-pressed={ringPaused}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#11151c]/75 px-3 py-1.5 text-[12px] font-medium text-[#b5c0d0] transition-colors hover:border-white/25 hover:text-white whitespace-nowrap shrink-0"
              >
                {ringPaused ? (
                  <>
                    <Play className="h-3 w-3 text-[#7aa2d4]" aria-hidden="true" />
                    <span>Resume Ring</span>
                  </>
                ) : (
                  <>
                    <Pause className="h-3 w-3 text-[#7aa2d4]" aria-hidden="true" />
                    <span>Pause Ring</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Multi-Page Navigation Links (with Add/Delete Page in Edit Mode) */}
        <nav aria-label="Primary Navigation" className="pointer-events-auto flex flex-row flex-wrap gap-4 md:flex-col md:items-end md:gap-1.5 text-[14px]">
          {pages.map((page) => {
            const isActive = page.id === activePageId;
            return (
              <div key={page.id} className="flex items-center gap-1.5">
                {isEditMode ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelectPage(page.id)}
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-[#213f66] text-white font-semibold' : 'text-[#9aa6b8] hover:text-white'
                      }`}
                    >
                      View
                    </button>
                    <EditableText
                      value={page.title}
                      onChange={(val) => onRenamePage(page.id, val)}
                      isEditMode={isEditMode}
                      ariaLabel={`Page ${page.title}`}
                      className={isActive ? 'font-medium text-white' : 'text-[#9aa6b8]'}
                    />
                    <button
                      type="button"
                      onClick={() => onDeletePage(page.id)}
                      title={`Delete page ${page.title}`}
                      aria-label={`Delete page ${page.title}`}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-rose-500/40 bg-rose-950/80 text-rose-300 hover:bg-rose-900 hover:text-white"
                    >
                      <Trash2 className="h-2.5 w-2.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <a
                    href={page.slug}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectPage(page.id);
                    }}
                    className={`transition-colors whitespace-nowrap shrink-0 ${
                      isActive ? 'font-medium text-white' : 'text-[#9aa6b8] hover:text-white'
                    }`}
                  >
                    {page.title}
                  </a>
                )}
              </div>
            );
          })}

          {isEditMode && (
            <button
              type="button"
              onClick={onAddPage}
              className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#7aa2d4]/50 bg-[#213f66]/45 px-2.5 py-0.5 text-[11px] font-medium text-white hover:bg-[#213f66] whitespace-nowrap shrink-0"
            >
              <Plus className="h-3 w-3 text-[#7aa2d4]" aria-hidden="true" />
              <span>Add Page</span>
            </button>
          )}
        </nav>
      </header>

      {/* 3D CURVED PANORAMIC PROJECT RING (Background Layer, z-10) */}
      {!isDeleted('hero-orbit-ring') && isEditMode && (
        <div className="absolute top-[19%] left-6 z-40 md:left-12">
          <DeleteSubComponentButton
            subComponentId="hero-orbit-ring"
            isEditMode={isEditMode}
            onDelete={onDeleteSubComponent}
          />
        </div>
      )}
      {!isDeleted('hero-orbit-ring') && (
        <div
          className="pointer-events-auto absolute inset-x-0 top-[15%] z-10 flex h-[260px] items-center justify-center overflow-visible"
          style={{
            perspective: '1500px',
            perspectiveOrigin: '50% 46%',
          }}
          onMouseEnter={() => setRingHovered(true)}
          onMouseLeave={() => setRingHovered(false)}
          data-testid="panoramic-project-ring"
        >

          <div className={`orbit-ring relative h-[166px] w-[270px] ${isOrbitPaused ? 'paused' : ''}`}>
            {ringCards.map((card, index) => {
              const angle = index * 36;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleCardClick(card.projectId)}
                  aria-label={`Inspect ${card.title} case study`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(-840px)`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  className="group absolute inset-0 h-[166px] w-[270px] cursor-pointer overflow-hidden rounded-xl border border-white/15 bg-[#11151c] text-left shadow-[0_18px_40px_rgba(0,0,0,0.65)] transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7aa2d4]"
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/90 to-transparent pt-7 pb-2.5 px-3.5 flex flex-col justify-end">
                    <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#7aa2d4]">
                      {card.subtitle}
                    </span>
                    <span className="font-serif-display text-[16px] leading-tight font-medium text-white">
                      {card.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CENTRAL CUTOUT PORTRAIT OF MARVEL METAL ULTRON (Foreground Layer, z-20) */}
      {!isDeleted('hero-portrait') && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1440px] flex-col items-center justify-end px-4">
          <CutoutPortrait
            src={config.heroPortraitUrl || HERO_PORTRAIT_PATH}
            alt="Hero subject studio portrait"
            enableCutout={config.enableCutout}
            className="w-full max-w-[650px] aspect-[3/4] max-h-[82vh]"
          />

          {/* In Edit Mode: Floating Portrait, Cutout & Delete Controls */}
          {isEditMode && (
            <div className="pointer-events-auto absolute bottom-20 z-40 flex flex-wrap items-center gap-2 rounded-full border border-[#7aa2d4]/60 bg-[#11151c]/95 px-4 py-1.5 text-[12px] shadow-2xl backdrop-blur-md">
              <input
                ref={portraitInputRef}
                type="file"
                accept="image/*"
                onChange={handlePortraitUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => portraitInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#7aa2d4]"
              >
                <ImagePlus className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
                <span>Upload Portrait</span>
              </button>
              <span className="text-white/20">|</span>
              <button
                type="button"
                onClick={() => onUpdateConfig({ ...config, enableCutout: !config.enableCutout })}
                className="inline-flex items-center gap-1.5 font-medium text-[#9ec2f0] hover:text-white"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
                <span>Cutout: {config.enableCutout ? 'ON' : 'OFF'}</span>
              </button>
              <span className="text-white/20">|</span>
              <button
                type="button"
                onClick={() => onDeleteSubComponent('hero-portrait')}
                aria-label="Delete Central Cutout Subject Portrait"
                className="inline-flex items-center gap-1 font-medium text-rose-300 hover:text-rose-200"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Delete Portrait</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM OVERLAYS (z-30) */}
      <div className="pointer-events-none relative z-30 mx-auto mt-auto flex w-full max-w-[1440px] flex-col justify-between gap-8 px-6 pb-8 md:flex-row md:items-end md:px-12 md:pb-10">
        {/* Bottom-Left: Kicker, Display Headline, Primary CTA */}
        {!isDeleted('hero-bottom-left') ? (
          <div className="pointer-events-auto max-w-xl">
            {isEditMode && (
              <div className="mb-2">
                <DeleteSubComponentButton
                  subComponentId="hero-bottom-left"
                  isEditMode={isEditMode}
                  onDelete={onDeleteSubComponent}
                />
              </div>
            )}
            <div className="mb-2.5 text-[12px] font-semibold tracking-[0.22em] uppercase text-[#7aa2d4]">
              <EditableText
                value={config.heroKicker}
                onChange={(val) => onUpdateConfig({ ...config, heroKicker: val })}
                isEditMode={isEditMode}
                ariaLabel="Hero Kicker"
              />
            </div>
            <h1 className="font-serif-display text-[52px] sm:text-[68px] leading-[0.98] font-normal tracking-[-0.02em] text-white">
              <span className="block">
                <EditableText
                  value={config.headlineLine1}
                  onChange={(val) => onUpdateConfig({ ...config, headlineLine1: val })}
                  isEditMode={isEditMode}
                  ariaLabel="Headline Line 1"
                />
              </span>
              <span className="block mt-1">
                <EditableText
                  value={config.headlineLine2}
                  onChange={(val) => onUpdateConfig({ ...config, headlineLine2: val })}
                  isEditMode={isEditMode}
                  ariaLabel="Headline Line 2"
                />
              </span>
            </h1>

            {!isDeleted('hero-cta-button') && (
              <div className="mt-6 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenInquiry()}
                  className="group inline-flex items-center gap-3.5 rounded-full bg-white py-2 pr-6 pl-2 text-[14px] font-semibold text-[#0b0d10] shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all duration-200 hover:bg-[#e5ecf6] active:scale-[0.99] whitespace-nowrap shrink-0"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b0d10] text-white transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>Begin a project</span>
                </button>
                {isEditMode && (
                  <DeleteSubComponentButton
                    subComponentId="hero-cta-button"
                    isEditMode={isEditMode}
                    onDelete={onDeleteSubComponent}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div />
        )}

        {/* Bottom-Right: Italic serif blockquote + script signature */}
        {!isDeleted('hero-bottom-right') && (
          <div className="pointer-events-auto max-w-[360px] md:text-left">
            {isEditMode && (
              <div className="mb-2">
                <DeleteSubComponentButton
                  subComponentId="hero-bottom-right"
                  isEditMode={isEditMode}
                  onDelete={onDeleteSubComponent}
                />
              </div>
            )}
            <div className="font-serif-display text-[21px] leading-[1.36] italic text-[#e3e9f2]/95">
              “
              <EditableText
                value={config.missionQuote}
                onChange={(val) => onUpdateConfig({ ...config, missionQuote: val })}
                isEditMode={isEditMode}
                multiline
                ariaLabel="Mission Quote"
              />
              ”
            </div>
            <div
              className="font-signature mt-2.5 text-[36px] leading-none text-[#7aa2d4] pb-1"
              aria-label={`Signature ${config.signatureText}`}
            >
              <EditableText
                value={config.signatureText}
                onChange={(val) => onUpdateConfig({ ...config, signatureText: val })}
                isEditMode={isEditMode}
                ariaLabel="Signature Text"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
