import React, { useState, useEffect, useRef, useMemo } from 'react'
import classnames from 'classnames';
import styles from './Card.module.css'
import _ from 'lodash'

export default function Card(props) {
  const {cardPoint, cardSuit, cardDisplay, onMouseDown, onMouseUp, onCardMouseUp} = props
  const [ display, setDisplay ] = useState(false)
  const [suit, setSuit] = useState("")
  const [ point, setPoint ] = useState("")
  const [cardPosition, setCardPosition] = useState({x:0,y:0})
  const isRed = suit === "♥" || suit === "♦";
  const selected = props.selected || false

  useEffect(() => {
    if (selected) {
      const handleWindowMouseMove = ({ clientX, clientY }) => {
        setCardPosition({
          x: clientX - selected.x,
          y: clientY - selected.y,
        });
      };
      const handleWindowMouseUp = () => {
        onMouseUp();
      };
      window.addEventListener("mousemove", handleWindowMouseMove);
      window.addEventListener("mouseup", handleWindowMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleWindowMouseMove);
        window.removeEventListener("mouseup", handleWindowMouseUp);
      };
    } else {
      setCardPosition({ x: 0, y: 0 });
    }
  }, [selected, onMouseUp]);

  const cProps = useMemo(()=>({
    className: classnames(styles.card, {
      [styles.back]: !display,
      [styles.display]: display,
      [styles.selected]: selected,
    }),
    style: {
      position: "relative",
      transform:`translate(${cardPosition.x}px, ${cardPosition.y}px)`,
      cursor: selected ? '-webkit-grabbing' : '-webkit-grab',
      zIndex: selected ? 100 : 1,
    },
  }),[cardPosition.x, cardPosition.y, display, selected]);

  useEffect(()=> {
    if(cardPoint && cardSuit && cardDisplay){
      setDisplay(cardDisplay)
      setPoint(cardPoint)
      setSuit(cardSuit)
    }
  },[cardPoint, cardSuit, cardDisplay])

  if (onMouseDown) {
    cProps.onMouseDown = (e) => {
      if (e.button === 0) {
        const { clientX, clientY } = e;
        onMouseDown(clientX, clientY);
      }
    };
  }

  if (onCardMouseUp) cProps.onMouseUp = onCardMouseUp;

  return (
      <div 
      {...cProps}
       >
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
