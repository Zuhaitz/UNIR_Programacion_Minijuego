import { Time } from "phaser";
import Character from "./Character";

export default class Player extends Character
{
    constructor(scene,x,y, spriteName, health, traps)
    {
        super(scene, x, y, spriteName, traps);

        //estadisticas
        this.maxHealth = health;
        this.health = health;
        this.jumpForce = 100;

        //Ivencibilidad
        this.invD = 2;
        this.invincible = false;

        //Controles de movimiento
        this.cursor = this.scene.input.keyboard.createCursorKeys();

        //Controles de disparo
        this.shoot = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.lastShoot;
        this.allowedToShoot = true;
        this.shootSpeed = 0.5;
    }

    update(time, delta){
        super.update(time, delta);
        //Comprueba si el jugador murio
        if(this.dead) return;

        //Ejecuta el movimiento
        this.controlarMovimiento();
        this.controlarSalto();
        this.controlarDisparo(time);

        /*if(this.jump)
            this.play('jump', true);
        else if(this.body.velocity.x != 0)
            this.play('walk', true);
        else
            this.play('idle', true);*/
    }

    /**
     * Mueve al personaje segun el input del jugador
     */
    controlarMovimiento()
    {
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
            this.setVelocityX(0); //Parado
        
    }

    /**
     * Hace saltar al personaje segun el input del jugador y el estado
     */
    controlarSalto()
    {
        if(this.jump && this.body.onFloor())
            this.jump = false;

        if (this.cursor.space.isDown && this.body.onFloor()) 
        {    
            this.setVelocityY(-this.jumpForce);
            this.jump = true;
        }
    }

    /**
     * Controla si el jugador puede o no disparar
     * @param {integer} time 
     */
    controlarDisparo(time)
    {
        if(!this.shoot.isDown && !this.allowedToShoot && time - this.lastShoot > this.shootSpeed)
            this.allowedToShoot = true;

        if(this.shoot.isDown && this.allowedToShoot)
        {
            var direction = 1;
            if(this.flipX) direction = -1;
            var posX = this.body.x+global.pixels/2;
            var posY = this.body.y+global.pixels/2;
            this.scene.tossCoin(posX, posY, direction);
            this.lastShoot = time;
            this.allowedToShoot = false;
        }
    }

    /**
     * Provoca daño al jugador y provoca que sea invencible durante un tiempo
     * @param {integer} dmg - el daño a causar al jugador
     * @returns - Si el jugador es invenciible
     */
    damage(dmg)
    {
        if(this.invincible) return; 

        this.health = this.health - dmg;
       
        //Comprueba si murio
        if(this.health <= 0){
            this.health = 0;
            this.die();
        }else{
            //Activar invencibilidad
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

        //LLamar a la escena para actualizar los corazones
        this.scene.updateHearts(this.health, dmg);
    }

    /**
     * Un pequeño impulso vertical, principalmente para cuando se pisa un enemigo
     */
    bounce(){
        this.setVelocityY(-this.jumpForce/2);
        this.jump = true;
    }
}