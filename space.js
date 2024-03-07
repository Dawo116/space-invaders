let tileSize = 32
let rows = 16
let columns = 16

let board
let boardWidth = tileSize * columns
let boardHeight = tileSize * rows
let context

//ship
let shipWidth = tileSize*2
let shipHeight = tileSize
let shipX = tileSize * columns/2 - tileSize
let shipY = tileSize * rows - tileSize*2

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
}

let shipImg
let shipVelocityX = tileSize // rusza sie o jeden kafelek

//kosmici lol
let alienArray = []
let alienWidth = tileSize*2
let alienHeight = tileSize
let alienX = tileSize
let alienY = tileSize
let alienImg

let alienRows = 2
let alienCol = 3
let alienCount = 0

window.onload = function () {
    board = document.getElementById("board")
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext("2d") //rysuje na tablicy

    shipImg = new Image()
    shipImg.src = "./ship.png"
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height)
    }

    alienImg = new Image()
    alienImg.src = "./alien.png"
    createAliens()

    requestAnimationFrame(update)
    document.addEventListener('keydown', moveShip)
}

function update() {
    context.clearRect(0, 0, boardWidth, boardHeight)
    requestAnimationFrame(update)
    //nieskonczona petla rysowania

    //statek
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height)

    //kosmici
    alienArray.forEach( (alien) => {
        if( alien.alive) {
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height)
        }
    })
}



function moveShip(e) {
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >=0) {
        ship.x -= shipVelocityX // w lewo
    } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX // w prawo
    }
}

function createAliens() {
    alienRows.forEach( element => {
        console.log('dupa')
    })
}

function createAliens() {
    alienArray = Array.from({ length: alienCol * alienRows }, (_, index) => {
        const c = Math.floor(index / alienRows);
        const r = index % alienRows;

        return {
            img: alienImg,
            x: alienX + c * alienWidth,
            y: alienY + r * alienHeight,
            width: alienWidth,
            height: alienHeight,
            alive: true
        };
    });

    alienCount = alienArray.length;
    console.log(alienArray)
}


// function createAliens() {
//     for (let c = 0; c < alienCol; c++) {
//         for (let r = 0; r < alienRows; r++) {
//             let alien = {
//                 img: alienImg,
//                 x: alienX + c*alienWidth,
//                 y: alienY + r*alienHeight,
//                 width: alienWidth,
//                 height: alienHeight,
//                 alive: true
//             }
//             alienArray.push(alien)
//         }
//     }
//     alienCount = alienArray.length
// }
