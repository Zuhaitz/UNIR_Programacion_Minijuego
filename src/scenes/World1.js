import Phaser from 'phaser'
import Enemy from '../classes/Enemy';
import Player from '../classes/Player';

export default class World1 extends Phaser.Scene
{
    constructor()
	{
		super('world1')
        this.spawnX = 54;
        this.spawnY = 128;
        this.offsetX = -global.pixels;
        this.offsetY = global.pixels;
	}

    preload()
    {
        this.load.tilemapTiledJSON('map', '8bitMap1.json');
        this.load.image('tiles', '8bitStyle_Atlas.png');
        this.load.image('player', '8bitStyle_Player.png');
        this.load.image('enemy1', 'Enemy1.png');
        this.load.image('bg', '8bitStyle_Background.png');
    }

    create(){
        this.physics.world.TILE_BIAS = 8;
        this.physics.world.setBounds(0,0, this.sys.game.canvas.width, this.sys.game.canvas.height*2);

        var bg = this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'bg');
        //El fondo sigue a la camara
        bg.setScrollFactor(0);

        var map = this.make.tilemap({key: 'map'});
        var tiles = map.addTilesetImage('8bitStyle_Atlas', 'tiles');
        const suelo = map.createLayer('ground', tiles, this.offsetX, this.offsetY);
        const traps = map.createLayer('traps', tiles, this.offsetX, this.offsetY);

        this.player = new Player(this, this.spawnX, this.spawnY, 'player', traps);
        this.physics.add.collider(this.player,suelo);

        suelo.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, suelo);

        //Limitar camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true);
        //Para evitar parpadeo de las tiles
        this.cameras.main.roundPixels = true;

        //Crear enemigos
        this.createEnemies(map, suelo, traps);
    }

    update (time, delta)
    {
        this.player.update(time,delta);
        for (let index = 0; index < this.enemies.length; index++) {
            const element = this.enemies[index];
            element.update(time, delta);
        }
    }

    createEnemies(map, suelo, traps)
    {
        var enemiesArr = map.getObjectLayer('enemies')['objects'];
        this.enemies = [];
        
        for (let index = 0; index < enemiesArr.length; index++) {
            const element = enemiesArr[index];
            //if (element.gid == 74){
                var enemy = new Enemy(this, element.x-this.offsetX, element.y+this.offsetY, 'enemy1', traps, this.player, element.properties[0].value);
                this.enemies.push(enemy);
                this.physics.add.collider(enemy, suelo);
            //}
        }
    }

    debug()
    {
        console.log("works");
    }
}