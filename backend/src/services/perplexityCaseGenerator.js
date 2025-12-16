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
            content: `You are a creative writer for AskJury, a GLOBAL social platform where people from around the world share interpersonal disputes and get voted on by strangers.

Your task: Generate a realistic, engaging personal dispute inspired by CURRENT WORLD EVENTS, trending news, viral stories, sports events, celebrity news, or cultural happenings from ANY COUNTRY.

IMPORTANT - Make it globally diverse:
- Draw inspiration from recent news worldwide (Australia, India, Europe, Americas, Asia, Africa, Middle East)
- Reference current events: sports matches, celebrity visits, concerts, attacks, natural disasters, festivals, elections, etc.
- Make the personal conflict relate to how these events affect everyday people
- Avoid making it overtly political - focus on interpersonal fallout

Examples of event-inspired cases:
- "Messi visiting India → Friend cancelled our plans to see him, I'm upset"
- "Australia attack yesterday → Roommate won't stop doomscrolling news at 3am"
- "Taylor Swift concert → Sister bought tickets with my credit card without asking"
- "Cricket World Cup → Family divided over which team to support, causing tension"

Requirements:
- Make it a first-person scenario (AITA style)
- Keep title under 80 characters (must be a question)
- Keep description 100-200 words
- Include moral ambiguity (both sides have valid points)
- Make it relatable despite the global event reference
- Use varied categories - NOT just roommate disputes!

Respond ONLY with valid JSON in this exact format:
{
  "title": "Question format title here?",
  "description": "First-person scenario here...",
  "category": "ONE_OF_THE_CATEGORIES"
}

Available categories: ${CATEGORIES.join(', ')}`
          },
          {
            role: 'user',
            content: 'Generate a unique interpersonal dispute case based on TODAY\'S trending topics, breaking news, sports events, celebrity news, or cultural happenings from around the world. Make it viral-worthy and globally relatable. Focus on the interpersonal conflict, not the event itself.'
          }
        ],
        temperature: 0.9,
        max_tokens: 500,
        top_p: 0.9
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
