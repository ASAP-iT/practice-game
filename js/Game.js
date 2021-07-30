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

const LEFT_KEY = 65;
const RIGHT_KEY = 68;
const SPACE_KEY = 32;
const ENTER_KEY = 13;
let rightKeyPressed, leftKeyPressed, spaceKeyPressed, enterKeyPressed;
let counter = 0;
const background = new Image();
background.src = 'backgrounds/backgroundarenablue2.png';

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
    if (event.keyCode === SPACE_KEY && spaceKeyPressed === true) {
        spaceKeyPressed = false;
    }
}

function movePlayer() {
    if (leftKeyPressed && player.x - player.dx >= 0) {
        player.x -= player.dx;
    }
    if (rightKeyPressed && player.x + player.dx <= (1200 - 60)) {
        player.x += player.dx;
    }
}

console.log("HUI");
let player = new wizard.Wizard(0, 600, 10, 10);

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
    player.draw(context);
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
