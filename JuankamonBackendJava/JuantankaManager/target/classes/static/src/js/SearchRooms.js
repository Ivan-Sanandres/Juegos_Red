//La variable la declaro global para que se guarde el valor para el juego. Si ya es true, cuando empiece el juego tampoco sonará música
var muted = false;

//ESCENA MENÚ
var SearchRooms = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Menu ()
    {
        Phaser.Scene.call(this, { key: 'SearchRooms'} ) //La key es la referencia en el código de esta escena para cuando la llamemos
    },

    preload: function () //Se cargan la fuente, las imágenes y la música de la escena
    {
      this.load.bitmapFont('fuente', './resources/fonts/font/MC_0.png', './resources/fonts/font/MC.fnt');
      //this.load.audio("menuMusic", "./resources/sound/menuMusic.mp3");
      this.load.image("buttonIcon", "./resources/sprites/sobreBoton2.png");
      this.load.image("buttonIconHover", "./resources/sprites/sobreBoton.png");
      this.load.image("arrowUpOff", "./resources/sprites/idleArrowUp.png");
      this.load.image("arrowUpOn", "./resources/sprites/hoverArrowUp.png");
      this.load.image("arrowDownOff", "./resources/sprites/idleArrowDown.png");
      this.load.image("arrowDownOn", "./resources/sprites/hoverArrowDown.png");
    },

    create: function () //Código que se ejecuta al generarse la escena
    {
      //CREACIÓN DE TEXTOS
      this.add.bitmapText(this.cameras.main.width/2 - 30, 15, 'fuente', 'Lista de partidas abiertas', 11).setOrigin(0.5, 0.5);

      //Se añade la música de fondo, se configura para que se reproduzca en bucle
      menuMusic = this.sound.add("menuMusic");
      menuMusic.play({mute: muted, loop: true});

      var backButton = new Button(this, this.cameras.main.width/2, 165, 'buttonIcon', 'buttonIconHover', "Volver al menú", 'fuente', function(that){
        menuMusic.stop();
        that.scene.start("Menu");
      }, 0.15);



      var roomList = new TextButtonList(this, this.cameras.main.width/2 - 120, 40, 7, function() {
        roomList.info = [];
        var that = this;

        AJAX_getRooms(function(rooms)
        {
          var line = "";
          for(var i = 0; i < rooms.length; i++)
          {
            if(rooms[i].open)
            {
              AJAX_getPlayer(rooms[i].juantankamonId, function(player)
              {
                line = "Partida " + player.roomId + " Juantankamón: " + player.name;
                roomList.info.push(line);
                roomList.updateButtons();
              });

              AJAX_getPlayer(rooms[i].guardId, function(player)
              {
                line = "Partida " + player.roomId + " Guardia: " + player.name;
                roomList.info.push(line);
                roomList.updateButtons();
              });

            } // if end
          } //for end
        }); //AJAX_getRooms end

      });
      roomList.updateInfo();

      var refreshButton = new Button(this, this.cameras.main.width/2 + 70, 15, 'buttonIcon', 'buttonIconHover', "actualizar", 'fuente', function(that){
        roomList.updateInfo();
      });

      var hostAsJuanButton = new Button(this, this.cameras.main.width/2 + 125, 65, 'buttonIcon', 'buttonIconHover', ["Crear partida", "como Juantankamón"], 'fuente', function(that){
        console.log("host as juantankamon");
      }, 0.18, 0.3, 1);
      var hostAsGuardButton = new Button(this, this.cameras.main.width/2 + 125, 125, 'buttonIcon', 'buttonIconHover', ["Crear partida", "como Juantankamón"], 'fuente', function(that){
        console.log("host as juantankamon");
      }, 0.18, 0.3, 1);

      var upButton = new Button(this, this.cameras.main.width/2 - 150, 60, 'arrowUpOff', 'arrowUpOn', "-", 'fuente', function(that){
        roomList.goUp();
        roomList.updateButtons();
      }, 1, 1, 1);

      var downButton = new Button(this, this.cameras.main.width/2 - 150, 120, 'arrowDownOff', 'arrowDownOn', "+", 'fuente', function(that){
        roomList.goDown();
        roomList.updateButtons();
      }, 1, 1, 1);

      var timerInput = this.time.addEvent({
        delay: 1000,
        callback: periodicPut,
        //args: [],
        callbackScope: this,
        loop: true
    });

      //var somebutton = new Button();
      //var testButton = new Button(this, 300, 60, 'buttonIcon', 'buttonIconHover', "xd", 'fuente', 0.1, 0.1);
      //var testButton2 = new TextButton(this, 100, 60, "salu2", 'fuente', 0.1, 0.1);
    },

    update: function (time, delta) //Código que se ejecuta en cada frame de la escena
    {

    }
});

function periodicPut()
{
  var player = {
    id: playerId,
    name: playerName
  }
  AJAX_updatePlayer(player)
}
