import Phaser from 'phaser'

import World1 from './scenes/World1'

var window = {width:320, height:180}
const config = {
	type: Phaser.AUTO,
	width: window.width,
	height: window.height,
	parent: "canvas",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true
		}
	},
	scene: [World1],
	scale: {
		zoom: 5
	}
}

export default new Phaser.Game(config)
