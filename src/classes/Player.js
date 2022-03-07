import { Time } from "phaser";
import Character from "./Character";

export default class Player extends Character
{
    constructor(scene,x,y, spriteName, health, traps)
    {
        super(scene, x, y, spriteName, traps);

        this.setSize(6, 8);
        this.setOffset(2 ,0);

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

        //Animaciones
        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 0, end: 4, prefix: 'Walk_' }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 0, end: 0, prefix: 'Idle_' }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNames('sprites_jugador', { start: 0, end: 0, prefix: 'Jump_' }),
            frameRate: 10,
            repeat: -1
        });

        //Efectos de sonido
        this.jumpEffect = this.scene.sound.add("jump", { loop: false , volume: 0.05 });
        this.damageEffect = this.scene.sound.add("damage", { loop: false , volume: 0.05 });
    }

    update(time, delta){
        super.update(time, delta);
        //Comprueba si el jugador murio
        if(this.dead) return;

        //Ejecuta el movimiento
        this.moveControl();
        this.jumpControl();
        this.shootControl(time);
        this.animControl();
    }

    /**
     * Mueve al personaje segun el input del jugador
     */
    moveControl()
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
    jumpControl()
    {
        if(this.jump && this.body.onFloor())
            this.jump = false;

        if (this.cursor.space.isDown && this.body.onFloor()) 
        {    
            this.setVelocityY(-this.jumpForce);
            this.jump = true;
            this.jumpEffect.play(); //Efecto de salto
        }
    }

    /**
     * Controla si el jugador puede o no disparar
     * @param {integer} time 
     */
    shootControl(time)
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
     * Controla las animaciones que se deben lanzar
     */
    animControl()
    {
        if(this.jump)
            this.play('jump', true);
        else if(this.body.velocity.x != 0)
            this.play('walk', true);
        else
            this.play('idle', true);
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
        this.damageEffect.play(); //Efecto de daño
       
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