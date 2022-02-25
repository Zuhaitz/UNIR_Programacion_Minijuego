import Phaser from 'phaser'
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
        this.load.image('bg', '8bitStyle_Background.png');
    }

    create(){
        this.physics.world.TILE_BIAS = 8;
        this.physics.world.setBounds(0,0, this.sys.game.canvas.width, this.sys.game.canvas.height+global.pixels);

        var bg = this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'bg');
        //El fondo sigue a la camara
        bg.setScrollFactor(0);

        var map = this.make.tilemap({key: 'map'});
        var tiles = map.addTilesetImage('8bitStyle_Atlas', 'tiles');
        var suelo = map.createLayer('ground', tiles, this.offsetX, this.offsetY);
        suelo.x
        var traps = map.createLayer('traps', tiles, this.offsetX, this.offsetY);

        this.player = new Player(this, this.spawnX, this.spawnY, 'player');
        this.physics.add.collider(this.player,suelo);

        suelo.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, suelo);

        //Limitar camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true);
        //Para evitar parpadeo de las tiles
        this.cameras.main.roundPixels = true;
    }

    update (time, delta)
    {
        this.player.update(time,delta);
    }
}