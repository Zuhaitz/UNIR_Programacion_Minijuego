import Character from "./Character";

export default class Enemy extends Character
{
    constructor(scene,x,y, spriteName, traps, player, area=0)
    {
        super(scene,x,y, spriteName, traps)
        this.player = player;
        this.area = area*global.pixels;

        this.velocity = 20;

        this.timeCheck = 0;
        this.lastPosX = 0;
        this.originX = this.x;

        if(this.area > 0)
        {
            this.nextPositionX = this.originX-this.area;
            this.state = "left";
        }
    }

    update(time,delta)
    {
        super.update(time, delta);
        if(this.dead) 
        {
            this.destroy();
            return;
        }
        if(this.body.onFloor() && this.body.velocity.x == 0) this.changeState();

        switch(this.state)
        {
            case "left":
                this.movingLeft(time);
                break;
            case "right":
                this.movingRight(time);
                break;
        }
    }

    movingLeft(time)
    {
        this.setVelocityX(-this.velocity);
        this.checkDistance(time);
    }

    movingRight(time)
    {
        this.setVelocityX(this.velocity);
        this.checkDistance(time);
    }

    checkDistance(time){
        let dist = Math.abs(this.nextPositionX - this.x);
        if(dist < 4 && this.body.onFloor())
        {
            this.changeState();
            this.time = time;
        }
    }

    changeState(){
        console.log("enter")
        if(this.state == "left") {
            this.setFlipX(true);
            this.state = "right";
            this.nextPositionX = this.originX+this.area;
        }
        else if(this.state == "right") {
            this.setFlipX(false);
            this.state = "left";
            this.nextPositionX = this.originX-this.area;
        }
    }
}