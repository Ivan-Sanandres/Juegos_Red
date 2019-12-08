var waitingTime = 5;
var fullLobby = false;
var timeText;

var WaitingRoom = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu ()
    {
        Phaser.Scene.call(this, { key: 'WaitingRoom'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    preload: function () //Se cargan la fuente, las imágenes y la música de la escena
    {
      this.load.bitmapFont('fuente', './resources/fonts/font/MC_0.png', './resources/fonts/font/MC.fnt');

      this.load.image("background", "./resources/sprites/waitingRoomBackground.png");
      this.load.audio("menuMusic", "./resources/sound/menuMusic.mp3");

      this.load.image("buttonIcon", "./resources/sprites/sobreBoton2.png");
      this.load.image("buttonIconHover", "./resources/sprites/sobreBoton.png");
    },

    create: function () //Código que se ejecuta al generarse la escena
    {

      //Se añade la imagen de fondo del menú
      this.add.image(0, 0, "background").setOrigin(0, 0);

      this.add.bitmapText((this.cameras.main.width / 2) - 75,58, 'fuente', '123456789012', 22).setOrigin(0.5, 0);
      this.add.bitmapText((this.cameras.main.width / 2) + 75,58, 'fuente', '1', 22).setOrigin (0.5, 0);
      timeText = this.add.bitmapText((this.cameras.main.width / 2), 15, 'fuente', waitingTime, 20).setOrigin(0.5, 0);

      fullLobby = true;
      var timerInput = this.time.addEvent({
        delay: 1000,
        callback: setTimer,
        //args: [],
        callbackScope: this,
        loop: true
    });
    },

    update: function (){

    },

});

function setTimer(){
    if(waitingTime > 0 && fullLobby === true){
        waitingTime--;
        timeText.text = waitingTime; 
        console.log(waitingTime);
    }
};