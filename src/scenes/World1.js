import Phaser from 'phaser'
import Crystal from '../classes/Crystal';
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
        this.load.image('player', 'Assets/Player1.png');
        this.load.image('enemy1', 'Assets/Enemy1.png');
        this.load.image('crystal', 'Assets/Crystal.png');
        this.load.image('bg', '8bitStyle_Background.png');
    }

    create(){
        
        

        var bg = this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'bg');
        //El fondo sigue a la camara
        bg.setScrollFactor(0);

        var map = this.make.tilemap({key: 'map'});
        var tiles = map.addTilesetImage('8bitStyle_Atlas', 'tiles');
        const suelo = map.createLayer('ground', tiles, this.offsetX, this.offsetY);
        const traps = map.createLayer('traps', tiles, this.offsetX, this.offsetY);

        this.physics.world.TILE_BIAS = 8;
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels*2);

        this.player = new Player(this, this.spawnX, this.spawnY, 'player', 3, traps);
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
        this.createCrystals(map);
    }

    update (time, delta)
    {
        this.player.update(time,delta);
        for (let index = 0; index < this.enemies.length; index++) {
            const element = this.enemies[index];
            element.update(time, delta);
        }
    }

    createCrystals(map)
    {
        var crystalsArr = map.getObjectLayer('crystals')['objects'];
        var crystalsGroup = this.physics.add.group({
            allowGravity: false,
            immovable : true
        });

        for (let index = 0; index < crystalsArr.length; index++) {
            const element = crystalsArr[index];
            var posX = element.x+this.offsetX/2;
            var posY = element.y+this.offsetY/2;
            var crystal = new Crystal(this, posX, posY, 'crystal');
            crystalsGroup.add(crystal);
        }
    }

    createEnemies(map, suelo, traps)
    {
        var enemiesGroup = this.physics.add.group({
            collideWorldBounds: true
        });

        var enemiesArr = map.getObjectLayer('enemies')['objects'];
        this.enemies = [];
        
        for (let index = 0; index < enemiesArr.length; index++) {
            const element = enemiesArr[index];
            if (element.gid == 74){
                var posX = element.x+this.offsetX/2;
                var posY = element.y+this.offsetY/2;
                var areaL = element.properties[0].value;
                var areaR = element.properties[1].value;
                var enemy = new Enemy(this, posX, posY, 'enemy1', traps, this.player, 1, areaL, areaR);
                this.enemies.push(enemy);
                enemiesGroup.add(enemy);
            }
        }

        this.physics.add.collider(enemiesGroup, suelo);
        this.physics.add.collider(enemiesGroup, enemiesGroup);
    }
}