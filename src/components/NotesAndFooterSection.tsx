import React from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Plus, Trash2 } from 'lucide-react';
import {
  EssayItem,
  FooterConfig,
  ProjectBriefSubmission,
  SubComponentId,
  TemplateConfig,
} from '../data/portfolioData';
import { EditableText } from './EditableText';
import { DeleteSubComponentButton } from './SectionEditWrapper';

interface NotesSectionProps {
  essays: EssayItem[];
  isEditMode: boolean;
  onOpenEssay: (essay: EssayItem) => void;
  onUpdateEssay: (updated: EssayItem) => void;
  onAddEssay: () => void;
  onDeleteEssay: (essayId: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  essays,
  isEditMode,
  onOpenEssay,
  onUpdateEssay,
  onAddEssay,
  onDeleteEssay,
}) => {
  return (
    <section id="blog" aria-labelledby="notes-essays-heading" className="bg-[#0b0d10] py-24 px-6 md:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2
            id="notes-essays-heading"
            className="text-[12px] font-semibold tracking-[0.22em] uppercase text-[#7aa2d4]"
          >
            • EDUCATION
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#7f8c9f]">Academic Qualifications & Milestones</span>
            {isEditMode && (
              <button
                type="button"
                onClick={onAddEssay}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#7aa2d4]/50 bg-[#213f66]/45 px-3.5 py-1 text-[12px] font-medium text-white transition-colors hover:bg-[#213f66]"
              >
                <Plus className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
                <span>Add Education Entry</span>
              </button>
            )}
          </div>
        </div>
        <div className="mb-14 h-px w-full bg-white/15" />

        {essays.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#11151c]/50 p-12 text-center">
            <p className="text-[14px] text-[#9aa6b8]">All education entries have been deleted from this section.</p>
            <button
              type="button"
              onClick={onAddEssay}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#213f66] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#2c5282]"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add New Education Entry</span>
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-8 ${essays.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {essays.map((essay) => (
              <article
                key={essay.id}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#11151c] p-8 transition-colors duration-200 hover:border-[#5c85b8]/50 hover:bg-[#141820]"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#8d9ab0]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[#7aa2d4]">
                        <EditableText
                          value={essay.category}
                          onChange={(val) => onUpdateEssay({ ...essay, category: val })}
                          isEditMode={isEditMode}
                          ariaLabel="Essay Category"
                        />
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        <EditableText
                          value={essay.date}
                          onChange={(val) => onUpdateEssay({ ...essay, date: val })}
                          isEditMode={isEditMode}
                          ariaLabel="Essay Date"
                        />
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        <EditableText
                          value={essay.readTime}
                          onChange={(val) => onUpdateEssay({ ...essay, readTime: val })}
                          isEditMode={isEditMode}
                          ariaLabel="Essay Read Time"
                        />
                      </span>
                    </div>

                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => onDeleteEssay(essay.id)}
                        aria-label={`Delete essay ${essay.title}`}
                        className="inline-flex items-center gap-1 rounded border border-rose-500/35 bg-rose-950/50 px-2 py-0.5 text-[11px] text-rose-300 hover:border-rose-400"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>

                  <h3
                    className="font-serif-display mt-4 text-[30px] sm:text-[34px] leading-[1.15] font-normal text-white group-hover:text-[#9ec2f0] transition-colors"
                    style={{ textWrap: 'balance' }}
                  >
                    {isEditMode ? (
                      <EditableText
                        value={essay.title}
                        onChange={(val) => onUpdateEssay({ ...essay, title: val })}
                        isEditMode={isEditMode}
                        ariaLabel="Essay Title"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenEssay(essay)}
                        className="text-left focus:outline-none"
                      >
                        {essay.title}
                      </button>
                    )}
                  </h3>

                  <div className="mt-3 text-[15px] leading-[1.65] text-[#a2aebe]">
                    <EditableText
                      value={essay.excerpt}
                      onChange={(val) => onUpdateEssay({ ...essay, excerpt: val })}
                      isEditMode={isEditMode}
                      multiline
                      ariaLabel="Essay Excerpt"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenEssay(essay)}
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-white transition-colors hover:text-[#7aa2d4] whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-[#7aa2d4]" aria-hidden="true" />
                    <span>Read Full Essay</span>
                  </button>
                  <ArrowUpRight className="h-4 w-4 text-[#7aa2d4] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

interface FooterSectionProps {
  config: TemplateConfig;
  footer: FooterConfig;
  submissions: ProjectBriefSubmission[];
  deletedSubComponents: SubComponentId[];
  isEditMode: boolean;
  onUpdateFooter: (next: FooterConfig) => void;
  onDeleteSubComponent: (id: SubComponentId) => void;
  onDeleteSubmission: (submissionId: string) => void;
  onOpenInquiry: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  config,
  footer,
  submissions,
  deletedSubComponents,
  isEditMode,
  onUpdateFooter,
  onDeleteSubComponent,
  onDeleteSubmission,
  onOpenInquiry,
}) => {
  const isDeleted = (id: SubComponentId) => deletedSubComponents.includes(id);

  return (
    <footer id="contact" className="bg-[#0b0d10] pt-12 pb-24 px-6 md:px-12 border-t border-white/10">
      <div className="mx-auto max-w-[1320px]">
        {/* Navy Gradient CTA Card */}
        {!isDeleted('footer-cta-banner') && (
          <div className="relative overflow-hidden rounded-3xl border border-[#4a6f9e]/35 bg-gradient-to-br from-[#213f66] via-[#1b3558] to-[#152a47] p-10 sm:p-16 shadow-[0_32px_90px_rgba(0,0,0,0.65)]">
            {isEditMode && (
              <div className="mb-4 flex justify-end">
                <DeleteSubComponentButton
                  subComponentId="footer-cta-banner"
                  isEditMode={isEditMode}
                  onDelete={onDeleteSubComponent}
                />
              </div>
            )}
            <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <div
                  className="text-[12px] font-semibold tracking-[0.22em] uppercase text-[#9ec2f0]"
                  data-testid="footer-spots-banner"
                >
                  •{' '}
                  <EditableText
                    value={footer.availabilityPrefix}
                    onChange={(val) => onUpdateFooter({ ...footer, availabilityPrefix: val })}
                    isEditMode={isEditMode}
                    ariaLabel="Footer Availability Prefix"
                  />{' '}
                  ({config.spotsAvailable} {config.spotsAvailable === 1 ? 'SPOT' : 'SPOTS'} LEFT)
                </div>
                <h2
                  className="font-serif-display mt-4 text-[40px] sm:text-[54px] leading-[1.04] font-normal text-white"
                  style={{ textWrap: 'balance' }}
                >
                  <EditableText
                    value={footer.headline}
                    onChange={(val) => onUpdateFooter({ ...footer, headline: val })}
                    isEditMode={isEditMode}
                    ariaLabel="Footer CTA Headline"
                  />
                </h2>
                <div className="mt-4 max-w-xl text-[15px] leading-[1.65] text-[#cbd7e8]">
                  <EditableText
                    value={footer.subcopy}
                    onChange={(val) => onUpdateFooter({ ...footer, subcopy: val })}
                    isEditMode={isEditMode}
                    multiline
                    ariaLabel="Footer Subcopy"
                  />
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={onOpenInquiry}
                  className="group inline-flex items-center gap-3.5 rounded-full bg-white py-2.5 pr-7 pl-2.5 text-[14px] font-semibold text-[#0b0d10] shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition-all duration-200 hover:bg-[#e5ecf6] whitespace-nowrap shrink-0"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b0d10] text-white transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>{footer.ctaLabel}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Project Brief Submissions Log (persisted in localStorage) */}
        {!isDeleted('footer-submissions-ledger') && (
          <div className="mt-16 rounded-2xl border border-white/10 bg-[#11151c] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif-display text-[24px] font-normal text-white">
                  Recent Project Brief Submissions
                </h3>
                <p className="text-[13px] text-[#8d9ab0]">
                  Live studio inquiry ledger persisted in browser storage
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-[#7aa2d4] tabular-nums">
                  {submissions.length} {submissions.length === 1 ? 'Brief Logged' : 'Briefs Logged'}
                </span>
                <DeleteSubComponentButton
                  subComponentId="footer-submissions-ledger"
                  isEditMode={isEditMode}
                  onDelete={onDeleteSubComponent}
                />
              </div>
            </div>

            <div className="mt-6 divide-y divide-white/8" data-testid="submissions-list">
              {submissions.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[13px]">
                      <span className="font-semibold text-white">{item.name}</span>
                      <span aria-hidden="true" className="text-[#6c7a8e]">·</span>
                      <span className="text-[#9aa6b8]">{item.company || 'Independent Founder'}</span>
                      <span aria-hidden="true" className="text-[#6c7a8e]">·</span>
                      <span className="text-[#7aa2d4]">{item.budgetRange}</span>
                      <span aria-hidden="true" className="text-[#6c7a8e]">·</span>
                      <span className="text-[#8d9ab0]">{item.timeline}</span>
                    </div>
                    <p className="mt-1.5 text-[14px] text-[#c7d0dd]">{item.projectGoals}</p>
                    {item.relatedProject && (
                      <p className="mt-1 text-[12px] text-[#7aa2d4]">
                        Reference Case Study: {item.relatedProject}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[12px] text-[#7f8c9f] whitespace-nowrap">
                      {item.submittedAt}
                    </span>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => onDeleteSubmission(item.id)}
                        aria-label={`Delete brief from ${item.name}`}
                        className="inline-flex items-center gap-1 rounded border border-rose-500/35 bg-rose-950/60 px-2 py-0.5 text-[11px] text-rose-300 hover:bg-rose-900"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Studio Copyright & Links */}
        {!isDeleted('footer-copyright') && (
          <div className="mt-14 flex flex-col items-center justify-between gap-4 pt-8 border-t border-white/10 text-[13px] text-[#7f8c9f] sm:flex-row">
            <div className="flex items-center gap-4">
              <span className="font-serif-display text-[22px] text-white">{config.brandWordmark}</span>
              <span>© {new Date().getFullYear()} Studio {config.signatureText}. All rights reserved.</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#works" className="hover:text-white transition-colors">Selected Works</a>
              <a href="#blog" className="hover:text-white transition-colors">Notes & Essays</a>
              <button
                type="button"
                onClick={onOpenInquiry}
                className="text-[#7aa2d4] hover:text-white transition-colors"
              >
                Begin a project
              </button>
              <DeleteSubComponentButton
                subComponentId="footer-copyright"
                isEditMode={isEditMode}
                onDelete={onDeleteSubComponent}
              />
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};
