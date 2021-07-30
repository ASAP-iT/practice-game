class Player {

    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    draw(z) {
        /*var pimg = new Image();
        pimg.src = 'img/witch.gif';
        context.drawImage(pimg, this.x, this.y, 75, 75);*/
        context.drawImage(Img[z], this.x, this.y, 75, 75);
        context.fillStyle = '#f20000';
        context.fillRect(this.x + 75 / 2 + 3, this.y + 75 / 2, 10, 10);
    }

    move(borders, key_released, context) {
        if(key_released === "left" && this.x - this.dx >= borders[0])
        {
            //todo сделать отрисовку
            this.x -= this.dx;
        }
        if(key_released === "right" && this.x + this.dx <= borders[3])
        {
            //todo сделать отрисовку
            this.x += this.dx;
        }
        if(key_released === "up" && this.y - this.dy >= borders[1])
        {
            //todo сделать отрисовку
            this.y -= this.dy;
        }

    }
}