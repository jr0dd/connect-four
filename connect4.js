class Game {
  constructor(p1 = new Player('#d05864'), p2 = new Player('#75d0e5'), height = 6, width = 7, ) {
    this.width = width
    this.height = height
    this.players = [p1, p2]
    this.p1 = p1
    this.p2 = p2
    this.currPlayer = p1
    this.board = []
    this.makeBoard()
    this.makeHtmlBoard()
  }

  // matrix array for storing piece locations
  makeBoard() {
    this.board = Array.from(Array(this.height), () => new Array(this.width).fill(null))
  }
  
  // makeHtmlBoard: make HTML table and row of column tops.
  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board')
    htmlBoard.innerHTML = ''

    // set default color in picker
    document.getElementById('p1').value = this.p1.color
    document.getElementById('p2').value = this.p2.color

    // handle start button
    const startBtn = document.getElementById('start-button')
    startBtn.classList.add('start')
    this.startClick = this.startGame.bind(this)
    startBtn.addEventListener('click', this.startClick)

    // create the top row that will add game pieces on click
    const top = document.createElement('tr')
    top.setAttribute('id', 'column-top')
    top.classList.add('disabled')

    for (let x = 0; x < this.width; x++) {
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
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr')
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td')
        cell.setAttribute('id', `${y}-${x}`)
        row.append(cell)
      }
      htmlBoard.append(row)
    }
  }

  // findSpotForCol: given column x, return top empty y (null if filled)
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] !== null) {
        continue
      }
      return y
    }
    return null
  }

  // placeInTable: update DOM to place piece into HTML table of board
  placeInTable(y, x) {
    const piece = document.createElement('div')
    piece.classList.add('piece')
    piece.style.backgroundColor = this.currPlayer.color
    const cell = document.getElementById(`${y}-${x}`)
    cell.append(piece)
  }

  // start game
  startGame() {
    // update player colors
    this.p1.color = document.getElementById('p1').value
    this.p2.color = document.getElementById('p2').value

    // check that play colors are different
    if (this.p1.color === this.p2.color) {
      return alert('Error: Player colors are the same!')
    }

    // handle drop of pieces
    const top = document.getElementById('column-top')
    top.classList.remove('disabled')
    this.dropClick = this.handleClick.bind(this)
    top.addEventListener('click', this.dropClick)

    // add arrow animation
    const arrows = document.querySelectorAll('.arrow')
    arrows.forEach((arrow) => arrow.classList.add('animate'))

    // update h3 text
    const h3 = document.querySelector('h3')
    h3.innerText = 'Click a drop button to make your move'

    // update start button
    const startBtn = document.getElementById('start-button')
    startBtn.classList.remove('start')
    startBtn.removeEventListener('click', this.startClick)
    startBtn.classList.add('restart')
    startBtn.addEventListener('click', this.restartGame.bind(this))
  }

  // end game
  endGame(msg) {
    const top = document.getElementById('column-top')
    top.classList.add('disabled')
    top.removeEventListener('click', this.dropClick)
    alert(msg)

    // remove arrow animation
    const arrows = document.querySelectorAll('.arrow')
    arrows.forEach((arrow) => arrow.classList.remove('animate'))

    // update h3 text
    const h3 = document.querySelector('h3')
    h3.innerText = 'Restart Game?'
  }

  // restart the game
  restartGame() {
    // store new colors if changed
    const p1Temp = document.getElementById('p1').value
    const p2Temp = document.getElementById('p2').value

    this.currPlayer = this.p1
    this.makeBoard()
    this.makeHtmlBoard()

    // handle player colors if they were changed
    document.getElementById('p1').value = p1Temp
    document.getElementById('p2').value = p2Temp
    return this.startGame()
  }

  // handle click of top row 
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.parentNode.id

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x)
    if (y === null) {
      return
    }

    // place piece in board and add to HTML table
    this.placeInTable(y, x)
    this.board[y][x] = this.currPlayer

    // check for win
    if (this.checkForWin()) {
      setTimeout(() => {
        if (this.currPlayer.color === this.p1.color) {
          this.endGame('Player 1 won!')
        } else {
          this.endGame('Player 2 won!')
        }
      }, 600)
    } else {
      // switch players
      this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1
    }

    // check for tie
    if (this.board.every((row) => row.every((col) => col)) && !this.checkForWin()) {
      setTimeout(() => {
        this.endGame('Oof! Tie game...')
      }, 600)
    }
  }

  // check for winner
  checkForWin() {
    // define win
    const _win = (cells) => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      )
    }
    // check winning combinations
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
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
}

class Player {
  constructor(color) {
    this.color = color
  }
}

new Game()
