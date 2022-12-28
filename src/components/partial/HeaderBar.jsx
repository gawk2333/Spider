import React from 'react'

export default function HeaderBar({ mode, setMode}) {
  return (
    <div className='App-header'>
      <div className='App-logo'>Spider Solitaire</div>
      <select className='modeSelector' defaultValue={1}>
        <option value={0}>Easy</option>
        <option value={1}>Middle</option>
        <option value={2}>Hard</option>
      </select>
    </div>
  )
}
