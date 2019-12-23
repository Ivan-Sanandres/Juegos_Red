//La variable playingAsJuantankamon define si el jugador está jugando con JUANTANKAMÓN o con el guardia
//Según esta variable el jugador podrá controlar a uno u otro personaje
//El que no sea controlado se moverá con websockets

var websocketData;
var animTolerance = 0;

var OnlineGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function LocalGame ()
    {
        Phaser.Scene.call(this, {key: 'OnlineGame'})
    },

    preload: function ()
    {
      //En esta función se cargan los recursos externos que utilizará el juego
      this.load.bitmapFont('fuente', './resources/fonts/font/MC_0.png', './resources/fonts/font/MC.fnt');

      this.load.image("tiles", "./resources/tilemap/tilemap.png");
      this.load.tilemapTiledJSON("map", "./resources/jsons/tileset.json"); //Este archivo json contiene la información del tilemap

      this.load.image("juan", "./resources/sprites/juan.png");
      this.load.image("guard", "./resources/sprites/guardia.png");
      this.load.image("key", "./resources/sprites/llave1.png");
      this.load.image("door", "./resources/sprites/puerta32.png");
      this.load.image("finalDoor", "./resources/sprites/puertasalida.png");

      this.load.image("backGround", "./resources/sprites/backgroundColor.png");

      this.load.audio("gameMusic", "./resources/sound/gameMusic.mp3");

      //ANIMATIONS
      this.load.spritesheet('guardAnim', 'resources/sprites/guardWalk.png', {frameWidth: 16, frameHeight: 16});
      this.load.spritesheet('juanAnim', 'resources/sprites/juanWalk.png', {frameWidth: 16, frameHeight: 16});

    },

    create: function ()
    {
      var that = this;
      var defaultCursors;
      pointer = this.input.mousePointer; //Referencia al ratón

      endGameState = endGameStates.PLAYING;

      // Se establecen eventos para detectar inputs, que sirven para controlar la desconexión por inactividad
      // actualizando el bool anyInput a true al pulsar una tecla o mover el ratón
      this.input.keyboard.on('keydown', function (event) {anyInput = true;})
      this.input.on('pointermove', function (pointer) {anyInput = true;});

      configKeys = this.input.keyboard.addKeys({ //Teclas usadas para opciones de configuración
        mute: Phaser.Input.Keyboard.KeyCodes.M
      });

      this.add.image(0, 0, 'backGround').setScale(130 * 64, 75 * 64);

      //Se crea un mapa de tiles
      const map = this.make.tilemap({key: "map"});

      //Se añaden las tiles al mapa tomando la información del archivo json y la tilesheet que se ha cargado
      const tileset = map.addTilesetImage("colored", "tiles");

      //Creamos 2 capas de mapas de tiles
      const worldLayer = map.createStaticLayer("Wall", tileset, 0, 0);
      const propsLayer = map.createStaticLayer("Object", tileset, 0, 0);

      //Agregamos colisión a aquellas tiles de la capa de props que contienen un booleano llamado collides que vale true
      propsLayer.setCollisionByProperty({collides: true});

      //Se crea un grupo de físicas para la colisión con las paredes
      this.walls = this.physics.add.group({
          allowGravity: false,
          immovable: true
        });

        //Se almacenan las propiedades los objetos del mapa de la capa de objetos llamada Collide
        const wallCol = map.getObjectLayer('Collide')['objects'];

        //Se crean las cajas de colisión de las paredes en base a las propiedades almacenadas y el grupo de físicas
        wallCol.forEach(wallCol => {
          //create( [x] [, y] [, key] [, frame] [, visible] [, active])
          const wall = this.walls.create(wallCol.x + (wallCol.width/2), wallCol.y + (wallCol.height/2),'',false);
          wall.body.setSize(wallCol.width,wallCol.height);
          wall.setVisible(false);
        });

      //Inicializa a Juan y todas sus variables
      function initJuan(speed)
      {
        that.anims.create({
          key : 'juanWalkAnim',
          frames: that.anims.generateFrameNumbers('juanAnim', {start : 0, end: 3}),
          frameRate: 6,
          repeat: -1
        });

        //Se elige un punto de spawn aleatorio
        spawnPoints[0] = map.findObject("Objects", obj => obj.name === "Spawn Point Juan 1");
        spawnPoints[1] = map.findObject("Objects", obj => obj.name === "Spawn Point Juan 2");

        var spawnPointJuan = spawnPoints[Phaser.Math.Between(0, 1)];

        //Se crea el objeto físcio de Juan
        juan = that.physics.add
                .sprite(spawnPointJuan.x, spawnPointJuan.y, "juan")
                .setSize(16, 16);

        //La cámara principal será la cámara principal
        if(playingAsJuantankamon)
        {
          juanCamera = that.cameras.main;
          //Ajustes de cámara
          juanCamera.setViewport(93, 0);
          juanCamera.setSize(176, 176);
          juanCamera.setScroll(93, 0);
          juanCamera.startFollow(juan, true, 1, 1); //true indica que no hay movimientos en subpíxeles. Los 1 sirven para que el movimiento se más suave
        }

        defaultCursors = that.input.keyboard.createCursorKeys();
        //Se establecen las teclas que usa Juan para moverse
        juanCursors = that.input.keyboard.addKeys(
           {w:Phaser.Input.Keyboard.KeyCodes.W,
            s:Phaser.Input.Keyboard.KeyCodes.S,
            a:Phaser.Input.Keyboard.KeyCodes.A,
            d:Phaser.Input.Keyboard.KeyCodes.D,
            up: defaultCursors.up,
            down: defaultCursors.down,
            left: defaultCursors.left,
            right: defaultCursors.right
          });

        juanSpeed = speed;

        //Juan colisiona con los props y las paredes
        that.physics.add.collider(juan, worldLayer);

        juan.anims.play('juanWalkAnim', true);
      }
      initJuan(90);

      //Inicializa al guardia y todas sus variables
      function initGuard(speed)
      {
        that.anims.create({
          key : 'guardWalkAnim',
          frames: that.anims.generateFrameNumbers('guardAnim', {start : 0, end: 3}),
          frameRate: 6,
          repeat: -1
        });

        const spawnPointGuard = map.findObject("Objects", obj => obj.name === "Spawn Point Guard");
        //Se crea un objeto físico guardia con el spawnPoint determinado en el jSon
        guard = that.physics.add
                .sprite(spawnPointGuard.x, spawnPointGuard.y, "guard")
                .setSize(16, 16);

        //Se crea una nueva cámara para guardia y se ajusta
        if(!playingAsJuantankamon)
        {
          guardCamera = that.cameras.main;
          guardCamera.setViewport(93, 0);
          guardCamera.setSize(176, 176);
          guardCamera.setScroll(93, 0);
          guardCamera.startFollow(guard, true, 1, 1);
        }

        //Se usan las flechas de movimiento por defecto para el guardia
        guardCursors = that.input.keyboard.addKeys(
           {w:Phaser.Input.Keyboard.KeyCodes.W,
            s:Phaser.Input.Keyboard.KeyCodes.S,
            a:Phaser.Input.Keyboard.KeyCodes.A,
            d:Phaser.Input.Keyboard.KeyCodes.D,
            up: defaultCursors.up,
            down: defaultCursors.down,
            left: defaultCursors.left,
            right: defaultCursors.right});
        guardSpeed = speed;

        that.physics.add.collider(guard, worldLayer);

        guard.anims.play('guardWalkAnim', true);
      }
      initGuard(100);

      statics = this.physics.add.staticGroup();
      //Crea las puertas de la escena
      function initDoors()
      {
        var spawnPoint;
        function createDoor(i)
        {
          //Se crean puertas según los puntos de spawn del json
          spawnPoint = map.findObject("Objects", obj => obj.name === "Puerta " + i);
          doors[i] = this.statics.create(spawnPoint.x + 16, spawnPoint.y + 16, "door").refreshBody();
          //Se asocia una callback al evento de colisión de Juan con las puertas
          //El guardia podrá atravesarlas
          that.physics.add.collider(juan, doors[i], function(){openDoor(i);}, null, this);
        }
        for(var i = 0; i < numDoors; i++)
          createDoor(i);
      }
      initDoors();

      //Crea las llaves de la escena
      function initKeys()
      {
        var spawnPoint;
        function createKey(i)
        {
          //Se generan las llaves según los puntos de spawn del Json
          spawnPoint = map.findObject("Objects", obj => obj.name === "Llave " + i);
          keys[i] = that.physics.add.sprite(spawnPoint.x, spawnPoint.y, "key");
          keys[i].picked = false;
          //Se asocia una callback al evento de overlap (trigger) de Juan con las llaves
          that.physics.add.overlap(juan, keys[i], function(){pickUpKey(i);}, null, this);
        }
        for(var i = 0; i < numKeys; i++)
          createKey(i);
      }
      initKeys();

      //Se crea la puerta de salida según el punto de spawn del json
      var spawnPoint = map.findObject("Objects", obj => obj.name === "Puerta Salida");
      finalDoor = statics.create(spawnPoint.x + 16, spawnPoint.y + 16, "finalDoor").refreshBody();

      //Instanciación de luces de los personajes
      lightManager = new LightingManager(this.game, [this.cameras.main]);

      juanLight = new Light_focal([juan.x, juan.y], [0.0, 0.0], 0.0, 1.5, [1.0, 1.0, 1.0], 1.3, 1.0, true, 0.9, 1.0, 1.0);

      if(playingAsJuantankamon) lightManager.addLight(0, juanLight);

      guardLight = new Light_focal([guard.x, guard.y], [0.0, 1.0], 1.5, 1.5, [1.0, 1.0, 0.5], 1.3, 1.0, true, 0.9, 1.0, 0.5);
      lightManager.addLight(0, guardLight);

      //Instanciación de luces del escenario
      function initLights(numLights)
      {
        var lightJson;

        for(var i = 0; i < numLights; i++)
        {
          lightJson = map.findObject("Objects", obj => obj.name === "Luz " + i);

          light = new Light_focal(
            [lightJson.x, lightJson.y],
            [0.0, 0.0],
            0.0,
            lightJson.properties[0].value, //weakness
            [lightJson.properties[1].value, lightJson.properties[2].value, lightJson.properties[3].value], //color
            1.3);

          lightManager.addLight(0, light);
        }
      }initLights(16);

      //Colisiones de juan y el guardia con las paredes y props
      //this.physics.add.collider(juan, this.walls);
      this.physics.add.collider(guard, this.walls);
      //this.physics.add.collider(juan, propsLayer);
      this.physics.add.collider(guard, propsLayer);

      //Se asocia la callback endGame a la colisión de Juan con la puerta de salida y con el guardia
      this.physics.add.collider(juan, finalDoor, function() {
        endGameState = endGameStates.JUAN_WINS;

        websocketData.gameState = 1;
        connection.send(JSON.stringify(websocketData));
        console.log(websocketData);
        endGame(that);
      }, null, this);

      this.physics.add.overlap(juan, guard, function()
      {
        endGameState = endGameStates.GUARD_WINS;

        websocketData.gameState = 2;
        connection.send(JSON.stringify(websocketData));
console.log(websocketData);
        endGame(that);
      }, null, this);

      txtMP = this.add.bitmapText(juan.x, juan.y, "fuente", "ESPACIO para volver").setOrigin(0.5, 0.5);
      txtMP.visible = false;

      gameMusic = this.sound.add("gameMusic");
      gameMusic.play({mute: muted, loop: true});

      //Cada 5 segundos se comprueba si el jugador ha hecho algún tipo de input
      //Si ha hecho algún input se hace un put al jugador, si no no se hace el put
      //El servidor detecta si un jugador lleva mucho tiempo sin hacer un put y en ese caso lo elimina
      var timerInput = this.time.addEvent({
        delay: 5000,
        callback: function()
          {
            if(anyInput)
            {
              var player = {
                id: playerId,
                name: playerName,
                roomId : playerRoomId
              }
              AJAX_updatePlayer(player)
            }
            anyInput = false;
          },
        //args: [],
        callbackScope: this,
        loop: true
      });

      //Cada 2 segundos se intenta obtener la room de este jugador
      //Si no se puede obtener es porque la partida ha sido borrada (porque uno de los jugadores ha sido desconectado)
      //Por tanto se lleva a la pantalla de fin por desconexión
      var timerGetRoom = this.time.addEvent({
        delay: 2000,
        callback: function()
          {
              AJAX_getRoom(playerRoomId, function(){}, function(){
                endGameState = endGameStates.DISCONNECT;
                endGame(that);
              });
          },
        //args: [],
        callbackScope: this,
        loop: true
      });

    },

    update: function (time, delta)
    {
      //gameState = 0 La partida debe continuar
      //gameState = 1 Gana Juan
      //gameState = 2 Gana el guardia
      websocketData = {
        posX: 0.0,
        posY: 0.0,
        dirX: 0.0,
        dirY: 0.0,
        gameState: 0,
        P1: playerId,
        P2: opponentId
      };

      txtMP.x = juan.x;
      txtMP.y = juan.y;

      if(Phaser.Input.Keyboard.JustDown(configKeys.mute))
      {
          muted = !muted;
          gameMusic.mute = muted;
      }

      pointerInWorldCoordinates = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

      function Move(character, cursors, speed, characterMovementVector)
      {
        var horizontalInput = 0; //Input horizontal del jugador (-1 a la izquieda y 1 a la derecha)
        var verticalInput = 0; // Input vertical del jugador (-1 arriba y 1 abajo)

        //Se elimina la velocidad que pudiera llevar el personaje
        character.setVelocityX(0);
        character.setVelocityY(0);

        //Usamos el vector de dirección de los jugadores normalizado y en valor absoluto
        characterMovementVector = characterMovementVector.normalize();
        characterMovementVector = new Phaser.Math.Vector2(Math.abs(characterMovementVector.x), Math.abs(characterMovementVector.y));


        //ANIMATIONS
        var movVecLength = characterMovementVector.length();
        if(movVecLength == 0.0 && !character.anims.currentAnim.paused){
          character.anims.currentAnim.pause();
        } else if (movVecLength > 0.0 && character.anims.currentAnim.paused){
          character.anims.currentAnim.resume();
        }

        //Si pulsamos Up o Down quitamos o añadimos respectivamente 1 a verticalInput
        //De esta forma si se pulsan las dos a la vez es = 0 y el personaje no se Mueve
        //Misma lógica para horizontalInput con Left y Right
        if(cursors.up.isDown || cursors.w.isDown) verticalInput += -1;

        if(cursors.down.isDown || cursors.s.isDown) verticalInput += 1;

        if(cursors.left.isDown || cursors.a.isDown) horizontalInput += -1;

        if(cursors.right.isDown || cursors.d.isDown) horizontalInput += 1;

        //Si el jugador se estaba movimiendo lo tenemos en cuenta para que no vaya más rápido en diaganol
        if(characterMovementVector.x != 0)
          character.setVelocityX(speed * horizontalInput * characterMovementVector.x);
        else
          character.setVelocityX(speed * horizontalInput);

        if(characterMovementVector.y != 0)
          character.setVelocityY(speed * verticalInput * characterMovementVector.y);
        else
          character.setVelocityY(speed * verticalInput);
      }

      if(playingAsJuantankamon)
        Move(juan, juanCursors, juanSpeed, juanMovementVector);
      else
        Move(guard, guardCursors, guardSpeed, guardMovementVector);

      //LIGHT POSITION
      juanLight.position = [juan.x, juan.y];

      if(!playingAsJuantankamon)
      {
        guardMouseVector.set(pointerInWorldCoordinates.x - guard.x, pointerInWorldCoordinates.y - guard.y).normalize();
        guardLight.direction = [guardMouseVector.x, guardMouseVector.y];
      }

      var guardLightDistance = 3.0;
      guardLight.position = [guard.x + guardLight.direction[0] * guardLightDistance, guard.y + guardLight.direction[1] * guardLightDistance];

      lightManager.updateAllUniforms(delta);

      //Websockets
      function UpdateCharacter(character, json)
      {
        character.x = json.posX;
        character.y = json.posY;
      }

      connection.onmessage = function(msg)
      {
        var json = JSON.parse(msg.data);

        //Si juegas como Juantankamón se debe actualizar el guardia
        if(playingAsJuantankamon)
        {
          //Se actualiza la posición y dirección del guardia según el mensaje de websockets
          UpdateCharacter(guard, json);
          guardLight.direction = [json.dirX, json.dirY];

          if(!guard.anims.currentAnim.paused && guardMovementVector.length() <= animTolerance )
            guard.anims.currentAnim.pause();

          else if(guard.anims.currentAnim.paused && guardMovementVector.length() > animTolerance)
            guard.anims.currentAnim.resume();
        }
        //Si juegas como el guardia se debe actualizar a Juantankamón
        else
        {
          //Se actualiza la posición y dirección del guardia según el mensaje de websockets
          UpdateCharacter(juan, json);

          if(!juan.anims.currentAnim.paused && juanMovementVector.length() <= animTolerance )
            juan.anims.currentAnim.pause();

          else if(juan.anims.currentAnim.paused && juanMovementVector.length() > animTolerance)
            juan.anims.currentAnim.resume();
        }

        if(json.gameState == 1)
        {
          //Si Juantankamón gana queremos teletransportar a Juantankamón hacia la puerta de salida
          endGameState = endGameStates.JUAN_WINS;

          juan.x = finalDoor.x;
          juan.y = finalDoor.y;
        }
        else if(json.gameState == 2)
        {
          //Si el guardia gana queremos teletransportar a Juantankamón hacia el guardia para activar el trigger
          endGameState = endGameStates.GUARD_WINS;

          juan.x = guard.x;
          juan.y = guard.y;
        }
      }

      //Actualiza la posición y la dirección de movimiento del jugador que se mueve por websockets
      function sendWebsocketData()
      {
        if(playingAsJuantankamon)
        {
          websocketData.posX = juan.x;
          websocketData.posY = juan.y;
          websocketData.dirX = juanMovementVector.x;
          websocketData.dirY = juanMovementVector.y;
        }
        else
        {
          websocketData.posX = guard.x;
          websocketData.posY = guard.y;
          websocketData.dirX = guardMouseVector.x;
          websocketData.dirY = guardMouseVector.y;
        }
        connection.send(JSON.stringify(websocketData));
      }
      //Solo se actualiza la posición del jugador si la partida no ha acabado
      if(endGameState == endGameStates.PLAYING)
        sendWebsocketData();

      //Mueve a un personaje según unas teclas de movimiento, una velocidad y su vecto de dirección
      juanMovementVector.set(juan.x - juanPreviousPos.x, juan.y - juanPreviousPos.y);
      guardMovementVector.set(guard.x - guardPreviousPos.x, guard.y - guardPreviousPos.y);

      //Posición que llevan los personajes en el frame anterior
      juanPreviousPos.set(juan.x, juan.y);
      guardPreviousPos.set(guard.x, guard.y);
    }
});
