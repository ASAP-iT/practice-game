function include(url) {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
}
import "./Wizard.js";
include("js/Wizard.js");



const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyUnpressed);

var pl = {x: 100, y: 300, dx: 10, dy: 10};
var player = new Wizard(pl.x, pl.y, pl.dx, pl.dy);

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

console.log("HUI");

background.onload = function () {
    game();
}

function game() {
    update();
    render();
    requestAnimFrame(game);
}


function update() {

}

function render() {

    context.drawImage(background, 0, 0, 1200, 700);
    // player.draw(0);
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
