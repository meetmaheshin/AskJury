# AI-Powered Case Generation Based on Current Global Topics

## Problem
Current bot system uses static templates that create many duplicate cases. The platform needs fresh, relevant cases based on real-world trending topics.

## Solution Options

### Option 1: OpenAI API Integration (Recommended)
Use GPT-4 to generate unique, contextually relevant cases based on trending topics.

**How it works:**
1. Fetch trending topics from news APIs (Google News, NewsAPI.org)
2. Send topics to OpenAI with prompts
3. Generate unique case titles and descriptions
4. Store in database

**Pros:**
- ✅ Fresh, unique content daily
- ✅ Based on real current events
- ✅ Natural language, diverse perspectives
- ✅ No duplicates

**Cons:**
- ❌ Costs ~$0.01-0.03 per case generated
- ❌ Requires OpenAI API key
- ❌ Need to moderate output

**Cost estimate**: ~$5-10/month for 300-500 cases

### Option 2: Claude API (Alternative)
Similar to OpenAI but uses Anthropic's Claude.

**Pros:**
- ✅ Better at nuance and avoiding controversial content
- ✅ Longer context window
- ✅ Similar quality to GPT-4

**Cons:**
- ❌ Similar pricing to OpenAI
- ❌ Requires Anthropic API key

### Option 3: News RSS + Template Substitution (Budget Option)
Fetch trending news headlines, extract keywords, substitute into templates.

**Pros:**
- ✅ Free (just RSS feeds)
- ✅ Still based on current events
- ✅ No API costs

**Cons:**
- ❌ Less creative than AI
- ❌ Can still generate similar-sounding cases
- ❌ Limited to template variations

---

## Implementation Plan (Option 1: OpenAI)

### Step 1: Setup

Install dependencies:
```bash
npm install openai rss-parser
```

Add to `.env`:
```
OPENAI_API_KEY=sk-proj-...
NEWS_API_KEY=... # Optional: for NewsAPI.org
```

### Step 2: News Fetcher Service

```javascript
// backend/src/services/newsFetcher.js
import Parser from 'rss-parser';

const parser = new Parser();

export async function getTrendingTopics() {
  const feeds = [
    'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
    'https://www.reddit.com/r/news/.rss',
    'https://www.reddit.com/r/worldnews/.rss'
  ];

  const topics = [];

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed);
      topics.push(...parsed.items.slice(0, 10).map(item => ({
        title: item.title,
        summary: item.contentSnippet || item.title,
        category: item.categories?.[0] || 'general'
      })));
    } catch (error) {
      console.error('Feed fetch error:', error);
    }
  }

  return topics.slice(0, 20); // Top 20 topics
}
```

### Step 3: AI Case Generator

```javascript
// backend/src/services/aiCaseGenerator.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateCaseFromTopic(topic) {
  const prompt = `Based on this news topic: "${topic.title}"

Create a personal dispute/dilemma for AskJury (a community platform where people vote on disputes).

Requirements:
- Make it a first-person scenario
- Keep it between 50-100 words
- Make it relatable and viral-worthy
- Focus on interpersonal conflict, not politics
- Format as: Title (question format), Description (scenario)
- Include two clear sides people can vote on

Example output format:
{
  "title": "Friend won't stop talking about [topic] at every gathering",
  "description": "My friend brings up [topic] constantly... (scenario)",
  "category": "FRIEND_DISAGREEMENTS"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cheaper model, good enough
      messages: [
        {
          role: "system",
          content: "You are a creative writer for AskJury, a platform where people share disputes and get community verdicts. Generate realistic, engaging interpersonal conflicts based on current topics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9, // High creativity
      max_tokens: 300
    });

    const generated = JSON.parse(completion.choices[0].message.content);

    // Validate and format
    return {
      title: generated.title,
      description: generated.description,
      category: generated.category || 'OTHER'
    };
  } catch (error) {
    console.error('OpenAI generation error:', error);
    return null;
  }
}
```

### Step 4: Bot Activity Manager Update

```javascript
// Update backend/src/jobs/botActivityManager.js

import { getTrendingTopics } from '../services/newsFetcher.js';
import { generateCaseFromTopic } from '../services/aiCaseGenerator.js';

// Add this to botCreateCase()
async function botCreateCase() {
  const bots = await prisma.user.findMany({
    where: { isBot: true },
    take: 50
  });

  if (bots.length === 0) return null;

  const randomBot = bots[Math.floor(Math.random() * bots.length)];

  // 70% chance: AI-generated from trending topic
  // 30% chance: Template-based (fallback)
  const useAI = Math.random() < 0.7;

  if (useAI && process.env.OPENAI_API_KEY) {
    try {
      const topics = await getTrendingTopics();
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const aiCase = await generateCaseFromTopic(randomTopic);

      if (aiCase) {
        const newCase = await prisma.case.create({
          data: {
            title: aiCase.title,
            description: aiCase.description,
            category: aiCase.category,
            userId: randomBot.id
          }
        });

        console.log(`✅ Bot ${randomBot.username} created AI case: "${aiCase.title.substr(0, 50)}..."`);
        return newCase;
      }
    } catch (error) {
      console.error('AI case generation failed, falling back to templates:', error);
    }
  }

  // Fallback to existing template system
  // ... (keep existing code)
}
```

### Step 5: Cron Job (Optional - Daily Topic Refresh)

```javascript
// In server.js, add a daily cron
import cron from 'node-cron';
import { getTrendingTopics } from './services/newsFetcher.js';
import { generateCaseFromTopic } from './services/aiCaseGenerator.js';

// Generate 10 AI cases daily at 6 AM
cron.schedule('0 6 * * *', async () => {
  console.log('[CRON] Generating daily AI cases from trending topics...');

  const topics = await getTrendingTopics();
  let generated = 0;

  for (let i = 0; i < 10 && i < topics.length; i++) {
    const topic = topics[i];
    const aiCase = await generateCaseFromTopic(topic);

    if (aiCase) {
      // Assign to random bot
      const bots = await prisma.user.findMany({ where: { isBot: true } });
      const randomBot = bots[Math.floor(Math.random() * bots.length)];

      await prisma.case.create({
        data: {
          title: aiCase.title,
          description: aiCase.description,
          category: aiCase.category,
          userId: randomBot.id
        }
      });

      generated++;
      console.log(`  Generated: "${aiCase.title.substr(0, 50)}..."`);
    }

    // Rate limit: wait 2 seconds between API calls
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`✅ Generated ${generated} AI cases from trending topics`);
});
```

---

## Budget Implementation (Option 3: RSS + Templates)

If you don't want to use paid APIs, here's a free alternative:

```javascript
// backend/src/services/newsBasedCases.js
import Parser from 'rss-parser';

const parser = new Parser();

const templates = [
  {
    pattern: "Friend won't stop talking about {topic}",
    description: "My friend brings up {topic} in every conversation. Even at social gatherings, they can't talk about anything else. It's becoming exhausting. AITA for asking them to talk about other things?"
  },
  {
    pattern: "Coworker constantly discusses {topic} at work",
    description: "A coworker won't stop bringing up {topic} in the office. It's affecting productivity and making others uncomfortable. Should I report this to HR?"
  },
  {
    pattern: "Family argues about {topic} every dinner",
    description: "Every family dinner turns into a heated debate about {topic}. I just want to enjoy a meal in peace. AITA for banning this topic at the table?"
  }
];

export async function generateNewsBasedCase() {
  const feed = await parser.parseURL('https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en');
  const randomArticle = feed.items[Math.floor(Math.random() * 10)];

  // Extract topic (simple keyword extraction)
  const topic = randomArticle.title.split(' ').slice(0, 3).join(' ');

  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    title: template.pattern.replace('{topic}', topic),
    description: template.description.replace(/{topic}/g, topic),
    category: 'OTHER'
  };
}
```

---

## Recommendation

**Start with Option 3 (Free RSS-based)** to test the concept, then upgrade to **Option 1 (OpenAI)** once you see it working and want better quality.

**Monthly cost for Option 1:**
- OpenAI API: ~$5-10/month (300-500 cases)
- NewsAPI (optional): Free tier (100 requests/day)
- **Total: $5-10/month**

This will give you fresh, unique cases daily without duplicates, and keep your platform feeling current and relevant!

Would you like me to implement any of these options?
