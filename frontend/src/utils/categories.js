/**
 * Shared workplace-rant taxonomy for the frontend.
 * Category values MUST match the CaseCategory enum in backend/prisma/schema.prisma.
 */

export const CATEGORIES = [
  { value: 'TOXIC_MANAGEMENT', label: 'Toxic Management', emoji: '☠️' },
  { value: 'BAD_BOSS', label: 'Bad Boss', emoji: '👔' },
  { value: 'COWORKER_DRAMA', label: 'Coworker Drama', emoji: '🎭' },
  { value: 'PAY_AND_PROMOTION', label: 'Pay & Promotion', emoji: '💰' },
  { value: 'JOB_SECURITY', label: 'Layoffs & Job Security', emoji: '📉' },
  { value: 'WORK_LIFE_BALANCE', label: 'Burnout & Balance', emoji: '🔥' },
  { value: 'HR_ISSUES', label: 'HR Issues', emoji: '📋' },
  { value: 'OFFICE_POLITICS', label: 'Office Politics', emoji: '🐍' },
  { value: 'RETURN_TO_OFFICE', label: 'Return to Office', emoji: '🏢' },
  { value: 'WORK_CULTURE', label: 'Work Culture', emoji: '🎪' },
  { value: 'OTHER', label: 'Other', emoji: '🗂️' },
];

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
