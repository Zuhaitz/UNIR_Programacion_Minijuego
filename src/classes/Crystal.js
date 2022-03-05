import Collectable from "./Collectable";

export default class Crystal extends Collectable
{
    constructor(scene, x, y, spriteName, player)
    {
        super(scene, x,y, spriteName, player);
    }

    spriteHit()
    {
        this.scene.crystalPicked(); 
        super.spriteHit();
    }
}