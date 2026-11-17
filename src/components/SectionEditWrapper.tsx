import React from 'react';
import { ArrowDown, ArrowUp, Layers, Trash2 } from 'lucide-react';
import { SECTION_LABELS, SectionId, SUBCOMPONENT_LABELS, SubComponentId } from '../data/portfolioData';

interface SectionEditWrapperProps {
  sectionId: SectionId;
  isEditMode: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDeleteSection: () => void;
  children: React.ReactNode;
}

export const SectionEditWrapper: React.FC<SectionEditWrapperProps> = ({
  sectionId,
  isEditMode,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDeleteSection,
  children,
}) => {
  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <div className="group/section relative border-y border-dashed border-transparent transition-colors hover:border-[#5c85b8]/40">
      {/* Floating Section Management Pill (Top-Right of Section) */}
      <div className="pointer-events-auto sticky top-3 z-40 mx-auto flex max-w-[1440px] justify-end px-6 pt-2 md:px-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#7aa2d4]/45 bg-[#11151c]/95 px-3 py-1 text-[11px] text-[#dce4f0] shadow-[0_10px_30px_rgba(0,0,0,0.75)] backdrop-blur-md">
          <Layers className="h-3 w-3 text-[#7aa2d4]" aria-hidden="true" />
          <span className="font-semibold text-white mr-1">{SECTION_LABELS[sectionId]}</span>

          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            title="Move section up"
            aria-label={`Move ${SECTION_LABELS[sectionId]} up`}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#141820] text-[#b5c0d0] hover:border-[#7aa2d4] hover:text-white disabled:opacity-30"
          >
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            title="Move section down"
            aria-label={`Move ${SECTION_LABELS[sectionId]} down`}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#141820] text-[#b5c0d0] hover:border-[#7aa2d4] hover:text-white disabled:opacity-30"
          >
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onDeleteSection}
            aria-label={`Delete ${SECTION_LABELS[sectionId]}`}
            className="ml-1 inline-flex items-center gap-1 rounded-full border border-rose-500/45 bg-rose-950/75 px-2.5 py-0.5 text-[11px] font-medium text-rose-200 transition-colors hover:border-rose-400 hover:bg-rose-900/80 hover:text-white"
          >
            <Trash2 className="h-3 w-3" aria-hidden="true" />
            <span>Delete Section</span>
          </button>
        </div>
      </div>

      {children}
    </div>
  );
};

interface DeleteSubComponentButtonProps {
  subComponentId: SubComponentId;
  isEditMode: boolean;
  onDelete: (id: SubComponentId) => void;
  className?: string;
}

export const DeleteSubComponentButton: React.FC<DeleteSubComponentButtonProps> = ({
  subComponentId,
  isEditMode,
  onDelete,
  className = '',
}) => {
  if (!isEditMode) return null;
  const label = SUBCOMPONENT_LABELS[subComponentId];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(subComponentId);
      }}
      title={`Delete ${label}`}
      aria-label={`Delete ${label}`}
      className={`pointer-events-auto inline-flex items-center gap-1 rounded-full border border-rose-500/45 bg-rose-950/85 px-2.5 py-1 text-[11px] font-medium text-rose-200 shadow-lg backdrop-blur-md transition-colors hover:border-rose-400 hover:bg-rose-900 hover:text-white whitespace-nowrap shrink-0 ${className}`}
    >
      <Trash2 className="h-3 w-3" aria-hidden="true" />
      <span>Delete {label}</span>
    </button>
  );
};
