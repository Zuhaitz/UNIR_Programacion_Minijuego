export default class Character extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, spriteName)
    {
        super(scene,x,y, spriteName);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setSize(8, 7);
        this.velocity = 50;
    }
}