class Wizard {

    constructor(x, y, dx, dy) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.health = 100;
    }

    draw(z) {
        /*var pimg = new Image();
        pimg.src = 'img/witch.gif';
        context.drawImage(pimg, this.x, this.y, 75, 75);*/
        context.drawImage(Img[0], this.x, this.y, 75, 75)
        context.fillStyle = '#f20000'
        context.fillRect(this.x + 75 / 2 + 3, this.y + 75 / 2, 10, 10)
    }

}