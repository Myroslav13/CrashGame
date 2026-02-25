import { useState } from 'react'
import GameControls from './components/GameControls'
import GamePanel from './components/GamePanel'
import type { HistoryItem, GameStatus } from './components/interfaces'

function App() {
  const [bet, setBet] = useState(100)
  const [history] = useState<HistoryItem[]>([
    { id: '1', multiplier: 2.5, isWin: true },
    { id: '2', multiplier: 1.8, isWin: false },
    { id: '3', multiplier: 3.2, isWin: true },
  ])
  const [status, setStatus] = useState<GameStatus>('idle')
  const [currentWin] = useState(0)

  return (
    <div className="wrapper">
      <div className="container">
        <GameControls
          bet={bet}
          onBetChange={setBet}
          history={history}
          status={status}
          onStatusChange={setStatus}
          currentWin={currentWin}
        />
        <GamePanel/>
      </div>
    </div>
  )
}

export default App
