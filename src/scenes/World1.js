import Phaser from 'phaser'
import Player from '../classes/Player';

export default class World1 extends Phaser.Scene
{
    constructor()
	{
		super('world1')
        this.spawnX = 50;
        this.spawnY = 20;
        this.offsetX = -8;
        this.offsetY = 8;
	}

    preload()
    {
        this.load.tilemapTiledJSON('map', '8bitMap1.json');
        this.load.image('tiles', '8bitStyle_Atlas.png');
        this.load.image('player', '8bitStyle_Player.png');
    }

    create(){
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
        //Hace que no parpadeen las casillas del mapa
        this.cameras.main.roundPixels = true;
    }

    update (time, delta)
    {
        this.player.update(time,delta);
    }
}