const config = {
    type: Phaser.AUTO,
    width: 362,
    height: 176,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: "game-container",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

var juan;
var juanSpeed;
var juanMovementVector = new Phaser.Math.Vector2();
var juanCursors;
var juanCamera;

var guard;
var guardSpeed;
var guardMovementVector = new Phaser.Math.Vector2();
var guardCursors;
var guardCamera;

var statics = {};

var doors = {};
var keys = {};
var finalDoor;

const numDoors = 4;
const numKeys = 4;

function preload() {
    this.load.image("tiles", "./Tilesheet/tilemap.png");
    this.load.tilemapTiledJSON("map", "./Tilesheet/tileset7.json");

    this.load.image("juan", "./Tilesheet/juan.png");
    this.load.image("guard", "./Tilesheet/guardia.png");
    this.load.image("key", "./Tilesheet/llave1.png");
    this.load.image("door", "./Tilesheet/puerta32.png");
    this.load.image("finalDoor", "./Tilesheet/finalDoor.png");
}

function create() {
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

    function initJuan(speed)
    {
      const spawnPointJuan = map.findObject("Objects", obj => obj.name === "Spawn Point Juan 1");

      juan = that.physics.add
              .sprite(spawnPointJuan.x, spawnPointJuan.y, "juan")
              .setSize(16, 16);

      juanCamera = that.cameras.main;

      juanCamera.setBackgroundColor('rgba(71, 45, 60, 1)');
      juanCamera.setViewport(0, 0);
      juanCamera.setSize(176, 176);
      juanCamera.startFollow(juan, true, 1, 1);

      juanCursors = that.input.keyboard.addKeys(
         {up:Phaser.Input.Keyboard.KeyCodes.W,
          down:Phaser.Input.Keyboard.KeyCodes.S,
          left:Phaser.Input.Keyboard.KeyCodes.A,
          right:Phaser.Input.Keyboard.KeyCodes.D});

      juanSpeed = speed;

      that.physics.add.collider(juan, worldLayer);
    }
    initJuan(90);

    function initGuard(speed)
    {
      const spawnPointGuard = map.findObject("Objects", obj => obj.name === "Spawn Point Guard");

      guard = that.physics.add
              .sprite(spawnPointGuard.x, spawnPointGuard.y, "guard")
              .setSize(16, 16);

      guardCamera = that.cameras.add(0, 0, 0, 0);

      guardCamera.setBackgroundColor('rgba(71, 45, 60, 1)');
      guardCamera.setViewport(186, 0);
      guardCamera.setScroll(186, 0);
      guardCamera.setSize(176, 176);
      guardCamera.startFollow(guard, true, 1, 1);

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
        spawnPoint = map.findObject("Objects", obj => obj.name === "Puerta " + i);
        doors[i] = statics.create(spawnPoint.x + 16, spawnPoint.y + 16, "door").refreshBody();
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
        spawnPoint = map.findObject("Objects", obj => obj.name === "Llave " + i);
        keys[i] = that.physics.add.sprite(spawnPoint.x, spawnPoint.y, "key");
        keys[i].picked = false;
        that.physics.add.overlap(juan, keys[i], function(){pickUpKey(i);}, null, this);
      }
      for(var i = 0; i < numKeys; i++)
        createKey(i);
    }
    initKeys();

    function initFinalDoor()
    {
      spawnPoint = map.findObject("Objects", obj => obj.name === "Puerta Salida");
      finalDoor = statics.create(spawnPoint.x + 16, spawnPoint.y + 16, "finalDoor").refreshBody();
      that.physics.add.collider(juan, finalDoor, openFinalDoor, null, this);
    }
    initFinalDoor();

    this.physics.add.collider(juan, this.walls);
    this.physics.add.collider(guard, this.walls);
    this.physics.add.collider(juan, propsLayer);
    this.physics.add.collider(guard, propsLayer);

    this.physics.add.overlap(juan, guard, juanCatched, null, this);
}

function update(time, delta) {

  function Move(character, cursors, speed, movementVector)
  {
    movementVector.x = character.body.deltaAbsX();
    movementVector.y = character.body.deltaAbsY();

    movementVector = movementVector.normalize();

    character.setVelocityX(0);
    character.setVelocityY(0);

    if (cursors.up.isDown)
    {
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

function juanCatched()
{
  console.log("pillao");
}

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

function openFinalDoor()
{
  finalDoor.destroy();
  console.log("GAME OVER");
}
