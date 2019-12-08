var waitingTime = 5;
var running = false;
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

      this.load.image("backgroundImage", "./resources/sprites/waitingRoomBackground.png");
      this.load.audio("menuMusic", "./resources/sound/menuMusic.mp3");

      this.load.image("buttonIcon", "./resources/sprites/sobreBoton2.png");
      this.load.image("buttonIconHover", "./resources/sprites/sobreBoton.png");
    },

    create: function () //Código que se ejecuta al generarse la escena
    {


      var that = this;


      var timerInput = this.time.addEvent({
        delay: 5000,
        callback: periodicPut,
        //args: [],
        callbackScope: this,
        loop: true
      });


      //Se añade la imagen de fondo del menú
      this.add.image(0, 0, "backgroundImage").setOrigin(0, 0);

      var juanName = this.add.bitmapText((this.cameras.main.width / 2) - 84,64, 'fuente', 'Esperando...', 22).setOrigin(0.5, 0);
      var guardName = this.add.bitmapText((this.cameras.main.width / 2) + 84,64, 'fuente', 'Esperando...', 22).setOrigin (0.5, 0);
      timeText = this.add.bitmapText((this.cameras.main.width / 2) + 1, 18, 'fuente', waitingTime, 22).setOrigin(0.5, 0);
      timeText.visible = false;


      if(playingAsJuantankamon) juanName.text = playerName;
      else guardName.text = playerName;
      //timerStart.paused = true;

      var timerStart = this.time.addEvent({
        delay: 1000,
        callback: function(){
          if(waitingTime > 0 && running === true){
              waitingTime--;
              timeText.text = waitingTime;
              console.log(waitingTime);
          }
          else if(waitingTime === 0){
            //CAMBIAR ESCENAS
            console.log("STARTING");
            timerStart.paused = true;
            that.scene.start("OnlineGame");
          }
        },
        //args: [],
        callbackScope: this,
        loop: true,
        paused: true
      });

      var timerGet = this.time.addEvent({
        delay: 1000,
        callback: function(){
          AJAX_getRoom(playerRoomId, function(room){
            if(room.full){
              console.log("IS FULL");
              //console.log(timerStart);
              //timerStart.paused = false;
              running = room.running;
              timerGet.paused = true;
              timerStart.paused = false;
              timeText.visible = true;

              var pId = 0; // id del otro jugador
              if(playingAsJuantankamon){
                pId = room.guardId;
              } else {
                pId = room.juantankamonId;
              }

              AJAX_getPlayer(pId, function(player){
                if(playingAsJuantankamon){
                  guardName.text = player.name;
                } else {
                  juanName.text = player.name;
                }
              })
            }
          });
        },
        //args: [],
        callbackScope: this,
        loop: true
      });



    },

    update: function (){

    },

});
