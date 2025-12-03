import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VerdictBadge from './VerdictBadge';

/**
 * TrendingMarquee Component (Now shows CLOSED cases with verdicts)
 * Auto-scrolling banner showing recently closed cases
 * Positioned below hero section
 */
export default function TrendingMarquee({ cases = [] }) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate cases for seamless infinite scroll
  const duplicatedCases = [...cases, ...cases, ...cases];

  if (!cases || cases.length === 0) {
    return null; // Don't show if no cases
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-y border-gray-800/50 overflow-hidden py-3">
      {/* Label */}
      <div className="max-w-7xl mx-auto px-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            🏛️ Recent Verdicts
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
        </div>
      </div>

      {/* Scrolling Container */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient Overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Content */}
        <div
          className={`flex gap-4 ${isPaused ? 'pause-animation' : 'animate-marquee'}`}
          style={{ width: 'max-content' }}
        >
          {duplicatedCases.map((caseItem, index) => (
            <MarqueeCard
              key={`${caseItem.id}-${index}`}
              caseItem={caseItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Case Card in the Marquee - CLOSED CASES WITH VERDICTS
 */
function MarqueeCard({ caseItem }) {
  const totalVotes = caseItem.totalVotes || 0;
  const sideAPercentage = caseItem.sideAPercentage || 50;
  const sideBPercentage = caseItem.sideBPercentage || 50;

  return (
    <Link
      to={`/case/${caseItem.id}`}
      className="group relative flex-shrink-0 w-[320px] bg-gray-900/80 hover:bg-gray-800/90 border border-gray-700 hover:border-primary/50 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
    >
      {/* Category & Closure Type */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-primary/70 uppercase tracking-wide">
          {caseItem.category?.replace(/_/g, ' ')}
        </span>
        <span className="text-xs text-gray-500">
          {caseItem.closureType === 'MANUAL_OWNER' ? '🔒 Manually Closed' : '⚡ Auto-Closed'}
        </span>
      </div>

      {/* Verdict Badge */}
      <div className="flex justify-center mb-3">
        <VerdictBadge
          verdict={caseItem.verdict}
          margin={caseItem.verdictMargin}
          isOwner={false}
        />
      </div>

      {/* Case Title */}
      <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {caseItem.title}
      </h3>

      {/* Voting Results Bar */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-xs">
          <span className="text-green-400 font-semibold">Side A: {sideAPercentage}%</span>
          <span className="text-blue-400 font-semibold">Side B: {sideBPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
            style={{ width: `${sideAPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>🗳️ {totalVotes} votes</span>
        {caseItem._count?.comments > 0 && (
          <span>💬 {caseItem._count.comments} comments</span>
        )}
      </div>

      {/* Owner Reward (if applicable) */}
      {parseFloat(caseItem.ownerReward) > 0 && (
        <div className="mt-2 text-xs text-green-400 font-semibold">
          💰 Winner earned: ${caseItem.ownerReward}
        </div>
      )}
    </Link>
  );
}

/**
 * Alternative: Compact Marquee (even smaller)
 * Use this if the main version feels too large
 */
export function CompactTrendingMarquee({ cases = [] }) {
  const [isPaused, setIsPaused] = useState(false);
  const duplicatedCases = [...cases, ...cases, ...cases];

  if (!cases || cases.length === 0) return null;

  return (
    <div className="bg-black/50 border-y border-gray-800/30 overflow-hidden py-2">
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10"></div>

        <div
          className={`flex gap-3 ${isPaused ? 'pause-animation' : 'animate-marquee-fast'}`}
          style={{ width: 'max-content' }}
        >
          {duplicatedCases.map((caseItem, index) => (
            <Link
              key={`${caseItem.id}-${index}`}
              to={`/case/${caseItem.id}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-primary/50 rounded-full transition-all group"
            >
              <span className="text-xs font-bold text-white group-hover:text-primary line-clamp-1 max-w-[200px]">
                {caseItem.title}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {caseItem.votesFor + caseItem.votesAgainst} votes
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
