/**
 * Shared domain constants for the workplace-complaint pivot.
 */

// Workplace categories (must match the CaseCategory enum in schema.prisma)
export const CATEGORIES = [
  { value: 'TOXIC_MANAGEMENT', label: 'Toxic Management' },
  { value: 'BAD_BOSS', label: 'Bad Boss' },
  { value: 'COWORKER_DRAMA', label: 'Coworker Drama' },
  { value: 'PAY_AND_PROMOTION', label: 'Pay & Promotion' },
  { value: 'JOB_SECURITY', label: 'Layoffs & Job Security' },
  { value: 'WORK_LIFE_BALANCE', label: 'Burnout & Work-Life Balance' },
  { value: 'HR_ISSUES', label: 'HR Issues' },
  { value: 'OFFICE_POLITICS', label: 'Office Politics' },
  { value: 'RETURN_TO_OFFICE', label: 'Return to Office' },
  { value: 'WORK_CULTURE', label: 'Work Culture' },
  { value: 'OTHER', label: 'Other' },
];

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

export const POST_TYPES = ['VENT', 'JUDGE'];

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
