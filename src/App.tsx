import { useState } from 'react'
import GameControls from './components/GameControls'
import GamePanel from './components/GamePanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="wrapper">
      <div className="container">
        <GameControls/>
        <GamePanel/>
      </div>
    </div>
  )
}

export default App
