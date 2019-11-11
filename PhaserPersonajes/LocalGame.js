var lightManager;

var juan; //Contiene el objeto físico de Juan
var juanSpeed;
var juanMovementVector = new Phaser.Math.Vector2(0, 0);
var juanPreviousPos = new Phaser.Math.Vector2(0, 0);
var juanCursors; //Teclas con las que se mueve Juan
var juanCamera;
var juanLight;

var guard; //Contiene el objeto físico del guardia
var guardSpeed;
var guardMovementVector = new Phaser.Math.Vector2(0, 0);
var guardPreviousPos = new Phaser.Math.Vector2(0, 0);
var guardMouseVector = new Phaser.Math.Vector2(0, 0);
var guardCursors; //Teclas con las que se mueve el guardia
var guardCamera;
var guardLight;

var statics = {}; //Objetos estáticos de la escena

var doors = {};
var keys = {};
var spawnPoints = {};
var finalDoor;

var pointer;
var pointerInScene;

var configKeys;
var paused = false;

const numDoors = 4;
const numKeys = 4;

var LocalGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function LocalGame ()
    {
        Phaser.Scene.call(this, {key: 'LocalGame'})
    },

    init: function ()
    {

    },

    preload: function ()
    {
      this.load.image("tiles", "./Tilesheet/tilemap.png");
      this.load.tilemapTiledJSON("map", "./Tilesheet/tileset8.json");

      this.load.image("juan", "./Tilesheet/juan.png");
      this.load.image("guard", "./Tilesheet/guardia.png");
      this.load.image("key", "./Tilesheet/llave1.png");
      this.load.image("door", "./Tilesheet/puerta32.png");
      this.load.image("finalDoor", "./Tilesheet/puertasalida.png");

      this.load.image("backGround", "./Tilesheet/backgroundColor.png");
    },

    create: function ()
    {
      var that = this;

      pointer = this.input.mousePointer; //Referencia al ratón

      configKeys = this.input.keyboard.addKeys({ //Teclas usadas para opciones de configuración
        pause: Phaser.Input.Keyboard.KeyCodes.P,
        mute: Phaser.Input.Keyboard.KeyCodes.M
        });

      this.add.image(0, 0, 'backGround').setScale(130 * 64, 75 * 64);

      const map = this.make.tilemap({key: "map"});
      const tileset = map.addTilesetImage("colored", "tiles");
      const worldLayer = map.createStaticLayer("Wall", tileset, 0, 0);
      const propsLayer = map.createStaticLayer("Object", tileset, 0, 0);

      propsLayer.setCollisionByProperty({collides: true});

      this.walls = this.physics.add.group({
          allowGravity: false,
          immovable: true
        });

        const wallCol = map.getObjectLayer('Collide')['objects'];

        wallCol.forEach(wallCol => {
          const wall = this.walls.create(wallCol.x + (wallCol.width/2), wallCol.y + (wallCol.height/2),'',false);
          wall.body.setSize(wallCol.width,wallCol.height);
          wall.setVisible(false);
        });

        //Inicializa a Juan y todas sus variables
      function initJuan(speed)
      {
        //Se elige un punto de spawn aleatorio
        spawnPoints[0] = map.findObject("Objects", obj => obj.name === "Spawn Point Juan 1");
        spawnPoints[1] = map.findObject("Objects", obj => obj.name === "Spawn Point Juan 2");

        var spawnPointJuan = spawnPoints[Phaser.Math.Between(0, 1)];

        //Se crea el objeto físcio de Juan
        juan = that.physics.add
                .sprite(spawnPointJuan.x, spawnPointJuan.y, "juan")
                .setSize(16, 16);

        //La cámara principal será la cámara principal
        juanCamera = that.cameras.main;

        //Ajustes de cámara
        //juanCamera.setBackgroundColor('rgba(255, 100, 160, 1)');
        juanCamera.setViewport(0, 0);
        juanCamera.setSize(176, 176);
        juanCamera.startFollow(juan, true, 1, 1);

        //Se establecen las teclas que usa Juan para moverse
        juanCursors = that.input.keyboard.addKeys(
           {up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D});

        juanSpeed = speed;

        //Juan colisiona con los props y las paredes
        that.physics.add.collider(juan, worldLayer);
      }
      initJuan(90);

      //Inicializa al guardia y todas sus variables
      function initGuard(speed)
      {
        const spawnPointGuard = map.findObject("Objects", obj => obj.name === "Spawn Point Guard");
        //Se crea un objeto físico guardia con el spawnPoint determinado en el jSon
        guard = that.physics.add
                .sprite(spawnPointGuard.x, spawnPointGuard.y, "guard")
                .setSize(16, 16);

        //Se crea una nueva cámara para guardia y se ajusta
        guardCamera = that.cameras.add(0, 0, 0, 0);

        //guardCamera.setBackgroundColor('rgba(255, 100, 160, 1)');
        guardCamera.setViewport(186, 0);
        guardCamera.setScroll(186, 0);
        guardCamera.setSize(176, 176);
        guardCamera.startFollow(guard, true, 1, 1);

        //Se usan las flechas de movimiento por defecto para el guardia
        guardCursors = that.input.keyboard.createCursorKeys();
        guardSpeed = speed;

        that.physics.add.collider(guard, worldLayer);
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
          //Se asocia una callback al evento de colisión de Juan con las llaves
          that.physics.add.overlap(juan, keys[i], function(){pickUpKey(i);}, null, this);
        }
        for(var i = 0; i < numKeys; i++)
          createKey(i);
      }
      initKeys();

      //Crea la puerta de salida
      function initFinalDoor()
      {
        //Se crea la puerta de salida según el punto de spawn del json
        spawnPoint = map.findObject("Objects", obj => obj.name === "Puerta Salida");
        finalDoor = this.statics.create(spawnPoint.x + 16, spawnPoint.y + 16, "finalDoor").refreshBody();
      }
      initFinalDoor();

      //Instanciación de luces de los personajes
      lightManager = new LightingManager(this.game, [juanCamera, guardCamera]);

      juanLight = new Light_focal([juan.x, juan.y], [0.0, 0.0], 0.0, 1.5, [1.0, 1.0, 1.0], 1.0, 1.0, 1.0);
      lightManager.addLight(0, juanLight);

      guardLight = new Light_focal([guard.x, guard.y], [0.0, 0.0], 2.5, 1.5, [1.0, 1.0, 0.5], 1.0, 1.0, 1.0);
      lightManager.addLight(1, guardLight);
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
            0.4);

          lightManager.addLight(0, light);
          lightManager.addLight(1, light);
        }
      }initLights(16);

      //Colisiones de juan y el guardia con las paredes y props
      this.physics.add.collider(juan, this.walls);
      this.physics.add.collider(guard, this.walls);
      this.physics.add.collider(juan, propsLayer);
      this.physics.add.collider(guard, propsLayer);

      //Se asocia la callback endGame a la colisión de Juan con la puerta de salida y con el guardia
      this.physics.add.collider(juan, finalDoor, endGame, null, this);
      this.physics.add.overlap(juan, guard, endGame, null, this);
    },

    update: function (time, delta)
    {

      //Si se pulsa la P se pausa el juego y no se actualizan las posiciones y luces
      if(Phaser.Input.Keyboard.JustDown(configKeys.pause))
      {
        paused = !paused;

        juan.setVelocityX(0); juan.setVelocityY(0);
        guard.setVelocityX(0); guard.setVelocityY(0);
      }

      if(!paused)
      {
        var pointerInScene = guardCamera.getWorldPoint(pointer.x, pointer.y);
        //Mueve a un personaje según unas teclas de movimiento, una velocidad y su vecto de dirección
        juanMovementVector.set(juan.x - juanPreviousPos.x, juan.y - juanPreviousPos.y);
        guardMovementVector.set(guard.x - guardPreviousPos.x, guard.y - guardPreviousPos.y);

        function Move(character, cursors, speed, characterMovementVector)
        {
          var movementVector = new Phaser.Math.Vector2(0, 0);
          //Se obtiene el vector de movimiento del personaje y se noramliza
          //movementVector.x = character.x - characterMovementVector.x;
          //movementVector.y = character.y - characterMovementVector.y;

          movementVector = movementVector.normalize();

          //Se elimina la velocidad que pudiera llevar el personaje
          character.setVelocityX(0);
          character.setVelocityY(0);

          //Se mueve hacia arriba, abajo, izquieda o derecha según la tecla pulsada
          if (cursors.up.isDown)
          {
            //Si ya lleva una dirección se multiplica por el vector normalizado
            //Para que mantenga la misma velocidad aunque vaya en diagonal
              if(movementVector.y != 0)
                character.setVelocityY(speed * movementVector.y);
              else
                character.setVelocityY(-speed);
          }

          if(cursors.down.isDown)
          {
              if(movementVector.y != 0)
                character.setVelocityY(speed * movementVector.y);
              else
                character.setVelocityY(speed);
          }

          if (cursors.left.isDown)
          {
              if(movementVector.x != 0)
                character.setVelocityX(speed * movementVector.x);
              else
                character.setVelocityX(-speed);
          }

          if(cursors.right.isDown)
          {
              if(movementVector.x != 0)
                character.setVelocityX(speed * movementVector.x);
              else
                character.setVelocityX(speed);
          }
        }
        Move(juan, juanCursors, juanSpeed, juanMovementVector);
        Move(guard, guardCursors, guardSpeed, guardMovementVector);

        juanPreviousPos.set(juan.x, juan.y);
        guardPreviousPos.set(guard.x, guard.y);

        juanLight.position = [juan.x, juan.y];
        guardLight.position = [guard.x, guard.y];

        guardMouseVector.set(pointerInScene.x - guard.x, pointerInScene.y - guard.y).normalize();

        guardLight.direction = [guardMouseVector.x, guardMouseVector.y];

        lightManager.updateAllUniforms(delta);
      }
    }
});
  //Actualiza una llave para indicar que ha sido recogida y la destruye
function pickUpKey(index)
{
    keys[index].picked = true;
    keys[index].destroy();
}

//Actualiza una puerta para abrirla si se ha recogido su llave
function openDoor(index)
{
  if(keys[index].picked)
  {
    doors[index].destroy();
  }
}

function endGame()
{
  //Se vuelve a la escena de menu
  this.scene.start("Menu");
}
