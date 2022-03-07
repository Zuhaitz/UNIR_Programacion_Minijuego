import Phaser, { Tilemaps } from 'phaser'
import Coin from '../classes/Coin';
import Crystal from '../classes/Crystal';
import Enemy from '../classes/Enemy';
import Player from '../classes/Player';
import Projectile from '../classes/Projectile';

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
        this.load.image('coinT', 'Assets/Coin_tiny.png');
        this.load.image('heart', 'Assets/Heart.png');
        this.load.image('heartE', 'Assets/Heart_Empty.png');
        this.load.image('bg', '8bitStyle_Background.png');

        //Animaciones
        this.load.atlas('sprites_jugador','Anim/Player_Anim.png', 'Anim/Player_Anim.json');

        //Efectos de sonido
        this.load.audio('jump', 'SoundEffects/422087__prof-mudkip__8-bit-jump.wav');
        this.load.audio('enemyDefeat', 'SoundEffects/506585__mrthenoronha__kill-enemy-4-8-bit.wav');
        this.load.audio('coin', 'SoundEffects/350869__cabled-mess__coin-c-06.wav');
        this.load.audio('damage', 'SoundEffects/457195__antikore__8-bit-damage.wav');

        //Fuente para que no no se vea pixelado el texto
        //Fuente: https://github.com/photonstorm/phaser3-examples/tree/master/public/assets/fonts/bitmap
        this.load.bitmapFont('atari', 'Fonts/atari-classic.png', 'Fonts/atari-classic.xml');
    }

    create()
    {
        //Cargar fondo
        var bg = this.add.image(this.sys.game.canvas.width*0.5, this.sys.game.canvas.height*0.5, 'bg');
        bg.setScrollFactor(0);

        //Cargar el tilemap
        var map = this.make.tilemap({key: 'map'});
        var tiles = map.addTilesetImage('8bitStyle_Atlas', 'tiles');
        const suelo = map.createLayer('ground', tiles, this.offsetX, this.offsetY);
        const traps = map.createLayer('traps', tiles, this.offsetX, this.offsetY);

        //El bias para que el personaje no atraviese paredes
        this.physics.world.TILE_BIAS = 8;
        //El tamaño del limite del mundo segun el mapa
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels*2);

        //Cargar el jugador
        this.player = new Player(this, this.spawnX, this.spawnY, 'player', 3, traps);
        this.physics.add.collider(this.player,suelo);
        suelo.setCollisionByExclusion(-1, true);
        this.physics.add.collider(this.player, suelo);
        //Inicializar vidas
        this.hearts = [];
        this.createHearts(3);

        //Lista de monedas lanzadas
        this.tossedCoins = []

        //Limitar camara al espacio del mapa y seguir jugador
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.roundPixels = true; //Para evitar parpadeo de las tiles

        //Inicializar elementos de juego
        this.createEnemies(map, suelo, traps);
        this.createCrystals(map);
        this.createCoins(map);

        //Inicializar interfaz
        this.createUI();
    }

    update (time, delta)
    {
        //Comprobar si el jugador a muerto
        if (this.player.dead)
        {
            this.scene.start('GameOver', { state: "loss",  caller: 'World1' });
        }

        //Actualizar jugador
        this.player.update(time,delta);
        //Actualizar enemigos
        for (let index = 0; index < this.enemies.length; index++) {
            const element = this.enemies[index];
            element.update(time, delta);
        }
        //Actualizar projectiles
        for (let index = 0; index < this.tossedCoins.length; index++) {
            const element = this.tossedCoins[index];
            element.update(time, delta);
        }
    }

    /**
     * Inicializa la interfaz de las monedas y cristales del nivel
     */
    createUI()
    {
        //Inicializar el contador de las monedas
        var coinsCount  = this.add.image(64, 16, 'coin');
        coinsCount.setScrollFactor(0);
        
        this.coinsCountTxt = this.add.bitmapText(62, 16, 'atari', " x0").setOrigin(0, 0.5);
        this.coinsCountTxt.setFontSize(8);
        this.coinsCountTxt.setScrollFactor(0);

        //Inicializar el contador de los cristales en el nivel
        var crystalsCount  = this.add.image(16, 32, 'crystal');
        crystalsCount.setScrollFactor(0);
        
        this.crystalsCountTxt = this.add.bitmapText(30, 32, 'atari', ` 0/${this.totalCrystals}`).setOrigin(0.5);
        this.crystalsCountTxt.setFontSize(8);
        this.crystalsCountTxt.setScrollFactor(0);
    }

    /**
     * Inicializa los contenedores de corazones llenos en la interfaz
     * @param {number} health - numero de corazones del jugador
     */
    createHearts(health)
    {
        for(let index = 0; index < health; ++index)
        {
            var heart  = this.add.image(16+(global.pixels+1)*index, 16, 'heart');
            heart.setScrollFactor(0);
            this.hearts.push(heart);
        }
    }

    /**
     * Actualiza los corazones a corazones vacios segun el daño recibido
     * @param {number} health - vida actual
     * @param {number} dmg - daño recibido
     */
    updateHearts(health, dmg)
    {
        for (let index = health; index < health+dmg; index++) {
            this.hearts[index].destroy(); //Destruimos el corazon
            var heartE = this.add.image(16+(global.pixels+1)*index, 16, 'heartE'); //Sustituimos por uno vacio
            heartE.setScrollFactor(0);
            this.hearts.push(heartE);
        }      
    }

    /**
     * Dibuja en escena los elementos recolectables (monedas y cristales)
     * @param {Tilemap} map - el tilemap donde se encuntra la informacion
     * @param {string} name - nombre de la capa de objetos
     * @param {string} sprite - el nombre del sprite
     * @param {Array} array - la array donde guardar los objetos
     * @param {(Coin | Crystal)} type - la clase a utilizar
     */
    createCollectables(map, name, sprite, array, type)
    {
        var collectableArr = map.getObjectLayer(name)['objects'];
        var collectableGroup = this.physics.add.group({
            allowGravity: false,
            immovable : true
        });

        for (let index = 0; index < collectableArr.length; index++) {
            const element = collectableArr[index];
            var posX = element.x+this.offsetX/2; //Offset para colocarlo bien en su sitio
            var posY = element.y+this.offsetY/2;
            var collectable = new type(this, posX, posY, sprite, this.player);
            collectableGroup.add(collectable);
            array.push(collectable);
        }
    }

    /**
     * Dibuja en escena los cristales
     * @param {Tilemap} map - el tilemap donde se encuntra la informacion
     */
    createCrystals(map)
    {
        this.crystals = [];
        this.nCrystals = 0;

        this.createCollectables(map, 'crystals', 'crystal', this.crystals, Crystal)
        this.totalCrystals = this.crystals.length;
    }

    /**
     * Dibuja en escena las monedas
     * @param {Tilemap} map - el tilemap donde se encuntra la informacion
     */
    createCoins(map)
    {
        this.coins = [];
        this.nCoins = 0;

        this.createCollectables(map, 'coins', 'coin', this.coins, Coin)
    } 

    /**
     * Dibuja en escena los enemigos
     * @param {Tilemap} map - el tilemap donde se encuntra la informacion
     * @param {Layer} suelo - el layer del suelo que van a pisar
     * @param {Layer} traps - el layer d las trampas con las que colisionar
     */
    createEnemies(map, suelo, traps)
    {
        this.enemies = [];

        var enemiesArr = map.getObjectLayer('enemies')['objects'];
        var enemiesGroup = this.physics.add.group({
            collideWorldBounds: true
        });
        
        for (let index = 0; index < enemiesArr.length; index++) {
            const element = enemiesArr[index];
            if (element.gid == 74){
                var posX = element.x+this.offsetX/2; //Offset para colocarlo bien en su sitio
                var posY = element.y+this.offsetY/2;
                var areaL = element.properties[0].value; //Area de movimiento hacia la izquierda
                var areaR = element.properties[1].value; //Area de movimiento hacia la derecha
                var enemy = new Enemy(this, posX, posY, 'enemy1', traps, this.player, 1, areaL, areaR);
                this.enemies.push(enemy);
                enemiesGroup.add(enemy);
            }
        }

        this.physics.add.collider(enemiesGroup, suelo);
        this.physics.add.collider(enemiesGroup, enemiesGroup);
    }

    /**
     * Invoca una moneda en la posicion dada y resta monedas al contador
     * @param {integer} posX - Posicion x donde saldra el proyectil
     * @param {integer} posY - Posicion y donde saldra el proyectil
     * @param {integer} direction - Direccion: derecha (1) o izquierda (-1)
     */
    tossCoin(posX, posY, direction)
    {
        if(this.nCoins>0)
        {
            var coin = new Projectile(this, posX, posY, 'coinT', this.enemies, direction, 100);
            this.tossedCoins.push(coin);
            this.nCoins--; //Resta la moneda
            this.coinsCountTxt.text = ` x${this.nCoins}`;
        }
    }

    /**
     * Aviso de que un cristal a sido recogido.
     * Se suma a la cantida y si se recogieron todos los cristales se gana la partida
     */
    crystalPicked()
    {
        console.log("Crystal picked");
        this.nCrystals++;
        this.crystalsCountTxt.text = ` ${this.nCrystals}/${this.totalCrystals}`;

        //Comprueba si se termino la partida
        if(this.nCrystals == this.totalCrystals)
        {
            this.scene.start('GameOver', { state: "win", coins: this.nCoins, caller: 'World1'});
        }
    }

    /**
     * Aviso de que una moneda a sido recogida.
     */
    coinPicked()
    {
        console.log("Coin picked");
        this.nCoins++;
        this.coinsCountTxt.text = ` x${this.nCoins}`;
    }
}