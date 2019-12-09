var EndScreen = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function EndScreen ()
    {
        Phaser.Scene.call(this, { key: 'EndScreen'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    preload: function()
    {
        this.load.bitmapFont('fuente', './resources/fonts/font/MC_0.png', './resources/fonts/font/MC.fnt');

        this.load.image("juanWinsBackground", "./resources/sprites/juanWinsBackground.png");
        this.load.image("guardWinsBackground", "./resources/sprites/guardWinsBackground.png");
        this.load.image("disconnectBackground", "./resources/sprites/disconnectBackground.png");
    },

    create: function()
    {
        if(endGameState == endGameStates.JUAN_WINS)
        {
            this.add.image(0, 0, 'juanWinsBackground').setOrigin(0, 0);
            this.add.bitmapText(92, 25, 'fuente', 'Juantankamón gana', 22);
        }
        else if(endGameState == endGameStates.GUARD_WINS)
        {
            this.add.image(0, 0, 'guardWinsBackground').setOrigin(0, 0);
            this.add.bitmapText(102, 55, 'fuente', 'El Guardia gana', 22);
        }
        else if(endGameState == endGameStates.DISCONNECT)
        {
          this.add.image(0, 0, 'disconnectBackground').setOrigin(0, 0);
          this.add.bitmapText(122, 30, 'fuente', 'Desconexión', 22);
        }

        //Al pulsar el botón de volver al menú y estar en la pantalla de desconexión
        //se le pide al jugador que vuelva a logearse
        var backButton = new Button(this, this.cameras.main.width/2, 20, 'buttonIcon', 'buttonIconHover', "Volver al menú", 'fuente', function(that){
          menuMusic.stop();
          if(endGameState != endGameStates.DISCONNECT) that.scene.start("Menu");
          else that.scene.start("NameInput");

        }, 1.6,1);

        //Cada 5 segundos se hace un put del jugador para actualizarlo en el servidor
        //y que no se borre por inactividad
        var timerInput = this.time.addEvent({
          delay: 5000,
          callback: function(){
            if(endGameState != endGameStates.DISCONNECT) periodicPut();
          },
          //args: [],
          callbackScope: this,
          loop: true
      });
    },

    update: function (time, delta) //Código que se ejecuta en cada frame de la escena
    {

    }
})
