export default class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene,x,y, spriteName)
    {
        super(scene, x, y, spriteName);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setSize(8, 7, true);

        //Colision con mundo
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds=true;

        this.cursor = this.scene.input.keyboard.createCursorKeys();
    }

    update(time, delta){
        if(this.cursor.left.isDown)
        {
            this.setVelocityX(-50);
            
            this.setFlipX(false); 
        }
        else if(this.cursor.right.isDown)
        {
            this.setVelocityX(50);
            this.setFlipX(true); 
        }
        else
        {
            //Parado
            this.setVelocityX(0);
        }

        if(this.jump && this.body.onFloor())
        {
            this.jump = false;
        }

        if (this.cursor.space.isDown && this.body.onFloor()) {
            
            this.setVelocityY(-100);
            this.jump = true;
        }


        /*if(this.jump)
            this.play('jump', true);
        else if(this.body.velocity.x != 0)
            this.play('walk', true);
        else
            this.play('idle', true);*/
    }
}