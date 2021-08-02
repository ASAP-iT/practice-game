export class MagicSphere {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = 0;
    }

    draw(context) {
        console.log('ghbdn')
        let img = new Image()
        img.src = 'playerAnim/WizardImg/Fire/fire1.png'
        context.drawImage(img, this.x, this.y, 20, 20)
    }

    move(side) {
        if (side === "right")
            this.dx = 15
        else
            this.dx = -15
        this.x += this.dx
    }

    outOfRange() {
        return this.x > 1400 || this.x < 0
    }

}