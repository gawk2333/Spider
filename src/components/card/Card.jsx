import React, { useState, useEffect, useMemo } from 'react'
import classnames from 'classnames'
import styles from './Card.module.css'

export default function Card (props) {
  const { cardPoint, cardSuit, cardDisplay, onMouseDown, onMouseUp, onCardMouseUp, onClick } = props
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 })
  const isRed = cardSuit === '♥' || cardSuit === '♦'
  const selected = props.selected || false

  useEffect(() => {
    if (selected) {
      const handleWindowMouseMove = ({ clientX, clientY }) => {
        setCardPosition({
          x: clientX - selected.x,
          y: clientY - selected.y
        })
      }
      const handleWindowMouseUp = () => {
        onMouseUp()
      }
      window.addEventListener('mousemove', handleWindowMouseMove)
      window.addEventListener('mouseup', handleWindowMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleWindowMouseMove)
        window.removeEventListener('mouseup', handleWindowMouseUp)
      }
    } else {
      setCardPosition({ x: 0, y: 0 })
    }
  }, [selected, onMouseUp])

  const cProps = useMemo(() => ({
    className: classnames(styles.card, {
      [styles.back]: !cardDisplay,
      [styles.display]: cardDisplay,
      [styles.selected]: selected
    }),
    style: {
      position: 'relative',
      transform: `translate(${cardPosition.x}px, ${cardPosition.y}px)`,
      cursor: selected ? '-webkit-grabbing' : '-webkit-grab',
      zIndex: selected ? 100 : 1
    }
  }), [cardPosition.x, cardPosition.y, cardDisplay, selected])

  if (onMouseDown) {
    cProps.onMouseDown = (e) => {
      if (e.button === 0) {
        const { clientX, clientY } = e
        onMouseDown(clientX, clientY)
      }
    }
  }

  if (onCardMouseUp) cProps.onMouseUp = onCardMouseUp

  if (onClick) cProps.onClick = onClick

  return (
    <div
      {...cProps}
    >
      <div className={styles.cardInner}></div>
      {cardDisplay && (
        <div className={styles.content}>
          <div
            className={classnames(styles.text, {
              [styles.red]: isRed
            })}
          >
            <div>{cardPoint}</div>
            <div className="spacer"></div>
            <div>{cardSuit}</div>
          </div>
          <div className="spacer" />
          <div
            className={classnames('rotated', styles.text, {
              [styles.red]: isRed
            })}
          >
            <div>{cardPoint}</div>
            <div className="spacer"></div>
            <div>{cardSuit}</div>
          </div>
        </div>)}
    </div>
  )
}
