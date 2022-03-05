import Phaser from 'phaser'
import Coin from '../classes/Coin';
import Crystal from '../classes/Crystal';
import Enemy from '../classes/Enemy';
import Player from '../classes/Player';

export default class World1 extends Phaser.Scene
{
    constructor()
	{
		super('World1');
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
        this.load.image('coin', 'Assets/Coin.png');
        this.load.image('bg', '8bitStyle_Background.png');
        this.load.bitmapFont('atari', 'Fonts/atari-classic.png', 'Fonts/atari-classic.xml');
    }

    create()
    {
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
        this.createCoins(map);
        this.createUI();
    }

    update (time, delta)
    {
        if (this.player.dead)
        {
            this.scene.start('GameOver', { state: "loss",  caller: 'World1' });
        }

        this.player.update(time,delta);
        for (let index = 0; index < this.enemies.length; index++) {
            const element = this.enemies[index];
            element.update(time, delta);
        }
    }

    createUI()
    {
        var coinsCount  = this.add.image(16, 16, 'coin');
        coinsCount.setScrollFactor(0,0);
        coinsCount.fixedToCamera = true;
        
        this.coinsCountTxt = this.add.bitmapText(14, 16, 'atari', " x0").setOrigin(0, 0.5);
        this.coinsCountTxt.setFontSize(8);
        this.coinsCountTxt.setScrollFactor(0);

        var crystalsCount  = this.add.image(16, 32, 'crystal');
        crystalsCount.setScrollFactor(0,0);
        crystalsCount.fixedToCamera = true;
        
        this.crystalsCountTxt = this.add.bitmapText(30, 32, 'atari', ` 0/${this.totalCrystals}`).setOrigin(0.5);
        this.crystalsCountTxt.setFontSize(8);
        this.crystalsCountTxt.setScrollFactor(0);
    }

    createCrystals(map)
    {
        var crystalsArr = map.getObjectLayer('crystals')['objects'];
        var crystalsGroup = this.physics.add.group({
            allowGravity: false,
            immovable : true
        });

        this.crystals = [];

        for (let index = 0; index < crystalsArr.length; index++) {
            const element = crystalsArr[index];
            var posX = element.x+this.offsetX/2;
            var posY = element.y+this.offsetY/2;
            var crystal = new Crystal(this, posX, posY, 'crystal', this.player);
            crystalsGroup.add(crystal);
            this.crystals.push(crystal);
        }

        this.nCrystals = 0;
        this.totalCrystals = this.crystals.length;
    }

    createCoins(map)
    {
        var coinsArr = map.getObjectLayer('coins')['objects'];
        var coinsGroup = this.physics.add.group({
            allowGravity: false,
            immovable : true
        });

        this.coins = [];

        for (let index = 0; index < coinsArr.length; index++) {
            const element = coinsArr[index];
            var posX = element.x+this.offsetX/2;
            var posY = element.y+this.offsetY/2;
            var coin = new Coin(this, posX, posY, 'coin', this.player);
            coinsGroup.add(coin);
            this.coins.push(coin);
        }

        this.nCoins = 0;
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

    crystalPicked()
    {
        console.log("Crystal picked");
        this.nCrystals++;
        this.crystalsCountTxt.text = ` ${this.nCrystals}/${this.totalCrystals}`;
        if(this.nCrystals == this.totalCrystals)
        {
            this.scene.start('GameOver', { state: "win", coins: this.nCoins, caller: 'World1'});
        }
    }

    coinPicked()
    {
        console.log("Coin picked");
        this.nCoins++;
        this.coinsCountTxt.text = ` x${this.nCoins}`;
    }
}