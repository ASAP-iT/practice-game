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

    // hasHitItem(item) {
    //     return (this.x + 13 >= item.x && this.x <= item.x + 75) && (this.y + 13 >= item.y && this.y <= item.y + 75);
    // }
    //
    // hasCollided() {
    //     let self = this;
    //     let collided = false;
    //
    //     if (self.hasHitItem()) {
    //         // enemy.health -= 10
    //         collided = true;
    //     }
    //     return collided
    // }
}