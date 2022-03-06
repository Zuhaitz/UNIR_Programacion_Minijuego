import Entity from "./Entity";

export default class Projectile extends Entity
{
    constructor(scene, x, y, spriteName, enemies, direction, speed)
    {
        super(scene, x,y, spriteName);
        this.setSize(3, 4);
        this.setOffset(3, 4);
        this.setAngle(90);
        this.body.setAllowGravity(false);

        this.scene.physics.add.overlap(this, enemies, this.spriteHit, null, this);

        this.direction = direction;
        this.speed = speed;
        this.originX = x;
        this.distance = global.pixels*5;
        this.end = false; 
    }

    update(time, delta)
    {
        if(this.end){
            this.destroy();
            return;
        }

        if(Math.abs(this.originX-this.body.x) > this.distance)
            this.end = true;

        else this.setVelocityX(this.direction*this.speed);
    }

    spriteHit(proyectile, enemy)
    {
        enemy.die();
        proyectile.end = true;
    }
}