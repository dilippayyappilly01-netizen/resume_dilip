import {
  DEFAULT_FULL_TEMPLATE,
  EssayItem,
  FullTemplateState,
  ProjectBriefSubmission,
  ProjectCategory,
  ProjectItem,
  SectionId,
  SubComponentId,
  TemplatePage,
  WhyUsMetricItem,
} from '../data/portfolioData';

/**
 * Cubic ease-out interpolation for animated metric counters.
 * Progress t in [0, 1] -> 1 - (1 - t)^3
 */
export function cubicEaseOut(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - clamped, 3);
}

export function interpolateMetricValue(target: number, elapsedMs: number, durationMs = 1100): number {
  if (durationMs <= 0) return target;
  const progress = Math.min(1, Math.max(0, elapsedMs / durationMs));
  return Math.round(target * cubicEaseOut(progress));
}

/**
 * Filter projects by category.
 */
export function filterProjectsByCategory(projects: ProjectItem[], category: ProjectCategory): ProjectItem[] {
  if (category === 'All') return projects;
  return projects.filter((p) => p.category === category);
}

/**
 * Build dynamic 10-card 3D panoramic ring from the user's editable projects list.
 */
export function buildOrbitRingCards(projects: ProjectItem[]) {
  const source = projects.length > 0 ? projects : DEFAULT_FULL_TEMPLATE.projects;
  return Array.from({ length: 10 }, (_, idx) => {
    const project = source[idx % source.length];
    return {
      id: `ring-${idx + 1}-${project.id}`,
      projectId: project.id,
      title: project.title.split(' ').slice(0, 3).join(' '),
      subtitle: project.category,
      image: project.image,
    };
  });
}

/**
 * Delete a major section from the template (adds to deletedSections).
 */
export function deleteSection(state: FullTemplateState, sectionId: SectionId): FullTemplateState {
  if (state.deletedSections.includes(sectionId)) return state;
  return {
    ...state,
    deletedSections: [...state.deletedSections, sectionId],
  };
}

/**
 * Restore a deleted major section.
 */
export function restoreSection(state: FullTemplateState, sectionId: SectionId): FullTemplateState {
  return {
    ...state,
    deletedSections: state.deletedSections.filter((id) => id !== sectionId),
  };
}

/**
 * Reorder a section up or down in sectionOrder.
 */
export function moveSectionOrder(
  sectionOrder: SectionId[],
  sectionId: SectionId,
  direction: 'up' | 'down'
): SectionId[] {
  const idx = sectionOrder.indexOf(sectionId);
  if (idx === -1) return sectionOrder;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= sectionOrder.length) return sectionOrder;
  const next = [...sectionOrder];
  const [removed] = next.splice(idx, 1);
  next.splice(targetIdx, 0, removed);
  return next;
}

/**
 * Delete a granular UI sub-component (e.g. 3D Ring, Cutout Portrait, Arch Card, Footer Banner).
 */
export function deleteSubComponent(state: FullTemplateState, compId: SubComponentId): FullTemplateState {
  if (state.deletedSubComponents.includes(compId)) return state;
  return {
    ...state,
    deletedSubComponents: [...state.deletedSubComponents, compId],
  };
}

/**
 * Restore a deleted UI sub-component.
 */
export function restoreSubComponent(state: FullTemplateState, compId: SubComponentId): FullTemplateState {
  return {
    ...state,
    deletedSubComponents: state.deletedSubComponents.filter((id) => id !== compId),
  };
}

/**
 * Delete a page from the template's page navigation list.
 */
export function deleteTemplatePage(state: FullTemplateState, pageId: string): FullTemplateState {
  const remaining = state.pages.filter((p) => p.id !== pageId);
  const nextActive =
    state.activePageId === pageId
      ? remaining[0]?.id || ''
      : state.activePageId;
  return {
    ...state,
    pages: remaining,
    activePageId: nextActive,
  };
}

/**
 * Add a new page to the template.
 */
export function addTemplatePage(
  state: FullTemplateState,
  title: string,
  sections: SectionId[] = ['hero', 'works', 'contact']
): FullTemplateState {
  const cleanTitle = title.trim() || `Page ${state.pages.length + 1}`;
  const slug = `#${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const newPage: TemplatePage = {
    id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: cleanTitle,
    slug,
    sections,
    customHeading: `${cleanTitle} — Studio Monograph`,
    customBody: 'Click to edit this custom page introduction or add/remove sections below.',
  };
  return {
    ...state,
    pages: [...state.pages, newPage],
    activePageId: newPage.id,
  };
}

/**
 * Remove an individual metric callout from Why Us.
 */
export function removeWhyUsMetric(metrics: WhyUsMetricItem[], metricId: string): WhyUsMetricItem[] {
  return metrics.filter((m) => m.id !== metricId);
}

/**
 * Restore all deleted sections and sub-components at once.
 */
export function restoreAllDeleted(state: FullTemplateState): FullTemplateState {
  if (state.deletedSections.length === 0 && state.deletedSubComponents.length === 0) {
    return state;
  }
  return {
    ...state,
    deletedSections: [],
    deletedSubComponents: [],
  };
}

export interface TemplateHistorySnapshot {
  state: FullTemplateState;
  submissions: ProjectBriefSubmission[];
  actionLabel: string;
  isDeletion?: boolean;
}

export interface TemplateHistoryState {
  past: TemplateHistorySnapshot[];
  future: TemplateHistorySnapshot[];
}

export function pushTemplateHistory(
  history: TemplateHistoryState,
  snapshot: TemplateHistorySnapshot,
  maxDepth = 50
): TemplateHistoryState {
  const nextPast = [...history.past, snapshot];
  if (nextPast.length > maxDepth) {
    nextPast.shift();
  }
  return {
    past: nextPast,
    future: [],
  };
}

export function undoTemplateHistory(
  history: TemplateHistoryState,
  currentState: FullTemplateState,
  currentSubmissions: ProjectBriefSubmission[]
): {
  history: TemplateHistoryState;
  state: FullTemplateState;
  submissions: ProjectBriefSubmission[];
  restoredLabel?: string;
} {
  if (history.past.length === 0) {
    return { history, state: currentState, submissions: currentSubmissions };
  }
  const previous = history.past[history.past.length - 1];
  const nextPast = history.past.slice(0, -1);
  const redoSnapshot: TemplateHistorySnapshot = {
    state: currentState,
    submissions: currentSubmissions,
    actionLabel: previous.actionLabel,
    isDeletion: previous.isDeletion,
  };
  return {
    history: {
      past: nextPast,
      future: [redoSnapshot, ...history.future],
    },
    state: previous.state,
    submissions: previous.submissions,
    restoredLabel: previous.actionLabel,
  };
}

export function redoTemplateHistory(
  history: TemplateHistoryState,
  currentState: FullTemplateState,
  currentSubmissions: ProjectBriefSubmission[]
): {
  history: TemplateHistoryState;
  state: FullTemplateState;
  submissions: ProjectBriefSubmission[];
  reappliedLabel?: string;
} {
  if (history.future.length === 0) {
    return { history, state: currentState, submissions: currentSubmissions };
  }
  const next = history.future[0];
  const nextFuture = history.future.slice(1);
  const undoSnapshot: TemplateHistorySnapshot = {
    state: currentState,
    submissions: currentSubmissions,
    actionLabel: next.actionLabel,
    isDeletion: next.isDeletion,
  };
  return {
    history: {
      past: [...history.past, undoSnapshot],
      future: nextFuture,
    },
    state: next.state,
    submissions: next.submissions,
    reappliedLabel: next.actionLabel,
  };
}

/**
 * Validate and parse imported JSON template configuration.
 */
export function parseTemplateJson(rawJson: string): {
  valid: boolean;
  state?: FullTemplateState;
  error?: string;
} {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'Template JSON must be a valid object.' };
    }
    if (!parsed.config || typeof parsed.config.brandWordmark !== 'string') {
      return { valid: false, error: 'Missing required config.brandWordmark in template JSON.' };
    }
    const merged: FullTemplateState = {
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
      sectionOrder: Array.isArray(parsed.sectionOrder) ? parsed.sectionOrder : DEFAULT_FULL_TEMPLATE.sectionOrder,
      deletedSections: Array.isArray(parsed.deletedSections) ? parsed.deletedSections : [],
      deletedSubComponents: Array.isArray(parsed.deletedSubComponents) ? parsed.deletedSubComponents : [],
    };
    return { valid: true, state: merged };
  } catch {
    return { valid: false, error: 'Invalid JSON syntax. Please check your pasted template data.' };
  }
}

/**
 * Pure helper to add or update a project item inside FullTemplateState.
 */
export function upsertProjectItem(projects: ProjectItem[], item: ProjectItem): ProjectItem[] {
  const exists = projects.some((p) => p.id === item.id);
  if (exists) {
    return projects.map((p) => (p.id === item.id ? item : p));
  }
  return [item, ...projects];
}

/**
 * Pure helper to delete a project item (allows deleting down to 0 items).
 */
export function removeProjectItem(projects: ProjectItem[], projectId: string): ProjectItem[] {
  return projects.filter((p) => p.id !== projectId);
}

/**
 * Pure helper to add or update an essay item.
 */
export function upsertEssayItem(essays: EssayItem[], item: EssayItem): EssayItem[] {
  const exists = essays.some((e) => e.id === item.id);
  if (exists) {
    return essays.map((e) => (e.id === item.id ? item : e));
  }
  return [item, ...essays];
}

/**
 * Pure helper to delete an essay item (allows deleting down to 0 items).
 */
export function removeEssayItem(essays: EssayItem[], essayId: string): EssayItem[] {
  return essays.filter((e) => e.id !== essayId);
}

/**
 * Validate project inquiry form inputs.
 */
export interface InquiryValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    email?: string;
    projectGoals?: string;
  };
}

export function validateProjectInquiry(input: {
  name: string;
  email: string;
  projectGoals: string;
}): InquiryValidationResult {
  const errors: InquiryValidationResult['errors'] = {};
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();
  const trimmedGoals = input.projectGoals.trim();

  if (!trimmedName) {
    errors.name = 'Please enter your name or studio contact.';
  }

  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Please provide a valid work email address.';
  }

  if (trimmedGoals.length < 10) {
    errors.projectGoals = 'Project goals must be at least 10 characters long.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Decrement available project spots safely (floor at 0).
 */
export function decrementSpots(currentSpots: number): number {
  return Math.max(0, currentSpots - 1);
}

/**
 * Border-seeded 4-connected BFS flood-fill cutout algorithm on RGBA pixel array.
 */
export function applyBorderSeededCutout(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  hardThreshold = 28,
  softThreshold = 45
): void {
  if (width <= 0 || height <= 0) return;

  const totalPixels = width * height;
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const tryEnqueue = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;

    const p = idx * 4;
    const maxChannel = Math.max(data[p], data[p + 1], data[p + 2]);
    if (maxChannel <= softThreshold) {
      visited[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < width; x++) {
    tryEnqueue(x, 0);
  }
  for (let y = 1; y < height; y++) {
    tryEnqueue(0, y);
    tryEnqueue(width - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;
    const p = idx * 4;
    const maxChannel = Math.max(data[p], data[p + 1], data[p + 2]);

    if (maxChannel < hardThreshold) {
      data[p + 3] = 0;
    } else {
      const ratio = (maxChannel - hardThreshold) / Math.max(1, softThreshold - hardThreshold);
      data[p + 3] = Math.round(data[p + 3] * Math.min(1, Math.max(0, ratio)));
    }

    if (x > 0) tryEnqueue(x - 1, y);
    if (x + 1 < width) tryEnqueue(x + 1, y);
    if (y > 0) tryEnqueue(x, y - 1);
    if (y + 1 < height) tryEnqueue(x, y + 1);
  }
}

export const INITIAL_SUBMISSIONS: ProjectBriefSubmission[] = [
  {
    id: 'brief-seed-1',
    name: 'Minjun Park',
    email: 'mpark@atelier-seoul.kr',
    company: 'Atelier Mobility',
    budgetRange: '$45k – $80k',
    timeline: 'Q1 Launch (10 Weeks)',
    projectGoals: 'Redesigning our flagship EV cockpit companion app and design token system for calm driver glanceability.',
    relatedProject: 'Aurora Hub Tactile Home & Companion App',
    submittedAt: '2 days ago',
  },
];
