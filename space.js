let tileSize = 32
let rows = 16
let columns = 16

let board
let boardWidth = tileSize * columns
let boardHeight = tileSize * rows
let context

//logo
let logoWidth = 512
let logoHeight = 221
let logoImg

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
let alienVelocityX = 1

let bulletArray = []
let bulletVelocityY = -10

let score = 0
let gameOver = false

const aliensPics = [
    './alien.png',
    './alien-cyan.png',
    './alien-magenta.png',
    './alien-yellow.png'
]

function randomAlien() {
    const aliensPics = [
        './alien.png',
        './alien-cyan.png',
        './alien-magenta.png',
        './alien-yellow.png'
    ]
    var a = Math.floor(Math.random() * aliensPics.length); 
    return aliensPics[a]
}



window.onload = function () {
    board = document.getElementById("board")
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext("2d") //rysuje na tablicy

    logoImg = new Image()
        
    logoImg.src = './logo.png'
        logoImg.onload = function() {
            context.drawImage(logoImg, 0, 50, logoWidth, logoHeight)
        }
        
        logoImg = new Image()
        logoImg.src = "./logo.png"
        
        context.fillStyle = 'white'
        context.font = "28px courier"
        context.fillText("Press SPACEBAR to start game", 20 , 400)


    document.addEventListener('keyup', e => {
        if (e.code === 'Space') {
            context.clearRect
            game()
          }
    }, { once: true })

    function game() { 
        shipImg = new Image()
        shipImg.src = './ship.png'
        shipImg.onload = function() {
            context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height)
        }

        
        alienImg = new Image()
        alienImg.src
        createAliens()


        requestAnimationFrame(update)
        document.addEventListener('keydown', moveShip)
        document.addEventListener("keyup", shoot)
    }
}

function update() {
    if (gameOver) {
        // context.clearRect
        // logoImg.src = './logo.png'
        // logoImg.onload = function() {
        //     context.drawImage(logoImg, 0, 50, logoWidth, logoHeight)
        // }
        
        // logoImg = new Image()
        // logoImg.src = "./logo.png"
        
        // context.fillStyle = 'white'
        // context.font = "28px courier"
        // context.fillText("GAME", 20 , 400)
        // context.fillText("OVER", 20 , 430)
        return
    }

    
    context.clearRect(0, 0, boardWidth, boardHeight)
    //nieskonczona petla rysowania
    requestAnimationFrame(update)


    //statek
    
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height)

    //kosmici
    alienArray.forEach( (alien) => {
        if( alien.alive) {
            alien.x += alienVelocityX

            if(alien.x + alienWidth >= board.width || alien.x <= 0) {
                alienVelocityX *= -1
                alien.x += alienVelocityX*2

                alienArray.forEach( alien => {
                    alien.y += alienHeight
                } )
            }
            context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height)

            if ( alien.y >= ship.y ) {
                gameOver = true
                context.clearRect
            }
        }
    })

    bulletArray.forEach( bullet => {
        bullet.y += bulletVelocityY
        context.fillStyle = "white"
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)

        alienArray.forEach(alien => {
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true
                alien.alive = false
                alienCount--
                score += 100
            }
        })
        
    })

    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift()
    }

    if (alienCount == 0) {
        alienCol = Math.min(alienCol + 1, columns/2 -2)
        alienRows = Math.min(alienRows + 1, rows-4)
        alienVelocityX += 20
        alienArray = []
        bulletArray = []
        createAliens()
    }

    context.fillStyle = 'white'
    context.font = "16px courier"
    context.fillText(score, 20, 20)
}



function moveShip(e) {
    if (gameOver) {
        return
    }
    
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >=0) {
        ship.x -= shipVelocityX // w lewo
    } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX // w prawo
    }
}


function createAliens() {
    alienArray = Array.from({ length: alienCol * alienRows }, (_, index) => {
        const c = Math.floor(index / alienRows);
        const r = index % alienRows;

        return {
            img: new Image(),
            x: alienX + c * alienWidth,
            y: alienY + r * alienHeight,
            width: alienWidth,
            height: alienHeight,
            alive: true
        };
    });

    alienArray.forEach((alien, index) => {
        const alienImgIndex = index % aliensPics.length;
        alien.img.src = aliensPics[Math.floor(Math.random() * aliensPics.length)];
    })
    
    alienCount = alienArray.length;
}

function shoot(e) {
    if (gameOver) {
        return
    }

    if (e.code == "Space") {
        let bullet = {
            x: ship.x + shipWidth * 15/32,
            y: ship.y,
            width: tileSize/8,
            height: tileSize/2,
            used: false
        }
        bulletArray.push(bullet)
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
}