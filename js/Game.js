function include(url) {
    const script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

import * as wizard from './Wizard.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyUnpressed);

let animationStep = -2, playerAnimType = "stay";

const LEFT_KEY = 65;
const RIGHT_KEY = 68;
const SPACE_KEY = 32;
const ENTER_KEY = 13;
let rightKeyPressed, leftKeyPressed, spaceKeyPressed, enterKeyPressed;
let counter = 0, reversed = false;
const background = new Image();
background.src = 'backgrounds/backgroundarenablue2.png';

let BaseURL = "89.223.127.79:1231"
let ws = null

let PlayerID = Number(localStorage.getItem("PlayerID"))
if (PlayerID === null || PlayerID === 0) {
    PlayerID = Math.floor(Math.random() * 1000000)
    localStorage.setItem("PlayerID", PlayerID.toString())
}
let GameID = Number(localStorage.getItem("GameID"))

let messageField = document.getElementById("messageText")
messageField.value = GameID

let host = document.getElementById("host")
host.onclick = async () => {
    await Host()
}
let join = document.getElementById("join")
join.onclick = () => {
    Join()
}

function keyPressed(event) {

    if (event.keyCode === LEFT_KEY) {
        leftKeyPressed = true;
    }
    if (event.keyCode === RIGHT_KEY) {
        rightKeyPressed = true;
    }
    if (event.keyCode === ENTER_KEY) {
        enterKeyPressed = true;
    }
    if (event.keyCode === SPACE_KEY) {
        spaceKeyPressed = true;
        if (counter < 100) {
            counter += 10;
        } else {
            spaceKeyPressed = false;
        }
    }

}

function keyUnpressed(event) {
    if (event.keyCode === LEFT_KEY) {
        leftKeyPressed = false;
    }
    if (event.keyCode === RIGHT_KEY) {
        rightKeyPressed = false;
    }
    if (event.keyCode === ENTER_KEY) {
        enterKeyPressed = false;
    }
    if (event.keyCode === SPACE_KEY) {
        spaceKeyPressed = false;
    }
}

function movePlayer() {
    let didMove = false

    if (!leftKeyPressed || !rightKeyPressed) {
        playerAnimType = "stay";
    }
    if (leftKeyPressed && player.x - player.dx >= 0) {
        reversed = true;
        playerAnimType = "run";
        didMove = true
        player.x -= player.dx;
    }
    if (rightKeyPressed && player.x + player.dx <= (1200 - 60)) {
        reversed = false;
        didMove = true
        playerAnimType = "run";
        player.x += player.dx;
    }
    if (spaceKeyPressed) {
        playerAnimType = "attack";
    }

    if (didMove) {
        WebSocketUpdatePlayer()
    }
}

let player = new wizard.Wizard(0, 600, 6, 10, PlayerID);
let entities = []

function game() {
    update();
    render();
    requestAnimFrame(game);
}

background.onload = function () {
    game();
}

function update() {
    movePlayer();

}

function render() {

    context.drawImage(background, 0, 0, 1200, 700);
    if (animationStep > 7) {
        animationStep = 0;
    }
    animationStep++;
    player.draw(context, reversed, animationStep, playerAnimType);
    entities.forEach((ent) => {
        ent.draw(context)
    })
}

var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimatoinFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimatoinFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20);
        };
})();


// ------------------------
// WebSocket Stuff
// ------------------------
function CloseWebSocket() {
    if (ws === null) {
        return
    }
    ws.close()
    ws = null
}


function WebSocketUpdatePlayer() {
    if (ws === null) {
        return
    }

    let data = {playerUpdate: {x: player.x, y: player.y}, playerId: PlayerID, gameId: GameID}
    ws.send(JSON.stringify(data))
}


function StartWebSocket() {

    // console.log("PLAYER ID:")
    // console.log(PlayerID)
    //
    console.log("GAME ID:")
    console.log(GameID)

    if (ws === null) {
        let url = `ws://${BaseURL}/connectToGame/${GameID}/${PlayerID}`
        ws = new WebSocket(url)
    } else {
        ws.close()

        let url = `ws://${BaseURL}/connectToGame/${GameID}/${PlayerID}`
        ws = new WebSocket(url)
    }

    console.log(ws)

    ws.onmessage = (event) => {
        let eventData = event.data
        let data = JSON.parse(eventData)
        console.log(data)

        // Load player data on connect
        if (data.loadData !== undefined) {
            let loadData = data.loadData
            let players = loadData.players

            players.forEach((playerId) => {
                entities.push(new wizard.Wizard(0, 600, 6, 10, playerId))
            })
        }

        // Player Connected
        if (data.connectPlayer !== undefined) {
            let playerId = data.connectPlayer
            console.log(`PLAYER: ${playerId} Connected`)
            entities.push(new wizard.Wizard(0, 600, 6, 10, playerId))
        }

        // Player Disconnected
        if (data.disconnectPlayer !== undefined) {
            let playerId = data.disconnectPlayer
            console.log(`PLAYER: ${playerId} Disconnected`)
            let index = entities.findIndex((p) => p.id === playerId)
            if (index > -1) {
                entities.splice(index, 1);
            }
        }

        // Update Players
        if (data.playerUpdate !== undefined) {
            let playerId = Number(data.playerId)
            let update = data.playerUpdate

            let index = entities.findIndex((p) => p.id === playerId)
            if (index > -1) {
                let movingPlayer = entities[index]

                // Move player
                movingPlayer.x = update.x
                movingPlayer.y = update.y
            }
        }
    }
}


async function Host() {
    GameID = Math.floor(Math.random() * 1000000)
    localStorage.setItem("GameID", GameID.toString())

    messageField.value = GameID

    let url = `http://${BaseURL}/createGame/${GameID}`
    let resp = await fetch(url)
    console.log(resp)

    StartWebSocket()
}


function Join() {
    GameID = Number(messageField.value)
    localStorage.setItem("GameID", GameID.toString())

    StartWebSocket()
}
