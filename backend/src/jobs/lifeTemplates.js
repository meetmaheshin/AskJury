/**
 * Original "life" dispute templates (roommate, relationship, family, etc.) restored
 * from the pre-pivot bot system, so the hybrid platform keeps posting them alongside
 * the workplace rants. Categories match the CaseCategory enum in schema.prisma.
 */

export const LIFE_TEMPLATES = [
  {
    category: 'ROOMMATE_DISPUTES',
    templates: [
      { title: 'Roommate keeps eating my food without asking', description: 'My roommate has been taking my food from the fridge without permission. I labeled everything clearly, but they still help themselves. They say I\'m being petty because "we\'re roommates" and should share. Am I wrong for being upset about this?' },
      { title: 'Roommate refuses to clean shared bathroom', description: 'I live with someone who never cleans the bathroom we share. I\'ve asked multiple times, but they say they\'re "too busy" with work. I end up cleaning it every time because I can\'t stand the mess. Should they pay more rent since I\'m doing all the cleaning?' },
      { title: 'Roommate has guests over every weekend', description: 'My roommate invites friends over every Friday and Saturday night until 2-3 AM. The noise makes it hard for me to sleep, and I have work in the morning. They say it\'s their place too and I should just deal with it. Who\'s in the wrong here?' },
      { title: 'Roommate uses my Netflix account for their friends', description: 'I pay for Netflix and gave my roommate access. Now they\'ve shared the password with their friends and family. My account is maxed out and I can\'t even watch. They say I\'m being selfish since "streaming is meant to be shared."' },
      { title: 'Roommate keeps thermostat too cold/hot', description: 'My roommate insists on keeping the AC at 18°C in summer. I\'m freezing all the time. When I adjust it, they change it back and say they\'re paying half so they get a say. How do we compromise?' },
    ],
  },
  {
    category: 'RELATIONSHIP_ISSUES',
    templates: [
      { title: 'Partner wants to split bills 50/50 despite income difference', description: 'I make $80k/year and my partner makes $45k/year. They insist on splitting all bills and rent exactly 50/50. I suggested splitting proportionally to our incomes, but they say that\'s not fair. What\'s the right approach here?' },
      { title: 'Partner checks my phone without permission', description: 'My partner occasionally picks up my phone and reads my messages when I\'m in the shower or sleeping. When I confronted them, they said if I have nothing to hide, it shouldn\'t be a problem. Is this normal in relationships?' },
      { title: 'Partner forgot our anniversary', description: 'My partner completely forgot our 2-year anniversary. No card, no gift, nothing. When I brought it up, they said anniversaries aren\'t that important and I\'m making a big deal out of nothing. Am I overreacting?' },
      { title: 'Partner wants separate bank accounts after marriage', description: 'We\'re getting married soon and my partner insists on keeping completely separate finances. They don\'t want a joint account at all. I feel like marriage should mean sharing everything. Are separate accounts a red flag?' },
      { title: 'Partner follows their ex on social media', description: 'My partner still follows their ex on Instagram and likes their posts occasionally. When I asked them to unfollow, they said I\'m being insecure and controlling. They broke up 3 years ago. Am I wrong to feel uncomfortable?' },
    ],
  },
  {
    category: 'WORKPLACE_CONFLICTS',
    templates: [
      { title: 'Coworker takes credit for my ideas in meetings', description: 'During team meetings, my coworker often presents ideas we discussed privately as their own. When I mention it, they say we "collaborated" on it. It\'s happened three times now. Should I say something to my manager?' },
      { title: 'Colleague microwaves fish in office kitchen', description: 'A coworker heats up fish in the microwave every day for lunch. The smell fills the entire office. Several people have complained, but they say they have a right to eat what they want. Who\'s right here?' },
      { title: 'Manager scheduled meeting during my lunch break', description: 'My manager keeps scheduling "quick" 30-minute meetings during my 12-1 PM lunch break. When I said I prefer to keep that time free, they said everyone needs to be flexible. Should I push back harder?' },
      { title: 'Colleague always asks me to cover their shift', description: 'The same coworker asks me to cover their shift at least twice a month. They always have "emergencies" but I see them posting on social media having fun. I feel guilty saying no. Should I stop helping?' },
    ],
  },
  {
    category: 'FAMILY_DRAMA',
    templates: [
      { title: 'Parents expect me to pay their bills', description: 'I recently got a good job, and now my parents expect me to help pay their monthly bills. They say it\'s my duty as their child. I want to help, but it\'s affecting my ability to save. Am I being selfish?' },
      { title: 'Sister borrows money and never pays back', description: 'My sister has borrowed money from me five times in the past year, totaling about $2000. She promises to pay back but never does. Now she\'s asking for more. Should I keep lending to family?' },
      { title: 'In-laws visit without calling first', description: 'My in-laws drop by our house unannounced, sometimes as early as 8 AM on weekends. When I asked them to call first, they were offended and said "family doesn\'t need permission." Am I wrong to want notice?' },
      { title: 'Parents favor my sibling over me', description: 'My parents helped my sister with a down payment for her house but refused to help me with mine. They say she "needed it more" even though I asked first. I feel like I\'ve always been the second choice.' },
      { title: 'Family expects me to host every holiday', description: 'For the past 5 years, I\'ve hosted Thanksgiving and Christmas for my extended family. When I suggested rotating to someone else\'s house, they said my place is biggest and I\'m being selfish. I\'m exhausted.' },
    ],
  },
  {
    category: 'FRIEND_DISAGREEMENTS',
    templates: [
      { title: 'Friend always cancels plans last minute', description: 'My friend cancels on me about 70% of the time, usually an hour before we\'re supposed to meet. They always have an excuse. I told them it\'s frustrating, and they said I\'m being too demanding of their time. Am I?' },
      { title: 'Friend never pays when we go out', description: 'Every time we eat out together, my friend "forgets" their wallet or says they\'ll "get it next time." This has happened at least 10 times. Should I stop inviting them or bring it up?' },
      { title: 'Friend posted unflattering photo of me', description: 'My friend posted a terrible photo of me on social media without asking. I requested they take it down, but they said I\'m being vain and it\'s "not that bad." Should they have asked first?' },
      { title: 'Friend invited my ex to group hangout', description: 'My friend invited my ex to our group outing without asking me first. We had a messy breakup 6 months ago. My friend says I can\'t control who they invite and I need to "be mature about it."' },
      { title: 'Friend never responds to my messages', description: 'My friend takes 2-3 days to respond to my texts but posts on Instagram constantly. When I mentioned it, they said they\'re "bad at texting." But they reply to others immediately. Am I not a priority?' },
    ],
  },
  {
    category: 'MONEY_PAYMENTS',
    templates: [
      { title: 'Split dinner bill evenly when I ordered less', description: 'At dinner with friends, everyone wanted to split the bill evenly. I only had a salad ($12) while others had steaks and drinks ($40-50). I suggested paying separately, and they said I was being cheap. Who\'s right?' },
      { title: 'Friend wants me to pay for their concert ticket', description: 'I invited my friend to a concert, and now they expect me to pay for their ticket because I "invited them." I thought we\'d each pay our own way. Should the person who invites always pay?' },
      { title: 'Group trip cost split unfairly', description: 'We booked an Airbnb for 6 people. Two couples took the master bedrooms and want to split cost evenly. I got the couch in the living room. Shouldn\'t couples pay more for private rooms?' },
      { title: 'Friend wants to use my discount without buying anything', description: 'I get a 30% employee discount at a store. My friend wants me to buy stuff for them using my discount even though I\'m not buying anything. The store prohibits this. They\'re calling me selfish.' },
      { title: 'Sibling expects me to pay for family gifts', description: 'Every birthday and holiday, my sibling suggests we go in together on gifts for family. But they never have money and I end up paying 80%. They still sign the card as "from both of us." Is this fair?' },
    ],
  },
  {
    category: 'NEIGHBOR_CONFLICTS',
    templates: [
      { title: 'Neighbor plays loud music at 2 AM every night', description: 'My upstairs neighbor blasts music until 2-3 AM on weekdays. I have to wake up at 6 AM for work. I\'ve asked them politely twice, but they say I\'m being too sensitive and "it\'s not that loud." Should I call the landlord?' },
      { title: 'Neighbor keeps parking in my spot', description: 'I have an assigned parking spot, but my neighbor keeps leaving their car in it. When I asked them to stop, they said the lot is "first come first served" even though it\'s clearly numbered. What now?' },
      { title: 'Neighbor\'s dog barks all day while they\'re at work', description: 'My neighbor leaves their dog alone all day and it barks non-stop from morning to evening. I work from home and can\'t concentrate. They say I\'m "attacking their pet" when I bring it up. Who\'s being unreasonable?' },
    ],
  },
  {
    category: 'OTHER',
    templates: [
      { title: 'Friend borrowed €500 six months ago, still hasn\'t paid back', description: 'I lent my close friend €500 for an emergency six months ago. They promised to pay back in 2 months. Now they avoid the topic and act like nothing happened. Should I bring it up again or let it go?' },
      { title: 'Restaurant charged me for a meal I didn\'t order', description: 'At a restaurant, I ordered the vegetarian pasta. The bill included a €25 steak I never ordered or received. When I pointed it out, the waiter insisted I must have ordered it. They refused to remove it. Should I have paid?' },
      { title: 'Friend keeps bringing their dog everywhere without asking', description: 'My friend brings their large dog to my apartment every time they visit, without asking first. I\'m allergic and have asked them to leave the dog at home. They say their dog has "separation anxiety" and I\'m being unreasonable. Who\'s right?' },
      { title: 'Taxi driver took longer route and charged extra ¥500', description: 'I took a taxi from the airport. I know the route should take 20 minutes and cost ¥200. The driver took backstreets for 40 minutes and charged ¥700. When I questioned it, he got angry. Should I have refused to pay?' },
    ],
  },
];

// Original general-purpose comment lines (kept for life-topic posts).
export const LIFE_COMMENTS = [
  'You\'re definitely right in this situation.',
  'I can see both sides, but I think you handled it well.',
  'Have you tried talking to them about it?',
  'This is a tough one. I would probably do the same thing.',
  'I disagree. I think you should consider their perspective.',
  'Been in a similar situation. It doesn\'t get better unless you address it.',
  'You need to set better boundaries here.',
  'This is pretty common actually. Don\'t stress too much.',
  'I think you\'re overreacting a bit, to be honest.',
  'Stand your ground. You\'re not wrong.',
  'Maybe there\'s a compromise you haven\'t considered?',
  'Communication is key in situations like this.',
  'NTA. They\'re clearly in the wrong here.',
  'YTA. You should apologize and move on.',
  'Set firm boundaries and stick to them. Don\'t back down.',
  'Document everything. You might need it later.',
  'Trust your gut. If something feels off, it probably is.',
  'This is a red flag. Proceed with caution.',
  'You deserve better treatment than this.',
  'Sounds like you need to have a serious conversation.',
  'Give them one more chance, but make your expectations clear.',
  'You\'re not crazy for feeling this way.',
  'In my culture, we handle this differently but I see your point.',
  'This happens everywhere, not just your country.',
  'Different countries, same drama 😅',
];
