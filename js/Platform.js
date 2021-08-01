export class Platform{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    draw(context, width, height)
    {
        // console.log("old yellow bricks...")
        let platformImg = new Image();
        platformImg.src = 'platformImg/Red_Brick_Platform.png';
        context.drawImage(platformImg, this.x, this.y, width, height);
    }
}