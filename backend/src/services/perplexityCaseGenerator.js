/**
 * Perplexity AI Case Generator
 * Generates unique WORKPLACE-rant scenarios grounded in current world-of-work trends
 * (layoffs, RTO mandates, burnout, AI-at-work anxiety, pay transparency, etc.).
 */

import { CATEGORY_VALUES } from '../utils/constants.js';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Workplace categories — must match the CaseCategory enum in schema.prisma.
const CATEGORIES = CATEGORY_VALUES;

/**
 * Generate a unique workplace rant using Perplexity AI.
 * Returns { title, description, category, postType } or null on failure.
 */
export async function generateAICase() {
  if (!PERPLEXITY_API_KEY) {
    console.warn('⚠️ PERPLEXITY_API_KEY not set, AI case generation disabled');
    return null;
  }

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar', // Lightweight model with web search grounding
        messages: [
          {
            role: 'system',
            content: `You are a writer for a GLOBAL "who's right?" platform. People post two kinds of disputes and let strangers weigh in:
  (A) WORKPLACE rants — bosses, coworkers, pay, layoffs, burnout, HR, RTO, office culture.
  (B) EVERYDAY LIFE disputes — roommates, relationships, family, friends, money, neighbors, travel, etc.

Generate ONE fresh, realistic scenario from EITHER bucket, inspired by CURRENT real-world trends from ANY country. Rotate widely between work and life and across themes — do NOT repeat the same topic.

POST TYPE — choose one:
- "JUDGE" : there are two defensible sides; readers vote who's right (use for ~55%)
- "VENT"  : pure rant, no clear question; readers just react (use for ~45%)

CATEGORY — choose the single best fit from this exact list:
${CATEGORIES.join(', ')}

DIVERSITY REQUIREMENTS:
- Vary title format: "AITA for...", "Did I overreact when...", "Was I wrong to...", "Just need to vent:...". Do NOT always start with AITA.
- Global context welcome: city/country, currency (Rs, €, £, ¥, $), local norms and customs.
- Vary tone: angry, exhausted, defensive, deadpan, darkly funny.
- First-person. Title under 110 characters. Description 80-180 words.

Respond ONLY with valid JSON:
{
  "title": "Title here",
  "description": "First-person scenario...",
  "category": "ONE_OF_THE_CATEGORIES",
  "postType": "JUDGE or VENT"
}`,
          },
          {
            role: 'user',
            content: 'Generate ONE completely unique dispute — either a workplace rant or an everyday-life dispute (roommate/relationship/family/friend/money/etc.) — grounded in a CURRENT real-world trend. Make it specific and fresh; avoid generic clichés and do not reuse common examples.',
          },
        ],
        temperature: 1.0,
        max_tokens: 500,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Perplexity API error:', response.status, error);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ Failed to parse JSON from Perplexity response:', content);
      return null;
    }

    const caseData = JSON.parse(jsonMatch[0]);

    // Validate / normalize category against the enum.
    if (!CATEGORIES.includes(caseData.category)) {
      caseData.category = 'OTHER';
    }

    // Normalize postType.
    caseData.postType = caseData.postType === 'VENT' ? 'VENT' : 'JUDGE';

    if (!caseData.title || !caseData.description) {
      console.error('❌ Invalid case data:', caseData);
      return null;
    }

    console.log(`✨ AI generated ${caseData.postType} case: "${caseData.title.substring(0, 50)}..."`);

    return {
      title: caseData.title.trim().substring(0, 120),
      description: caseData.description.trim(),
      category: caseData.category,
      postType: caseData.postType,
    };
  } catch (error) {
    console.error('❌ Perplexity case generation error:', error.message);
    return null;
  }
}

/**
 * Test the AI case generator.
 */
export async function testAICaseGeneration() {
  console.log('🧪 Testing Perplexity AI workplace case generation...\n');

  for (let i = 1; i <= 3; i++) {
    console.log(`\nTest ${i}/3:`);
    const caseData = await generateAICase();

    if (caseData) {
      console.log('✅ Title:', caseData.title);
      console.log('📝 Description:', caseData.description.substring(0, 100) + '...');
      console.log('🏷️  Category:', caseData.category, '| Type:', caseData.postType);
    } else {
      console.log('❌ Failed to generate case');
    }

    if (i < 3) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log('\n✨ Test complete!');
}
