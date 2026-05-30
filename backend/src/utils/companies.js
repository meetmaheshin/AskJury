/**
 * Company helpers. Companies are created on-demand when a post tags one by name.
 */

/** Turn a company name into a URL-safe slug. */
export function slugify(name) {
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/['’.]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Find a company by slug, or create it if it doesn't exist yet.
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {string} name
 * @returns {Promise<object|null>}
 */
export async function findOrCreateCompany(prisma, name) {
  const clean = String(name || '').trim();
  if (!clean) return null;

  const slug = slugify(clean);
  if (!slug) return null;

  const existing = await prisma.company.findUnique({ where: { slug } });
  if (existing) return existing;

  try {
    return await prisma.company.create({
      data: { name: clean.slice(0, 100), slug },
    });
  } catch (err) {
    // Race condition: another request created it first
    return prisma.company.findUnique({ where: { slug } });
  }
}
