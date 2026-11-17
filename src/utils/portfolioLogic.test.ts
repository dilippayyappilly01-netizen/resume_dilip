import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cubicEaseOut,
  interpolateMetricValue,
  filterProjectsByCategory,
  validateProjectInquiry,
  decrementSpots,
  applyBorderSeededCutout,
  buildOrbitRingCards,
  parseTemplateJson,
  upsertProjectItem,
  removeProjectItem,
  upsertEssayItem,
  removeEssayItem,
  deleteSection,
  restoreSection,
  deleteSubComponent,
  restoreSubComponent,
  deleteTemplatePage,
  addTemplatePage,
  moveSectionOrder,
  removeWhyUsMetric,
  restoreAllDeleted,
  pushTemplateHistory,
  undoTemplateHistory,
  redoTemplateHistory,
  INITIAL_SUBMISSIONS,
} from './portfolioLogic';
import { DEFAULT_FULL_TEMPLATE, PROJECTS } from '../data/portfolioData';

test('cubicEaseOut and interpolateMetricValue smoothly interpolate from 0 to target over 1100ms', () => {
  assert.equal(cubicEaseOut(0), 0);
  assert.equal(cubicEaseOut(1), 1);
  assert.equal(interpolateMetricValue(93, 0, 1100), 0);
  assert.equal(interpolateMetricValue(93, 1100, 1100), 93);
  const mid = interpolateMetricValue(100, 550, 1100);
  assert.ok(mid > 50 && mid < 100, `Expected cubic ease-out midpoint > 50, got ${mid}`);
});

test('filterProjectsByCategory returns all or matching category items', () => {
  const all = filterProjectsByCategory(PROJECTS, 'All');
  assert.equal(all.length, PROJECTS.length);

  const mobile = filterProjectsByCategory(PROJECTS, 'Mobile App');
  assert.ok(mobile.length >= 1);
  assert.ok(mobile.every((p) => p.category === 'Mobile App'));
});

test('validateProjectInquiry enforces required name, valid email, and >= 10 char goals', () => {
  const invalid = validateProjectInquiry({
    name: '',
    email: 'invalid-email',
    projectGoals: 'too short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.projectGoals);

  const valid = validateProjectInquiry({
    name: 'Elena Rostova',
    email: 'elena@lignum.ch',
    projectGoals: 'We need a complete dark-mode design system for our multi-asset portfolio terminal.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('decrementSpots reduces available spots by 1 and floors at 0', () => {
  assert.equal(decrementSpots(2), 1);
  assert.equal(decrementSpots(1), 0);
  assert.equal(decrementSpots(0), 0);
});

test('applyBorderSeededCutout clears outer dark background while preserving enclosed interior dark pixels', () => {
  const width = 5;
  const height = 5;
  const data = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const isMetalRing = x >= 1 && x <= 3 && y >= 1 && y <= 3 && !(x === 2 && y === 2);
      if (isMetalRing) {
        data[idx] = 180;
        data[idx + 1] = 185;
        data[idx + 2] = 195;
        data[idx + 3] = 255;
      } else {
        data[idx] = 8;
        data[idx + 1] = 10;
        data[idx + 2] = 12;
        data[idx + 3] = 255;
      }
    }
  }

  applyBorderSeededCutout(data, width, height, 28, 45);
  assert.equal(data[3], 0);
  assert.equal(data[(1 * width + 1) * 4 + 3], 255);
  assert.equal(data[(2 * width + 2) * 4 + 3], 255);
});

test('template CRUD helpers add, update, and remove projects/essays and build 10 orbit ring cards', () => {
  const ring = buildOrbitRingCards(PROJECTS);
  assert.equal(ring.length, 10);

  const newProj = { ...PROJECTS[0], id: 'custom-proj', title: 'Custom AI Studio Project' };
  const added = upsertProjectItem(PROJECTS, newProj);
  assert.equal(added.length, PROJECTS.length + 1);
  assert.equal(added[0].title, 'Custom AI Studio Project');

  const updated = upsertProjectItem(added, { ...newProj, title: 'Updated Title' });
  assert.equal(updated.length, added.length);
  assert.equal(updated[0].title, 'Updated Title');

  const removed = removeProjectItem(updated, 'custom-proj');
  assert.equal(removed.length, PROJECTS.length);

  const essay = { ...DEFAULT_FULL_TEMPLATE.essays[0], id: 'custom-essay', title: 'New Monograph' };
  const essaysAdded = upsertEssayItem(DEFAULT_FULL_TEMPLATE.essays, essay);
  assert.equal(essaysAdded.length, DEFAULT_FULL_TEMPLATE.essays.length + 1);
  const essaysRemoved = removeEssayItem(essaysAdded, 'custom-essay');
  assert.equal(essaysRemoved.length, DEFAULT_FULL_TEMPLATE.essays.length);
});

test('deleteSection, restoreSection, deleteSubComponent, and deleteTemplatePage allow deleting and restoring pages and components', () => {
  let state = DEFAULT_FULL_TEMPLATE;

  // Delete a major section
  state = deleteSection(state, 'whyus');
  assert.ok(state.deletedSections.includes('whyus'));

  // Restore section
  state = restoreSection(state, 'whyus');
  assert.equal(state.deletedSections.includes('whyus'), false);

  // Delete a granular sub-component (e.g., 3D ring or portrait)
  state = deleteSubComponent(state, 'hero-orbit-ring');
  assert.ok(state.deletedSubComponents.includes('hero-orbit-ring'));
  state = restoreSubComponent(state, 'hero-orbit-ring');
  assert.equal(state.deletedSubComponents.includes('hero-orbit-ring'), false);

  // Add and delete a page
  state = addTemplatePage(state, 'Labs', ['works']);
  assert.equal(state.pages.length, DEFAULT_FULL_TEMPLATE.pages.length + 1);
  const addedPageId = state.activePageId;
  state = deleteTemplatePage(state, addedPageId);
  assert.equal(state.pages.length, DEFAULT_FULL_TEMPLATE.pages.length);

  // Reorder section
  const reordered = moveSectionOrder(['hero', 'whyus', 'process'], 'whyus', 'up');
  assert.deepEqual(reordered, ['whyus', 'hero', 'process']);

  // Delete individual Why Us metric callout
  const metricsAfterDelete = removeWhyUsMetric(state.whyUs.metrics, 'metric-tl');
  assert.equal(metricsAfterDelete.length, 3);
});

test('parseTemplateJson validates and merges exported template JSON', () => {
  const bad = parseTemplateJson('{bad json');
  assert.equal(bad.valid, false);

  const exported = JSON.stringify({
    ...DEFAULT_FULL_TEMPLATE,
    config: { ...DEFAULT_FULL_TEMPLATE.config, brandWordmark: 'Atelier.' },
  });
  const good = parseTemplateJson(exported);
  assert.equal(good.valid, true);
  assert.equal(good.state?.config.brandWordmark, 'Atelier.');
});

test('DEFAULT_FULL_TEMPLATE includes Multi-Brand E-Commerce Founder, AI & UI Creator, and National Case Competitor bulletins', () => {
  const bulletins = DEFAULT_FULL_TEMPLATE.whyUs.bulletins ?? [];
  assert.equal(bulletins.length, 3);
  assert.equal(bulletins[0].title, 'Multi-Brand E-Commerce Founder');
  assert.ok(bulletins[0].description.includes('Treaseb and Trimister'));
  assert.equal(bulletins[1].title, 'AI & UI Creator');
  assert.ok(bulletins[1].description.includes('curated prompt libraries'));
  assert.equal(bulletins[2].title, 'National Case Competitor');
  assert.ok(bulletins[2].description.includes('IIM Ahmedabad (Armageddon)'));
});

test('undoTemplateHistory, redoTemplateHistory, and restoreAllDeleted restore and reapply deleted components', () => {
  let current = DEFAULT_FULL_TEMPLATE;
  let history = { past: [], future: [] } as ReturnType<typeof pushTemplateHistory>;

  // Push snapshot before deleting a section and a subcomponent
  history = pushTemplateHistory(history, {
    state: current,
    submissions: INITIAL_SUBMISSIONS,
    actionLabel: 'Deleted Why Us Central Navy Arch Card',
    isDeletion: true,
  });
  current = deleteSubComponent(current, 'whyus-arch');
  assert.ok(current.deletedSubComponents.includes('whyus-arch'));

  // Undo restores the just-deleted component
  const undone = undoTemplateHistory(history, current, INITIAL_SUBMISSIONS);
  assert.equal(undone.restoredLabel, 'Deleted Why Us Central Navy Arch Card');
  assert.equal(undone.state.deletedSubComponents.includes('whyus-arch'), false);
  assert.equal(undone.history.future.length, 1);

  // Redo reapplies the deletion
  const redone = redoTemplateHistory(undone.history, undone.state, undone.submissions);
  assert.equal(redone.reappliedLabel, 'Deleted Why Us Central Navy Arch Card');
  assert.ok(redone.state.deletedSubComponents.includes('whyus-arch'));

  // restoreAllDeleted clears all deleted sections and subcomponents
  const withDeleted = deleteSection(redone.state, 'whyus');
  const restoredAll = restoreAllDeleted(withDeleted);
  assert.equal(restoredAll.deletedSections.length, 0);
  assert.equal(restoredAll.deletedSubComponents.length, 0);
});

test('DEFAULT_FULL_TEMPLATE includes IIMB BBA, Class 12, and Class 10 education slides', () => {
  assert.equal(DEFAULT_FULL_TEMPLATE.processSteps.length, 3);
  assert.equal(
    DEFAULT_FULL_TEMPLATE.processSteps[0].title,
    'Indian Institute of Management Bangalore (IIMB)'
  );
  assert.ok(
    DEFAULT_FULL_TEMPLATE.processSteps[0].showcaseMeta.includes(
      'BBA) in Digital Business & Entrepreneurship | 2026 – Present'
    )
  );
  assert.equal(
    DEFAULT_FULL_TEMPLATE.processSteps[1].title,
    'Senior Secondary Education (Class 12)'
  );
  assert.equal(
    DEFAULT_FULL_TEMPLATE.processSteps[1].showcaseMeta,
    'Score: 77% Overall | 91% in Computer Science'
  );
  assert.equal(DEFAULT_FULL_TEMPLATE.processSteps[2].title, 'Secondary Education (Class 10)');
  assert.equal(DEFAULT_FULL_TEMPLATE.processSteps[2].showcaseMeta, 'Score: 90.2%');

  assert.equal(DEFAULT_FULL_TEMPLATE.essays.length, 3);
  assert.equal(
    DEFAULT_FULL_TEMPLATE.essays[0].title,
    'Indian Institute of Management Bangalore (IIMB)'
  );
});

test('DEFAULT_FULL_TEMPLATE removes "Begin a project" CTA from 1st page by default, with restore/delete support', () => {
  // By default, the hero CTA button is marked as deleted so it does not render on page 1
  assert.ok(DEFAULT_FULL_TEMPLATE.deletedSubComponents.includes('hero-cta-button'));

  // Restoring it removes it from deletedSubComponents
  const restored = restoreSubComponent(DEFAULT_FULL_TEMPLATE, 'hero-cta-button');
  assert.equal(restored.deletedSubComponents.includes('hero-cta-button'), false);

  // Deleting it adds it back to deletedSubComponents
  const reDeleted = deleteSubComponent(restored, 'hero-cta-button');
  assert.ok(reDeleted.deletedSubComponents.includes('hero-cta-button'));
});
