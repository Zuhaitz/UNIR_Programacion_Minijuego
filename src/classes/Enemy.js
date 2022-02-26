import Character from "./Character";

export default class Enemy extends Character
{
    constructor(scene,x,y, spriteName, player, area=0)
    {
        super(scene,x,y, spriteName)
        this.player = player;
        this.area = area*global.pixels;

        this.velocity = this.velocity/2;

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
        switch(this.state)
        {
            case "left":
                this.movingLeft(time, delta);
                break;
            case "right":
                this.movingRight(time, delta);
                break;
        }
        if(this.body.onFloor() && this.lastPosX == this.x) this.changeState();
        this.lastPosX = this.x;
    }

    movingLeft(time, delta)
    {
        this.setVelocityX(-this.velocity);
        this.setFlipX(false);
        let dist = Math.abs(this.nextPositionX - this.x);
        if(dist < 4)
        {
            this.state = "right";
            this.nextPositionX = this.originX+this.area;
            this.time = time;
        }
    }

    movingRight(time, delta)
    {
        this.setVelocityX(this.velocity);
        this.setFlipX(true);
        let dist = Math.abs(this.nextPositionX - this.x);
        if(dist < 4)
        {
            this.state = "left";
            this.nextPositionX = this.originX-this.area;
            this.time = time;
        }
    }

    changeState(){
        console.log("enter")
        if(this.state == "left") {
            this.state = "right";
            this.nextPositionX = this.originX+this.area;
        }
        else if(this.state == "right") {
            this.state = "left";
            this.nextPositionX = this.originX-this.area;
        }
    }
}