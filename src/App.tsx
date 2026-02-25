import { useState } from 'react'
import GameControls from './components/GameControls'
import GamePanel from './components/GamePanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GameControls/>
      <GamePanel/>
    </>
  )
}

export default App
