import React, { useState, useEffect, useCallback } from 'react'
import { HeaderBar } from '../partial'
import styles from './Game.module.css'
import Card from '../card'
import classnames from 'classnames'
import { ALL_POINTS, POINTS_MAP } from './constants'

const SUITS_NUM = 2

export default function Game() {
  const [ mode , setMode ] = useState(2)

  const shuffle = (arr) => {
    arr.sort(() => Math.random() - 0.5);
  };

  const getInitGameState = useCallback(() => {
    let ALL_SUITS;
    if (mode === 3) {
      ALL_SUITS = ["♠", "♥", "♣", "♦"];
    } else if (mode === 2) {
      ALL_SUITS = ["♠", "♥", "♠", "♥"];
    } else if (mode === 1) {
      ALL_SUITS = ["♠", "♠", "♠", "♠"];
    }
  
    let lastIndex = 0;
    let allCardsT = [];
    let cardsT = [[], [], [], [], [], [], [], [], [], []];
    for (let i = 0; i < SUITS_NUM; i++) {
      for (let suit of ALL_SUITS) {
        for (let point of ALL_POINTS) {
          allCardsT.push({
            index: lastIndex++,
            point,
            suit,
            display: false,
          });
        }
      }
    }
 
    shuffle(allCardsT);
  
    for (let i = 0; i < 10; i++) {
      let t = i < 4 ? 6 : 5;
      for (let j = 0; j < t; j++) {
        let card = allCardsT.pop();
        if (j === t - 1) {
          card.display = true;
        }
        cardsT[i].push(card);
      }
    }
    return [cardsT, allCardsT];
  },[mode]);

  useEffect(()=> {
    const result = getInitGameState()
    console.log('result',result)
  },[getInitGameState])

  return (
    <div className={ styles.ui }>
      <HeaderBar mode={ mode } setMode={ setMode }/>
      <div className={styles.game}>
        <Card/>
      </div>
    </div>
  )
}
