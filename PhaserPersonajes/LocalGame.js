var lightManager;

var juan; //Contiene el objeto físico de Juan
var juanSpeed;
var juanMovementVector = new Phaser.Math.Vector2();
var juanCursors; //Teclas con las que se mueve Juan
var juanCamera;

var guard; //Contiene el objeto físico del guardia
var guardSpeed;
var guardMovementVector = new Phaser.Math.Vector2();
var guardCursors; //Teclas con las que se mueve el guardia
var guardCamera;

var statics = {}; //Objetos estáticos de la escena

var doors = {};
var keys = {};
var spawnPoints = {};
var finalDoor;

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
    },

    create: function ()
    {
      var that = this;

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
        juanCamera.setBackgroundColor('rgba(71, 45, 60, 1)');
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

        guardCamera.setBackgroundColor('rgba(71, 45, 60, 1)');
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

      function initFinalDoor()
      {
        //Se crea la puerta de salida según el punto de spawn del json
        spawnPoint = map.findObject("Objects", obj => obj.name === "Puerta Salida");
        finalDoor = this.statics.create(spawnPoint.x + 16, spawnPoint.y + 16, "finalDoor").refreshBody();
      }
      initFinalDoor();

      lightManager = new LightingManager(this.game, [juanCamera, guardCamera]);

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
      //Mueve a un personaje según unas teclas de movimiento, una velocidad y su vecto de dirección
      function Move(character, cursors, speed, movementVector)
      {
        //Se obtiene el vector de movimiento del personaje y se noramliza
        movementVector.x = character.body.deltaAbsX();
        movementVector.y = character.body.deltaAbsY();

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
              character.setVelocityY(-speed * movementVector.y);
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
              character.setVelocityX(-speed * movementVector.x);
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
    }
});

function pickUpKey(index)
{
    keys[index].picked = true;
    keys[index].destroy();
}

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
