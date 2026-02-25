import type { GameStatus } from "../interfaces";

interface StatusDisplayProps {
  status: GameStatus;
  crashPoint?: number;
  cashoutPoint?: number;
}

function StatusDisplay({ status, crashPoint, cashoutPoint }: StatusDisplayProps) {
  function getStatusContent() {
    switch (status) {
      case 'idle':
        return { text: 'Status: Ready to Launch', color: 'text-gray-400' };
      case 'running':
        return { text: 'Status: ROCKET IS FLYING!', color: 'text-yellow-400 animate-pulse' };
      case 'cashed_out':
        return { text: `Status: You Won! Cashed at x${cashoutPoint?.toFixed(2)}`, color: 'text-green-400' };
      case 'crashed':
        return { text: `Status: Crashed at x${crashPoint?.toFixed(2)}`, color: 'text-red-500' };
      default:
        return { text: '', color: 'text-gray-400' };
    }
  };

  const { text, color } = getStatusContent();

  return (
    <div className="mt-4">
      <h3 className={`text-center ${color}`}>{text}</h3>
    </div>
  )
}

export default StatusDisplay;