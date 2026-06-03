import { Link } from 'react-router-dom';
import { Swords, Trophy, Flame } from 'lucide-react';
import { authorName, getCategoryLabel } from '../utils/categories';

/**
 * VS Challenge card (new mobile-social look). Challenger (purple) vs Opponent (yellow),
 * crowd support bar, and a context-aware CTA (accept / vote / winner).
 */
export default function ChallengeCard({ caseItem }) {
  const challenger = caseItem.user;
  const opponent = caseItem.opponent;
  const isOpen = !opponent;
  const isClosed = caseItem.status === 'CLOSED';
  const aPct = caseItem.sideAPercentage ?? 50;
  const bPct = caseItem.sideBPercentage ?? 50;
  const supporters = caseItem.voteCount ?? caseItem._count?.votes ?? 0;
  const aWins = caseItem.verdict === 'SIDE_A_WINS';
  const bWins = caseItem.verdict === 'SIDE_B_WINS';

  const Avatar = ({ user, color }) => (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ring-2 ${color}`}>
      {user ? authorName(user).charAt(0).toUpperCase() : '?'}
    </div>
  );

  return (
    <Link to={`/case/${caseItem.id}`} className="block group">
      <div className="rounded-3xl p-5 border border-white/10 bg-gradient-to-br from-zinc-900 via-purple-950/40 to-yellow-900/10 hover:border-yellow-400/30 transition-all">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-yellow-400">
            <Swords size={14} /> Challenge
          </span>
          <span className="text-[11px] text-zinc-400">
            {isClosed ? 'Settled' : isOpen ? 'Open · needs a rival' : <span className="inline-flex items-center gap-1 text-orange-400"><Flame size={12} /> Live</span>}
          </span>
        </div>

        {/* Claim */}
        <h3 className="text-lg md:text-xl font-bold text-white leading-snug mb-1.5 line-clamp-2 group-hover:text-yellow-300 transition-colors">
          {caseItem.title}
        </h3>
        <span className="block text-[11px] font-medium uppercase tracking-wide text-zinc-500 mb-4">
          {getCategoryLabel(caseItem.category)}
        </span>

        {/* VS row */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          {/* Challenger */}
          <div className="flex flex-col items-center text-center">
            <Avatar user={challenger} color="ring-purple-500/60" />
            <p className="mt-1.5 text-xs font-semibold text-white truncate max-w-[110px]">{authorName(challenger)}</p>
            <p className="text-[11px] text-purple-300 truncate max-w-[110px]">{caseItem.sideALabel}</p>
            {aWins && <span className="mt-1 text-[10px] font-bold text-yellow-400 inline-flex items-center gap-0.5"><Trophy size={11} /> WON</span>}
          </div>

          <div className="w-10 h-10 rounded-full bg-black border border-white/15 flex items-center justify-center text-xs font-black text-zinc-300">VS</div>

          {/* Opponent */}
          <div className="flex flex-col items-center text-center">
            <Avatar user={opponent} color={isOpen ? 'ring-white/15 opacity-60' : 'ring-yellow-400/60'} />
            <p className="mt-1.5 text-xs font-semibold text-white truncate max-w-[110px]">{isOpen ? 'Open spot' : authorName(opponent)}</p>
            <p className="text-[11px] text-yellow-300 truncate max-w-[110px]">{caseItem.sideBLabel}</p>
            {bWins && <span className="mt-1 text-[10px] font-bold text-yellow-400 inline-flex items-center gap-0.5"><Trophy size={11} /> WON</span>}
          </div>
        </div>

        {/* Support bar (only once there's a rival) */}
        {!isOpen && (
          <div className="mb-4">
            <div className="flex justify-between text-[11px] font-bold mb-1">
              <span className="text-purple-300">{aPct}%</span>
              <span className="text-yellow-300">{bPct}%</span>
            </div>
            <div className="flex h-2.5 rounded-full overflow-hidden bg-zinc-800">
              <div className="bg-purple-500 transition-all duration-500" style={{ width: `${aPct}%` }} />
              <div className="bg-yellow-400 transition-all duration-500" style={{ width: `${bPct}%` }} />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-400">{supporters.toLocaleString()} backing</span>
          <span className={`text-sm font-bold ${isOpen ? 'text-purple-300' : 'text-yellow-400'} group-hover:opacity-80`}>
            {isClosed ? 'See the verdict →' : isOpen ? 'Accept the challenge →' : 'Pick a side →'}
          </span>
        </div>
      </div>
    </Link>
  );
}
