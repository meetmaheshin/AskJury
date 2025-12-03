/**
 * Verdict Calculator Utility
 * Handles verdict determination and reward calculation for case closures
 */

/**
 * Calculate verdict and rewards for a case
 * @param {number} sideAVotes - Votes for Side A
 * @param {number} sideBVotes - Votes for Side B
 * @returns {Object} { verdict, margin, ownerReward }
 */
export function calculateVerdict(sideAVotes, sideBVotes) {
  const totalVotes = sideAVotes + sideBVotes;

  if (totalVotes === 0) {
    return { verdict: 'TIED', margin: 0, ownerReward: 0 };
  }

  const sideAPercentage = (sideAVotes / totalVotes) * 100;
  const sideBPercentage = (sideBVotes / totalVotes) * 100;

  // Determine verdict
  let verdict;
  if (sideAPercentage > 50) {
    verdict = 'SIDE_A_WINS';
  } else if (sideBPercentage > 50) {
    verdict = 'SIDE_B_WINS';
  } else {
    verdict = 'TIED';
  }

  // Calculate margin (absolute percentage difference)
  const margin = Math.abs(sideAPercentage - sideBPercentage);

  // Calculate owner reward (only if Side A wins)
  // Formula: (favorable_votes - opposing_votes) × $0.001
  let ownerReward = 0;
  if (verdict === 'SIDE_A_WINS') {
    const netVotes = sideAVotes - sideBVotes;
    ownerReward = netVotes * 0.001; // $0.001 per net favorable vote
  }

  return {
    verdict,
    margin: Math.round(margin),
    ownerReward: parseFloat(ownerReward.toFixed(2))
  };
}

/**
 * Check if case should auto-close
 * @param {Object} caseData - Case with votes and timestamps
 * @param {number} sideAVotes - Current Side A vote count
 * @param {number} sideBVotes - Current Side B vote count
 * @returns {Object|null} { shouldClose, closureType } or null
 */
export function shouldAutoClose(caseData, sideAVotes, sideBVotes) {
  const totalVotes = sideAVotes + sideBVotes;
  const now = new Date();
  const createdAt = new Date(caseData.createdAt);
  const daysSinceCreation = (now - createdAt) / (1000 * 60 * 60 * 24);

  // Check time-based closure (7 days)
  if (daysSinceCreation >= 7) {
    return { shouldClose: true, closureType: 'AUTO_TIME_LIMIT' };
  }

  // Check vote-based closure (90% with min 50 votes)
  if (totalVotes >= 50) {
    const sideAPercentage = (sideAVotes / totalVotes) * 100;
    const sideBPercentage = (sideBVotes / totalVotes) * 100;

    if (sideAPercentage >= 90 || sideBPercentage >= 90) {
      return { shouldClose: true, closureType: 'AUTO_VOTE_THRESHOLD' };
    }
  }

  return null;
}
