import React, { useState } from 'react'
import { HeaderBar } from '../partial'
import styles from './Game.module.css'
import Card from '../card'
import classnames from 'classnames'

export default function Game() {
  const [ mode , setMode ] = useState(2)

  return (
    <div className={ styles.ui }>
      <HeaderBar mode={ mode } setMode={ setMode }/>
      <div className={styles.game}>
        <Card/>
      </div>
    </div>
  )
}
