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
let player = new wizard.Wizard(0, 600, 0, 0);


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
        }

        if (controller.left) {
            runFrame++;
            player.dx -= 0.65;

        }

        if (controller.right) {
            player.dx += 0.65;
        }

        player.dy += 1.7;
        player.x += player.dx;
        player.y += player.dy;
        player.dx *= 0.9;
        player.dy *= 0.9;
        // CHECK IS ON PLATFORM
        if (200 <= player.x && player.x <= 350 && player.y < 500 && player.on_platform === false) {
            player.dy = 0;
            player.jumping = false;
            player.y = 500;
            player.on_platform = true;
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
        } else if (playerAnimType === "jump") {
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


    requestAnimationFrame(game);
    requestAnimationFrame(playerMoving);
}

background.onload = function () {
    game();
}

document.addEventListener('keydown', controller.keyListener);
document.addEventListener('keyup', controller.keyListener);
