import React from 'react';
import { ArrowLeftRight, ArrowUpRight, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { PRESET_IMAGES, ProcessStepItem, ProjectItem } from '../data/portfolioData';
import { EditableText } from './EditableText';

interface HowWeWorkSectionProps {
  processSteps: ProcessStepItem[];
  projects: ProjectItem[];
  isEditMode: boolean;
  onUpdateProcessSteps: (next: ProcessStepItem[]) => void;
  onOpenProject: (project: ProjectItem) => void;
}

export const HowWeWorkSection: React.FC<HowWeWorkSectionProps> = ({
  processSteps,
  projects,
  isEditMode,
  onUpdateProcessSteps,
  onOpenProject,
}) => {
  const handleShowcaseClick = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId) || projects[0];
    if (project) onOpenProject(project);
  };

  const updateStep = (index: number, patch: Partial<ProcessStepItem>) => {
    const next = processSteps.map((step, i) => (i === index ? { ...step, ...patch } : step));
    onUpdateProcessSteps(next);
  };

  const addProcessStep = () => {
    const nextNum = String(processSteps.length + 1).padStart(2, '0') + '.';
    const newStep: ProcessStepItem = {
      id: `step-${Date.now()}`,
      number: nextNum,
      title: 'Refining & Scaling Post-Launch',
      description:
        'We partner with your product team post-launch to measure real-world retention, fine-tune micro-interactions, and expand your component library.',
      projectId: projects[0]?.id || 'mode-partners',
      showcaseTitle: projects[0]?.title || 'Flagship Product',
      showcaseMeta: 'Continuous Iteration · Design Ops · 2026',
      showcaseImage: PRESET_IMAGES[processSteps.length % PRESET_IMAGES.length].url,
      imageLeft: processSteps.length % 2 === 0,
    };
    onUpdateProcessSteps([...processSteps, newStep]);
  };

  const removeProcessStep = (index: number) => {
    onUpdateProcessSteps(processSteps.filter((_, i) => i !== index));
  };

  const cyclePresetImage = (index: number) => {
    const currentUrl = processSteps[index].showcaseImage;
    const currentIdx = PRESET_IMAGES.findIndex((p) => p.url === currentUrl);
    const nextPreset = PRESET_IMAGES[(currentIdx + 1) % PRESET_IMAGES.length];
    updateStep(index, { showcaseImage: nextPreset.url });
  };

  return (
    <section aria-labelledby="how-we-work-heading" className="bg-[#0b0d10] py-24 px-6 md:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header + full-width 1px divider */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2
            id="how-we-work-heading"
            className="text-[12px] font-semibold tracking-[0.22em] uppercase text-[#7aa2d4]"
          >
            • EDUCATION
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#7f8c9f]">
              01 — {String(processSteps.length).padStart(2, '0')} Education & Academic Credentials
            </span>
            {isEditMode && (
              <button
                type="button"
                onClick={addProcessStep}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#7aa2d4]/60 bg-[#213f66]/50 px-3.5 py-1 text-[12px] font-medium text-white hover:bg-[#213f66]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add Education Step</span>
              </button>
            )}
          </div>
        </div>
        <div className="mb-20 h-px w-full bg-white/15" />

        {/* Alternating 2-column rows */}
        <div className="flex flex-col gap-24">
          {processSteps.map((step, index) => {
            const showcaseCard = (
              <div className="relative">
                <div
                  onClick={() => !isEditMode && handleShowcaseClick(step.projectId)}
                  role={!isEditMode ? 'button' : undefined}
                  tabIndex={!isEditMode ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (!isEditMode && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleShowcaseClick(step.projectId);
                    }
                  }}
                  className="group relative block w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#11151c] text-left shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-all duration-300 hover:border-[#5c85b8]/50 cursor-pointer"
                >
                  <img
                    src={step.showcaseImage}
                    alt={step.showcaseTitle}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/95 to-transparent pt-14 pb-5 px-6 flex flex-col justify-end">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-[12px] text-[#9aa6b8]">
                          <EditableText
                            value={step.showcaseMeta}
                            onChange={(val) => updateStep(index, { showcaseMeta: val })}
                            isEditMode={isEditMode}
                            ariaLabel={`Step ${index + 1} showcase metadata`}
                          />
                        </div>
                        <div className="font-serif-display mt-0.5 text-[24px] leading-tight text-white">
                          <EditableText
                            value={step.showcaseTitle}
                            onChange={(val) => updateStep(index, { showcaseTitle: val })}
                            isEditMode={isEditMode}
                            ariaLabel={`Step ${index + 1} showcase title`}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleShowcaseClick(step.projectId)}
                        aria-label={`Open ${step.showcaseTitle} case study`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#11151c]/90 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[#7aa2d4]"
                      >
                        <ArrowUpRight className="h-4 w-4 text-[#7aa2d4]" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {isEditMode && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => cyclePresetImage(index)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#141820] px-3 py-1.5 text-[12px] text-[#dce4f0] hover:border-[#7aa2d4]"
                    >
                      <ImageIcon className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
                      <span>Switch Showcase Artwork</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStep(index, { imageLeft: !step.imageLeft })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#141820] px-3 py-1.5 text-[12px] text-[#dce4f0] hover:border-[#7aa2d4]"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
                      <span>Swap Left/Right Column</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProcessStep(index)}
                      aria-label={`Delete step ${step.title}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-1.5 text-[12px] text-rose-300 hover:border-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Delete Step</span>
                    </button>
                  </div>
                )}
              </div>
            );

            const copyColumn = (
              <div className="flex flex-col justify-center">
                <div className="metric-numeral text-[72px] sm:text-[82px] leading-none font-normal text-[#5c85b8]">
                  <EditableText
                    value={step.number}
                    onChange={(val) => updateStep(index, { number: val })}
                    isEditMode={isEditMode}
                    ariaLabel={`Step ${index + 1} number`}
                  />
                </div>
                <h3
                  className="font-serif-display mt-4 text-[34px] sm:text-[42px] leading-[1.1] font-normal text-white"
                  style={{ textWrap: 'balance' }}
                >
                  <EditableText
                    value={step.title}
                    onChange={(val) => updateStep(index, { title: val })}
                    isEditMode={isEditMode}
                    ariaLabel={`Step ${index + 1} title`}
                  />
                </h3>
                <div className="mt-3 text-[13px] font-semibold tracking-[0.04em] text-[#8eb4e6]">
                  <EditableText
                    value={step.showcaseMeta}
                    onChange={(val) => updateStep(index, { showcaseMeta: val })}
                    isEditMode={isEditMode}
                    ariaLabel={`Step ${index + 1} credential`}
                  />
                </div>
                {step.description && step.description !== step.showcaseMeta && (
                  <div className="mt-4 max-w-[52ch] text-[15px] sm:text-[16px] leading-[1.7] text-[#a9b4c4]">
                    <EditableText
                      value={step.description}
                      onChange={(val) => updateStep(index, { description: val })}
                      isEditMode={isEditMode}
                      multiline
                      ariaLabel={`Step ${index + 1} description`}
                    />
                  </div>
                )}
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={() => handleShowcaseClick(step.projectId)}
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-[#7aa2d4] underline decoration-[#5c85b8]/50 underline-offset-4 transition-colors hover:text-white whitespace-nowrap shrink-0"
                  >
                    <span>Explore {step.showcaseTitle} Case Study</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );

            return (
              <div
                key={step.id || step.number}
                className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
              >
                {step.imageLeft ? (
                  <>
                    <div className="lg:col-span-7">{showcaseCard}</div>
                    <div className="lg:col-span-5">{copyColumn}</div>
                  </>
                ) : (
                  <>
                    <div className="order-2 lg:order-1 lg:col-span-5">{copyColumn}</div>
                    <div className="order-1 lg:order-2 lg:col-span-7">{showcaseCard}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
