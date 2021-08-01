export class Wizard {

    constructor(x, y, dx, dy, id) {
        this.id = id
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.health = 100;
        this.jumping = false;
        this.on_platform = false;
    }
}
