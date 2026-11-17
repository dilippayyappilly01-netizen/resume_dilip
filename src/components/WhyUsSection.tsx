import React, { useEffect, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  DEFAULT_WHY_US_BULLETINS,
  SubComponentId,
  WhyUsBulletinItem,
  WhyUsConfig,
  WhyUsMetricItem,
} from '../data/portfolioData';
import { interpolateMetricValue, removeWhyUsMetric } from '../utils/portfolioLogic';
import { EditableText } from './EditableText';
import { DeleteSubComponentButton } from './SectionEditWrapper';

interface WhyUsSectionProps {
  whyUs: WhyUsConfig;
  signatureText: string;
  deletedSubComponents: SubComponentId[];
  isEditMode: boolean;
  onUpdateWhyUs: (next: WhyUsConfig) => void;
  onUpdateSignature: (nextSig: string) => void;
  onDeleteSubComponent: (id: SubComponentId) => void;
  onOpenCustomizer?: (tab: string) => void;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({
  whyUs,
  signatureText,
  deletedSubComponents,
  isEditMode,
  onUpdateWhyUs,
  onUpdateSignature,
  onDeleteSubComponent,
  onOpenCustomizer,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [elapsedMs, setElapsedMs] = useState(1100);
  const hasAnimatedRef = useRef(false);

  const bulletins: WhyUsBulletinItem[] = Array.isArray(whyUs.bulletins)
    ? whyUs.bulletins
    : DEFAULT_WHY_US_BULLETINS;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          const duration = 1100;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            if (elapsed < duration) {
              setElapsedMs(elapsed);
              requestAnimationFrame(tick);
            } else {
              setElapsedMs(duration);
            }
          };

          setElapsedMs(0);
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const updateMetricById = (id: string, patch: Partial<WhyUsMetricItem>) => {
    const nextMetrics = whyUs.metrics.map((m) => (m.id === id ? { ...m, ...patch } : m));
    onUpdateWhyUs({ ...whyUs, metrics: nextMetrics });
  };

  const handleDeleteMetric = (id: string) => {
    onUpdateWhyUs({
      ...whyUs,
      metrics: removeWhyUsMetric(whyUs.metrics, id),
    });
  };

  const updateBulletinById = (id: string, patch: Partial<WhyUsBulletinItem>) => {
    const nextBulletins = bulletins.map((b) => (b.id === id ? { ...b, ...patch } : b));
    onUpdateWhyUs({ ...whyUs, bulletins: nextBulletins });
  };

  const handleDeleteBulletin = (id: string) => {
    onUpdateWhyUs({
      ...whyUs,
      bulletins: bulletins.filter((b) => b.id !== id),
    });
  };

  const handleAddBulletin = () => {
    const newBulletin: WhyUsBulletinItem = {
      id: `bulletin-${Date.now()}`,
      title: 'New Leadership Bulletin',
      description: 'Click to edit this bulletin highlight description directly on the page.',
    };
    onUpdateWhyUs({
      ...whyUs,
      bulletins: [...bulletins, newBulletin],
    });
  };

  const leftMetrics = whyUs.metrics.filter((_, idx) => idx % 2 === 0);
  const rightMetrics = whyUs.metrics.filter((_, idx) => idx % 2 === 1);
  const archDeleted = deletedSubComponents.includes('whyus-arch');

  const renderMetricCard = (m: WhyUsMetricItem, isRightSide: boolean, isBottom: boolean) => {
    const animatedVal = interpolateMetricValue(m.targetNumber, elapsedMs, 1100);

    return (
      <div
        key={m.id}
        className={`relative w-full ${isRightSide ? 'lg:flex lg:flex-col lg:items-end' : ''}`}
      >
        {isEditMode ? (
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-dashed border-[#7aa2d4]/60 bg-[#141820]/90 p-2.5">
            <input
              type="text"
              value={m.prefix}
              onChange={(e) => updateMetricById(m.id, { prefix: e.target.value })}
              aria-label={`Metric ${m.label} prefix`}
              placeholder="$"
              className="w-8 rounded border border-white/15 bg-[#0b0d10] px-1.5 py-1 text-center text-[14px] text-white"
            />
            <input
              type="number"
              value={m.targetNumber}
              onChange={(e) => updateMetricById(m.id, { targetNumber: parseInt(e.target.value, 10) || 0 })}
              aria-label={`Metric ${m.label} target value`}
              className="w-20 rounded border border-white/15 bg-[#0b0d10] px-2 py-1 text-center font-serif-display text-[24px] text-white"
            />
            <input
              type="text"
              value={m.suffix}
              onChange={(e) => updateMetricById(m.id, { suffix: e.target.value })}
              aria-label={`Metric ${m.label} suffix`}
              placeholder="+"
              className="w-12 rounded border border-white/15 bg-[#0b0d10] px-1.5 py-1 text-center text-[14px] text-white"
            />
            <button
              type="button"
              onClick={() => handleDeleteMetric(m.id)}
              title="Delete this metric callout"
              aria-label={`Delete metric ${m.label}`}
              className="ml-1 inline-flex items-center gap-1 rounded-lg border border-rose-500/45 bg-rose-950/75 px-2 py-1 text-[11px] text-rose-200 hover:bg-rose-900 hover:text-white"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        ) : (
          <div className="metric-numeral text-[52px] sm:text-[60px] leading-none font-normal text-white">
            {m.prefix}
            {animatedVal}
            {m.suffix}
          </div>
        )}

        {(m.title || isEditMode) && (
          <div className="mt-2.5 max-w-[320px] font-serif-display text-[22px] leading-snug font-medium text-[#8eb4e6]">
            <EditableText
              value={m.title || 'Callout Title'}
              onChange={(val) => updateMetricById(m.id, { title: val })}
              isEditMode={isEditMode}
              ariaLabel={`Metric title ${m.title || m.label}`}
            />
          </div>
        )}

        <div className="mt-1.5 max-w-[320px] text-[12px] font-medium tracking-[0.04em] leading-relaxed text-[#b8c4d6]">
          <EditableText
            value={m.label}
            onChange={(val) => updateMetricById(m.id, { label: val })}
            isEditMode={isEditMode}
            multiline
            ariaLabel={`Metric label ${m.label}`}
          />
        </div>

        {/* 45-degree angled SVG underline */}
        <svg
          className="mt-3 h-8 w-full max-w-[330px] overflow-visible"
          viewBox="0 0 330 32"
          fill="none"
          aria-hidden="true"
        >
          {!isRightSide ? (
            isBottom ? (
              <>
                <path d="M 0 28 L 292 28 L 316 4" stroke="#668fc2" strokeOpacity="0.65" strokeWidth="1.25" />
                <rect x="313" y="1" width="6" height="6" fill="#0b0d10" stroke="#668fc2" strokeWidth="1.4" />
              </>
            ) : (
              <>
                <path d="M 0 4 L 292 4 L 316 28" stroke="#668fc2" strokeOpacity="0.65" strokeWidth="1.25" />
                <rect x="313" y="25" width="6" height="6" fill="#0b0d10" stroke="#668fc2" strokeWidth="1.4" />
              </>
            )
          ) : isBottom ? (
            <>
              <path d="M 330 28 L 38 28 L 14 4" stroke="#668fc2" strokeOpacity="0.65" strokeWidth="1.25" />
              <rect x="11" y="1" width="6" height="6" fill="#0b0d10" stroke="#668fc2" strokeWidth="1.4" />
            </>
          ) : (
            <>
              <path d="M 330 4 L 38 4 L 14 28" stroke="#668fc2" strokeOpacity="0.65" strokeWidth="1.25" />
              <rect x="11" y="25" width="6" height="6" fill="#0b0d10" stroke="#668fc2" strokeWidth="1.4" />
            </>
          )}
        </svg>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-us-heading"
      className="relative bg-[#0b0d10] py-28 px-6 md:px-12"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN CALLOUTS (4 cols) */}
          <div className="flex flex-col justify-between gap-16 lg:col-span-4 lg:min-h-[520px] lg:py-6">
            {leftMetrics.map((m, i) => renderMetricCard(m, false, i % 2 === 1))}
          </div>

          {/* CENTER COLUMN: Tall Rounded-Top Navy Arch Card (4 cols) */}
          <div className="flex flex-col items-center justify-center lg:col-span-4">
            {!archDeleted ? (
              <>
                {isEditMode && (
                  <div className="mb-3">
                    <DeleteSubComponentButton
                      subComponentId="whyus-arch"
                      isEditMode={isEditMode}
                      onDelete={onDeleteSubComponent}
                    />
                  </div>
                )}
                <div className="flex w-full max-w-[380px] min-h-[590px] flex-col items-center justify-between rounded-t-full border border-[#4a6f9e]/35 bg-gradient-to-b from-[#213f66] via-[#1b3558] to-[#152a47] px-9 pt-24 pb-14 text-center shadow-[0_28px_80px_rgba(0,0,0,0.65)]">
                  <div className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#8eb4e6]">
                    <EditableText
                      value={whyUs.kicker}
                      onChange={(val) => onUpdateWhyUs({ ...whyUs, kicker: val })}
                      isEditMode={isEditMode}
                      ariaLabel="Why Us Kicker"
                    />
                  </div>

                  <div className="my-auto py-8">
                    <h2
                      id="why-us-heading"
                      className="font-serif-display text-[40px] sm:text-[44px] leading-[1.06] font-normal text-white"
                      style={{ textWrap: 'balance' }}
                    >
                      <EditableText
                        value={whyUs.heading}
                        onChange={(val) => onUpdateWhyUs({ ...whyUs, heading: val })}
                        isEditMode={isEditMode}
                        ariaLabel="Why Us Heading"
                      />
                    </h2>
                    <div className="mt-5 text-[15px] leading-[1.65] text-[#cbd7e8]/90">
                      <EditableText
                        value={whyUs.bodyCopy}
                        onChange={(val) => onUpdateWhyUs({ ...whyUs, bodyCopy: val })}
                        isEditMode={isEditMode}
                        multiline
                        ariaLabel="Why Us Body Copy"
                      />
                    </div>
                  </div>

                  <div className="font-signature text-[38px] leading-none text-[#9ec2f0]">
                    <EditableText
                      value={signatureText}
                      onChange={onUpdateSignature}
                      isEditMode={isEditMode}
                      ariaLabel="Arch Signature"
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* RIGHT COLUMN CALLOUTS (4 cols) */}
          <div className="flex flex-col justify-between gap-16 lg:col-span-4 lg:min-h-[520px] lg:py-6 lg:items-end lg:text-right">
            {rightMetrics.map((m, i) => renderMetricCard(m, true, i % 2 === 1))}
          </div>
        </div>

        {/* EXECUTIVE BULLETINS STRIP (3 Key Bulletins) */}
        {bulletins.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-12">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#7aa2d4]">
                <span className="h-2 w-2 rounded-full bg-[#5c85b8]" aria-hidden="true" />
                <span>KEY CREDENTIALS & EXECUTIVE BULLETINS</span>
              </div>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleAddBulletin}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#7aa2d4]/50 bg-[#141820] px-3 py-1 text-[11px] font-medium text-[#9ec2f0] hover:bg-[#213f66] hover:text-white"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                  <span>Add Bulletin Item</span>
                </button>
              )}
            </div>

            <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {bulletins.map((item) => (
                <li
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#11151c]/90 p-6 transition-colors hover:border-[#5c85b8]/50"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="inline-block h-2 w-2 shrink-0 rotate-45 border border-[#7aa2d4] bg-[#213f66]"
                          aria-hidden="true"
                        />
                        <h3 className="font-serif-display text-[23px] leading-snug font-medium text-white">
                          <EditableText
                            value={item.title}
                            onChange={(val) => updateBulletinById(item.id, { title: val })}
                            isEditMode={isEditMode}
                            ariaLabel={`Bulletin title ${item.title}`}
                          />
                        </h3>
                      </div>

                      {isEditMode && (
                        <button
                          type="button"
                          onClick={() => handleDeleteBulletin(item.id)}
                          aria-label={`Delete bulletin ${item.title}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/75 px-2 py-1 text-[11px] text-rose-200 hover:bg-rose-900 hover:text-white shrink-0"
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>

                    <div className="mt-3 pl-4.5 text-[14px] leading-[1.68] text-[#b8c4d6]">
                      <EditableText
                        value={item.description}
                        onChange={(val) => updateBulletinById(item.id, { description: val })}
                        isEditMode={isEditMode}
                        multiline
                        ariaLabel={`Bulletin description ${item.title}`}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
