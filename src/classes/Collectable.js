import Entity from "./Entity";

export default class Collectable extends Entity
{
    constructor(scene, x, y, spriteName, player)
    {
        super(scene, x,y, spriteName);
        this.scene.physics.add.overlap(this, player, this.spriteHit, null, this);
    }

    /**
     * Llamada cuando se colisiona con el jugador
     */
    spriteHit()
    {
        this.destroy();  
    }
}