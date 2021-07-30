function include(url) {
    const script = document.createElement('script');
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

include("Player.js");
// include("enemy.js");
// include("bullet.js");
// include("obstacle.js");
// include("bosses.js");

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyUnpressed);
canvas.addEventListener("mousemove", checkPos);

const LEFT_KEY = 65;
const RIGHT_KEY = 68;
const SPACE_KEY = 32;
let rightKeyPressed, leftKeyPressed, spaceKeyPressed;
let counter = 0;

function keyPressed(event) {

    if (event.keyCode === LEFT_KEY) {
        leftKeyPressed = true;
    }
    if (event.keyCode === RIGHT_KEY) {
        rightKeyPressed = true;
    }
    if (event.keyCode === SPACE_KEY) {
        spaceKeyPressed = true;
        if (counter < 100) {
            counter += 10;
        }
        else {
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
    if (event.keyCode === SPACE_KEY && spaceKeyPressed === true) {
        spaceKeyPressed = false;
    }
}