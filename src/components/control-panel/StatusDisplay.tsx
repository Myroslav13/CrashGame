import type { GameStatus } from "../interfaces";

interface StatusDisplayProps {
  roundBet: number;
  status: GameStatus;
  crashPoint?: number;
  cashoutPoint?: number;
}

function StatusDisplay({ roundBet, status, crashPoint, cashoutPoint }: StatusDisplayProps) {
  function getStatusContent() {
    switch (status) {
      case 'idle':
        return { text: 'Status: Ready to Launch', color: 'text-gray-400' };
      case 'running':
        return { text: 'Status: ROCKET IS FLYING!', color: 'text-yellow-400 animate-pulse' };
      case 'cashed_out':
        return { text: `Status: You Won! Cashed at x${cashoutPoint?.toFixed(2)} (+${((cashoutPoint ?? 0) * roundBet).toFixed(2)}$)`, color: 'text-green-400' };
      case 'crashed':
        return { text: `Status: Crashed at x${crashPoint?.toFixed(2)} (-${(roundBet).toFixed(2)}$)`, color: 'text-red-500' };
      default:
        return { text: '', color: 'text-gray-400' };
    }
  };

  const { text, color } = getStatusContent();

  return (
    <div className="mt-2 sm:mt-4">
      <h3 className={`text-center ${color} text-xs sm:text-sm lg:text-base line-clamp-2`}>{text}</h3>
    </div>
  )
}

export default StatusDisplay;