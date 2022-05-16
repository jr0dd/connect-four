/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7
const HEIGHT = 6

let currPlayer = 1 // active player: 1 or 2
let board = [] // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
const makeBoard = () => {
  board = Array.from(Array(HEIGHT), () => new Array(WIDTH).fill(null))
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  const htmlBoard = document.getElementById('board')

  // create the top row that will add game pieces on click
  const top = document.createElement('tr')
  top.setAttribute('id', 'column-top')
  top.addEventListener('click', handleClick)

  for (let x = 0; x < WIDTH; x++) {
    // top row buttons
    const headCell = document.createElement('td')
    headCell.setAttribute('id', x)

    // adding a hover animation
    const dropText = document.createElement('div')
    dropText.innerText = 'drop'
    headCell.append(dropText)

    const dropButton = document.createElement('div')
    dropButton.classList.add('hide')
    dropButton.innerText = '⬇︎'
    headCell.append(dropButton)

    top.append(headCell)
  }
  htmlBoard.append(top)

  // create each cell with a unique id
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr')
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td')
      cell.setAttribute('id', `${y}-${x}`)
      row.append(cell)
    }
    htmlBoard.append(row)
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  for (let y = HEIGHT - 1; y >= 0; y--) {
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

/** endGame: announce game end */
const endGame = (msg) => {
  const top = document.getElementById('column-top')
  top.removeEventListener('click', handleClick)
  alert(msg)

  // create restart button in place of h3
  const title = document.getElementById('title')
  const h3 = document.querySelector('#title h3')
  title.removeChild(h3)
  const restartBtn = document.createElement('button')
  restartBtn.setAttribute('id', 'restart')
  restartBtn.innerText = 'Restart'
  title.append(restartBtn)
  restartBtn.addEventListener('click', restartGame)
}

// restart the game
const restartGame = () => {
  // cleanup restart button
  const restartBtn = document.getElementById('restart')
  restartBtn.removeEventListener('click', restartGame)
  restartBtn.remove()

  // add title h3 back
  const title = document.getElementById('title')
  const h3 = document.createElement('h3')
  h3.innerText = 'Click drop to begin!'
  title.append(h3)

  // clean up board
  makeBoard()
  const pieces = document.querySelectorAll('.piece')
  pieces.forEach((piece) => piece.remove())
  const top = document.getElementById('column-top')
  top.addEventListener('click', handleClick)
  currPlayer = 1
}

/** handleClick: handle click of column top to play piece */
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

  // fix player because of timer on checkForWin()
  const lastPlayer = currPlayer

  // check for win
  if (checkForWin()) {
    setTimeout(() => {
      endGame(`Player ${lastPlayer} won!`)
    }, 600)
  }

  // check for tie
  if (board.every((row) => row.every((col) => col)) && !checkForWin()) {
    setTimeout(() => {
      endGame('Oof! Tie game...')
    }, 600)
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    )
  }

  // check winning combinations
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
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
