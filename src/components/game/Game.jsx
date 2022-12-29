import React, { useState, useEffect, useCallback } from 'react'
import { HeaderBar } from '../partial'
import styles from './Game.module.css'
import Card from '../card'
import classnames from 'classnames'
import { ALL_POINTS, POINTS_MAP } from './constants'

const SUITS_NUM = 2

export default function Game() {
  const [allCards, setAllCards] = useState([])
  const [ mode , setMode ] = useState(2)
  const [cards, setCards] = useState([[], [], [], [], [], [], [], [], [], []]);

  const shuffle = (arr) => {
    arr.sort(() => Math.random() - 0.5);
  };

  const getInitGameState = useCallback(() => {
    let ALL_SUITS;
    if (mode === 2) {
      ALL_SUITS = ["♠", "♥", "♣", "♦"];
    } else if (mode === 1) {
      ALL_SUITS = ["♠", "♥", "♠", "♥"];
    } else if (mode === 0) {
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
    const data = getInitGameState()
    if(data){
      setAllCards(data[1])
      setCards(data[0])
    }
  },[getInitGameState])

  return (
    <div className={ styles.ui }>
      <HeaderBar mode={ mode } setMode={ setMode }/>
      <div className={styles.game}>
        {cards.map( (col, index) => {
          return <div className={classnames(styles.column, {
                  [styles.column12]: col.length >= 12,
                  [styles.column18]: col.length >= 18,
                  [styles.column24]: col.length >= 24,
                  [styles.column30]: col.length >= 30,
                }
              )}
              key={index}
              >
                <div className={styles.holderWrapper}>
                  <div className={styles.holder}>
                    <div className={styles.holderInner}>
                    </div>
                    </div>
                  </div>
                      {col.map(({ point, suit, display, index }, rowIndex)=> {
                        return (
                          <div className={styles.cardWrapper}>
                              <Card
                                cardPoint={point}
                                cardSuit={suit}
                                cardDisplay={display}
                                cardIndex={index}
                                key={rowIndex}
                                />
                            </div>
                            )
                      })}

              </div>
            })}
          </div>
        </div>
      )
}
