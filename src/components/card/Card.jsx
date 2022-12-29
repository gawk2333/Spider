import React, { useState } from 'react'
import classnames from 'classnames';
import styles from './Card.module.css'

export default function Card() {
  const [ display, setDisplay ] = useState(true)
  const [suit, setSuit] = useState("♦")
  const [ point, setPoint ] = useState(3)
  const isRed = suit === "♥" || suit === "♦";

  return (
    display && (
    <div className={styles.cardWrapper}>
      <div className={styles.card}>
        <div className={styles.cardInner}></div>
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
          </div>
      </div>
    </div>)
  );
}
