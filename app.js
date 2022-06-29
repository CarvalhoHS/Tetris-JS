document.addEventListener('DOMContentLoaded', () => {
const width = 10
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#Botao_Iniciar')
let nextRandom = 0
let timerId
let score = 0
const colors = [
  'orange',
  'red',
  'purple',
  'green',
  'blue'
]

// the TetroMinos
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width +2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const theTretominoes = [lTetromino, zTetromino, iTetromino, oTetromino, tTetromino]

  let currentPosition = 4
  let currentRotation = 0

//randomizando a releção de tetrmino e sua rotação

let random = Math.floor(Math.random()*theTretominoes.length)

  let current = theTretominoes[random] [currentRotation]


  //desenhando o tetromino
  function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  draw()

  function undraw() {
    current.forEach(index =>{
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
  }
  
  //faça o tetromino cair na grade
  //timerId = setInterval(moveDown, 1000)


  // colocando função no teclado
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    }else if (e.keyCode === 38){
        rotate()
    } else if (e.keyCode === 39){
        moveRight()
    }else if (e.keyCode === 40){
        moveDown()
    }}
    document.addEventListener('keyup', control)

  // função de mover pra baixo
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

// função pra parar de cair
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        // start a new teotrmino caindo
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTretominoes.length)
        current = theTretominoes[random] [currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

// regras de margem para mover o tetromino
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

  // rotate the tetromino

  function rotate(){
    undraw()
    currentRotation ++
    if (currentRotation === current.length) { // se chegar na ultima rotação fazer voltar a primeira
        currentRotation = 0
    }
    current = theTretominoes[random] [currentRotation]
    draw()
  }
  
// show up-next tetromino in mini-drig display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displaywidth = 4
const displayIndex = 0

// the tetrominos without rotations
const upNextTetrominoes = [
    [1, displaywidth+1, displaywidth*2+1,2],
    [0,displaywidth, displaywidth+1,displaywidth*2+1],
    [1,displaywidth, displaywidth+1, displaywidth +2],
    [0,1,displaywidth,displaywidth+1],
    [1, displaywidth+1, displaywidth*2+1, displaywidth*3+1]
]

function displayShape() {
    // remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]

    })
}

// adicionando funcionalidade ao ao botão de Start

startBtn.addEventListener('click', () => {
if ( timerId) {
  clearInterval(timerId)
  timerId = null
} else {
  draw()
  timerId = setInterval(moveDown, 1000)
  nextRandom = Math.floor(Math.random()*theTretominoes.length)
  displayShape()
}
})

// adiciona os pontos
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+7, i+8, i+9]

    if(row.every(index => squares[index].classList.contains('taken'))){
      score += 10
      scoreDisplay.innerHTML = score
      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundColor = ''
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}

// game over
function gameOver() {
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    scoreDisplay.innerHTML= 'end'
    clearInterval(timerId)
  }
}














})