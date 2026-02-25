import { useState } from 'react'
import GameControls from './components/GameControls'
import GamePanel from './components/GamePanel'
import type { HistoryItem, GameStatus } from './components/interfaces'

function generateCrashPoint() {
  return Number((1.2 + Math.random() * 8.8).toFixed(2))
}

function App() {
  const [balance, setBalance] = useState(1000)
  const [bet, setBet] = useState(100)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [status, setStatus] = useState<GameStatus>('idle')
  const [roundBet, setRoundBet] = useState(100)
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
      setRoundBet(bet)
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
      setBalance((prev) => prev + roundBet * settled)
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
      setBalance((prev) => prev - roundBet)
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
          balance={balance}
          bet={bet}
          roundBet={roundBet}
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
