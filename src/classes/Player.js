import Character from "./Character";

export default class Player extends Character
{
    constructor(scene,x,y, spriteName, traps)
    {
        super(scene, x, y, spriteName, traps);

        this.jumpForce = 100;

        this.cursor = this.scene.input.keyboard.createCursorKeys();
    }

    update(time, delta){
        super.update(time, delta);
        if(this.dead) return;

        if(this.cursor.left.isDown)
        {
            this.setVelocityX(-this.velocity);
            
            this.setFlipX(true); 
        }
        else if(this.cursor.right.isDown)
        {
            this.setVelocityX(this.velocity);
            this.setFlipX(false); 
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
            
            this.setVelocityY(-this.jumpForce);
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