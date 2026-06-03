import { Swords, Trophy, Flame, Quote } from 'lucide-react';
import { authorName } from '../utils/categories';

/**
 * The Challenge "Arena": two debaters' arguments side-by-side, a live tug-of-war
 * support meter, and "Back this side" buttons. The crowd decides the winner.
 *
 * Props:
 *  caseData   — the challenge (user=challenger/side A, opponent=side B)
 *  onSupport  — (side) => void   where side is 'SIDE_A' | 'SIDE_B'
 *  onAccept   — () => void        (open challenges only)
 *  busy       — bool
 */
export default function ChallengeArena({ caseData, onSupport, onAccept, busy }) {
  const challenger = caseData.user;
  const opponent = caseData.opponent;
  const isOpen = !opponent;
  const isClosed = caseData.status === 'CLOSED';
  const aPct = caseData.sideAPercentage ?? 50;
  const bPct = caseData.sideBPercentage ?? 50;
  const aVotes = caseData.sideAVotes ?? 0;
  const bVotes = caseData.sideBVotes ?? 0;
  const backing = caseData.voteCount ?? 0;
  const userSide = caseData.userVote; // 'SIDE_A' | 'SIDE_B' | null
  const aWins = caseData.verdict === 'SIDE_A_WINS';
  const bWins = caseData.verdict === 'SIDE_B_WINS';

  const Initial = ({ user, ring }) => (
    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white ring-2 ${ring}`}>
      {user ? authorName(user).charAt(0).toUpperCase() : '?'}
    </div>
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden">
      {/* Topic / status */}
      <div className="p-5 md:p-7 text-center bg-gradient-to-b from-purple-950/30 via-transparent to-yellow-950/10">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-yellow-400 mb-3">
          <Swords size={14} /> The Arena
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{caseData.title}</h1>
        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-zinc-400">
          {isClosed
            ? <span className="inline-flex items-center gap-1 text-yellow-400"><Trophy size={13} /> Settled</span>
            : <span className="inline-flex items-center gap-1 text-orange-400"><Flame size={13} /> Live</span>}
          <span>·</span>
          <span>{backing.toLocaleString()} backing</span>
        </div>
      </div>

      {/* Winner banner */}
      {isClosed && (aWins || bWins) && (
        <div className="px-5 py-3 text-center font-bold text-black bg-yellow-400 flex items-center justify-center gap-2">
          <Trophy size={18} /> {authorName(aWins ? challenger : opponent)} won the argument · {aWins ? aPct : bPct}%
        </div>
      )}

      {/* Tug-of-war meter */}
      {!isOpen && (
        <div className="px-5 md:px-7 pt-5">
          <div className="flex justify-between text-sm font-black mb-1.5">
            <span className="text-purple-300">{aPct}%</span>
            <span className="text-yellow-300">{bPct}%</span>
          </div>
          <div className="relative flex h-4 rounded-full overflow-hidden bg-zinc-800 ring-1 ring-white/10">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-700" style={{ width: `${aPct}%` }} />
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 transition-all duration-700" style={{ width: `${bPct}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-black border-2 border-white/30 flex items-center justify-center text-[9px] font-black text-white transition-all duration-700" style={{ left: `${aPct}%` }}>VS</div>
          </div>
        </div>
      )}

      {/* Debater panels */}
      <div className="grid md:grid-cols-2 gap-px bg-white/10 mt-5">
        {/* Challenger — purple */}
        <DebaterPanel
          accent="purple"
          user={challenger}
          stance={caseData.sideALabel}
          argument={caseData.description}
          votes={aVotes}
          isWinner={aWins}
          isUserSide={userSide === 'SIDE_A'}
          disabled={busy || isClosed}
          onBack={() => onSupport('SIDE_A')}
        />

        {/* Opponent — yellow (or open seat) */}
        {isOpen ? (
          <div className="bg-zinc-950 p-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-full ring-2 ring-white/15 border-dashed flex items-center justify-center text-2xl text-zinc-600">?</div>
            <p className="text-sm text-zinc-400">This seat is open. Think you can argue <span className="text-yellow-300 font-semibold">"{caseData.sideBLabel}"</span>?</p>
            <button
              onClick={onAccept}
              disabled={busy}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-bold text-sm disabled:opacity-50"
            >
              Accept the challenge
            </button>
          </div>
        ) : (
          <DebaterPanel
            accent="yellow"
            user={opponent}
            stance={caseData.sideBLabel}
            argument={caseData.opponentStatement}
            votes={bVotes}
            isWinner={bWins}
            isUserSide={userSide === 'SIDE_B'}
            disabled={busy || isClosed}
            onBack={() => onSupport('SIDE_B')}
          />
        )}
      </div>
    </div>
  );
}

function DebaterPanel({ accent, user, stance, argument, votes, isWinner, isUserSide, disabled, onBack }) {
  const purple = accent === 'purple';
  const ring = purple ? 'ring-purple-500/60' : 'ring-yellow-400/60';
  const stanceColor = purple ? 'text-purple-300' : 'text-yellow-300';
  const btnActive = purple ? 'bg-purple-500 text-white' : 'bg-yellow-400 text-black';
  const btnIdle = 'bg-white/5 text-white hover:bg-white/10 border border-white/10';

  return (
    <div className={`bg-zinc-950 p-5 md:p-6 flex flex-col ${isWinner ? '' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white ring-2 ${ring} ${purple ? 'bg-purple-600/40' : 'bg-yellow-500/30'}`}>
          {user ? authorName(user).charAt(0).toUpperCase() : '?'}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white truncate">{authorName(user)}</p>
          <p className={`text-sm font-semibold ${stanceColor} truncate`}>"{stance}"</p>
        </div>
      </div>

      <div className="flex-1 mb-4">
        <Quote size={16} className={`${stanceColor} mb-1`} />
        <p className="text-sm md:text-[15px] text-zinc-200 leading-relaxed whitespace-pre-wrap">{argument}</p>
      </div>

      <button
        onClick={onBack}
        disabled={disabled}
        className={`mt-auto w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isUserSide ? btnActive : btnIdle}`}
      >
        {isUserSide ? '✓ Backing' : 'Back this side'} · {votes.toLocaleString()}
      </button>
    </div>
  );
}
