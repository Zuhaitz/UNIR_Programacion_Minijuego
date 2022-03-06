export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super('GameOver');
    }

    init(data)
    {
        //Recoger los datos
        this.state = data.state; //Estado de fin de juego
        this.caller = data.caller; //La escena que llamo
        if (this.state == "win") this.coins = data.coins; //Las monedas en caso de vistoria
    }

    preload()
    {
        //Fuente para que no no se vea pixelado el texto
        //Fuente: https://github.com/photonstorm/phaser3-examples/tree/master/public/assets/fonts/bitmap
        this.load.bitmapFont('atari', 'Fonts/atari-classic.png', 'Fonts/atari-classic.xml');
    }

    create ()
    {
        //Calcular el centro ce la pantalla
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        var gameOverTxt;

        switch(this.state)
        {
            case "win": //En caso de victoria ponemos el texto y las monedas conseguidas
                gameOverTxt  = this.add.bitmapText(screenCenterX, screenCenterY-16, 'atari', "YOU WIN!").setOrigin(0.5, 0.5);
                gameOverTxt.setFontSize(25);
                gameOverTxt.setTint(0x38b764);
                gameOverTxt.setScrollFactor(0);

                gameOverTxt  = this.add.bitmapText(screenCenterX, screenCenterY+2, 'atari', `Total coins: ${this.coins}`).setOrigin(0.5, 0.5);
                gameOverTxt.setFontSize(10);
                gameOverTxt.setTint(0xffcd75);
                gameOverTxt.setScrollFactor(0);
                break;

            case "loss": //En caso de derrota ponemos el texto
                gameOverTxt  = this.add.bitmapText(screenCenterX, screenCenterY-8, 'atari', "GAME OVER").setOrigin(0.5, 0.5);
                gameOverTxt.setFontSize(25);
                gameOverTxt.setTint(0xb13e53);
                gameOverTxt.setScrollFactor(0);
                break;

            default:
                gameOverTxt  = this.add.bitmapText(screenCenterX, screenCenterY-8, 'atari', "NO STATE").setOrigin(0.5, 0.5);
                gameOverTxt.setFontSize(25);
                gameOverTxt.setScrollFactor(0);
        }

        gameOverTxt  = this.add.bitmapText(screenCenterX, screenCenterY+16, 'atari', "Press enter to restart").setOrigin(0.5, 0.5);
        gameOverTxt.setFontSize(8);
        gameOverTxt.setScrollFactor(0);

        //Registro de la tecla enter
        this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(time,delta)
    {
        if(this.enter.isDown)
        {
            this.scene.start(this.caller); //Reiniciamos la escena
        }
    }
}