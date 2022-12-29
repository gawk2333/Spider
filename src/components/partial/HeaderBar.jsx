import React from 'react'
import Select from 'react-select'

export default function HeaderBar({ mode, setMode}) {
  const options = [
    {value:0, label:'Easy'},
    {value:1, label:'Midium'},
    {value:2, label:'Hard'}
  ]
  return (
    <div className='App-header'>
      <div className='App-logo'>Spider Solitaire</div>
      <div className='spacer'/>
      <Select 
      className='modeSelector'
      defaultValue={1}
      options={options}/>
    </div>
  )
}
