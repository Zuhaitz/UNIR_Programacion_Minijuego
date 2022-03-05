import Collectable from "./Collectable";

export default class Coin extends Collectable
{
    constructor(scene, x, y, spriteName, player)
    {
        super(scene, x,y, spriteName, player);
    }

    spriteHit()
    {
        this.scene.coinPicked();
        super.spriteHit();
    }
}