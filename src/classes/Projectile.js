import Enemy from "./Enemy";
import Entity from "./Entity";

export default class Projectile extends Entity
{
    constructor(scene, x, y, spriteName, enemies, direction, speed)
    {
        super(scene, x,y, spriteName);
        //Ajustar el sprite y hitbox
        this.setSize(3, 4);
        this.setOffset(3, 4);
        this.setAngle(90);
        this.body.setAllowGravity(false);

        //Colison con los enemigos
        this.scene.physics.add.overlap(this, enemies, this.spriteHit, null, this);

        //Estadisticas
        this.speed = speed;
        this.distance = global.pixels*5;

        //Datos
        this.originX = x;
        this.direction = direction;
        this.end = false; 
    }

    update(time, delta)
    {
        //Se destruye al finalizar
        if(this.end){
            this.destroy();
            return;
        }

        //Comprueba si se acabo el tiempo de vida
        if(Math.abs(this.originX-this.body.x) > this.distance)
            this.end = true;

        else this.setVelocityX(this.direction*this.speed);
    }

    /**
     * Llamada cuando se colisiona con un enemigo
     * @param {Projectile} proyectile - el proyectil que impacta
     * @param {Enemy} enemy - el enemigo con el que impacto
     */
    spriteHit(projectile, enemy)
    {
        enemy.die();
        projectile.end = true;
    }
}