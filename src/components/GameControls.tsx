import { useState } from 'react'
import BetInput from './control-panel/BetInput'
import StartButton from './control-panel/StartButton'
import StatusDisplay from './control-panel/StatusDisplay'
import History from './control-panel/History'

function GameControls() {
  const [count, setCount] = useState(0)

  return (
    <div className="game-controls">
      <BetInput bet={count} onBetChange={setCount} disabled={false} />
      <StartButton onStart={() => {}} disabled={false} />
      <StatusDisplay status="idle" />
      <History items={[]} />
    </div>
  )
}

export default GameControls