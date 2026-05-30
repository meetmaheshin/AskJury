/**
 * Shared workplace-rant taxonomy for the frontend.
 * Category values MUST match the CaseCategory enum in backend/prisma/schema.prisma.
 */

// Hybrid taxonomy: workplace topics + the original life topics.
export const CATEGORIES = [
  // Workplace
  { value: 'TOXIC_MANAGEMENT', label: 'Toxic Management', emoji: '☠️', group: 'Work' },
  { value: 'BAD_BOSS', label: 'Bad Boss', emoji: '👔', group: 'Work' },
  { value: 'COWORKER_DRAMA', label: 'Coworker Drama', emoji: '🎭', group: 'Work' },
  { value: 'PAY_AND_PROMOTION', label: 'Pay & Promotion', emoji: '💰', group: 'Work' },
  { value: 'JOB_SECURITY', label: 'Layoffs & Job Security', emoji: '📉', group: 'Work' },
  { value: 'WORK_LIFE_BALANCE', label: 'Burnout & Balance', emoji: '🔥', group: 'Work' },
  { value: 'HR_ISSUES', label: 'HR Issues', emoji: '📋', group: 'Work' },
  { value: 'OFFICE_POLITICS', label: 'Office Politics', emoji: '🐍', group: 'Work' },
  { value: 'RETURN_TO_OFFICE', label: 'Return to Office', emoji: '🏢', group: 'Work' },
  { value: 'WORK_CULTURE', label: 'Work Culture', emoji: '🎪', group: 'Work' },
  // Life
  { value: 'ROOMMATE_DISPUTES', label: 'Roommate Disputes', emoji: '🏠', group: 'Life' },
  { value: 'RELATIONSHIP_ISSUES', label: 'Relationship Issues', emoji: '💔', group: 'Life' },
  { value: 'WORKPLACE_CONFLICTS', label: 'Workplace Conflicts', emoji: '💼', group: 'Life' },
  { value: 'FAMILY_DRAMA', label: 'Family Drama', emoji: '👨‍👩‍👧', group: 'Life' },
  { value: 'FRIEND_DISAGREEMENTS', label: 'Friend Disagreements', emoji: '🫂', group: 'Life' },
  { value: 'MONEY_PAYMENTS', label: 'Money & Payments', emoji: '💸', group: 'Life' },
  { value: 'NEIGHBOR_CONFLICTS', label: 'Neighbor Conflicts', emoji: '🚪', group: 'Life' },
  { value: 'SPORTS_EVENTS', label: 'Sports & Events', emoji: '🏆', group: 'Life' },
  { value: 'TRAVEL_DISPUTES', label: 'Travel Disputes', emoji: '✈️', group: 'Life' },
  { value: 'CULTURAL_EVENTS', label: 'Cultural Events', emoji: '🎉', group: 'Life' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media', emoji: '📱', group: 'Life' },
  { value: 'SHOPPING_CONSUMER', label: 'Shopping & Consumer', emoji: '🛒', group: 'Life' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', emoji: '🎬', group: 'Life' },
  { value: 'POLITICS', label: 'Politics', emoji: '🏛️', group: 'Life' },
  { value: 'OTHER', label: 'Other', emoji: '🗂️', group: 'Life' },
];

// Categories grouped by section, for grouped dropdowns / sidebars.
export const CATEGORY_GROUPS = CATEGORIES.reduce((acc, c) => {
  (acc[c.group] = acc[c.group] || []).push(c);
  return acc;
}, {});

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

/** Human-friendly label for a category value (falls back to the raw value). */
export function getCategoryLabel(value) {
  return CATEGORY_LABELS[value] || value;
}

/** Reactions for VENT posts. Types MUST match the ReactionType enum in schema.prisma. */
export const REACTIONS = [
  { type: 'RELATABLE', emoji: '😮‍💨', label: 'Relatable' },
  { type: 'BOSS_WRONG', emoji: '🚩', label: 'Boss is wrong' },
  { type: 'OVERREACTING', emoji: '🙄', label: 'Overreacting' },
  { type: 'SAME_HERE', emoji: '🙋', label: 'Same here' },
  { type: 'RUN', emoji: '🏃', label: 'Run' },
];

/** Display name for a public (anonymous) post/comment author. */
export function authorName(user) {
  return user?.anonymousHandle || user?.username || 'Anonymous';
}
