import React, { useState, useEffect, useCallback } from 'react'
import { HeaderBar } from '../partial'
import styles from './Game.module.css'
import Card from '../card'
import classnames from 'classnames'
import { ALL_POINTS, POINTS_MAP, pointLess } from './constants'
import _ from 'lodash'

const SUITS_NUM = 2

export default function Game () {
  const [allCards, setAllCards] = useState([])
  const [mode, setMode] = useState(2)
  const [cards, setCards] = useState([[], [], [], [], [], [], [], [], [], []])
  const [selectedCard, setSelectedCard] = useState(null)
  const [finishedCards, setFinishedCards] = useState([])
  const [score, setScore] = useState(500)
  const [history, setHistory] = useState([])
  const [hints, setHints] = useState([])
  const [hintIndex, setHintIndex] = useState(0)
  const [hintSrc, setHintSrc] = useState(null)
  const [hintDest, setHintDest] = useState(null)

  /**
  * shuffle an array
  * @param {array} arr
  */
  const shuffle = (arr) => {
    arr.sort(() => Math.random() - 0.5)
  }

  /**
   * select a card
   * @param {number} col column of selected card
   * @param {number} row row of selected card
   * @param {boolean} display display of selected card
   * @param {number} x clientX of selected card
   * @param {number} y clientY of selected card
   */
  const select = (col, row, display, x, y) => {
    if (!display) return
    if (selectedCard === null && canMoveFrom(col, row)) {
      setSelectedCard({ col, row, pos: { x, y } })
    }
  }

  /**
   * get the point less than before
   * @param {string} point
   * @returns {string}
   */
  const getNextPoint = (point) => {
    if (POINTS_MAP[point] - 1 < 0) return '-1'
    return ALL_POINTS[POINTS_MAP[point] - 1]
  }

  /**
   * get the point greater than before
   * @param {string} point
   * @returns {string}
   */
  const getPrevPoint = (point) => {
    if (POINTS_MAP[point] + 1 > 12) return '-1'
    return ALL_POINTS[POINTS_MAP[point] + 1]
  }

  /**
   * Clear selected card when mouse up
   */
  const handleWindowMouseUp = useCallback(() => {
    setSelectedCard(null)
  }, [])

  const canMoveFrom = (col, row) => {
    const len = cards[col].length
    const movedCards = cards[col].slice(row, len)
    if (movedCards.length <= 0) {
      return false
    }
    let point = movedCards[0].point
    const suit = movedCards[0].suit
    for (const c of movedCards) {
      if (c.point !== point || c.suit !== suit) return false
      point = getNextPoint(point)
    }
    return true
  }

  /**
   * Check if selected card can move to the certain column
   * @param {number} col
   * @param {string} point
   * @returns {boolean}
   */
  const canMoveTo = (col, point) => {
    if (
      cards[col].length > 0 &&
      point !== getNextPoint(cards[col][cards[col].length - 1].point)
    ) {
      return false
    }
    return true
  }

  /**
   *
   * @param {number} dest dest column
   * @param {array} movedCards moved card stack
   * @returns {boolean || number}
   */
  const canMerge = (dest, movedCards) => {
    // If the top of the moved card stack is not A, return false
    if (movedCards[movedCards.length - 1].point !== 'A') return false

    // Check moved card stack one by one to see if it is end with K
    const suit = movedCards[0].suit
    let point = getPrevPoint(movedCards[0].point)
    let i = cards[dest].length - 1
    while (
      i >= 0 &&
      cards[dest][i].point === point &&
      cards[dest][i].suit === suit
    ) {
      point = getPrevPoint(point)
      i--
    }
    if (i + 1 < cards[dest].length && cards[dest][i + 1].point === 'K') {
      return i + 1
    } else {
      return false
    }
  }

  /**
   * [core] move
   * @param {number} src source column
   * @param {number} dest dest column
   * @param {number} srcRow source row
   * @returns
   */
  const move = (src, dest, srcRow) => {
    const len = cards[src].length
    const movedCards = cards[src].slice(srcRow, len)
    const remainCards = cards[src].slice(0, srcRow)

    const historyItem = { src, dest, num: movedCards.length }

    // check if needs to flip card
    if (
      remainCards.length > 0 &&
      !remainCards[remainCards.length - 1].display
    ) {
      // flip card
      historyItem.flip = true
      remainCards[remainCards.length - 1].display = true
    } else {
      historyItem.flip = false
    }

    // Check if the card stack is clearable
    const r = canMerge(dest, movedCards)

    if (r !== false) {
      // Is clearable
      historyItem.type = 'merge'
      const destRemovedCards = cards[dest].slice(r)
      cards[dest] = cards[dest].slice(0, r)
      if (
        cards[dest].length > 0 &&
        !cards[dest][cards[dest].length - 1].display
      ) {
        cards[dest][cards[dest].length - 1].display = true
        historyItem.mergeWithFlip = true
      } else {
        historyItem.mergeWithFlip = false
      }
      setFinishedCards([...finishedCards, ...destRemovedCards, ...movedCards])
      setScore(score + 100)
    } else {
      // move
      historyItem.type = 'move'
      cards[dest] = [...cards[dest], ...movedCards]
      setScore(score - 1)
    }
    cards[src] = remainCards
    setCards([...cards])
    setHistory([...history, historyItem])
    return true
  }

  const undo = () => {
    if (history.length > 0) {
      const modifiedHistory = _.cloneDeep(history)
      const prevCards = _.cloneDeep(cards)
      const last = _.last(history)
      const { src, dest, num, flip, type } = last
      if (type === 'move') {
        if (flip) {
          prevCards[src][cards[src].length - 1].display = false
        }
        forceMove(src, dest, num, prevCards)
      }
      if (type === 'merge') {
        const mergedCards = finishedCards.slice(finishedCards.length - 13, finishedCards.length)
        if (last.mergeWithFlip) {
          prevCards[dest][prevCards[dest].length - 1].display = false
        }
        prevCards[dest] = [...prevCards[dest], ...mergedCards.slice(0, mergedCards.length - 1 - num)]
        prevCards[src] = [...prevCards[src], ...mergedCards.slice(mergedCards.length - num, mergedCards.length)]
        setCards([...prevCards])
        setFinishedCards(finishedCards.slice(0, finishedCards.length - 13))
      }
      if (type === 'deal') {
        const dealedCards = []
        prevCards.map((col) => {
          const lastCard = col.pop()
          dealedCards.push(lastCard)
        })
        setCards([...prevCards])
        setAllCards([...allCards, ...dealedCards])
      }
      modifiedHistory.pop()
      setHistory(modifiedHistory)
    }
  }

  const forceMove = (src, dest, num, prevCards) => {
    const len = prevCards[dest].length
    const movedCards = prevCards[dest].slice(len - num, len)
    const remainCard = prevCards[dest].slice(0, len - num)
    prevCards[src] = [...prevCards[src], ...movedCards]
    prevCards[dest] = [...remainCard]
    setCards([...prevCards])
  }

  const restart = () => {
    const data = getInitGameState()
    if (data) {
      setAllCards(data[1])
      setCards(data[0])
      setScore(500)
      setHintDest(null)
      setHintSrc(null)
      setHintIndex(0)
    }
  }

  const generateHints = () => {
    const hintsT = []
    for (let i = 0; i < 10; i++) {
      if (cards[i].length === 0) {
        console.log('empty column')
      } else {
        const card = cards[i][cards[i].length - 1]
        for (let j = 0; j < 10; j++) {
          if (i === j || cards[j].length === 0) continue
          let row = cards[j].length - 1
          let { suit, point } = cards[j][row]
          while (
            row >= 0 &&
            cards[j][row].display &&
            suit === cards[j][row].suit &&
            point === cards[j][row].point &&
            pointLess(point, card.point)
          ) {
            point = getPrevPoint(point)
            row--
          }
          if (row + 1 >= cards[j].length) continue
          if (cards[j][row + 1].point === getNextPoint(card.point)) {
            const hintsItem = {
              src: j,
              srcRow: row + 1,
              dest: i,
              priority: 2
            }
            if (
              row >= 0 &&
              cards[j][row].display &&
              cards[j][row].point === getPrevPoint(cards[j][row + 1].point)
            ) {
              hintsItem.priority = 1
            }
            if (cards[j][row + 1].suit === card.suit) {
              hintsItem.priority += 1
            }
            hintsT.push(hintsItem)
          }
        }
      }
    }
    hintsT.sort((a, b) => {
      if (a.priority > b.priority) {
        return -1
      } else if (a.priority < b.priority) {
        return 1
      } else {
        return 0
      }
    })
    return hintsT
  }

  const hint = () => {
    if (hints.length) {
      setHintSrc({
        col: hints[hintIndex].src,
        row: hints[hintIndex].srcRow
      })
      setHintDest(hints[hintIndex].dest)
      setHintIndex((hintIndex + 1) % hints.length)
    }
  }

  const moreCards = () => {
    for (let i = 0; i < 10; i++) {
      const card = allCards.pop()
      card.display = true
      cards[i].push(card)
    }
    setSelectedCard(null)
    setAllCards([...allCards])
    setCards([...cards])
    setHistory([...history, { type: 'deal' }])
  }

  /**
   *
   * @param {number} col dest column
   * @param {number} row dest column
   * @param {boolean} eventCardDisplay selectedcard display
   */
  const handleCardMouseUp = (col, row, eventCardDisplay) => {
    if (
      eventCardDisplay &&
      selectedCard &&
      selectedCard.col !== col &&
      canMoveTo(col, cards[selectedCard.col][selectedCard.row].point)
    ) {
      move(selectedCard.col, col, selectedCard.row)
      setSelectedCard(null)
    }
  }

  /**
   * Initialize game state
   */
  const getInitGameState = useCallback(() => {
    let ALL_SUITS
    if (mode === 2) {
      ALL_SUITS = ['♠', '♥', '♣', '♦']
    } else if (mode === 1) {
      ALL_SUITS = ['♠', '♥', '♠', '♥']
    } else if (mode === 0) {
      ALL_SUITS = ['♠', '♠', '♠', '♠']
    }

    let lastIndex = 0
    const allCardsT = []
    const cardsT = [[], [], [], [], [], [], [], [], [], []]
    for (let i = 0; i < SUITS_NUM; i++) {
      for (const suit of ALL_SUITS) {
        for (const point of ALL_POINTS) {
          allCardsT.push({
            index: lastIndex++,
            point,
            suit,
            display: false
          })
        }
      }
    }

    shuffle(allCardsT)

    for (let i = 0; i < 10; i++) {
      const t = i < 4 ? 6 : 5
      for (let j = 0; j < t; j++) {
        const card = allCardsT.pop()
        if (j === t - 1) {
          card.display = true
        }
        cardsT[i].push(card)
      }
    }
    return [cardsT, allCardsT]
  }, [mode])

  useEffect(() => {
    const data = getInitGameState()
    if (data) {
      setAllCards(data[1])
      setCards(data[0])
      setScore(500)
      setHintDest(null)
      setHintSrc(null)
      setHintIndex(0)
    }
  }, [getInitGameState])

  useEffect(() => {
    setHints(generateHints())
    setHintDest(null)
    setHintSrc(null)
    setHintIndex(0)
  }, [cards])

  return (
    <div className={ styles.ui }>
      <HeaderBar
        setMode={ setMode }
        score={ score }
        restart={ restart }
        hint={ hint }
        undo={ undo }/>
      <div className={styles.game}>
        {cards.map((col, colIndex) => {
          return <div className={classnames(styles.column, {
            [styles.column12]: col.length >= 12,
            [styles.column18]: col.length >= 18,
            [styles.column24]: col.length >= 24,
            [styles.column30]: col.length >= 30
          }
          )}
          key={`col-${colIndex}`}
          >
            <div className={styles.holderWrapper}>
              <div className={styles.holder}
                onMouseUp={() => handleCardMouseUp(colIndex, 0, true)}
              >
                <div className={styles.holderInner}>
                </div>
              </div>
            </div>
            {col.map(({ point, suit, display, index }, rowIndex) => {
              return (
                <div
                  className={classnames(styles.cardWrapper, {
                    [styles.display]: display
                  })}
                  key={`card-${index}`}>
                  <Card
                    cardPoint={point}
                    cardSuit={suit}
                    cardDisplay={display}
                    selected={
                      selectedCard &&
                                  rowIndex >= selectedCard.row &&
                                  colIndex === selectedCard.col
                        ? selectedCard.pos
                        : false
                    }
                    flash={
                      hintDest === colIndex &&
                      rowIndex === col.length - 1
                    }
                    flashSrc={
                      hintSrc &&
                      hintSrc.col === colIndex &&
                      hintSrc.row <= rowIndex
                    }
                    onMouseDown={(x, y) => {
                      select(colIndex, rowIndex, display, x, y)
                    }}
                    onMouseUp={handleWindowMouseUp}
                    onCardMouseUp={() => handleCardMouseUp(colIndex, rowIndex, display)}
                  />
                </div>
              )
            })}
          </div>
        })}
      </div>
      <div className={styles.control}>
        <div className={styles.cardStack}>
          {[...Array(Math.floor(finishedCards.length / 13)).keys()].map(
            (i) => {
              return (
                <div className={styles.horizenWrapper} key={i}>
                  <Card
                    cardPoint={'K'}
                    cardSuit={finishedCards[i * 13].suit}
                    cardDisplay={true}
                  />
                </div>
              )
            }
          )}
        </div>
        <div className="spacer"></div>
        <div className={classnames(styles.cardStack, 'rotated')}>
          {[...Array(Math.floor(allCards.length / 10)).keys()].map((i) => {
            return (
              <div className={styles.horizenWrapper} key={i}>
                <Card cardPoint={'A'} cardSuit={'♠'} onClick={moreCards} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
