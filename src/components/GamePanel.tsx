import { useState } from 'react'

function GamePanel() {
  const [count, setCount] = useState(0)

  return (
    <div className="game-panel">
      <h2 className="text-xl font-bold text-white mb-4">Game Panel</h2>
    </div>
  )
}

export default GamePanel
