/**
 * Shared domain constants for the workplace-complaint pivot.
 */

// Categories (must match the CaseCategory enum in schema.prisma).
// Hybrid: workplace topics + the original life topics.
export const CATEGORIES = [
  // Workplace
  { value: 'TOXIC_MANAGEMENT', label: 'Toxic Management', group: 'work' },
  { value: 'BAD_BOSS', label: 'Bad Boss', group: 'work' },
  { value: 'COWORKER_DRAMA', label: 'Coworker Drama', group: 'work' },
  { value: 'PAY_AND_PROMOTION', label: 'Pay & Promotion', group: 'work' },
  { value: 'JOB_SECURITY', label: 'Layoffs & Job Security', group: 'work' },
  { value: 'WORK_LIFE_BALANCE', label: 'Burnout & Work-Life Balance', group: 'work' },
  { value: 'HR_ISSUES', label: 'HR Issues', group: 'work' },
  { value: 'OFFICE_POLITICS', label: 'Office Politics', group: 'work' },
  { value: 'RETURN_TO_OFFICE', label: 'Return to Office', group: 'work' },
  { value: 'WORK_CULTURE', label: 'Work Culture', group: 'work' },
  // Life
  { value: 'ROOMMATE_DISPUTES', label: 'Roommate Disputes', group: 'life' },
  { value: 'RELATIONSHIP_ISSUES', label: 'Relationship Issues', group: 'life' },
  { value: 'WORKPLACE_CONFLICTS', label: 'Workplace Conflicts', group: 'life' },
  { value: 'FAMILY_DRAMA', label: 'Family Drama', group: 'life' },
  { value: 'FRIEND_DISAGREEMENTS', label: 'Friend Disagreements', group: 'life' },
  { value: 'MONEY_PAYMENTS', label: 'Money & Payments', group: 'life' },
  { value: 'NEIGHBOR_CONFLICTS', label: 'Neighbor Conflicts', group: 'life' },
  { value: 'SPORTS_EVENTS', label: 'Sports & Events', group: 'life' },
  { value: 'TRAVEL_DISPUTES', label: 'Travel Disputes', group: 'life' },
  { value: 'CULTURAL_EVENTS', label: 'Cultural Events', group: 'life' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media', group: 'life' },
  { value: 'SHOPPING_CONSUMER', label: 'Shopping & Consumer', group: 'life' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', group: 'life' },
  { value: 'POLITICS', label: 'Politics', group: 'life' },
  { value: 'OTHER', label: 'Other', group: 'life' },
];

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

export const POST_TYPES = ['VENT', 'JUDGE', 'CHALLENGE'];

export const TARGET_TYPES = ['COMPANY', 'PERSON', 'GENERAL'];

export const REACTION_TYPES = ['RELATABLE', 'BOSS_WRONG', 'OVERREACTING', 'SAME_HERE', 'RUN'];

/**
 * Map a user row to the public, anonymity-safe shape.
 * NEVER returns email or the internal username.
 */
export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    anonymousHandle: user.anonymousHandle,
    avatarUrl: user.avatarUrl ?? null,
  };
}

// Prisma `select` for embedding a post author safely.
export const PUBLIC_USER_SELECT = {
  id: true,
  anonymousHandle: true,
  avatarUrl: true,
};
