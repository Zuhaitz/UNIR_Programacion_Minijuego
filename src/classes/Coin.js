import Collectable from "./Collectable";

export default class Coin extends Collectable
{
    constructor(scene, x, y, spriteName, player)
    {
        super(scene, x,y, spriteName, player);
    }

    /**
     * Llamada cuando se colisiona con el jugador
     */
    spriteHit()
    {
        this.scene.coinPicked();
        super.spriteHit();
    }
}