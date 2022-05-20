const width = 7
const height = 6

let currPlayer = 1
let board = []

// matrix array for storing piece locations
const makeBoard = () => {
  board = Array.from(Array(height), () => new Array(width).fill(null))
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  const htmlBoard = document.getElementById('board')

  // handle start button
  const startBtn = document.getElementById('start-button')
  startBtn.classList.add('start')
  startBtn.addEventListener('click', startGame)

  // create the top row that will add game pieces on click
  const top = document.createElement('tr')
  top.setAttribute('id', 'column-top')
  top.classList.add('disabled')

  for (let x = 0; x < width; x++) {
    // top row buttons
    const headCell = document.createElement('td')
    headCell.setAttribute('id', x)

    // adding a hover animation
    const dropText = document.createElement('div')
    dropText.innerText = 'drop'
    headCell.append(dropText)
    const dropBtn = document.createElement('div')
    dropBtn.innerText = '⬇︎'
    dropBtn.classList.add('arrow')
    headCell.append(dropBtn)

    top.append(headCell)
  }
  htmlBoard.append(top)

  // create each cell with a unique id
  for (let y = 0; y < height; y++) {
    const row = document.createElement('tr')
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('td')
      cell.setAttribute('id', `${y}-${x}`)
      row.append(cell)
    }
    htmlBoard.append(row)
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  for (let y = height - 1; y >= 0; y--) {
    if (board[y][x] !== null) {
      continue
    }
    return y
  }
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
  const piece = document.createElement('div')
  piece.classList.add('piece', `p${currPlayer}`)
  const cell = document.getElementById(`${y}-${x}`)
  cell.append(piece)
}

// start game
const startGame = () => {
  const top = document.getElementById('column-top')
  top.addEventListener('click', handleClick)
  top.classList.remove('disabled')

  // add arrow animation
  const arrows = document.querySelectorAll('.arrow')
  arrows.forEach((arrow) => arrow.classList.add('animate'))

  // update h3 text
  const h3 = document.querySelector('h3')
  h3.innerText = 'Click a drop button to make your move'

  // update start button
  const startBtn = document.getElementById('start-button')
  startBtn.classList.remove('start')
  startBtn.removeEventListener('click', startGame)
  startBtn.classList.add('restart')
  startBtn.addEventListener('click', restartGame)
}

// end game
const endGame = (msg) => {
  const top = document.getElementById('column-top')
  top.classList.add('disabled')
  top.removeEventListener('click', handleClick)
  alert(msg)

  // remove arrow animation
  const arrows = document.querySelectorAll('.arrow')
  arrows.forEach((arrow) => arrow.classList.remove('animate'))

  // update h3 text
  const h3 = document.querySelector('h3')
  h3.innerText = 'Restart Game?'
}

// restart the game
const restartGame = () => {
  // add arrow animation
  const arrows = document.querySelectorAll('.arrow')
  arrows.forEach((arrow) => arrow.classList.add('animate'))

  // update h3 text
  const h3 = document.querySelector('h3')
  h3.innerText = 'Click a drop button to make your move'

  // clean up board
  const pieces = document.querySelectorAll('.piece')
  pieces.forEach((piece) => piece.remove())
  const top = document.getElementById('column-top')
  top.classList.remove('disabled')
  top.addEventListener('click', handleClick)
  makeBoard()
  currPlayer = 1
}

// handle click of top row 
const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.parentNode.id

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x)
  if (y === null) {
    return
  }

  // place piece in board and add to HTML table
  placeInTable(y, x)
  board[y][x] = currPlayer

  // check for win
  if (checkForWin()) {
    setTimeout(() => {
      endGame(`Player ${currPlayer} won!`)
    }, 600)
  } else {
    // switch players
    currPlayer = currPlayer === 1 ? 2 : 1
  }

  // check for tie
  if (board.every((row) => row.every((col) => col)) && !checkForWin()) {
    setTimeout(() => {
      endGame('Oof! Tie game...')
    }, 600)
  }
}

// check for winner
const checkForWin = () => {
  const _win = (cells) => {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < height &&
        x >= 0 &&
        x < width &&
        board[y][x] === currPlayer
    )
  }

  // check winning combinations
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // horizontal win
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ]
      // vertical win
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ]
      // diagonal down right win
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ]
      // diagonal down left win
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ]

      // check for win
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true
      }
    }
  }
}

makeBoard()
makeHtmlBoard()
