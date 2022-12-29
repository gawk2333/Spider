import React, { useState, useEffect } from 'react'
import classnames from 'classnames';
import styles from './Card.module.css'

export default function Card({cardPoint, cardSuit, cardDisplay, cardIndex}) {
  const [ display, setDisplay ] = useState(false)
  const [suit, setSuit] = useState("♦")
  const [ point, setPoint ] = useState(3)
  const isRed = suit === "♥" || suit === "♦";

  const cProps = {
    className: classnames(styles.card, {
      [styles.back]: !display,
      [styles.display]: display,
    }),
    style: {
      position: "relative",
    },
  };

  useEffect(()=> {
    if(cardPoint && cardSuit && cardDisplay){
      setDisplay(cardDisplay)
      setPoint(cardPoint)
      setSuit(cardSuit)
    }
  },[cardPoint, cardSuit, cardDisplay])

  return (
      <div {...cProps}>
        <div className={styles.cardInner}></div>
        {display && (
          <div className={styles.content}>
            <div
              className={classnames(styles.text, {
                [styles.red]: isRed,
              })}
            >
              <div>{point}</div>
              <div className="spacer"></div>
              <div>{suit}</div>
            </div>
            <div className="spacer" />
            <div
              className={classnames("rotated", styles.text, {
                [styles.red]: isRed,
              })}
            >
              <div>{point}</div>
              <div className="spacer"></div>
              <div>{suit}</div>
            </div>
          </div>)}
      </div>
    )
}
