import { useState } from 'react'
import GameControls from './components/GameControls'
import GamePanel from './components/GamePanel'
import type { HistoryItem, GameStatus } from './components/interfaces'

function generateCrashPoint() {
  return Number((1.1 + Math.random() * 4.4).toFixed(2))
}

function App() {
  const [bet, setBet] = useState(100)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [status, setStatus] = useState<GameStatus>('idle')
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [currentWin, setCurrentWin] = useState(0)
  const [crashPoint, setCrashPoint] = useState<number | undefined>(undefined)
  const [cashoutPoint, setCashoutPoint] = useState<number | undefined>(undefined)

  function pushHistory(multiplier: number, isWin: boolean) {
    setHistory((prev) => [
      { id: crypto.randomUUID(), multiplier, isWin },
      ...prev,
    ].slice(0, 5))
  }

  function handleStatusChange(nextStatus: GameStatus) {
    if (nextStatus === 'running') {
      const nextCrashPoint = generateCrashPoint()
      setCrashPoint(nextCrashPoint)
      setCashoutPoint(undefined)
      setCurrentMultiplier(1)
      setCurrentWin(0)
      setStatus('running')
      return
    }

    if (nextStatus === 'cashed_out' && status === 'running') {
      const settled = Number(currentMultiplier.toFixed(2))
      setCashoutPoint(settled)
      setCurrentWin(bet * settled)
      setStatus('cashed_out')
      pushHistory(settled, true)
      return
    }

    setStatus(nextStatus)
  }

  function handleMultiplierChange(multiplier: number) {
    const rounded = Number(multiplier.toFixed(2))
    setCurrentMultiplier(rounded)

    if (status !== 'running') {
      return
    }

    setCurrentWin(bet * rounded)

    if (crashPoint !== undefined && rounded >= crashPoint) {
      setStatus('crashed')
      setCurrentWin(0)
      setCashoutPoint(undefined)
      pushHistory(crashPoint, false)
    }
  }

  const settledMultiplier = status === 'cashed_out'
    ? (cashoutPoint ?? currentMultiplier)
    : status === 'crashed'
      ? (crashPoint ?? currentMultiplier)
      : currentMultiplier

  return (
    <div className="wrapper">
      <div className="container">
        <GameControls
          bet={bet}
          onBetChange={setBet}
          history={history}
          status={status}
          onStatusChange={handleStatusChange}
          currentWin={currentWin}
          crashPoint={crashPoint}
          cashoutPoint={cashoutPoint}
        />
        <GamePanel
          status={status}
          settledMultiplier={settledMultiplier}
          onMultiplierChange={handleMultiplierChange}
        />
      </div>
    </div>
  )
}

export default App
