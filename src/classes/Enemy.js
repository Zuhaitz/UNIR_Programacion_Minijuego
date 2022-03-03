import Character from "./Character";

export default class Enemy extends Character
{
    constructor(scene,x,y, spriteName, traps, player, attack, areaL=0, areaR=0)
    {
        super(scene,x,y, spriteName, traps)
        this.player = player;
        this.areaL = areaL*global.pixels;
        this.areaR = areaR*global.pixels;

        this.velocity = 20;
        this.attack = attack;

        this.timeCheck = 0;
        this.lastPosX = 0;
        this.originX = this.x;

        if(this.areaL > 0 || areaR > 0)
        {
            this.nextPositionX = this.originX-this.areaL;
            this.state = "left";
        }

        this.scene.physics.add.overlap(this, player, this.spriteHit, null, this);
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
        if(this.state == "left") {
            this.setFlipX(true);
            this.state = "right";
            this.nextPositionX = this.originX+this.areaR;
        }
        else if(this.state == "right") {
            this.setFlipX(false);
            this.state = "left";
            this.nextPositionX = this.originX-this.areaL;
        }
    }

    spriteHit()
    {
        var dist =  this.y - this.player.y;
        if(dist>global.pixels-2 && this.player.body.velocity.y > 0) 
        {
            this.die();
            this.player.bounce();
        }
        else this.player.damage(this.attack);
    }
}