import BetInput from './control-panel/BetInput'
import StartButton from './control-panel/StartButton'
import StatusDisplay from './control-panel/StatusDisplay'
import History from './control-panel/History'
import type { GameStatus, HistoryItem } from './interfaces'
import CashoutButton from './control-panel/CashoutButton'

interface GameControlsProps {
  bet: number
  onBetChange: (newBet: number) => void
  history: HistoryItem[]
  status: GameStatus
  onStatusChange: (status: GameStatus) => void
  currentWin: number
}

function GameControls({ bet, onBetChange, history, status, onStatusChange, currentWin }: GameControlsProps) {

  return (
    <div className="game-controls">
      <BetInput bet={bet} onBetChange={onBetChange} disabled={status === 'running'} />
      { status === 'idle' ?
        <StartButton onStart={() => onStatusChange('running')} disabled={status !== 'idle'} />
        :
        <CashoutButton onCashout={() => onStatusChange('cashed_out')} disabled={status !== 'running'} currentWin={currentWin} />
      }
      <StatusDisplay status={status} />
      <History items={history} />
    </div>
  )
}

export default GameControls