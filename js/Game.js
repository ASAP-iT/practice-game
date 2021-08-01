function include(url) {
    const script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

import * as wizard from './Wizard.js';
import * as platform from './Platform.js'

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
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

let entities = []

const LEFT_KEY = 65;
const RIGHT_KEY = 68;
const JUMP_KEY = 32;
const ATTACK_KEY = 13;

let viewToLeft = false, animationStep = -2, playerAnimType = "stay";
let jumpFrame = 0, runFrame = 0, attackFrame = 1;

let controller = {
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
    keyListener: function (event) {
        let keyState = (event.type === "keydown");

        switch (event.keyCode) {
            case LEFT_KEY:
                controller.left = keyState;
                if (controller.left) {
                    playerAnimType = "run";
                    runFrame = 1;
                } else {
                    playerAnimType = "stay";
                }
                viewToLeft = true;
                break;
            case RIGHT_KEY:
                controller.right = keyState;
                if (controller.right) {
                    playerAnimType = "run";
                    runFrame = 1;
                } else {
                    playerAnimType = "stay";
                }
                viewToLeft = false;
                break;
            case JUMP_KEY:
                controller.up = keyState;
                if (controller.up) {
                    playerAnimType = "jump";
                    runFrame = 1;
                } else {
                    playerAnimType = "stay";
                }
                break;
            case ATTACK_KEY:
                controller.attack = keyState;
                if (keyState) {
                    playerAnimType = "attack";
                    runFrame = 1;
                } else {
                    playerAnimType = "stay";
                }
        }
    }
}
const background = new Image();
background.src = 'backgrounds/backgroundarenablue2.png';

let platform_one = new platform.Platform(200, 450)
let platform_two = new platform.Platform(400, 350)
let platform_three = new platform.Platform(860, 450)
let player = new wizard.Wizard(0, 600, 0, 0, PlayerID);
let didMove;

function game() {
    context.drawImage(background, 0, 0, 1200, 700);
    platform_one.draw(context, 150, 100)
    platform_two.draw(context, 410, 100)
    platform_three.draw(context, 150, 100)

    let playerMoving = function () {
        let img = new Image();
        if (jumpFrame > 7) {
            jumpFrame = 0;
        }
        if (runFrame > 8) {
            runFrame = 1;
        }
        if (attackFrame > 7) {
            attackFrame = 1;
        }

        if (controller.up && player.jumping === false) {
            player.dy -= 40;
            player.jumping = true;
            console.log(player.y);
        }

        if (controller.left) {
            runFrame++;
            didMove = true
            player.dx -= 0.65;

        }


        if (controller.right) {
            runFrame++;
            player.dx += 0.65;
            didMove = true
        }
        if (!player.on_platform)
            player.dy += 1.7;
        player.x += player.dx;
        // if (player.on_platform)
        player.y += player.dy;

        player.dx *= 0.9;
        player.dy *= 0.9;
        // CHECK IS ON PLATFORM (150-330 (420), x-x , x-x)
        if ((player.x >= 150 && player.x <= 330 && player.y < 420) || (player.x >= 810 && player.x <= 980 && player.y < 420) || (player.x >= 350 && player.x <= 790 && player.y < 320)) {
            player.on_platform = true;
            player.jumping = false;
            player.dy = 0;
            if (player.x >= 350 && player.x <= 790){
                player.y = 320;
            } else
                player.y = 420;
        } else if ((player.x < 150 || player.x > 330) && (player.x < 810 || player.x > 980) && (player.x < 350 || player.x > 790)) {
            player.on_platform = false;
            player.jumping = true;
        }

        if (player.y > 600) {
            player.jumping = false;
            player.y = 600;
            player.dy = 0;

        }
        if (player.x <= 0) {
            player.x = 0;
            player.dx = 0;
        }
        if (player.x >= 1125) {
            player.x = 1125;
            player.dx = 0;
        }
        if (playerAnimType === "stay") {
            img.src = "playerAnim/WizardImg/mage1.png";
            if (viewToLeft) {
                img.src = "playerAnim/WizardImg/mage_reversed.png";
            }
        } else if (player.jumping) {
            if (viewToLeft) {
                img.src = "playerAnim/WizardImg/Jump/jump" + runFrame + "r.png"
            } else {
                img.src = "playerAnim/WizardImg/Jump/jump" + runFrame + ".png"
            }
            jumpFrame++;
        } else if (playerAnimType === "run") {
            if (viewToLeft) {
                img.src = "playerAnim/WizardImg/Run/run" + runFrame + "r.png"
            } else {
                img.src = "playerAnim/WizardImg/Run/run" + runFrame + ".png"
            }
            runFrame++;
        } else if (playerAnimType === "attack") {
            if (viewToLeft) {
                img.src = "playerAnim/WizardImg/Attack/attack" + attackFrame + "r.png"
            } else {
                img.src = "playerAnim/WizardImg/Attack/attack" + attackFrame + ".png"
            }
        }
        context.drawImage(img, player.x, player.y, 75, 75);
    }
    window.requestAnimationFrame(playerMoving);


    if (didMove) {
        WebSocketUpdatePlayer()
    }

    requestAnimationFrame(game);
    requestAnimationFrame(playerMoving);
}

document.addEventListener('keydown', controller.keyListener);
document.addEventListener('keyup', controller.keyListener);

background.onload = function () {
    game();
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

