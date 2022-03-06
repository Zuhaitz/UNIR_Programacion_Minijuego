import Entity from "./Entity";

export default class Character extends Entity
{
    constructor(scene, x, y, spriteName, traps)
    {
        super(scene,x,y, spriteName);

        this.setCollideWorldBounds(true); //Colision con mundo
        this.traps = traps; //Layer de trampas para detectar la colision
        this.fallen = this.scene.sys.game.canvas.height+global.pixels*3;
        this.velocity = 50;
        this.dead = false;
    }

    update(time,delta)
    {
        //Comprueba que el personaje no se cayo al vacio o en una trampa 
        if(this.y >= this.fallen) this.die();
        this.checkTraps();
    }

    /**
     * Se detecta si hay una tramapa en la posicion del personaje
     */
    checkTraps()
    {
        var tile = this.traps.getTileAtWorldXY(this.x, this.y);
        if (tile)
            this.die();
    }
    
    /**
     * Mata al personaje y lo detiene
     */
    die()
    {
        if(!this.dead){
            this.dead = true;
            this.setVelocityX(0);
            console.log(this.type +" dead");
        }
    }
}