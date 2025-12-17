/**
 * Perplexity AI Case Generator
 * Generates unique case scenarios based on current trending topics
 */

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

const CATEGORIES = [
  'ROOMMATE_DISPUTES',
  'RELATIONSHIP_ISSUES',
  'WORKPLACE_CONFLICTS',
  'FAMILY_DRAMA',
  'FRIEND_DISAGREEMENTS',
  'MONEY_PAYMENTS',
  'NEIGHBOR_CONFLICTS',
  'SPORTS_EVENTS',
  'TRAVEL_DISPUTES',
  'CULTURAL_EVENTS',
  'SOCIAL_MEDIA',
  'SHOPPING_CONSUMER',
  'ENTERTAINMENT',
  'OTHER'
];

/**
 * Generate a unique case using Perplexity AI based on current trending topics
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar', // Lightweight model with web search grounding
        messages: [
          {
            role: 'system',
            content: `You are a creative writer for AskJury, a GLOBAL social platform where people from around the world share interpersonal disputes.

Generate DIVERSE, UNIQUE personal disputes inspired by CURRENT WORLD EVENTS from ANY COUNTRY.

CRITICAL DIVERSITY REQUIREMENTS:
1. VARY TITLE FORMAT - Do NOT always use "AITA":
   - "AITA for..." (30% of time)
   - "Did I overreact when..." (20%)
   - "Was I wrong to..." (20%)
   - "Should I apologize for..." (15%)
   - "Am I being unfair about..." (15%)

2. GLOBAL LOCATIONS - Include cultural context:
   - Use city/country names: "in Mumbai", "during Ramadan in Dubai", "at Sydney cafe"
   - Reference local customs, festivals, currencies (Rs, €, £, ¥, R$)
   - Mention local foods, traditions, weather

3. DIVERSE TOPICS - Check recent global news:
   - Sports: Cricket, football, basketball, Olympics, local tournaments
   - Entertainment: Concerts, film releases, award shows, TV finales
   - Cultural: Festivals (Diwali, Christmas, Eid, Lunar New Year), weddings
   - Natural events: Heatwaves, monsoons, snow storms
   - Technology: App launches, gaming events, viral trends
   - AVOID repeating same event multiple times!

4. VARIED WRITING STYLES:
   - Some formal, some casual
   - Different sentence structures
   - Various levels of emotion (angry, confused, guilty, defensive)

5. MIXED CATEGORIES - Use ALL 14 categories equally:
   ${CATEGORIES.join(', ')}

Examples of GOOD diverse cases:
- "Did I overreact firing my maid during Diwali celebrations in Delhi?"
- "Was I wrong to sell my Cricket World Cup tickets after losing my job?"
- "Should I apologize for missing my best friend's nikah for a K-pop concert?"
- "Am I being unfair expecting my roommate to split ₹15,000 electricity bill?"
- "Skipped family Christmas lunch to watch Manchester derby - too harsh?"

Requirements:
- First-person scenario
- Title under 80 characters (MUST be a question)
- Description 100-200 words
- Include location/cultural markers
- Moral ambiguity (both sides valid)
- UNIQUE - never repeat topics

Respond ONLY with valid JSON:
{
  "title": "Question format title here?",
  "description": "First-person scenario with location/cultural context...",
  "category": "ONE_OF_THE_CATEGORIES"
}

Available categories: ${CATEGORIES.join(', ')}`
          },
          {
            role: 'user',
            content: 'Generate ONE completely unique interpersonal dispute based on TODAY\'S diverse global events (NOT overdone topics like Jake Paul). Use different locations, currency symbols, cultural contexts, and title formats. Include city/country names. Make it fresh and globally diverse!'
          }
        ],
        temperature: 1.0,  // Maximum creativity for diversity
        max_tokens: 500,
        top_p: 0.95  // High randomness for variety
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Perplexity API error:', response.status, error);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ Failed to parse JSON from Perplexity response:', content);
      return null;
    }

    const caseData = JSON.parse(jsonMatch[0]);

    // Validate category
    if (!CATEGORIES.includes(caseData.category)) {
      caseData.category = 'OTHER';
    }

    // Validate required fields
    if (!caseData.title || !caseData.description) {
      console.error('❌ Invalid case data:', caseData);
      return null;
    }

    console.log(`✨ AI Generated case: "${caseData.title.substring(0, 50)}..."`);

    return {
      title: caseData.title.trim(),
      description: caseData.description.trim(),
      category: caseData.category
    };

  } catch (error) {
    console.error('❌ Perplexity case generation error:', error.message);
    return null;
  }
}

/**
 * Test the AI case generator
 */
export async function testAICaseGeneration() {
  console.log('�� Testing Perplexity AI case generation...\n');

  for (let i = 1; i <= 3; i++) {
    console.log(`\nTest ${i}/3:`);
    const caseData = await generateAICase();

    if (caseData) {
      console.log('✅ Title:', caseData.title);
      console.log('📝 Description:', caseData.description.substring(0, 100) + '...');
      console.log('🏷️  Category:', caseData.category);
    } else {
      console.log('❌ Failed to generate case');
    }

    // Wait 2 seconds between requests to avoid rate limiting
    if (i < 3) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n✨ Test complete!');
}
