import React from 'react'
import styles from './HeaderBar.module.css'
import Select from 'react-select'

export default function HeaderBar ({ setMode, score, undo, restart }) {
  const options = [
    { value: 0, label: 'Easy' },
    { value: 1, label: 'Midium' },
    { value: 2, label: 'Hard' }
  ]

  const customStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
      border: '1px solid black'
    }),
    control: (base) => ({
      ...base,
      border: '1px solid black'
    })
  }
  return (
    <div className={styles.header}>
      <div className={styles.logo}>Spider Solitaire</div>
      <div className='spacer'/>
      <span className={styles.btn} onClick={() => restart()}>Restart</span>
      <div className='spacer'/>
      <span className={styles.btn} onClick={() => undo()}>Undo</span>
      <div className='spacer'/>
      <Select
        styles={customStyles}
        defaultValue={options[2]}
        onChange={(e) => setMode(e.value)}
        options={options}/>
      <div className='spacer'></div>
      <span className={ styles.score }>Score: {score}</span>
    </div>
  )
}
