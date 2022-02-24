import Phaser from 'phaser'

import World1 from './scenes/World1'

var window = {width:800, height:480}
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
	scene: [World1]
}

export default new Phaser.Game(config)
