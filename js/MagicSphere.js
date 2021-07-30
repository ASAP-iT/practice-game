class MagicSphere {
    constructor(x, y, dx) {
        this.x = x;
        this.y = y;
        this.dx = dx;
    }

    draw() {
        context.drawImage(spheres[0], this.x, this.y, 13, 13)
    }

    move() {
        this.x += this.dx;
    }

    outOfRange() {
        return this.x > 1400
    }

    hasHitItem(item) {
        return (this.x + 13 >= item.x && this.x <= item.x + 75) && (this.y + 13 >= item.y && this.y <= item.y + 75);
    }


    hasCollided() {
        var self = this;
        var collided = false;

        if (self.hasHitEnemy(enemy)) {
            enemy.health -= 10
            collided = true;
        }
    }
}