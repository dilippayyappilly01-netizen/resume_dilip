import React, { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (nextValue: string) => void;
  isEditMode: boolean;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div' | 'blockquote';
  multiline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  placeholder?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  isEditMode,
  as: Component = 'span',
  multiline = false,
  className = '',
  style,
  ariaLabel,
  placeholder = 'Click to edit...',
}) => {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditingInline && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingInline]);

  if (!isEditMode) {
    return (
      <Component className={className} style={style} aria-label={ariaLabel}>
        {value}
      </Component>
    );
  }

  const commit = () => {
    setIsEditingInline(false);
    if (draft.trim() !== '' && draft !== value) {
      onChange(draft);
    } else {
      setDraft(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDraft(value);
      setIsEditingInline(false);
    } else if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      commit();
    }
  };

  if (isEditingInline) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          rows={3}
          aria-label={ariaLabel || 'Edit text'}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-[#7aa2d4] bg-[#11151c]/95 px-2.5 py-1.5 text-white shadow-[0_0_0_2px_rgba(122,162,212,0.25)] focus:outline-none ${className}`}
          style={style}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || 'Edit text'}
        placeholder={placeholder}
        className={`w-full max-w-full rounded-lg border border-[#7aa2d4] bg-[#11151c]/95 px-2 py-0.5 text-white shadow-[0_0_0_2px_rgba(122,162,212,0.25)] focus:outline-none ${className}`}
        style={style}
      />
    );
  }

  return (
    <Component
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditingInline(true);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsEditingInline(true);
        }
      }}
      title="Click to edit inline"
      aria-label={ariaLabel ? `${ariaLabel} (Click to edit)` : 'Click to edit text'}
      style={style}
      className={`group/edit relative cursor-text rounded-md border border-dashed border-[#7aa2d4]/45 bg-[#213f66]/15 px-1.5 -mx-1.5 transition-colors hover:border-[#7aa2d4] hover:bg-[#213f66]/30 ${className}`}
    >
      {value}
      <span
        aria-hidden="true"
        className="pointer-events-none ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded bg-[#213f66] text-[#9ec2f0] opacity-80 group-hover/edit:opacity-100 align-middle"
      >
        <Pencil className="h-2.5 w-2.5" />
      </span>
    </Component>
  );
};
