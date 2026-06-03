/**
 * VS Challenge prompts. Each is a debatable claim with two stances and a ready-made
 * argument for the challenger (side A) and the opponent (side B). Used by bots + seed.
 * Category values must match the CaseCategory enum.
 */
export const CHALLENGE_TEMPLATES = [
  {
    title: 'Return-to-office is about control, not collaboration',
    category: 'RETURN_TO_OFFICE',
    sideALabel: 'RTO is control',
    sideBLabel: 'Office wins',
    challenger: "RTO mandates exist so managers can watch us, not because it helps. I ship more from home and the metrics prove it. Commuting to take Zoom calls is theatre.",
    opponent: "Cope. In-person builds trust, mentorship and speed you can't fake on a call. Remote-only teams drift, juniors get abandoned, and culture quietly dies. Show up.",
  },
  {
    title: 'Unlimited PTO is a scam',
    category: 'WORK_LIFE_BALANCE',
    sideALabel: 'It\'s a scam',
    sideBLabel: 'It\'s great',
    challenger: "Unlimited PTO means nobody actually takes time off because there's no accrued balance to 'use'. It's a liability trick that saves the company payout money. Give me 25 fixed days.",
    opponent: "Skill issue. Good teams normalise taking real breaks and you're not capped at 20 days. I took 6 weeks last year. The problem is your manager, not the policy.",
  },
  {
    title: 'Replying to work messages after hours should be illegal',
    category: 'WORK_LIFE_BALANCE',
    sideALabel: 'Ban after-hours',
    sideBLabel: 'Grow up',
    challenger: "If it's not an emergency, it can wait till 9am. France literally legislated the right to disconnect. Your inability to set boundaries is not my problem.",
    opponent: "Some jobs have real-time stakes. A 10-second reply isn't slavery. Rigid 'I clock off at 5 sharp' energy is exactly why you keep getting passed over.",
  },
  {
    title: 'Tipping culture has gone completely out of control',
    category: 'SHOPPING_CONSUMER',
    sideALabel: 'Tipping is broken',
    sideBLabel: 'Just tip',
    challenger: "A screen flipped at me asking 20% for handing me a muffin? Wages are the employer's job, not a guilt tax on customers. The whole model is broken.",
    opponent: "Easy to say while the worker stares at you. Until pay changes, stiffing them hurts a real person, not the CEO. Don't punish staff for a system they didn't build.",
  },
  {
    title: 'Splitting the bill equally when you ordered a salad is robbery',
    category: 'MONEY_PAYMENTS',
    sideALabel: 'Pay your share',
    sideBLabel: 'Split it',
    challenger: "I had a $12 salad and water, you had steak, three cocktails and dessert. 'Let's just split evenly' is you reaching into my wallet. Pay for what you ordered.",
    opponent: "It's dinner with friends, not an audit. The 20 minutes of itemising and the vibe you kill are worth more than $25. Penny-counting at the table is its own red flag.",
  },
  {
    title: 'Pineapple absolutely belongs on pizza',
    category: 'OTHER',
    sideALabel: 'Pineapple yes',
    sideBLabel: 'Pineapple no',
    challenger: "Sweet, salty, acidic, savoury — pineapple and ham is a perfect flavour balance and you only hate it to fit in. Hawaiian outsells your 'authentic' margherita everywhere.",
    opponent: "Putting fruit syrup on a savoury dish and calling it cuisine is a crime. Warm pineapple turns the cheese to soup. This isn't a take, it's a confession.",
  },
  {
    title: 'Open-plan offices are the worst idea corporate ever had',
    category: 'WORK_CULTURE',
    sideALabel: 'Open-plan = hell',
    sideBLabel: 'Open-plan works',
    challenger: "No focus, constant noise, someone's call in my ear all day. Studies show open-plan tanks deep work and spikes sick days. Give engineers a door.",
    opponent: "Walls breed silos and ego. Open-plan keeps teams talking, unblocks people in seconds and kills the 'book a meeting to ask one question' nonsense. Use headphones.",
  },
  {
    title: 'Your manager being your friend is a trap',
    category: 'TOXIC_MANAGEMENT',
    sideALabel: 'Never friends',
    sideBLabel: 'Friends are fine',
    challenger: "The second they have to PIP you or deny your raise, the 'friendship' evaporates and now they know your weak spots. Keep it professional and protect yourself.",
    opponent: "A manager who actually knows and likes you fights harder for you, gives real feedback and covers you when it counts. Cold transactional bosses are how you get blindsided.",
  },
  {
    title: 'Quitting without a backup job is sometimes the right move',
    category: 'JOB_SECURITY',
    sideALabel: 'Just quit',
    sideBLabel: 'Never quit first',
    challenger: "If a job is wrecking your health, the 'always have something lined up' advice is privilege. Sometimes you leave to survive and figure it out after. Money heals slower than burnout.",
    opponent: "Quitting into nothing hands the company a win and hands you anxiety, a resume gap and a weaker negotiating position. Rest on their dime while you line up the next one.",
  },
  {
    title: 'Group chats that never stop are a form of violence',
    category: 'FRIEND_DISAGREEMENTS',
    sideALabel: 'Mute them all',
    sideBLabel: 'You\'re the problem',
    challenger: "247 messages about brunch logistics while I'm working. Muting isn't rude, it's survival. If it's urgent, call me. Otherwise the chat can debate the restaurant without me.",
    opponent: "You 'mute' then complain you're always the last to know and never invited. You can't opt out of the friendship admin and still expect VIP treatment. Engage or accept it.",
  },
];
