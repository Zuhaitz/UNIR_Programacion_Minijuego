import Entity from "./Entity";

export default class Character extends Entity
{
    constructor(scene, x, y, spriteName, traps)
    {
        super(scene,x,y, spriteName);

        this.traps = traps;

        //Colision con mundo
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds=true;

        this.fallen = this.scene.sys.game.canvas.height+global.pixels*3;

        this.velocity = 50;

        this.dead = false;
    }

    update(time,delta)
    {
        if(this.y >= this.fallen) this.die();
        this.checkTraps();
    }

    checkTraps()
    {
        var tile = this.traps.getTileAtWorldXY(this.x, this.y);
        if (tile) {
            this.die();
        }
    }
    
    die()
    {
        if(!this.dead){
            this.dead = true;
            this.setVelocityX(0);
            console.log(this.type +" dead");
        }
    }


}