import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VerdictBadge from './VerdictBadge';

/**
 * TrendingMarquee Component (Now shows CLOSED cases with verdicts)
 * Auto-scrolling banner showing recently closed cases
 * Positioned below hero section
 * MOBILE-OPTIMIZED: Smaller cards on mobile, full cards on desktop
 */
export default function TrendingMarquee({ cases = [] }) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate cases for seamless infinite scroll
  const duplicatedCases = [...cases, ...cases, ...cases];

  if (!cases || cases.length === 0) {
    return null; // Don't show if no cases
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-y border-gray-800/50 overflow-hidden py-2 md:py-3">
      {/* Label */}
      <div className="max-w-7xl mx-auto px-4 mb-1 md:mb-2">
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
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Content */}
        <div
          className={`flex gap-3 md:gap-4 ${isPaused ? 'pause-animation' : 'animate-marquee'}`}
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
 * Mobile: Compact design 240px wide
 * Desktop: Full design 320px wide
 */
function MarqueeCard({ caseItem }) {
  const totalVotes = caseItem.totalVotes || 0;
  const sideAPercentage = caseItem.sideAPercentage || 50;
  const sideBPercentage = caseItem.sideBPercentage || 50;

  return (
    <Link
      to={`/case/${caseItem.id}`}
      className="group relative flex-shrink-0 w-[240px] md:w-[320px] bg-gray-900/80 hover:bg-gray-800/90 border border-gray-700 hover:border-primary/50 rounded-xl p-3 md:p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
    >
      {/* Category & Closure Type - Hidden on mobile */}
      <div className="hidden md:flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-primary/70 uppercase tracking-wide">
          {caseItem.category?.replace(/_/g, ' ')}
        </span>
        <span className="text-xs text-gray-500">
          {caseItem.closureType === 'MANUAL_OWNER' ? '🔒' : '⚡'}
        </span>
      </div>

      {/* Verdict Badge */}
      <div className="flex justify-center mb-2 md:mb-3">
        <VerdictBadge
          verdict={caseItem.verdict}
          margin={caseItem.verdictMargin}
          isOwner={false}
        />
      </div>

      {/* Case Title */}
      <h3 className="text-xs md:text-sm font-bold text-white mb-2 md:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
        {caseItem.title}
      </h3>

      {/* Voting Results Bar */}
      <div className="space-y-1 mb-2">
        <div className="flex justify-between text-[10px] md:text-xs">
          <span className="text-green-400 font-semibold">{sideAPercentage}%</span>
          <span className="text-blue-400 font-semibold">{sideBPercentage}%</span>
        </div>
        <div className="h-1.5 md:h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
            style={{ width: `${sideAPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-400">
        <span>🗳️ {totalVotes}</span>
        {caseItem._count?.comments > 0 && (
          <span className="hidden md:inline">💬 {caseItem._count.comments}</span>
        )}
      </div>

      {/* Owner Reward (if applicable) - Hidden on mobile */}
      {parseFloat(caseItem.ownerReward) > 0 && (
        <div className="hidden md:block mt-2 text-xs text-green-400 font-semibold">
          💰 ${caseItem.ownerReward}
        </div>
      )}
    </Link>
  );
}
