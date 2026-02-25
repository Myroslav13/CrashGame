import BetInput from './control-panel/BetInput'
import StartButton from './control-panel/StartButton'
import StatusDisplay from './control-panel/StatusDisplay'
import History from './control-panel/History'
import type { GameStatus, HistoryItem } from './interfaces'
import CashoutButton from './control-panel/CashoutButton'

interface GameControlsProps {
  balance: number;
  bet: number;
  roundBet: number;
  onBetChange: (newBet: number) => void;
  history: HistoryItem[];
  status: GameStatus;
  onStatusChange: (status: GameStatus) => void;
  currentWin: number;
  crashPoint?: number;
  cashoutPoint?: number;
}

function GameControls({ balance, bet, roundBet, onBetChange, history, status, onStatusChange, currentWin, crashPoint, cashoutPoint }: GameControlsProps) {

  return (
    <div className="game-controls">
      <BetInput bet={bet} onBetChange={onBetChange} disabled={status === 'running'} />
      { status !== 'running' ?
        <StartButton onStart={() => onStatusChange('running')} disabled={bet <= 0 || bet > balance} />
        :
        <CashoutButton onCashout={() => onStatusChange('cashed_out')} disabled={status !== 'running'} currentWin={currentWin} />
      }
      <StatusDisplay roundBet={roundBet} status={status} crashPoint={crashPoint} cashoutPoint={cashoutPoint} />
      <History items={history} />
    </div>
  )
}

export default GameControls