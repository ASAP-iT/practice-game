// function sleep (time) {
//     return new Promise((resolve) => setTimeout(resolve, time));
// }

export class Wizard {

    constructor(x, y, dx, dy) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.health = 100;
    }

    draw(context, is_reverse = false, animStep = -1, moveType) {

        if (moveType === "attack") {
            this.attackAnimation(context, is_reverse);
        }

        let img = new Image();
        console.log(moveType);
        // console.log(animStep);
        img.src = "playerAnim/WizardImg/mage1.png";
        if (is_reverse && moveType === "stay") {
            img.src = "playerAnim/WizardImg/mage_reversed.png";
        } else if (moveType === "run" && animStep !== -1) {
            if (is_reverse) {
                img.src = "playerAnim/WizardImg/Run/run" + animStep + "r.png"
            } else {
                img.src = "playerAnim/WizardImg/Run/run" + animStep + ".png"
            }
        }
        context.drawImage(img, this.x, this.y, 75, 75)


        /*var pimg = new Image();
        pimg.src = 'img/witch.gif';
        context.drawImage(pimg, this.x, this.y, 75, 75);*/

        // context.fillStyle = '#f20000'
        // context.fillRect(this.x + 75 / 2 + 3, this.y + 75 / 2, 10, 10)
    }

    attackAnimation(context, is_reverse = false) {
        console.log("ANIMATE ATTACK");
        for (let i = 1; i < 8; i++) {
            let img = new Image();
            img.src = "playerAnim/WizardImg/Attack/attack" + i + ".png";
            context.drawImage(img, this.x, this.y, 75, 75);
            // sleep(500).then(r => {});

        }
    }
}