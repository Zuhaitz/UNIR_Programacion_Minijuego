import Collectable from "./Collectable";

export default class Coin extends Collectable
{
    constructor(scene, x, y, spriteName, player)
    {
        super(scene, x,y, spriteName, player);

        this.coinEffect = this.scene.sound.add("coin", { loop: false , volume: 0.05 });
    }

    /**
     * Llamada cuando se colisiona con el jugador
     */
    spriteHit()
    {
        this.scene.coinPicked();
        this.coinEffect.play();
        super.spriteHit();
    }
}