import Character from "./Character";

export default class Enemy extends Character
{
    constructor(scene,x,y, spriteName, traps, player, attack, areaL=0, areaR=0)
    {
        super(scene,x,y, spriteName, traps);
        //Referencia al jugador
        this.player = player;

        //Estadisticas
        this.velocity = 20;
        this.attack = attack;

        //Area de desplazamiento
        this.areaL = areaL*global.pixels;
        this.areaR = areaR*global.pixels;
        this.originX = this.x;

        if(this.areaL > 0 || areaR > 0)
        {
            this.nextPositionX = this.originX-this.areaL;
            this.state = "left";
        }

        //Colision con el jugador
        this.scene.physics.add.overlap(this, player, this.spriteHit, null, this);

        //Efectos de sonido
        this.defeatEffect = this.scene.sound.add("enemyDefeat", { loop: false , volume: 0.05 });

        //Particulas de muerte
        this.emitter0 = this.scene.add.particles('coin').createEmitter({
            x: this.x,
            y: this.y,
            speed: { min: -50, max: 50 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            blendMode: 'SCREEN',
            //active: false,
            lifespan: 200,
            gravityY: 0,
            on:false
        });
    }

    update(time,delta)
    {
        super.update(time, delta);

        //Comprueba la muerte
        if(this.dead) 
        {
            this.destroy();
            return;
        }

        //Si no se mueve, que se de la vuelta
        if(this.body.onFloor() && this.body.velocity.x == 0) this.changeState();

        //Control de estado
        switch(this.state)
        {
            case "left":
                this.moving(-1);
                break;
            case "right":
                this.moving(1);
                break;
        }
    }

    /**
     * Mueve al enemigo hasta la posicion designada
     */
    moving(direction)
    {
        this.setVelocityX(this.velocity*direction);
        this.checkDistance();
    }

    /**
     * Comprueba si se llego al punto de destino
     */
    checkDistance(){
        let dist = Math.abs(this.nextPositionX - this.x);
        if(dist < 4 && this.body.onFloor())
            this.changeState();
    }

    /**
     * Cambia el estado del enemigo a la direccion contraria
     * Actualiza su nueva posicion destino
     */
    changeState(){
        if(this.state == "left") {
            this.setFlipX(true);
            this.state = "right";
            this.nextPositionX = this.originX+this.areaR;
        }
        else if(this.state == "right") {
            this.setFlipX(false);
            this.state = "left";
            this.nextPositionX = this.originX-this.areaL;
        }
    }

    /**
     * Comprueba la colision con el jugador
     */
    spriteHit()
    {
        var dist =  this.y - this.player.y;
        //Si el jugador esta por encima
        if(dist>global.pixels-2 /*&& this.player.body.velocity.y > 0*/) //El requerimiento de caida no se si hace falta, necesita testeo
        {
            //Muere y dice al jugador que se impulse
            this.die();
            this.player.bounce();
        }
        else this.player.damage(this.attack);
    }

    /**
     * Mata al personaje y lo detiene
     */
    die()
    {
        if(!this.dead) 
        {
            //Efecto de muerte
            this.defeatEffect.play();
            this.deathParticles();
        } 
        super.die();
    }

    /**
     * Invoca las particulas
     */
    deathParticles(){
        this.emitter0.setPosition(this.x, this.y);
        this.emitter0.explode(10);

    }
}