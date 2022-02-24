import Phaser from 'phaser'

export default class World1 extends Phaser.Scene
{
    constructor()
	{
		super('world1')
        this.spawnX = 50;
        this.spawnY = 260;
	}

    preload()
    {
        
    }
}