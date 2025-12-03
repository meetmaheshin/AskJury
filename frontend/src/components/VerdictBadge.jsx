/**
 * Verdict Badge Component
 * Displays the verdict outcome with appropriate styling
 */

export default function VerdictBadge({ verdict, margin, isOwner }) {
  if (!verdict) return null;

  const getVerdictDisplay = () => {
    if (verdict === 'TIED') {
      return { text: 'TIED', color: 'bg-yellow-500', icon: '⚖️' };
    }

    const won = verdict === 'SIDE_A_WINS';

    if (isOwner) {
      return won
        ? { text: `Case Won by ${margin}%`, color: 'bg-green-500', icon: '🏆' }
        : { text: `Case Lost by ${margin}%`, color: 'bg-red-500', icon: '❌' };
    }

    // For non-owners viewing (marquee, public view)
    return won
      ? { text: `Case Won by ${margin}%`, color: 'bg-green-500', icon: '🏆' }
      : { text: `Case Lost by ${margin}%`, color: 'bg-red-500', icon: '❌' };
  };

  const display = getVerdictDisplay();

  return (
    <div className={`${display.color} text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg inline-flex`}>
      <span>{display.icon}</span>
      <span>{display.text}</span>
    </div>
  );
}
