class Platform{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    draw()
    {
        let platformImg = new Image();
        platformImg.src = 'platformImg/Red_Brick_Platform.png';
        context.drawImage(platformImg, this.x, this.y, 20, 100);
        context.fillStyle = '#f20000'
        context.fillRect(this.x, this.y, 20, 100)
    }
}