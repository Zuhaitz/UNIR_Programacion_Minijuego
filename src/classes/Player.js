import { Time } from "phaser";
import Character from "./Character";

export default class Player extends Character
{
    constructor(scene,x,y, spriteName, health, traps)
    {
        super(scene, x, y, spriteName, traps);

        this.maxHealth = health;
        this.health = health;
        this.jumpForce = 100;

        this.invD = 2;
        this.invincible = false;

        this.cursor = this.scene.input.keyboard.createCursorKeys();

        this.shoot = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.lastShoot;
        this.allowedToShoot = true;
        this.shootSpeed = 0.5;
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

        if (this.cursor.space.isDown && this.body.onFloor()) 
        {    
            this.setVelocityY(-this.jumpForce);
            this.jump = true;
        }


        if(!this.shoot.isDown && !this.allowedToShoot && time - this.lastShoot > this.shootSpeed)
        {
            this.allowedToShoot = true;
        }
        if(this.shoot.isDown && this.allowedToShoot)
        {
            var direction = 1;
            if(this.flipX) direction = -1;
            this.scene.tossCoin(this.body.x+global.pixels+1, this.body.y+1, direction);
            this.lastShoot = time;
            this.allowedToShoot = false;
        }


        /*if(this.jump)
            this.play('jump', true);
        else if(this.body.velocity.x != 0)
            this.play('walk', true);
        else
            this.play('idle', true);*/
    }

    damage(dmg)
    {
        if(this.invincible) return;

        this.health = this.health - dmg;
       
        if(this.health <= 0){
            this.health = 0;
            this.die();
        }else{
            this.alpha = 0.5;
            this.invincible = true;

            this.scene.time.addEvent({
                delay: this.invD*1000,
                callback: function(){ 
                    this.alpha = 1;
                    this.invincible = false;
                },
                callbackScope: this,
            });
        }

        this.scene.updateHearts(this.health, dmg);
    }

    bounce(){
        this.setVelocityY(-this.jumpForce/2);
        this.jump = true;
    }
}