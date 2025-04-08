// src/App.tsx

import React from 'react'
import { Board } from './components/board'
import Hand from './components/hand'

function App() {
  return (
<div className="main-layout">
  <div className="left-panel">
    <h1>Chessbreaker sans breaker</h1>
    <div className="board-wrapper">
      <Board />
    </div>
  </div>

  <div className="right-panel">
    <Hand />
  </div>
</div>


  )
}

export default App
