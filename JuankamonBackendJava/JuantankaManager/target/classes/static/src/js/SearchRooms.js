//La variable la declaro global para que se guarde el valor para el juego. Si ya es true, cuando empiece el juego tampoco sonará música
var muted = false;
var playerRoomId = 0;
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

      this.load.image("genericBackground", "./resources/sprites/genericBackground.png");
    },

    create: function () //Código que se ejecuta al generarse la escena
    {
      this.add.image(0, 0, "genericBackground").setOrigin(0, 0);

      //CREACIÓN DE TEXTOS
      this.add.bitmapText(this.cameras.main.width/2 - 30, 15, 'fuente', 'Lista de partidas abiertas', 11).setOrigin(0.5, 0.5);

      //Se añade la música de fondo, se configura para que se reproduzca en bucle
      menuMusic = this.sound.add("menuMusic");
      menuMusic.play({mute: muted, loop: true});

      var backButton = new Button(this, this.cameras.main.width/2, 165, 'buttonIcon', 'buttonIconHover', "Volver al menú", 'fuente', function(that){
        menuMusic.stop();
        that.scene.start("Menu");
      }, 1.6,1);

      var roomList = new TextButtonList(this, this.cameras.main.width/2 - 120, 40, 7, function() {
        roomList.info = [];
        roomList.auxValues = [];
        var that = this;

        //Se obtienen todas las rooms del servidor
        AJAX_getRooms(function(rooms)
        {
          var line = "";
          for(var i = 0; i < rooms.length; i++)
          {
            //Por cada room abierta obtenida
            if(rooms[i].open)
            {
              //Se obtiene el jugador que la ha abierto para ponerlo en el mensaje por pantalla
              AJAX_getPlayer(rooms[i].juantankamonId, function(player)
              {
                line = "Partida " + player.roomId + " Juantankamón: " + player.name;
                roomList.auxValues.push(player.roomId);
                roomList.info.push(line);
                roomList.updateButtons();
                updateButtonCallbacks(this, roomList);
              });

              AJAX_getPlayer(rooms[i].guardId, function(player)
              {
                line = "Partida " + player.roomId + " Guardia: " + player.name;
                roomList.auxValues.push(player.roomId);
                roomList.info.push(line);
                roomList.updateButtons();
                updateButtonCallbacks(this, roomList);
              });
            } else {
              roomList.updateButtons();
              updateButtonCallbacks(this, roomList);
            } // if end
          } //for end
        }); //AJAX_getRooms end
      });
      roomList.updateInfo();
      roomList.updateButtons();


      function updateButtonCallbacks(scene, list){
        for(var i = 0; i < list.size; i++){
          list.buttons[i].clickCallback = function(){
            var roomId = this.auxValue;

            //Al pulsar un botón se obtiene la room asociada a ese botón
            AJAX_getRoom(roomId, function(room){  //get success
              var roomUpdated = {
                id : roomId,
                juantankamonId : room.juantankamonId,
                guardId : room.guardId,
                running : true,
                empty: false,
                open: false,
                full: true
              }

              //Se le asigna este jugador a la id de Juantankamón o del guardia
              //Según la que esté vacía
              if(room.juantankamonId == 0){
                roomUpdated.juantankamonId = playerId;
                playingAsJuantankamon = true;
              } else if(room.guardId == 0){
                roomUpdated.guardId = playerId;
                playingAsJuantankamon = false;
              }

              //Se sube la room con los ids de jugadores actualizados
              //y se carga la sala de espera de la partida
              AJAX_updateRoom(roomUpdated, function(room){  //put success
                playerRoomId = room.id;
                that.scene.start('WaitingRoom');
                that.scene.stop('SearchRooms');
              }, function(){  //put failed
                roomList.updateInfo();
              });

            }, function(){  //get failed
              roomList.updateInfo();
            });
          } //end button callback
        } // end for
      } //end function

      var refreshButton = new Button(this, this.cameras.main.width/2 + 70, 15, 'buttonIcon', 'buttonIconHover', "Actualizar", 'fuente', function(that){
        roomList.updateInfo();
      }, 1, 1);

      var hostAsJuanButton = new Button(this, this.cameras.main.width/2 + 125, 65, 'buttonIcon', 'buttonIconHover', ["Crear partida", "como Juantankamón"], 'fuente', function(that){
        playingAsJuantankamon = true;
        var roomData = {
          juantankamonId : playerId
        };

        //Si se hostea la partida como juantankamon se crea una room y asignamos la id de este jugador a la de juantankamon
        AJAX_createRoom(roomData, function(room){
          playerRoomId = room.id;
          that.scene.start("WaitingRoom");
        });
      },1.8, 1.8, 1);
      var hostAsGuardButton = new Button(this, this.cameras.main.width/2 + 125, 125, 'buttonIcon', 'buttonIconHover', ["Crear partida", "como guardia"], 'fuente', function(that){
        playingAsJuantankamon = false;
        var roomData = {
          guardId : playerId
        };

        //Si se hostea la partida como guardia se crea una room y asignamos la id de este jugador a la de guardia
        AJAX_createRoom(roomData, function(room){
          playerRoomId = room.id;
          that.scene.start("WaitingRoom");
        });
      }, 1.8, 1.8, 1);

      var upButton = new Button(this, this.cameras.main.width/2 - 150, 60, 'arrowUpOff', 'arrowUpOn', "-", 'fuente', function(that){
        roomList.goUp();
        roomList.updateButtons();
      }, 1, 1, 1);

      var downButton = new Button(this, this.cameras.main.width/2 - 150, 120, 'arrowDownOff', 'arrowDownOn', "+", 'fuente', function(that){
        roomList.goDown();
        roomList.updateButtons();
      }, 1, 1, 1);

      //Cada 5 segundos se actualiza el jugador en el server para que no lo borre
      var timerInput = this.time.addEvent({
        delay: 5000,
        callback: periodicPut,
        //args: [],
        callbackScope: this,
        loop: true
      });
    },

    update: function (time, delta) //Código que se ejecuta en cada frame de la escena
    {

    }
});
